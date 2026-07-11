# Design System — Iruvy 웹사이트

출처: `styles/tokens.css`(실제 구현값) + Iruvy 브랜드 시스템. 이 문서는 현행 구현을 문서화하고 확장 규칙을 정한다. 값이 바뀌면 `tokens.css`가 정본이고 이 문서를 갱신한다.

## 원칙 (톤)

human-centered + technical precision + enterprise infrastructure. "착한 복지앱"도 "차가운 데이터기업"도 아님. Apple(여백·제품 중심·조용한 프리미엄) + Linear/Stripe(B2B 정보 밀도·KPI·카드) + 접근성(고대비·명확한 방향성).

## 색상 토큰 (tokens.css)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--brand-700` | `#503bd7` | primary(버튼·강조·on-white 라벨). 흰 배경 대비 ≈6.5:1 |
| `--brand-600` | `#6753f8` | brand 액센트·hover |
| `--brand-500` | `#7968ff` | 보조 액센트·커넥터(장식 그래픽) |
| `--brand-100` | `#e9e5ff` | 연보라 표면. ⚠ 흰 배경 텍스트 금지(대비 ≈1.1:1) |
| `--brand-050` | `#f5f3ff` | 아주 옅은 보라 표면 |
| `--ink-950` | `#121218` | 본문 잉크·다크 배경 |
| `--ink-800` | `#292936` | 진한 보조 텍스트 |
| `--ink-650` | `#505160` | 본문 보조·히어로 카피 |
| `--ink-500` | `#6f7080` | 약한 보조 |
| `--line` | `#dedee7` | 경계선 |
| `--surface` / `--surface-warm` | `#f7f7fa` / `#fbfaf7` | 표면 |
| `--white` | `#fff` | 배경 |
| `--success` `--warning` `--danger` `--focus` | `#087f5b` `#9a5b00` `#b42318` `#1769e0` | 상태색(의미 전용, 장식 금지) |

**대비 규칙:** 본문 텍스트 4.5:1, 큰 텍스트 3:1 이상. 보라 배경 위 흰색 텍스트는 불투명도 ≥0.88(단가 고지 등 작은 텍스트 특히). `--brand-100`은 표면색이지 텍스트색이 아님.

## 타이포그래피

- 한글/영문 **Pretendard**(woff2 self-host: Regular400/SemiBold600/ExtraBold800, `font-display: swap`). 프리로드: Regular·ExtraBold.
- 헤드라인 ExtraBold(800), 살짝 좁은 자간(히어로 `letter-spacing: -0.03em`). 본문 Regular. 숫자 KPI는 크게.
- 한글 줄바꿈은 어절 단위 고려(keep-all 성향), 히어로는 의미 단위 `<br>`.

## 스페이싱·형태 토큰

- 반경: `--radius-sm .65rem` / `--radius-md 1rem` / `--radius-lg 1.5rem` / `--radius-xl 2.25rem`. 버튼 pill(999px).
- 그림자: `--shadow-soft`, `--shadow-phone`(목업). 그림자는 제품/폰 아래 위주, 카드·버튼·텍스트 남용 금지.
- 레이아웃: `--content 76rem`, `--reading 45rem`, `--gutter clamp(1.25rem,4vw,4.5rem)`, `--section clamp(5rem,10vw,9rem)`.
- 모션: `--ease cubic-bezier(.2,.75,.2,1)`. 모션은 의미 전달용(방향·이동), 장식 금지. `prefers-reduced-motion` 준수.

## 컴포넌트 규약

- **버튼:** 기본(ink-950 채움) / `--brand`(보라 채움, primary) / `--light`(흰색, 다크 배경용) / `--ghost`(외곽선, 라이트 배경 보조) / `--glass`(반투명, 다크 히어로 잔존). hover는 보라로 채워짐.
- **히어로(홈):** 라이트 그라디언트(`#f8f7ff→#fff→#eef1ff` + 우상단 보라 radial), 좌 콘텐츠(제품 로고 락업 + eyebrow + h1 + 카피 + CTA 2) / 우 앱 목업 2개(오버랩, 다크 베젤 0.5rem·radius 2rem). 목업은 현재 브랜드만.
- **eyebrow(kicker):** 대문자·800·보라(`--brand-700`, 라이트 배경). 다크 섹션에선 밝은 보라/흰색.
- **섹션 리듬:** 라이트/소프트/다크(`--ink-950`)/브랜드(`--brand-700`) 교차. 결론형 헤드라인(주제어 단독 금지) 지향.

## 접근성 연동

- 초점 표시 `--focus #1769e0` 가시적 유지. 시맨틱 HTML·랜드마크·제목 순서. 상세 `docs/ACCESSIBILITY.md`.

## 금지 스타일

보라 네온·사이버펑크·AI 미래도시 / 복지 브로슈어 톤(하트·파스텔 무지개) / 카드·버튼·텍스트 그림자 남용 / 이모지 / 시맨틱색 장식 남용 / 주제어 단독 헤드라인 / 구 브랜드(Riav 등) 노출.

## 알려진 톤 불일치(정리 대상)

- 홈 히어로(라이트) vs 하위 페이지 다크/혼합 섹션 — 통일 검토(QA/디자인 후속).
- 헤더 CTA 검정 pill vs 브랜드 보라 — 액센트 통일 검토.
