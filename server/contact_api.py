#!/usr/bin/env python3
"""Minimal same-origin contact API for iruvy.com."""

from __future__ import annotations

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
    if not all(data[field] for field in ("name", "organization", "phone", "role", "environment", "scope", "timeline")):
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

    def do_GET(self) -> None:
        if self.path == "/health":
            self.respond(200, {"status": "ok"})
            return
        self.respond(404, {"ok": False})

    def do_POST(self) -> None:
        if self.path == "/api/events":
            self.handle_event()
            return
        if self.path != "/api/contact":
            self.respond(404, {"ok": False})
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
