#!/usr/bin/env python3

import os
import tempfile
import unittest

import contact_api


class ContactApiTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tempdir = tempfile.TemporaryDirectory()
        contact_api.DB_PATH = os.path.join(self.tempdir.name, "leads.db")
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
        for field in ("phone", "role", "environment", "scope", "timeline"):
            payload = dict(self.valid)
            payload[field] = ""
            _, error = contact_api.validate(payload)
            self.assertEqual(error, "missing_required", field)

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


if __name__ == "__main__":
    unittest.main()
