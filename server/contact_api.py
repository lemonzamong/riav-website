#!/usr/bin/env python3
"""Minimal same-origin contact API for iruvy.com."""

from __future__ import annotations

import base64
import binascii
import hashlib
import hmac
import json
import os
import re
import smtplib
import sqlite3
import ssl
import time
import uuid
from collections import defaultdict, deque
from datetime import datetime, timezone
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlsplit
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo


HOST = os.environ.get("CONTACT_API_HOST", "127.0.0.1")
PORT = int(os.environ.get("CONTACT_API_PORT", "8431"))
SMTP_HOST = os.environ.get("CONTACT_SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("CONTACT_SMTP_PORT", "465"))
SMTP_USERNAME = os.environ.get("CONTACT_SMTP_USERNAME", "")
SMTP_PASSWORD = os.environ.get("CONTACT_SMTP_PASSWORD", "")
MAIL_FROM = os.environ.get("CONTACT_MAIL_FROM", SMTP_USERNAME)
MAIL_TO = os.environ.get("CONTACT_MAIL_TO", "iruvy.official@gmail.com")
DB_PATH = os.environ.get("CONTACT_DB_PATH", "/var/lib/iruvy-contact/leads.db")
RELAY_SECRET = os.environ.get("OUTREACH_RELAY_SECRET", "")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
RESEND_WEBHOOK_SECRET = os.environ.get("RESEND_WEBHOOK_SECRET", "")
CONSENT_VERSION = "privacy-2026-07-24"
LOCAL_TIMEZONE = ZoneInfo(os.environ.get("CONTACT_TIMEZONE", "Asia/Seoul"))
ALLOWED_ORIGINS = {
    origin.strip()
    for origin in os.environ.get(
        "CONTACT_ALLOWED_ORIGINS",
        "https://iruvy.com,https://www.iruvy.com",
    ).split(",")
    if origin.strip()
}
MAX_BODY_BYTES = 32_768
MAX_WEBHOOK_BODY_BYTES = 262_144
RATE_WINDOW_SECONDS = 600
RATE_LIMIT = 5
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
INQUIRIES = {
    "flow": "제조 디자인 파트너",
    "technology": "기술·데이터 연동",
    "partnership": "산업·공급 파트너십",
    "investment": "투자",
    "media": "미디어",
    "company": "기타 회사 문의",
}
LEAD_STATUSES = {
    "new", "reviewing", "qualified", "contacted", "discovery_scheduled",
    "discovery_complete", "site_assessment", "proposal", "pilot_negotiation",
    "pilot_active", "annual_contract", "nurture", "won", "lost", "spam",
}
RATE_BUCKETS: dict[str, deque[float]] = defaultdict(deque)
EVENT_BUCKETS: dict[str, deque[float]] = defaultdict(deque)
ALLOWED_EVENTS = {
    "page_view", "nav_primary_cta_click", "hero_primary_cta_click",
    "hero_demo_open", "demo_step_view", "demo_complete", "use_case_view",
    "technology_view", "security_view", "design_partner_view",
    "fit_form_start", "fit_form_step_complete", "fit_form_submit",
    "fit_form_error", "contact_submit", "email_link_click",
}


def clean_text(value: object, maximum: int) -> str:
    if not isinstance(value, str):
        return ""
    return value.replace("\x00", "").strip()[:maximum]


def validate(payload: object) -> tuple[dict[str, str] | None, str | None]:
    if not isinstance(payload, dict):
        return None, "invalid_payload"

    data = {
        "inquiry": clean_text(payload.get("inquiry"), 20),
        "name": clean_text(payload.get("name"), 80),
        "organization": clean_text(payload.get("organization"), 120),
        "email": clean_text(payload.get("email"), 254),
        "role": clean_text(payload.get("role"), 120),
        "environment": clean_text(payload.get("environment"), 160),
        "scope": clean_text(payload.get("scope"), 240),
        "constraints": clean_text(payload.get("constraints"), 1000),
        "timeline": clean_text(payload.get("timeline"), 40),
        "challenge": clean_text(payload.get("challenge"), 5000),
        "privacy": clean_text(payload.get("privacy"), 20),
        "website": clean_text(payload.get("website"), 200),
        "phone": clean_text(payload.get("phone"), 40),
        "utm_source": clean_text(payload.get("utm_source"), 120),
        "utm_medium": clean_text(payload.get("utm_medium"), 120),
        "utm_campaign": clean_text(payload.get("utm_campaign"), 160),
        "utm_content": clean_text(payload.get("utm_content"), 160),
        "utm_term": clean_text(payload.get("utm_term"), 160),
        "landing_page": clean_text(payload.get("landing_page"), 500),
        "referrer": clean_text(payload.get("referrer"), 500),
        "first_touch_at": clean_text(payload.get("first_touch_at"), 40),
        "last_touch_at": clean_text(payload.get("last_touch_at"), 40),
        "session_id": clean_text(payload.get("session_id"), 80),
    }

    if data["website"]:
        return None, "spam"
    if data["inquiry"] not in INQUIRIES:
        return None, "invalid_inquiry"
    if not all(data[field] for field in ("name", "organization", "role", "environment", "scope", "timeline")):
        return None, "missing_required"
    if data["privacy"] != "agreed":
        return None, "privacy_required"
    if not EMAIL_RE.fullmatch(data["email"]):
        return None, "invalid_email"
    if len(data["challenge"]) < 10:
        return None, "message_too_short"
    return data, None


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def lead_score(data: dict[str, str]) -> int:
    score = 20
    if data["inquiry"] == "flow":
        score += 20
    if data["timeline"] in {"1개월 이내", "3개월 이내"}:
        score += 20
    elif data["timeline"] == "6개월 이내":
        score += 10
    if data["role"]:
        score += 10
    if data["constraints"]:
        score += 5
    if len(data["challenge"]) >= 120:
        score += 10
    return min(score, 100)


def database() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DB_PATH), mode=0o750, exist_ok=True)
    connection = sqlite3.connect(DB_PATH, timeout=10)
    os.chmod(DB_PATH, 0o600)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA journal_mode=WAL")
    connection.execute("PRAGMA foreign_keys=ON")
    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY,
            public_reference TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'new',
            score INTEGER NOT NULL DEFAULT 0,
            inquiry TEXT NOT NULL,
            name TEXT NOT NULL,
            organization TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL DEFAULT '',
            role TEXT NOT NULL DEFAULT '',
            environment TEXT NOT NULL,
            scope TEXT NOT NULL,
            constraints TEXT NOT NULL DEFAULT '',
            timeline TEXT NOT NULL DEFAULT '',
            challenge TEXT NOT NULL,
            utm_source TEXT NOT NULL DEFAULT '',
            utm_medium TEXT NOT NULL DEFAULT '',
            utm_campaign TEXT NOT NULL DEFAULT '',
            utm_content TEXT NOT NULL DEFAULT '',
            utm_term TEXT NOT NULL DEFAULT '',
            landing_page TEXT NOT NULL DEFAULT '',
            referrer TEXT NOT NULL DEFAULT '',
            first_touch_at TEXT NOT NULL DEFAULT '',
            last_touch_at TEXT NOT NULL DEFAULT '',
            session_id TEXT NOT NULL DEFAULT '',
            consent_version TEXT NOT NULL,
            notification_status TEXT NOT NULL DEFAULT 'pending',
            internal_notification_status TEXT NOT NULL DEFAULT 'pending',
            receipt_notification_status TEXT NOT NULL DEFAULT 'pending'
        );
        CREATE TABLE IF NOT EXISTS lead_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lead_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            event_type TEXT NOT NULL,
            detail TEXT NOT NULL DEFAULT '',
            FOREIGN KEY(lead_id) REFERENCES leads(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status, created_at DESC);
        CREATE TABLE IF NOT EXISTS analytics_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            event_name TEXT NOT NULL,
            page TEXT NOT NULL,
            target TEXT NOT NULL DEFAULT '',
            session_id TEXT NOT NULL DEFAULT ''
        );
        CREATE INDEX IF NOT EXISTS idx_analytics_event_time ON analytics_events(event_name, created_at DESC);
        CREATE TABLE IF NOT EXISTS outreach_contacts (
            email TEXT PRIMARY KEY,
            unsubscribe_token TEXT NOT NULL UNIQUE,
            opted_out INTEGER NOT NULL DEFAULT 0,
            updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS outreach_schedules (
            provider_id TEXT PRIMARY KEY,
            message_id TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'scheduled',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(email) REFERENCES outreach_contacts(email) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_outreach_schedules_email
            ON outreach_schedules(email, status);
        CREATE TABLE IF NOT EXISTS outreach_events (
            seq INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT NOT NULL UNIQUE,
            event_type TEXT NOT NULL,
            provider_id TEXT NOT NULL DEFAULT '',
            sender_email TEXT NOT NULL DEFAULT '',
            payload TEXT NOT NULL DEFAULT '{}',
            created_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_outreach_events_seq ON outreach_events(seq);
        """
    )
    lead_columns = {row[1] for row in connection.execute("PRAGMA table_info(leads)")}
    migration_columns = {
        "first_touch_at": "TEXT NOT NULL DEFAULT ''",
        "last_touch_at": "TEXT NOT NULL DEFAULT ''",
        "internal_notification_status": "TEXT NOT NULL DEFAULT 'pending'",
        "receipt_notification_status": "TEXT NOT NULL DEFAULT 'pending'",
    }
    for column, definition in migration_columns.items():
        if column not in lead_columns:
            connection.execute(f"ALTER TABLE leads ADD COLUMN {column} {definition}")
    connection.execute(
        "DELETE FROM leads WHERE julianday(created_at) < julianday('now', '-365 days')"
    )
    connection.execute(
        "DELETE FROM analytics_events WHERE julianday(created_at) < julianday('now', '-365 days')"
    )
    connection.execute(
        "DELETE FROM outreach_events WHERE julianday(created_at) < julianday('now', '-90 days')"
    )
    connection.execute(
        "DELETE FROM outreach_schedules WHERE status != 'scheduled' "
        "AND julianday(updated_at) < julianday('now', '-90 days')"
    )
    return connection


def store_lead(data: dict[str, str]) -> tuple[str, str]:
    lead_id = str(uuid.uuid4())
    public_reference = f"IRV-{datetime.now(LOCAL_TIMEZONE):%Y%m%d}-{uuid.uuid4().hex[:6].upper()}"
    now = utc_now()
    fields = [
        "inquiry", "name", "organization", "email", "phone", "role", "environment",
        "scope", "constraints", "timeline", "challenge", "utm_source", "utm_medium",
        "utm_campaign", "utm_content", "utm_term", "landing_page", "referrer",
        "first_touch_at", "last_touch_at", "session_id",
    ]
    values = [data[field] for field in fields]
    with database() as connection:
        connection.execute(
            f"""INSERT INTO leads (
                id, public_reference, created_at, updated_at, status, score,
                {', '.join(fields)}, consent_version
            ) VALUES ({', '.join('?' for _ in range(6 + len(fields) + 1))})""",
            [lead_id, public_reference, now, now, "new", lead_score(data), *values, CONSENT_VERSION],
        )
        connection.execute(
            "INSERT INTO lead_events (lead_id, created_at, event_type, detail) VALUES (?, ?, ?, ?)",
            (lead_id, now, "created", "website_contact_form"),
        )
    return lead_id, public_reference


def update_notification_component(lead_id: str, component: str, status: str, detail: str = "") -> None:
    if component not in {"internal", "receipt"}:
        raise ValueError("invalid notification component")
    if status not in {"pending", "sent", "failed"}:
        raise ValueError("invalid notification status")
    now = utc_now()
    column = f"{component}_notification_status"
    with database() as connection:
        connection.execute(
            f"UPDATE leads SET {column} = ?, updated_at = ? WHERE id = ?",
            (status, now, lead_id),
        )
        row = connection.execute(
            "SELECT internal_notification_status, receipt_notification_status FROM leads WHERE id = ?",
            (lead_id,),
        ).fetchone()
        component_states = {row["internal_notification_status"], row["receipt_notification_status"]}
        overall = "sent" if component_states == {"sent"} else "failed" if "failed" in component_states else "pending"
        connection.execute(
            "UPDATE leads SET notification_status = ?, updated_at = ? WHERE id = ?",
            (overall, now, lead_id),
        )
        connection.execute(
            "INSERT INTO lead_events (lead_id, created_at, event_type, detail) VALUES (?, ?, ?, ?)",
            (lead_id, now, f"notification_{component}_{status}", detail[:240]),
        )


def store_event(payload: object) -> bool:
    if not isinstance(payload, dict):
        return False
    event_name = clean_text(payload.get("event"), 80)
    if event_name not in ALLOWED_EVENTS:
        return False
    page = clean_text(payload.get("page"), 300)
    target = clean_text(payload.get("target"), 300)
    session_id = clean_text(payload.get("session_id"), 80)
    if not page.startswith("/"):
        return False
    with database() as connection:
        connection.execute(
            "INSERT INTO analytics_events (created_at, event_name, page, target, session_id) VALUES (?, ?, ?, ?, ?)",
            (utc_now(), event_name, page, target, session_id),
        )
    return True


def relay_authorized(headers: object) -> bool:
    provided = getattr(headers, "get")("X-Relay-Secret", "") if headers else ""
    return bool(RELAY_SECRET) and hmac.compare_digest(provided, RELAY_SECRET)


def extract_email(value: object) -> str:
    if not isinstance(value, str):
        return ""
    angled = re.search(r"<([^<>\s]+@[^<>\s]+)>", value)
    candidate = angled.group(1) if angled else value
    candidate = candidate.strip().lower()
    return candidate if EMAIL_RE.fullmatch(candidate) else ""


def verify_resend_signature(raw_body: bytes, headers: object) -> bool:
    if not RESEND_WEBHOOK_SECRET or not headers:
        return False
    event_id = getattr(headers, "get")("svix-id", "")
    timestamp = getattr(headers, "get")("svix-timestamp", "")
    signature_header = getattr(headers, "get")("svix-signature", "")
    try:
        timestamp_number = int(timestamp)
    except (TypeError, ValueError):
        return False
    if not event_id or not signature_header or abs(time.time() - timestamp_number) > 300:
        return False
    secret = (
        RESEND_WEBHOOK_SECRET[6:]
        if RESEND_WEBHOOK_SECRET.startswith("whsec_")
        else RESEND_WEBHOOK_SECRET
    )
    try:
        key = base64.b64decode(secret, validate=True)
    except (ValueError, binascii.Error):
        return False
    signed = f"{event_id}.{timestamp}.".encode("utf-8") + raw_body
    expected = base64.b64encode(
        hmac.new(key, signed, hashlib.sha256).digest()
    ).decode("ascii")
    for part in signature_header.split():
        if part.startswith("v1,") and hmac.compare_digest(part[3:], expected):
            return True
    return False


def relay_register(payload: object) -> tuple[bool, str]:
    if not isinstance(payload, dict):
        return False, "invalid_payload"
    email = extract_email(payload.get("email"))
    token = clean_text(payload.get("unsubscribe_token"), 100).lower()
    schedules = payload.get("schedules", [])
    if not email or not re.fullmatch(r"[a-f0-9]{32}", token):
        return False, "invalid_contact"
    if not isinstance(schedules, list) or len(schedules) > 10:
        return False, "invalid_schedules"
    parsed_schedules: list[tuple[str, str]] = []
    for item in schedules:
        if not isinstance(item, dict):
            return False, "invalid_schedule"
        provider_id = clean_text(item.get("provider_id"), 160)
        message_id = clean_text(item.get("message_id"), 160)
        if not provider_id or not message_id:
            return False, "invalid_schedule"
        parsed_schedules.append((provider_id, message_id))
    now = utc_now()
    with database() as connection:
        connection.execute(
            """
            INSERT INTO outreach_contacts
                (email, unsubscribe_token, opted_out, updated_at)
            VALUES (?, ?, 0, ?)
            ON CONFLICT(email) DO UPDATE SET
                unsubscribe_token=excluded.unsubscribe_token,
                updated_at=excluded.updated_at
            """,
            (email, token, now),
        )
        for provider_id, message_id in parsed_schedules:
            connection.execute(
                """
                INSERT INTO outreach_schedules
                    (provider_id, message_id, email, status, created_at, updated_at)
                VALUES (?, ?, ?, 'scheduled', ?, ?)
                ON CONFLICT(provider_id) DO UPDATE SET
                    message_id=excluded.message_id,
                    email=excluded.email,
                    updated_at=excluded.updated_at
                """,
                (provider_id, message_id, email, now, now),
            )
        opted_out = connection.execute(
            "SELECT opted_out FROM outreach_contacts WHERE email = ?", (email,)
        ).fetchone()["opted_out"]
    if opted_out:
        cancel_scheduled_for_email(email, "already_unsubscribed")
    return True, ""


def resend_cancel(provider_id: str) -> bool:
    if not RESEND_API_KEY:
        return False
    request = Request(
        f"https://api.resend.com/emails/{provider_id}/cancel",
        method="POST",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
    )
    try:
        with urlopen(request, timeout=12) as response:
            return 200 <= response.status < 300
    except HTTPError as error:
        return error.code in {404, 409}
    except (URLError, TimeoutError):
        return False


def cancel_scheduled_for_email(email: str, reason: str) -> int:
    with database() as connection:
        rows = connection.execute(
            """
            SELECT provider_id FROM outreach_schedules
            WHERE email = ? AND status = 'scheduled'
            """,
            (email,),
        ).fetchall()
    cancelled = 0
    for row in rows:
        if not resend_cancel(row["provider_id"]):
            continue
        with database() as connection:
            connection.execute(
                """
                UPDATE outreach_schedules
                SET status = 'cancelled', updated_at = ?
                WHERE provider_id = ? AND status = 'scheduled'
                """,
                (utc_now(), row["provider_id"]),
            )
        cancelled += 1
    if rows and cancelled < len(rows):
        print(
            f"outreach cancellation incomplete reason={reason} "
            f"cancelled={cancelled} expected={len(rows)}",
            flush=True,
        )
    return cancelled


def relay_store_event(
    event_id: str,
    event_type: str,
    provider_id: str = "",
    sender_email: str = "",
) -> None:
    with database() as connection:
        connection.execute(
            """
            INSERT OR IGNORE INTO outreach_events
                (event_id, event_type, provider_id, sender_email, payload, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                event_id[:200],
                event_type[:100],
                provider_id[:200],
                sender_email[:254],
                json.dumps({"type": event_type}, ensure_ascii=False),
                utc_now(),
            ),
        )


def process_resend_webhook(
    payload: object, event_id: str
) -> tuple[bool, str]:
    if not isinstance(payload, dict):
        return False, "invalid_payload"
    event_type = clean_text(payload.get("type"), 100)
    data = payload.get("data", {})
    if not event_type or not isinstance(data, dict):
        return False, "invalid_event"
    provider_id = clean_text(data.get("email_id"), 200)
    sender_email = (
        extract_email(data.get("from")) if event_type == "email.received" else ""
    )
    recipients = data.get("to", [])
    recipient_email = (
        extract_email(recipients[0])
        if isinstance(recipients, list) and recipients
        else ""
    )
    related_email = sender_email or recipient_email
    if not related_email and provider_id:
        with database() as connection:
            row = connection.execute(
                "SELECT email FROM outreach_schedules WHERE provider_id = ?",
                (provider_id,),
            ).fetchone()
            related_email = row["email"] if row else ""
    if related_email and event_type in {
        "email.received",
        "email.bounced",
        "email.complained",
    }:
        if event_type in {"email.bounced", "email.complained"}:
            with database() as connection:
                connection.execute(
                    "UPDATE outreach_contacts SET opted_out = 1, updated_at = ? "
                    "WHERE email = ?",
                    (utc_now(), related_email),
                )
        cancel_scheduled_for_email(related_email, event_type)
    relay_store_event(event_id, event_type, provider_id, related_email)
    return True, ""


def relay_unsubscribe(token: str) -> tuple[bool, str]:
    if not re.fullmatch(r"[a-f0-9]{32}", token):
        return False, ""
    with database() as connection:
        row = connection.execute(
            "SELECT email FROM outreach_contacts WHERE unsubscribe_token = ?",
            (token,),
        ).fetchone()
        if not row:
            return False, ""
        email = row["email"]
        connection.execute(
            "UPDATE outreach_contacts SET opted_out = 1, updated_at = ? "
            "WHERE email = ?",
            (utc_now(), email),
        )
    cancel_scheduled_for_email(email, "unsubscribed")
    relay_store_event(f"unsubscribe:{token}", "contact.unsubscribed", "", email)
    return True, email


def relay_poll(after: int) -> dict[str, object]:
    with database() as connection:
        rows = connection.execute(
            """
            SELECT seq, event_id, event_type, provider_id, sender_email, created_at
            FROM outreach_events WHERE seq > ? ORDER BY seq ASC LIMIT 100
            """,
            (max(0, after),),
        ).fetchall()
    events = [dict(row) for row in rows]
    return {
        "events": events,
        "next_cursor": events[-1]["seq"] if events else max(0, after),
    }


def smtp_send(message: EmailMessage) -> None:
    if not SMTP_USERNAME or not SMTP_PASSWORD or not MAIL_FROM or not MAIL_TO:
        raise RuntimeError("contact mail configuration is incomplete")

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=15) as smtp:
        smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
        smtp.send_message(message)


def build_internal_message(data: dict[str, str], public_reference: str) -> EmailMessage:

    inquiry_label = INQUIRIES[data["inquiry"]]
    safe_org = data["organization"].replace("\r", " ").replace("\n", " ")
    safe_name = data["name"].replace("\r", " ").replace("\n", " ")
    message = EmailMessage()
    message["Subject"] = f"[{inquiry_label}] {safe_org} · {safe_name}"
    message["From"] = MAIL_FROM
    message["To"] = MAIL_TO
    message["Reply-To"] = data["email"]
    message.set_content(
        "\n".join(
            [
                f"문의 유형: {inquiry_label}",
                f"접수 번호: {public_reference}",
                f"이름: {data['name']}",
                f"기관·회사: {data['organization']}",
                f"회신 이메일: {data['email']}",
                f"소속·역할: {data['role'] or '미입력'}",
                f"현장·시설: {data['environment']}",
                f"대상 공간과 범위: {data['scope']}",
                f"데이터·기술 제약: {data['constraints'] or '미입력'}",
                f"희망 일정: {data['timeline'] or '미정'}",
                "",
                "문의 내용:",
                data["challenge"],
            ]
        )
    )

    return message


def build_receipt_message(data: dict[str, str], public_reference: str) -> EmailMessage:
    inquiry_label = INQUIRIES[data["inquiry"]]
    receipt = EmailMessage()
    receipt["Subject"] = "[Iruvy] 문의가 접수되었습니다"
    receipt["From"] = MAIL_FROM
    receipt["To"] = data["email"]
    receipt["Reply-To"] = MAIL_TO
    receipt.set_content(
        "\n".join(
            [
                f"{data['name']}님, Iruvy 웹사이트에서 문의를 접수했습니다.",
                "담당자가 내용을 확인한 뒤 입력하신 이메일로 회신드리겠습니다.",
                "",
                f"접수 번호: {public_reference}",
                f"문의 유형: {inquiry_label}",
                f"기관·회사: {data['organization']}",
                f"현장·시설: {data['environment']}",
                f"대상 공간과 범위: {data['scope']}",
                f"희망 일정: {data['timeline'] or '미정'}",
                "",
                "보내신 내용:",
                data["challenge"],
            ]
        )
    )
    return receipt


def send_internal_message(data: dict[str, str], public_reference: str) -> None:
    smtp_send(build_internal_message(data, public_reference))


def send_receipt_message(data: dict[str, str], public_reference: str) -> None:
    smtp_send(build_receipt_message(data, public_reference))


class ContactHandler(BaseHTTPRequestHandler):
    server_version = "IruvyContact/1.0"

    def log_message(self, fmt: str, *args: object) -> None:
        status = args[1] if len(args) > 1 else "unknown"
        print(f"contact_api status={status}", flush=True)

    def respond(self, status: int, payload: dict[str, object]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def respond_html(self, status: int, title: str, message: str) -> None:
        body = (
            "<!doctype html><html lang=\"ko\"><meta charset=\"utf-8\">"
            "<meta name=\"viewport\" content=\"width=device-width\">"
            "<meta name=\"robots\" content=\"noindex,nofollow\">"
            f"<title>{title}</title>"
            "<body style=\"font-family:system-ui,sans-serif;max-width:560px;"
            "margin:15vh auto;padding:24px;color:#171717\">"
            "<p style=\"color:#654cff;font-weight:700\">IRUVY</p>"
            f"<h1>{title}</h1><p>{message}</p></body></html>"
        ).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        parsed = urlsplit(self.path)
        query = parse_qs(parsed.query)
        if parsed.path == "/health":
            self.respond(200, {"status": "ok"})
            return
        if parsed.path == "/api/contact" and "unsubscribe" in query:
            token = clean_text(query.get("unsubscribe", [""])[0], 100).lower()
            success, _email = relay_unsubscribe(token)
            self.respond_html(
                200 if success else 404,
                "수신거부가 완료되었습니다." if success else "유효하지 않은 요청입니다.",
                (
                    "앞으로 Iruvy의 영업 메일을 보내지 않겠습니다."
                    if success
                    else "링크를 다시 확인해 주세요."
                ),
            )
            return
        if parsed.path == "/api/events" and query.get("relay", [""])[0] in {
            "poll",
            "status",
        }:
            if not relay_authorized(self.headers):
                self.respond(401, {"ok": False, "error": "unauthorized"})
                return
            action = query.get("relay", [""])[0]
            if action == "status":
                with database() as connection:
                    contacts = connection.execute(
                        "SELECT COUNT(*) AS count FROM outreach_contacts"
                    ).fetchone()["count"]
                    scheduled = connection.execute(
                        "SELECT COUNT(*) AS count FROM outreach_schedules "
                        "WHERE status = 'scheduled'"
                    ).fetchone()["count"]
                self.respond(
                    200,
                    {
                        "ok": True,
                        "webhook_configured": bool(RESEND_WEBHOOK_SECRET),
                        "email_configured": bool(RESEND_API_KEY),
                        "contacts": contacts,
                        "scheduled": scheduled,
                    },
                )
                return
            try:
                after = int(query.get("after", ["0"])[0])
            except ValueError:
                after = 0
            self.respond(200, {"ok": True, **relay_poll(after)})
            return
        self.respond(404, {"ok": False})

    def do_POST(self) -> None:
        parsed = urlsplit(self.path)
        query = parse_qs(parsed.query)
        if parsed.path == "/api/events" and query.get("relay", [""])[0] == "register":
            self.handle_relay_register()
            return
        if parsed.path == "/api/events":
            self.handle_event()
            return
        if parsed.path != "/api/contact":
            self.respond(404, {"ok": False})
            return
        if self.headers.get("svix-signature"):
            self.handle_resend_webhook()
            return

        origin = self.headers.get("Origin", "")
        if origin and origin not in ALLOWED_ORIGINS:
            self.respond(403, {"ok": False, "error": "origin_not_allowed"})
            return

        content_type = self.headers.get("Content-Type", "").split(";", 1)[0].strip()
        if content_type != "application/json":
            self.respond(415, {"ok": False, "error": "json_required"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY_BYTES:
            self.respond(413, {"ok": False, "error": "invalid_size"})
            return

        client_ip = self.headers.get("X-Forwarded-For", self.client_address[0]).split(",")[-1].strip()
        now = time.monotonic()
        bucket = RATE_BUCKETS[client_ip]
        while bucket and now - bucket[0] > RATE_WINDOW_SECONDS:
            bucket.popleft()
        if len(bucket) >= RATE_LIMIT:
            self.respond(429, {"ok": False, "error": "rate_limited"})
            return

        try:
            payload = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.respond(400, {"ok": False, "error": "invalid_json"})
            return

        data, error = validate(payload)
        if error == "spam":
            self.respond(200, {"ok": True})
            return
        if error or data is None:
            self.respond(400, {"ok": False, "error": error})
            return

        bucket.append(now)
        try:
            lead_id, public_reference = store_lead(data)
        except Exception as exc:
            print(f"lead storage failed: {type(exc).__name__}", flush=True)
            self.respond(503, {"ok": False, "error": "storage_failed"})
            return

        notifications_sent = True
        try:
            send_internal_message(data, public_reference)
            update_notification_component(lead_id, "internal", "sent")
        except Exception as exc:
            print(f"internal mail delivery failed: {type(exc).__name__}", flush=True)
            update_notification_component(lead_id, "internal", "failed", type(exc).__name__)
            notifications_sent = False

        try:
            send_receipt_message(data, public_reference)
            update_notification_component(lead_id, "receipt", "sent")
        except Exception as exc:
            print(f"receipt delivery failed: {type(exc).__name__}", flush=True)
            update_notification_component(lead_id, "receipt", "failed", type(exc).__name__)
            notifications_sent = False

        self.respond(200, {
            "ok": True,
            "reference": public_reference,
            "notification": "sent" if notifications_sent else "pending",
        })

    def handle_relay_register(self) -> None:
        if not relay_authorized(self.headers):
            self.respond(401, {"ok": False, "error": "unauthorized"})
            return
        if self.headers.get("Content-Type", "").split(";", 1)[0].strip() != "application/json":
            self.respond(415, {"ok": False, "error": "json_required"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY_BYTES:
            self.respond(413, {"ok": False, "error": "invalid_size"})
            return
        try:
            payload = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.respond(400, {"ok": False, "error": "invalid_json"})
            return
        try:
            success, error = relay_register(payload)
        except Exception as exception:
            print(f"relay registration failed: {type(exception).__name__}", flush=True)
            self.respond(503, {"ok": False, "error": "storage_failed"})
            return
        self.respond(
            200 if success else 400,
            {"ok": success, **({"error": error} if error else {})},
        )

    def handle_resend_webhook(self) -> None:
        if self.headers.get("Content-Type", "").split(";", 1)[0].strip() != "application/json":
            self.respond(415, {"ok": False, "error": "json_required"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_WEBHOOK_BODY_BYTES:
            self.respond(413, {"ok": False, "error": "invalid_size"})
            return
        raw_body = self.rfile.read(length)
        if not verify_resend_signature(raw_body, self.headers):
            self.respond(401, {"ok": False, "error": "invalid_signature"})
            return
        try:
            payload = json.loads(raw_body)
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.respond(400, {"ok": False, "error": "invalid_json"})
            return
        event_id = clean_text(self.headers.get("svix-id"), 200)
        try:
            success, error = process_resend_webhook(payload, event_id)
        except Exception as exception:
            print(f"resend webhook failed: {type(exception).__name__}", flush=True)
            self.respond(503, {"ok": False, "error": "processing_failed"})
            return
        self.respond(
            200 if success else 400,
            {"ok": success, **({"error": error} if error else {})},
        )

    def handle_event(self) -> None:
        origin = self.headers.get("Origin", "")
        if origin and origin not in ALLOWED_ORIGINS:
            self.respond(403, {"ok": False, "error": "origin_not_allowed"})
            return
        if self.headers.get("Content-Type", "").split(";", 1)[0].strip() != "application/json":
            self.respond(415, {"ok": False, "error": "json_required"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > 4_096:
            self.respond(413, {"ok": False, "error": "invalid_size"})
            return
        client_ip = self.headers.get("X-Forwarded-For", self.client_address[0]).split(",")[0].strip()
        now = time.monotonic()
        bucket = EVENT_BUCKETS[client_ip]
        while bucket and now - bucket[0] > RATE_WINDOW_SECONDS:
            bucket.popleft()
        if len(bucket) >= 120:
            self.respond(429, {"ok": False, "error": "rate_limited"})
            return
        try:
            payload = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.respond(400, {"ok": False, "error": "invalid_json"})
            return
        bucket.append(now)
        try:
            stored = store_event(payload)
        except Exception as exc:
            print(f"event storage failed: {type(exc).__name__}", flush=True)
            self.respond(503, {"ok": False, "error": "storage_failed"})
            return
        if not stored:
            self.respond(400, {"ok": False, "error": "invalid_event"})
            return
        self.respond(202, {"ok": True})


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), ContactHandler)
    print(f"Iruvy contact API listening on {HOST}:{PORT}", flush=True)
    server.serve_forever()
