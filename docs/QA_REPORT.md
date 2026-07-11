# QA Report — 2026-07-11 (히어로 재설계 후)

계획: `docs/QA_PLAN.md`. 방식: 자동 검사 + 기계적 전수 grep + 브라우저 계측(데스크톱/모바일/경계폭) + 2차 독립 검토(§17).

## 기계적 QA (전 페이지) — 통과

- 빌드/검사: `node tests/check-site.mjs` = 9 pages OK. `node -c scripts/site.js` OK.
- 잔존 구 문자열 0: `93.3`, bare `23명`, `PoC 시작하기`, `Riav`, `Atmos`, `app-user-clean`, `hero-film`.
- 고아 클래스 0(HTML): `hero-evidence`·`hero-video*`·`hero-problems`·`hero-solution`·`sales-hero__glow`·`evidence-label`.
- `button--glass` 정의·사용 정상(최종 CTA, 다크 배경).
- 홈 앵커 타깃 존재(#service·#results·#solutions·#programs), 단일 h1, kicker 라이트 오버라이드(brand-700).
- 반응형 오버플로우/클리핑 0: 375·1000·1080·1300px 계측 확인.

## 2차 독립 검토(§17) 결과 — Critical/High 없음

검토자가 실제 파일 검사·대비 계산·이미지 치수·전수 grep 수행. 확인된 clean(재검 불요): 고아 클래스 0, 대비 통과(히어로 kicker 6.4~6.9:1·카피 7.5:1·brand 버튼 7.1:1), 이미지 치수 일치, 앵커 유효, title/og 정합, JS 정상, 반응형 안전.

### 발견·조치

| ID | 심각도 | 발견 | 조치 | 검증 |
|---|---|---|---|---|
| M1 | Medium | 히어로 로고 img에 width/height 없음 → 상단 CLS | `width="1040" height="260"` 추가(SVG viewBox 1040×260 일치, 왜곡 없음) | logoHasDims=true |
| L1 | Low | 라이트 히어로에서 ghost 버튼 경계 대비 ≈1.1:1(<3:1, WCAG 1.4.11) | `.sales-hero .button--ghost` 경계 `--brand-700` | 계산값 rgb(80,59,215) ≈6.5:1 |
| L2 | Low | 모바일 네비 드로어 top이 4.75rem 고정 → 홈 헤더(5rem/4.4rem)와 불일치 | `.sales-header .site-nav` top 5rem(≤960)·4.4rem(≤680) 오버라이드 | 드로어 top 70.4px = 헤더 71px |
| L3 | Low | 죽은 `.hero`/`.hero-map` CSS(미디어쿼리 잔재, 이미지 참조 없음, HTML 미사용) | pages.css에서 제거(page-hero-grid는 보존) | 검사 통과, 참조 0 |

### 관찰(무해, 미조치)
- O1 `.sales-hero__product`의 role 없는 div `aria-label`은 AT가 대체로 무시(자식 img alt로 정보 충분).
- O2 홈 헤더 비-sticky는 의도(앵커 점프 정상).
- O3 영어 eyebrow 카피 — 전역 지침상 비선호(회귀 범위 밖, 콘텐츠 후속 검토: `docs/CONTENT_STRATEGY.md`).

## 콘텐츠 QA
- 수치 96.7%/90명 전 페이지 정합, 제한 문구 유지. 관계 표현 정직. CTA "PoC 문의하기" 통일.

## 접근성 QA
- 대비: 히어로·버튼·라벨 통과(계산 확인). 타깃 크기 24×24(2.5.8) 전수는 후속(네비·인라인 링크). 모션: 자동재생 요소 없음(영상 제거), reduced-motion 전역 준수. 키보드/초점/제목/랜드마크 이전 검토 유지.

## 남은 QA 후속(비차단)
- 24×24 타깃 크기 전수, 스크린리더 1패스, 200% 확대 육안, 하위 페이지 시각 톤·영어 eyebrow 검토.

## 결론
Critical/High 결함 없음. 발견된 Medium/Low 전부 수정·검증. 배포 안전.
