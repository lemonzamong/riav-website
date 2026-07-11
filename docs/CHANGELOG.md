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

### Proposed (미배포, 대표 결정 대기)
- 전략 체크포인트: 히어로 프레이밍(감정 슬로건 → 구매자-결과). `docs/decisions.md` D-HERO.
