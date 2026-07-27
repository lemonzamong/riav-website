#!/usr/bin/env python3

import base64
import hashlib
import hmac
import json
import os
import tempfile
import unittest
from unittest.mock import patch

import contact_api


class ContactApiTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tempdir = tempfile.TemporaryDirectory()
        contact_api.DB_PATH = os.path.join(self.tempdir.name, "leads.db")
        self.previous_webhook_secret = contact_api.RESEND_WEBHOOK_SECRET
        self.valid = {
            "inquiry": "flow",
            "name": "테스트 담당자",
            "organization": "테스트 제조",
            "email": "buyer@example.com",
            "phone": "02-1234-5678",
            "role": "생산관리 팀장",
            "environment": "정밀가공",
            "scope": "가공 생산셀 1개와 주문·공정·실적 데이터",
            "constraints": "읽기 전용 연결",
            "timeline": "6개월 이내",
            "challenge": "긴급 주문과 설비 정지 때 납기 위험을 늦게 발견합니다.",
            "privacy": "agreed",
            "website": "",
            "first_touch_at": "2026-07-20T00:00:00.000Z",
            "last_touch_at": "2026-07-20T01:00:00.000Z",
        }

    def tearDown(self) -> None:
        contact_api.RESEND_WEBHOOK_SECRET = self.previous_webhook_secret
        self.tempdir.cleanup()

    def test_flow_lead_validates_and_persists_attribution(self) -> None:
        data, error = contact_api.validate(self.valid)
        self.assertIsNone(error)
        self.assertIsNotNone(data)
        _, reference = contact_api.store_lead(data)
        self.assertRegex(reference, r"^IRV-\d{8}-[A-Z0-9]{6}$")
        with contact_api.database() as db:
            row = db.execute("SELECT * FROM leads").fetchone()
        self.assertEqual(row["inquiry"], "flow")
        self.assertEqual(row["first_touch_at"], self.valid["first_touch_at"])
        self.assertEqual(row["last_touch_at"], self.valid["last_touch_at"])
        self.assertEqual(row["internal_notification_status"], "pending")
        self.assertEqual(row["receipt_notification_status"], "pending")

    def test_notification_components_are_tracked_independently(self) -> None:
        data, _ = contact_api.validate(self.valid)
        lead_id, _ = contact_api.store_lead(data)
        contact_api.update_notification_component(lead_id, "internal", "sent")
        with contact_api.database() as db:
            row = db.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
        self.assertEqual(row["internal_notification_status"], "sent")
        self.assertEqual(row["receipt_notification_status"], "pending")
        self.assertEqual(row["notification_status"], "pending")

        contact_api.update_notification_component(lead_id, "receipt", "failed", "SMTPError")
        with contact_api.database() as db:
            row = db.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
        self.assertEqual(row["notification_status"], "failed")

    def test_required_sales_context_is_enforced(self) -> None:
        for field in ("role", "environment", "scope", "timeline"):
            payload = dict(self.valid)
            payload[field] = ""
            _, error = contact_api.validate(payload)
            self.assertEqual(error, "missing_required", field)

    def test_phone_is_optional_for_lower_friction_fit_review(self) -> None:
        payload = dict(self.valid)
        payload["phone"] = ""
        data, error = contact_api.validate(payload)
        self.assertIsNone(error)
        self.assertEqual(data["phone"], "")

    def test_flow_funnel_events_are_allowed(self) -> None:
        for event in (
            "nav_primary_cta_click",
            "hero_primary_cta_click",
            "hero_demo_open",
            "demo_step_view",
            "fit_form_start",
            "fit_form_step_complete",
            "fit_form_submit",
            "fit_form_error",
            "contact_submit",
        ):
            self.assertIn(event, contact_api.ALLOWED_EVENTS)

    def test_full_sales_pipeline_statuses_are_available(self) -> None:
        for status in ("discovery_scheduled", "site_assessment", "pilot_active", "annual_contract", "nurture"):
            self.assertIn(status, contact_api.LEAD_STATUSES)

    def test_relay_registers_contact_and_scheduled_messages(self) -> None:
        token = "a" * 32
        success, error = contact_api.relay_register(
            {
                "email": "Buyer <BUYER@example.com>",
                "unsubscribe_token": token,
                "schedules": [
                    {"provider_id": "provider-1", "message_id": "message-1"},
                    {"provider_id": "provider-2", "message_id": "message-2"},
                ],
            }
        )
        self.assertTrue(success)
        self.assertEqual(error, "")
        with contact_api.database() as db:
            contact = db.execute(
                "SELECT * FROM outreach_contacts WHERE email = ?",
                ("buyer@example.com",),
            ).fetchone()
            schedules = db.execute(
                "SELECT * FROM outreach_schedules ORDER BY provider_id"
            ).fetchall()
        self.assertEqual(contact["unsubscribe_token"], token)
        self.assertEqual(contact["opted_out"], 0)
        self.assertEqual([row["provider_id"] for row in schedules], ["provider-1", "provider-2"])

    def test_unsubscribe_marks_contact_and_cancels_schedules(self) -> None:
        token = "b" * 32
        contact_api.relay_register(
            {
                "email": "buyer@example.com",
                "unsubscribe_token": token,
                "schedules": [
                    {"provider_id": "provider-1", "message_id": "message-1"},
                ],
            }
        )
        with patch.object(contact_api, "resend_cancel", return_value=True):
            success, email = contact_api.relay_unsubscribe(token)
        self.assertTrue(success)
        self.assertEqual(email, "buyer@example.com")
        with contact_api.database() as db:
            contact = db.execute(
                "SELECT opted_out FROM outreach_contacts WHERE email = ?",
                (email,),
            ).fetchone()
            schedule = db.execute(
                "SELECT status FROM outreach_schedules WHERE provider_id = 'provider-1'"
            ).fetchone()
        self.assertEqual(contact["opted_out"], 1)
        self.assertEqual(schedule["status"], "cancelled")
        events = contact_api.relay_poll(0)["events"]
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["event_type"], "contact.unsubscribed")
        self.assertEqual(events[0]["sender_email"], email)

    def test_reply_event_cancels_followups_and_is_idempotent(self) -> None:
        token = "c" * 32
        contact_api.relay_register(
            {
                "email": "buyer@example.com",
                "unsubscribe_token": token,
                "schedules": [
                    {"provider_id": "provider-1", "message_id": "message-1"},
                ],
            }
        )
        payload = {
            "type": "email.received",
            "data": {"email_id": "inbound-1", "from": "Buyer <buyer@example.com>"},
        }
        with patch.object(contact_api, "resend_cancel", return_value=True):
            self.assertEqual(
                contact_api.process_resend_webhook(payload, "event-1"),
                (True, ""),
            )
            self.assertEqual(
                contact_api.process_resend_webhook(payload, "event-1"),
                (True, ""),
            )
        with contact_api.database() as db:
            schedule = db.execute(
                "SELECT status FROM outreach_schedules WHERE provider_id = 'provider-1'"
            ).fetchone()
        self.assertEqual(schedule["status"], "cancelled")
        self.assertEqual(len(contact_api.relay_poll(0)["events"]), 1)

    def test_bounce_uses_recipient_to_stop_future_messages(self) -> None:
        token = "d" * 32
        contact_api.relay_register(
            {
                "email": "buyer@example.com",
                "unsubscribe_token": token,
                "schedules": [
                    {"provider_id": "followup-1", "message_id": "message-1"},
                ],
            }
        )
        payload = {
            "type": "email.bounced",
            "data": {
                "email_id": "initial-1",
                "from": "Iruvy <contact@iruvy.com>",
                "to": ["buyer@example.com"],
            },
        }
        with patch.object(contact_api, "resend_cancel", return_value=True):
            self.assertEqual(
                contact_api.process_resend_webhook(payload, "event-bounce"),
                (True, ""),
            )
        with contact_api.database() as db:
            contact = db.execute(
                "SELECT opted_out FROM outreach_contacts WHERE email = ?",
                ("buyer@example.com",),
            ).fetchone()
            schedule = db.execute(
                "SELECT status FROM outreach_schedules WHERE provider_id = ?",
                ("followup-1",),
            ).fetchone()
        self.assertEqual(contact["opted_out"], 1)
        self.assertEqual(schedule["status"], "cancelled")
        event = contact_api.relay_poll(0)["events"][0]
        self.assertEqual(event["sender_email"], "buyer@example.com")

    def test_resend_webhook_signature_validation(self) -> None:
        raw_secret = b"relay-webhook-test-secret"
        contact_api.RESEND_WEBHOOK_SECRET = "whsec_" + base64.b64encode(raw_secret).decode("ascii")
        raw_body = json.dumps(
            {"type": "email.received", "data": {"email_id": "inbound-1"}},
            separators=(",", ":"),
        ).encode("utf-8")
        timestamp = "1800000000"
        event_id = "msg_test"
        signed = f"{event_id}.{timestamp}.".encode("utf-8") + raw_body
        signature = base64.b64encode(
            hmac.new(raw_secret, signed, hashlib.sha256).digest()
        ).decode("ascii")
        headers = {
            "svix-id": event_id,
            "svix-timestamp": timestamp,
            "svix-signature": f"v1,{signature}",
        }
        with patch.object(contact_api.time, "time", return_value=1800000000):
            self.assertTrue(contact_api.verify_resend_signature(raw_body, headers))
            self.assertFalse(
                contact_api.verify_resend_signature(raw_body + b" ", headers)
            )


if __name__ == "__main__":
    unittest.main()
