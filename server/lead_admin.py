#!/usr/bin/env python3
"""Local-only lead administration for the Iruvy contact database."""

from __future__ import annotations

import argparse
import csv
import os
import sqlite3
import sys
from datetime import datetime, timedelta, timezone

import contact_api


DB_PATH = os.environ.get("CONTACT_DB_PATH", "/var/lib/iruvy-contact/leads.db")
STATUSES = (
    "new", "reviewing", "qualified", "contacted", "discovery_scheduled",
    "discovery_complete", "site_assessment", "proposal", "pilot_negotiation",
    "pilot_active", "annual_contract", "nurture", "won", "lost", "spam",
)


def connection() -> sqlite3.Connection:
    contact_api.DB_PATH = DB_PATH
    return contact_api.database()


def list_leads(limit: int, status: str | None) -> None:
    query = """SELECT public_reference, created_at, status, score, inquiry,
                      organization, name, email, timeline, notification_status
               FROM leads"""
    params: list[object] = []
    if status:
        query += " WHERE status = ?"
        params.append(status)
    query += " ORDER BY created_at DESC LIMIT ?"
    params.append(limit)
    with connection() as db:
        rows = db.execute(query, params).fetchall()
    for row in rows:
        print("\t".join(str(row[key]) for key in row.keys()))


def update_status(reference: str, status: str, note: str) -> None:
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with connection() as db:
        row = db.execute(
            "SELECT id, status FROM leads WHERE public_reference = ?", (reference,)
        ).fetchone()
        if row is None:
            raise SystemExit(f"lead not found: {reference}")
        db.execute(
            "UPDATE leads SET status = ?, updated_at = ? WHERE id = ?",
            (status, now, row["id"]),
        )
        detail = f"{row['status']} -> {status}"
        if note:
            detail += f" · {note[:180]}"
        db.execute(
            "INSERT INTO lead_events (lead_id, created_at, event_type, detail) VALUES (?, ?, ?, ?)",
            (row["id"], now, "status_changed", detail),
        )
    print(f"updated {reference}: {status}")


def export_csv(output: str, status: str | None) -> None:
    query = "SELECT * FROM leads"
    params: list[object] = []
    if status:
        query += " WHERE status = ?"
        params.append(status)
    query += " ORDER BY created_at DESC"
    with connection() as db:
        rows = db.execute(query, params).fetchall()
    if not rows:
        raise SystemExit("no leads to export")
    stream = sys.stdout if output == "-" else open(output, "w", encoding="utf-8", newline="")
    try:
        writer = csv.DictWriter(stream, fieldnames=rows[0].keys())
        writer.writeheader()
        for row in rows:
            safe_row = {
                key: f"'{value}" if isinstance(value, str) and value.startswith(("=", "+", "-", "@")) else value
                for key, value in dict(row).items()
            }
            writer.writerow(safe_row)
    finally:
        if stream is not sys.stdout:
            stream.close()


def dashboard(days: int) -> None:
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat(timespec="seconds")
    with connection() as db:
        leads = db.execute(
            "SELECT status, COUNT(*) AS total FROM leads WHERE created_at >= ? GROUP BY status ORDER BY total DESC",
            (since,),
        ).fetchall()
        inquiries = db.execute(
            "SELECT inquiry, COUNT(*) AS total FROM leads WHERE created_at >= ? GROUP BY inquiry ORDER BY total DESC",
            (since,),
        ).fetchall()
        events = db.execute(
            "SELECT event_name, COUNT(*) AS total FROM analytics_events WHERE created_at >= ? GROUP BY event_name ORDER BY total DESC",
            (since,),
        ).fetchall()
    print(f"Iruvy website dashboard · last {days} days")
    for heading, rows, key in (("lead_status", leads, "status"), ("inquiry", inquiries, "inquiry"), ("events", events, "event_name")):
        print(f"\n[{heading}]")
        if not rows:
            print("no data")
        for row in rows:
            print(f"{row[key]}\t{row['total']}")


def retry_notifications(reference: str | None, limit: int) -> None:
    query = """SELECT * FROM leads
               WHERE (internal_notification_status != 'sent'
                  OR receipt_notification_status != 'sent')"""
    params: list[object] = []
    if reference:
        query += " AND public_reference = ?"
        params.append(reference)
    query += " ORDER BY created_at ASC LIMIT ?"
    params.append(limit)
    with connection() as db:
        rows = db.execute(query, params).fetchall()
    if not rows:
        print("no pending notifications")
        return

    sent = 0
    failed = 0
    for row in rows:
        data = dict(row)
        lead_id = row["id"]
        public_reference = row["public_reference"]
        row_ok = True
        if row["internal_notification_status"] != "sent":
            try:
                contact_api.send_internal_message(data, public_reference)
                contact_api.update_notification_component(lead_id, "internal", "sent", "manual_retry")
            except Exception as exc:
                contact_api.update_notification_component(lead_id, "internal", "failed", type(exc).__name__)
                row_ok = False
        if row["receipt_notification_status"] != "sent":
            try:
                contact_api.send_receipt_message(data, public_reference)
                contact_api.update_notification_component(lead_id, "receipt", "sent", "manual_retry")
            except Exception as exc:
                contact_api.update_notification_component(lead_id, "receipt", "failed", type(exc).__name__)
                row_ok = False
        print(f"{public_reference}\t{'sent' if row_ok else 'failed'}")
        sent += int(row_ok)
        failed += int(not row_ok)
    print(f"retried={len(rows)} sent={sent} failed={failed}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Manage locally stored Iruvy website leads")
    subparsers = parser.add_subparsers(dest="command", required=True)

    list_parser = subparsers.add_parser("list")
    list_parser.add_argument("--limit", type=int, default=30)
    list_parser.add_argument("--status", choices=STATUSES)

    update_parser = subparsers.add_parser("update")
    update_parser.add_argument("reference")
    update_parser.add_argument("status", choices=STATUSES)
    update_parser.add_argument("--note", default="")

    export_parser = subparsers.add_parser("export")
    export_parser.add_argument("--output", default="-")
    export_parser.add_argument("--status", choices=STATUSES)

    dashboard_parser = subparsers.add_parser("dashboard")
    dashboard_parser.add_argument("--days", type=int, default=7)

    notify_parser = subparsers.add_parser("retry-notifications")
    notify_parser.add_argument("--reference")
    notify_parser.add_argument("--limit", type=int, default=50)

    args = parser.parse_args()
    if args.command == "list":
        list_leads(max(1, min(args.limit, 500)), args.status)
    elif args.command == "update":
        update_status(args.reference, args.status, args.note)
    elif args.command == "export":
        export_csv(args.output, args.status)
    elif args.command == "dashboard":
        dashboard(max(1, min(args.days, 3650)))
    else:
        retry_notifications(args.reference, max(1, min(args.limit, 500)))


if __name__ == "__main__":
    main()
