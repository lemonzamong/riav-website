# 독립 검토 보고서 — 2026-07-11

검토 방식: 기존 코드베이스를 사실로 두고, 별도의 적대적(adversarial) 독립 검토자 관점으로 9개 페이지·CSS 5종·`scripts/site.js`·에셋·`tests/check-site.mjs`를 직접 검사. 이전 codex 리디자인의 요약을 신뢰하지 않고 파일을 재검증함.

## 재검증에서 양호했던 항목 (재작업 불필요)

- 홈 탭 위젯 키보드 상호작용(`scripts/site.js:44-77`): roving tabindex, ArrowLeft/Right 순환, Home/End, `aria-selected` 동기화, `panel.hidden` 토글까지 ARIA APG 준수.
- 모바일 네비(`site.js:5-33`): `aria-expanded` 동기화, Escape 닫기·포커스 복귀, 링크 클릭 닫기, 리사이즈 닫기, 스크롤 잠금.
- 실증 수치 정직성 문구: 수치가 등장하는 모든 위치(`index.html:98,103,173`, `proof/`)에 "팀 제공 결과·제삼자 인증 아님·특정 환경" 제한 명시.
- 기관 관계 표현: 협의/관심/지원 맥락/접점으로 절제(과장 없음).
- 구 브랜드(Riav/Atmos/소리블록) 잔재: HTML/CSS/JS·참조 에셋 경로 전체에서 0건.
- 문의 양식: 모든 필드 `<label for>`, `role="status" aria-live`, 전송 성공 위장 없이 `mailto:` 인계.

## 이번에 수정 완료 (안전한 내부 품질·접근성, 대외 주장 변경 없음)

| ID | 심각도 | 문제 | 조치 | 검증 |
|---|---|---|---|---|
| H1 | High | 기술 페이지 파이프라인 단계 라벨(`.tech-node span`)이 흰 배경에 `#e9e5ff` → 대비 ≈1.1:1로 사실상 안 보임 | `--brand-700`(#503bd7)로 변경, 연결 화살표 `::after`는 `--brand-500` | 브라우저 계산값 `rgb(80,59,215)` on white ≈6.5:1 확인 |
| M1 | Medium | 히어로 YouTube 영상이 autoplay+loop로 `prefers-reduced-motion` 무시(전정기관 민감 사용자 위험) | 기본 src를 비자동재생으로, `data-autoplay-src`+`site.js`에서 움직임 허용 시에만 autoplay 적용 | 움직임 허용 상태에서 autoplay 적용, 축소 설정 시 미적용 확인 |
| M2 | Medium | 회사 페이지 Vision 섹션에 `<h2>` 부재 → 문서 개요·스크린리더 제목 탐색 누락 | `.vision-line`을 `<p>`→`<h2>`로 변경 | — |
| M3 | Medium | 보라(`--brand-700`) 배경 위 흰색 텍스트 저대비: `.section--brand p/li` 0.75, `.program-section p` 0.7, `.program-note`(단가 고지) 0.62 | 각각 0.9/0.9/0.88로 상향 | `program-note` 계산값 `rgba(255,255,255,0.88)` ≈5.2:1 확인 |
| L1 | Low | 존재하지 않는 `/assets/media/indoor-navigation-hospital.jpg`를 참조하는 죽은 `.hero*` CSS 블록 | 전 페이지 미사용(0건) 확인 후 `pages.css`에서 제거 | `check-site.mjs` 통과 |

수정 후 `node tests/check-site.mjs` 통과(9 pages), `node -c scripts/site.js` 통과.

## 대표 결정에 따라 반영 완료

- **D1 실증 수치 갱신 완료.** 대표 결정: "최신 확정으로 갱신". 라이브 표기를 `26.6% → 93.3%`(23명)에서 `26.6% → 96.7%`(2차 PoC 87/90, 90명 규모 반복 실증)로 전체 갱신. 반영 위치: `index.html`(히어로 근거·proof 지표 타일·system 리포트·relationship 카드), `proof/index.html`(메타 설명·case labels·case result·방법/제한 표), 내부 문서(`release-report`·`blockers`·`repository-audit`·`content-strategy`). 정직성 문구("팀 제공 결과·제삼자 인증 아님·특정 환경")는 그대로 유지. 원자료 공개는 여전히 미결(KI-001) — 페이지가 이미 이를 고지함.
- **D2 홈페이지 네비게이션 수정 완료.** 대표 결정: "수정". 홈 헤더 앵커 메뉴를 서브페이지와 동일한 페이지 네비(제품/솔루션/기술/실증/회사)로 교체 → 상세 페이지 헤더 도달 가능. CTA 라벨을 사이트 전체 `PoC 문의하기`로 통일(서브페이지 6곳 `PoC 시작하기`→`PoC 문의하기`). 홈 섹션 id(#service 등)는 유지되어 히어로 버튼 앵커는 계속 동작.

## 미결 — 추가 결정 필요

- **L5 기술 페이지 입력 프레이밍(미변경).** `technology/`가 `INPUT 01 스마트폰 센서 / INPUT 02 Wi-Fi·RF 신호`를 동급 1차 입력으로 표기. 팀 정본 신호 위계상 실시간 코어는 IMU/PDR + 내비게이션 그래프이고 Wi-Fi/RF는 보조 보정 신호 → 기술 파트너 관점에서 소폭 과대 표현. 정정 여부 대표 확인 대기.

## 배포 주의

현재 사이트는 운영 배포된 상태(2026-07-10 Caddy 수동 배포, 자동 배포 없음 — KI-004). 위 수정은 워킹 트리에만 적용됨. 커밋·운영 반영은 대표 확인 후 진행 권장.
