# Changelog

## 2026-07-11

### Added
- 마스터 프롬프트 문서 체계(정본): PROJECT_AUDIT, AGENTS, PROJECT_BRIEF, ASSUMPTIONS, RESEARCH_PLAN, RESEARCH_LOG, EVIDENCE, STRATEGY, AUDIENCE, POSITIONING, INFORMATION_ARCHITECTURE, CONTENT_STRATEGY, DESIGN_SYSTEM, ACCESSIBILITY, IMPLEMENTATION_PLAN, TASKS, review-report, QA_PLAN, FINAL_HANDOFF.
- 외부 리서치 3종: `research/benchmarks/benchmark_matrix.md`, `research/secondary/standards_procurement.md`, `research/notes/audience_and_disconfirming.md`.

### Changed
- 실증 수치 26.6%→93.3%(23명) → **26.6%→96.7%(2차 PoC 87/90, 90명)** 전 페이지 갱신, 제한 문구 유지. (배포됨)
- 홈 헤더 네비게이션을 상세 페이지 링크로, CTA "PoC 문의하기" 전 사이트 통일. (배포됨)
- 홈 히어로: 다크+YouTube 임베드 → 라이트 그라디언트 + "누구나 어디든 갈 수 있는 세상" + 현재 브랜드 앱 목업 2개. title/og 갱신. (배포됨)
- 기술 페이지 신호 위계 정정: 스마트폰 센서=핵심 입력, Wi-Fi·RF=보조 보정. (배포됨)

### Fixed
- 접근성: 기술 파이프라인 라벨 대비(≈1.1:1→6.5:1), 히어로 영상 reduced-motion(이후 영상 제거), 회사 Vision h2 누락, 보라 배경 저대비 흰색(단가 고지 포함). (배포됨)

### Removed
- 존재하지 않는 이미지 참조 죽은 CSS(구 `.hero*`), 고아 이미지 `assets/media/indoor-navigation-hospital.jpg`, 죽은 히어로 영상 JS(`#hero-film`). (배포됨)

### Pivoted
- 초기 "검증·수정 중심(문서 대부분 생략)" → 대표 지적 후 "마스터 프롬프트 전체 정석 이행"으로 전환.
- 홈 대표 매체 "공식 영상 히어로"(2026-07-10) → "앱 목업 라이트 히어로"로 대체.

### Changed (추가 — 서브페이지 프리미엄 재구성, 배포됨)
- 제품·솔루션·기술·실증·회사 5개 서브페이지를 홈 수준 프리미엄으로 재구성(sales-* 컴포넌트·KPI 빅넘버·앱 목업·partner-flow·space-solutions·premium-grid 재사용). 각 서브페이지에 home.css 추가, CSS 링크 버전 쿼리(?v=20260711)로 캐시 방지. 회사 Vision h2 복구.

### Changed (추가 — 배경 통일, 배포됨)
- 전 페이지 배경을 하나의 연속 라벤더-흰색 필드로 통일(body 고정 그라디언트+섹션 투명). PPT식 검정/베이지/보라 밴드 제거, 다크 섹션 내부를 라이트로 전환.

### Changed (추가 — 전략 체크포인트 C 반영, 배포됨)
- 홈 전면 재구성(대표 결정 C): 히어로 헤드라인을 감정 슬로건 → **구매자-결과**("실제 목적지까지 안내하고 접근성 개선을 숫자로")로, 앱 목업 비주얼 유지.
- 섹션 재배열(결과→문제→대상→작동→시설→레퍼런스→안심→도입단계→CTA), 신규 섹션(문제 정의, 도입 안심=프라이버시·무료 SW·조달청 혁신제품), 감정 문구는 마무리로 강등, title/og 갱신.
