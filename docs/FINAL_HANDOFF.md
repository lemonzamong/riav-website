# Final Handoff — Iruvy 웹사이트

작성 2026-07-11. 다른 전문가가 이어받아 계속할 수 있도록.

## Executive summary

기존에 성숙한 Iruvy 정적 웹사이트(9페이지)를 대상으로 (1) 독립 검토·접근성 수정, (2) 실증 수치 최신화(96.7%), (3) 네비게이션 일관화, (4) 대표 지시에 따른 하이브리드 히어로(깔끔한 앱 목업 + 9페이지 깊이) 재설계·배포, (5) 마스터 프롬프트 전체 문서·리서치 체계 구축, (6) 2차 독립 검토·QA·수정을 수행했다. 라이브(iruvy.com) 반영·검증 완료. **미결정 1건: 히어로 프레이밍(감정 vs 구매자-결과) — 대표 결정 대기.**

## What was changed / Why

- 실증 수치 26.6%→93.3%(23명) → **96.7%(2차 PoC 87/90, 90명)**: 대표 검증 최신치. 정직성 문구 유지.
- 홈 헤더 네비 → 상세 페이지 링크·CTA 통일: 도달성·일관성.
- 홈 히어로: 다크+YouTube → 라이트+앱 목업(현재 브랜드): 대표 미학 선호 + 브랜드 리스크(Riav) 제거.
- 기술 신호 위계 정정(센서 핵심·Wi-Fi/RF 보조), 접근성 4건 수정, 죽은 CSS/JS 제거.
- 문서·리서치 체계 신규 구축(§23 지름길 시정).

## Final strategy (요지)

1차 청중 = **내부 챔피언(접근성·시설 담당)**. 홈의 임무 = 챔피언을 예산·조달 심사에서 무장. 리드 = 구매자 **의무+결과**(감정은 보조). 근거는 n·과제·장소·자기측정 라벨, 실명 기관. 진입 = 무료 SW/Light PoC + 조달청 혁신제품 무과실 경로. 상세: `docs/STRATEGY.md`.

## Final target audience

`docs/AUDIENCE.md` — 챔피언(1차), 예산·시설·기관장·개인정보/조달(2차), 사용자·장애인단체(증인).

## Final messaging hierarchy

이해 → 관련성(의무·부담·입증) → 증거 → 실행 가능성 → 신뢰 → 행동. `docs/STRATEGY.md`.

## Final IA

9경로(홈·제품·솔루션·기술·실증·회사·문의·개인정보·접근성). 홈 권장 순서·미응답 반대 배치: `docs/INFORMATION_ARCHITECTURE.md`.

## Final design direction

라이트 히어로(앱 목업)·Pretendard·Iruvy Violet 토큰·섹션 리듬. `docs/DESIGN_SYSTEM.md`. 하위 페이지 톤 통일은 후속.

## Final implementation status

정적 다중 페이지, Caddy 배포(iruvy.com). 최신 커밋까지 라이브 반영·검증. 빌드·검사 통과.

## Evidence and sources

주장-근거표 `docs/EVIDENCE.md`. 외부 리서치 원문 `research/`(벤치마크·표준/조달·청중/반증). 리서치 해석 `docs/RESEARCH_LOG.md`.

## Accessibility status

WCAG 2.2 AA 실무 기준. 대비·초점·제목·모션·폼 확인·수정. 후속: 24×24 타깃 전수, 스크린리더 1패스, 200% 육안. `docs/ACCESSIBILITY.md`.

## QA status

Critical/High 없음. Medium/Low(M1·L1·L2·L3) 전부 수정·검증. `docs/QA_REPORT.md`.

## Independent review status

2회 수행(§17): 1차(초기 결함) `docs/review-report-2026-07-11.md`, 2차(히어로 회귀) QA_REPORT에 종합. 모두 수정 완료.

## Known limitations

- KI-001 실증 원자료 미공개(페이지 고지 중). KI-003 문의 mailto. KI-004 자동 배포 없음.
- 하위 페이지 시각 톤·영어 eyebrow 미통일. main 브랜치 미정리.
- 규제 조문 번호·벌칙 수치 일부 미확정(사용 전 원문 확인).

## Deferred items (대표 결정/자료 필요)

- **히어로 프레이밍 결정**(감정 vs 구매자-결과, 권고 B) — `docs/decisions.md` D-HERO.
- 실증 원보고서 공개 연결, 조달청 혁신제품 콘텐츠, 프라이버시 카피 강화, 조달 킷 게시, main 브랜치 정리.

## How to run / test / deploy

`AGENTS.md`의 명령어·배포 절차 참조. 로컬: `python3 -m http.server 4173`(127.0.0.1). 검사: `node tests/check-site.mjs`. 배포: SSH `atmos-prod` 백업→rsync(대용량 미디어 제외)→라이브 검증, 대표 확인 후.

## Important files

- 사이트: `index.html`, `*/index.html`, `styles/*.css`, `scripts/site.js`.
- 가이드: `AGENTS.md`. 정본 문서: `docs/`(대문자·언더스코어). 리서치: `research/`.
- 롤백: `/var/www/iruvy-backups/riav-<TS>`.

## Future recommendations

1. 히어로 프레이밍 결정 반영. 2. 하위 페이지 구매자-결과 카피·톤 통일. 3. 조달청 혁신제품·프라이버시·조달 킷 콘텐츠 추가. 4. 접근성 후속 QA(24×24·스크린리더·200%). 5. 문의 폼 백엔드(전송 위장 금지). 6. 자동 배포·main 브랜치 정리. 7. 실증 원자료 공개로 근거 Proven 승격.
