# AGENTS.md — Iruvy 웹사이트 작업 가이드

이 파일은 이 저장소(`website/`)에서 작업할 미래 에이전트를 위한 것이다. 전부 재발견하지 않고 바로 올바르게 일하도록 핵심 규칙·맥락을 담는다.

## 프로젝트 미션

GPS가 닿지 않는 복합 실내공간에서 시각장애인·이동약자·초행 방문자가 **실제 목적지까지 스스로** 이동하도록 돕는 Iruvy 실내 내비게이션을, **기관 구매자**(병원·공공기관·복지시설·대학·교통시설)에게 설명·설득하고 PoC 문의로 전환시키는 공개 웹사이트.

## 1차 청중 (누구에게 말하는가)

- **핵심 구매자·영향자:** 접근성 담당자, 공공기관 담당·시설관리, 예산 결정자, 조달·법무/개인정보 검토자.
- **최종 사용자(수혜자):** 시각장애인·고령자·이동약자·초행 방문자. → 사용자 감성만으로 끝내지 말고 구매자의 도입 명분·근거로 번역할 것.
- 상세: `docs/AUDIENCE.md`.

## 비협상 원칙 (지키지 않으면 실패)

1. **정직성.** 실증 수치엔 항상 제한 문구("팀 제공·제삼자 인증 아님·특정 환경"). 기관 관계는 협의/관심/지원/접점으로 구분 — 계약·정식 구축으로 과장 금지.
2. **대외 공개·근거 사안은 대표 확인 후.** 실증 수치·기관 관계·라이브 배포는 임의 강화·변경 금지.
3. **접근성은 1급 요구.** WCAG 2.2 AA 실무 기준. 대비·키보드·초점·제목구조·alt·reduced-motion·타깃 크기 유지. `docs/ACCESSIBILITY.md`.
4. **구 브랜드 금지.** 표시 텍스트·참조 자산에 Riav/Atmos/소리블록 금지. `assets/app-user-clean.jpg`는 "Riav" baked-in → 사용 금지, 현재 브랜드 목업(`assets/product/*.jpg`, `assets/app-admin-clean.jpg`) 사용.
5. **검증 후 완료.** write-success는 증거가 아님 — `tests/check-site.mjs` + 브라우저 육안(데스크톱/모바일) 확인.
6. **최신 사실.** 실증 헤드라인 = 자력 도착률 **26.6% → 96.7%**(2차 PoC 87/90, 90명 규모). 구 93.3%/23명 재사용 금지.

## 현재 전략 (요약)

- 포지셔닝·메시지·IA·콘텐츠·디자인 전략은 `docs/STRATEGY.md`, `docs/POSITIONING.md`, `docs/INFORMATION_ARCHITECTURE.md`, `docs/CONTENT_STRATEGY.md`, `docs/DESIGN_SYSTEM.md` 참조. 근거표는 `docs/EVIDENCE.md`.
- 홈 히어로: 라이트 그라디언트 + "누구나 어디든 갈 수 있는 세상" + 현재 브랜드 앱 목업 2개 + 도입 문의/서비스 보기. (main의 깔끔함 + codex의 9페이지 깊이 하이브리드.)

## 폴더 규약

- 페이지: 각 경로 `<name>/index.html`(압축된 단일 라인 섹션). 스타일 `styles/*.css`, 스크립트 `scripts/site.js`.
- 문서: `docs/`(마스터 프롬프트 정규 파일 + 기존 소문자 파일). 리서치: `research/{benchmarks,secondary,primary,notes,sources}/`.
- 자산: 현재 브랜드만. 대용량 원본은 `assets/media/`(운영 서빙 대상 아님, 배포 제외).

## 명령어

```bash
# 검사(빌드 겸용)
node tests/check-site.mjs
# JS 문법
node -c scripts/site.js
# 로컬 서빙
python3 -m http.server 4173   # http://127.0.0.1:4173 (브라우저는 127.0.0.1 사용; localhost 차단될 수 있음)
```

## 배포 (운영)

- 서버: SSH `atmos-prod`(AWS Lightsail, ubuntu). 웹서버: Caddy, 문서 루트 `/var/www/riav`(HTML no-cache → 즉시 반영). 도메인 iruvy.com/www/riav.duckdns.org.
- 자동 배포 없음. 절차: ① `/var/www/riav` 백업 → `/var/www/iruvy-backups/riav-<TS>` ② 변경 파일만 `rsync -avzR --rsync-path="sudo rsync" <files> atmos-prod:/var/www/riav/`(대용량 미디어 절대 제외) ③ curl/브라우저로 라이브 검증.
- **운영 배포·origin 푸시는 대외 공개 행위 — 대표 확인 후.**

## 알려진 위험 / 이슈

- KI-001 실증 원자료 미공개(페이지가 고지 중). KI-002 구 브랜드 목업. KI-003 문의 서버 수집 없음(mailto). KI-004 자동 배포 없음. 상세 `docs/known-issues.md`.
- `main` 브랜치는 옛 단일 페이지 — 정본은 `codex/iruvy-premium-redesign-20260710`(배포본). 정리 미정.

## 금지된 지름길

- 저장소 감사 없이 재구조화, 원본 이해 없이 삭제, 리서치 1패스로 종료, 근거 날조, 관계·수치 과장, 경쟁사 사이트 복제, 접근성 저해 패턴, 플레이스홀더 방치, 독립 검토 전 완료 선언.

## 검토 기대치

- 변경 후 §17 독립 검토(적대적) + §14 QA(기능·콘텐츠·시각·접근성·성능·링크·반응형) → `docs/QA_REPORT.md`, `docs/REVIEW_REPORT*.md`. 검토 지적은 무시하지 말 것.
