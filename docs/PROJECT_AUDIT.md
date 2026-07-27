# Project Audit

작성: 2026-07-11 · 대상: Iruvy 공개 홍보 웹사이트(`website/`) · 방식: 저장소 직접 검사 + 독립 검토(§17) 결과 반영

> 범위 주의: 이 감사는 마스터 프롬프트가 지정한 산출물인 **공개 웹사이트**를 프로젝트 루트로 본다. 상위 모노레포(`android/`, `ios/`, `server/`, `brand/`)는 제품·엔지니어링 자산으로 별도 관리되며, 웹사이트 전략에 영향을 주는 범위에서만 참조한다.

## Executive summary

Iruvy 웹사이트는 이미 성숙한 정적 사이트다. 9개 경로(홈·제품·솔루션·기술·실증·회사·문의·개인정보·접근성), 디자인 토큰 시스템(`styles/tokens.css` 외 4종), 접근성 기반(skip link·ARIA 탭 위젯·시맨틱 구조), 자체 문서 세트(`docs/` 15종), 링크·자산·메타 자동 검사기(`tests/check-site.mjs`), 운영 배포(AWS Lightsail + Caddy, 도메인 iruvy.com)를 갖췄다. 정직성 규율이 강해 실증 수치에 제한 문구를 달고 기관 관계를 과장하지 않는다.

핵심 문제는 "미완성"이 아니라 **두 디자인이 브랜치로 갈려 있었고(main = 앱 목업 기반 라이트 히어로, codex = YouTube 영상 기반 다크 히어로), 정본이 불명확**했다는 점이다. 2026-07-11 대표 결정으로 **하이브리드**(main의 깔끔한 히어로 + codex의 9페이지 깊이·정직성·접근성·최신 수치)를 채택·배포했다. 남은 격차는 리서치·전략 문서 체계의 부재(이 감사로 착수)와 하위 페이지의 시각 톤 통일 여부다.

## Existing project purpose

GPS가 닿지 않는 복합 실내공간(병원·공공기관·복지시설·전시장·대학·교통시설)에서 시각장애인·이동약자·초행 방문자가 **건물 입구가 아니라 실제 목적지(진료실·민원창구·상담실 등)까지** 스스로 이동하도록 돕는 실내 내비게이션을, 기관 구매자에게 설명·설득하고 PoC 문의로 전환시키는 것.

## Existing folder structure (website/)

```
website/
├─ index.html + {product,solutions,technology,proof,company,contact,privacy,accessibility}/index.html
├─ privacy.html, support.html            # 구 경로 → /privacy//contact/ 리다이렉트 스텁
├─ styles/{tokens,base,components,pages,home}.css
├─ scripts/site.js                        # 모바일 네비·연도·탭 위젯·문의 mailto
├─ assets/{fonts-web, product/, media/, *.svg/png/jpg}
├─ deliverables/                          # 앱 데모 영상·포스터·법인 문서(docx/pdf)
├─ app-store-screenshots/
├─ tests/check-site.mjs                   # 링크·자산·메타·제목·alt 검사
├─ docs/  (기존 15종 + 이번 신규)
├─ tools/  (데모 영상 생성 python)
├─ robots.txt, sitemap.xml, package.json
└─ .git  (branch: codex/iruvy-premium-redesign-20260710, main)
```

## Key assets discovered

- **현재 브랜드 앱 목업(Riav 잔재 없음):** `assets/product/destination-home.jpg`(어디로 갈까요), `voice-destination.jpg`, `turn-guidance.jpg`, `assets/app-admin-clean.jpg`(무엇을 할까요·스캔 시작). 하이브리드 히어로에 사용.
- **구 브랜드 잔재 목업(사용 금지):** `assets/app-user-clean.jpg` — "Riav 기본 체험 공간" 텍스트가 이미지에 baked-in.
- 자체 글꼴(Pretendard woff2), 로고 SVG, OG 이미지, 앱 데모 영상(deliverables), 공식 홍보영상(YouTube RpktEiPSRG0).
- 검사기 `tests/check-site.mjs`(빌드/검증 겸용), 배포 대상 `/var/www/riav`(Caddy no-cache HTML).

## Existing strengths

- 정적 HTML·최소 JS로 접근성·성능·유지보수 우수. 스크립트 없이도 전 콘텐츠 판독 가능.
- 디자인 토큰 체계, 일관된 컴포넌트, 자체 글꼴.
- 접근성: skip link, ARIA 탭(roving tabindex·화살표·Home/End), 모바일 네비(Esc·포커스 복귀), 문의 양식 라벨·aria-live, 전송 성공 위장 없음.
- 정직성: 실증 수치에 "팀 제공·제삼자 인증 아님·특정 환경" 제한 명시. 기관 관계를 협의/관심/지원/접점으로 구분.
- 자동 검사기 + 자체 문서 세트 존재.

## Existing weaknesses

- **디자인 정본 이원화(핵심):** main vs codex 두 히어로 → 2026-07-11 하이브리드로 해소, 그러나 `main` 브랜치는 여전히 옛 단일 페이지로 잔존(정리 필요).
- 전략·리서치 문서 체계 부재: 외부 벤치마크·청중 모델·근거 표·전략 문서가 없었음(이번에 착수).
- 실증 수치 원자료(96.7% 등)가 저장소·공개 링크로 연결되지 않음(KI-001).
- 하위 페이지(제품/솔루션/기술 등)는 홈 히어로만큼 시각적으로 프리미엄하지 않아 톤 통일 여지.
- 문의가 mailto 인계 방식(서버 수집 없음, KI-003).
- 자동 배포 파이프라인 없음 — 수동 SSH rsync(KI-004).

## Duplicates and clutter

- `main` 브랜치 단일 페이지 디자인 vs `codex` 9페이지 디자인(정본 명확화 필요).
- `assets/media/`에 대용량 원본 영상·이미지 다수(운영 서빙 대상 아님, 저장소에는 untracked). 배포에서 제외 확인됨.
- 죽은 CSS(구 `.hero*` 블록)·죽은 JS(구 히어로 영상 로직)는 이번에 제거함.

## Missing pieces

- 마스터 프롬프트가 요구한 문서 체계 대부분(AUDIT·BRIEF·ASSUMPTIONS·DECISIONS·RESEARCH_*·EVIDENCE·STRATEGY·AUDIENCE·POSITIONING·IA·CONTENT·DESIGN·ACCESSIBILITY·IMPLEMENTATION·QA·HANDOFF·AGENTS) → **이번 전체 이행으로 생성 중.**
- 외부 벤치마크·표준/조달 리서치·반증 근거 → 병렬 리서치로 수집 중.
- 다운로드형 기관 검토 자료(원페이지 소개·PoC 제안서)의 웹 게시 연결.

## Risks

- 공개 검증형 수치(96.7%)의 원자료 부재 → 회의적 구매자·실사에서 약점(정직성 문구로 완화 중).
- 라이브 사이트 직접 수정·배포 → 대외 공개 행위, 백업·검증 필수(백업 절차 확립됨).
- main/codex 정본 미정리 시 향후 혼선 재발.

## Technical debt

- 자동 배포 부재(수동 rsync). 롤백은 타임스탬프 백업 디렉터리 의존.
- 문의 서버 수집 백엔드 없음(mailto 대체).
- 일부 반응형 세부(모바일 폰 목업 크기)와 하위 페이지 시각 톤.

## Content debt

- 실증 수치 원자료·방법 상세(반복 횟수·참여자 특성 분포) 미공개.
- 하위 페이지 카피가 홈만큼 결과·구매자 관점으로 벼려지지 않은 부분.
- 영어 eyebrow 라벨("Relationship, not logo theater" 등)이 한국 기관 구매자에게 불명확할 수 있음.

## Design debt

- 홈 히어로는 라이트·프리미엄으로 통일했으나 하위 페이지는 다크/혼합 섹션과 카드 위주 — 톤 통일 검토.
- 헤더 CTA가 검정 pill(main은 보라) — 브랜드 액센트 통일 여지.
- 푸터 태그라인이 옛 슬로건 잔존.

## Accessibility concerns

- 독립 검토(§17)에서 확인·수정: 기술 다이어그램 라벨 대비(≈1.1:1→6.5:1), 히어로 영상 reduced-motion, 회사 Vision h2 누락, 보라 배경 저대비 흰색. 
- 지속 점검 필요: 라이트 히어로 전환 후 대비 재확인(완료), 하위 페이지 대비·초점·키보드 전수.
- 앱/PoC 환경 접근성은 웹과 별도 검증 대상.

## Research gaps

- 경쟁·유사 조직 벤치마크(실내내비·접근성기술·B2G) → 수집 중.
- WCAG 2.2 AA 체크리스트·한국 편의증진법/웹접근성·EAA 등 규제 수요 신호 → 수집 중.
- 기관 구매자 의사결정 모델·반대 논리·근거 임계치 → 수집 중.

## Recommended restructuring plan

1. `website/`를 프로젝트 루트로 마스터 프롬프트 문서 체계 구축(docs/ 정규 파일 + research/ + AGENTS.md). — 진행 중
2. 리서치 3종 결과를 STRATEGY·AUDIENCE·POSITIONING·IA·CONTENT·EVIDENCE·DESIGN·ACCESSIBILITY로 종합.
3. 전략 체크포인트(§6)에서 홈 히어로 방향(감정 슬로건 vs 구매자 문제·결과 우선) 재점검·필요 시 조정.
4. 하위 페이지 시각 톤 통일 및 전수 QA(§14) → QA_REPORT.
5. main 브랜치 정리(정본을 codex로) — git 관리 결정 필요.
6. FINAL_HANDOFF로 마감.

## Items that must be preserved

- 정직성 규율(제한 문구·관계 구분), 접근성 기반(ARIA·시맨틱), 검사기, 자체 글꼴, 현재 브랜드 앱 목업.
- 운영 백업(`/var/www/iruvy-backups/*`).

## Items that may be archived

- `assets/app-user-clean.jpg`(구 Riav 목업) — 웹에서 미사용 처리(참조 제거됨).
- `main` 브랜치 옛 단일 페이지(정본 확정 후 태그 보존·정리).

## Items that should not be touched without strong reason

- 운영 Caddyfile·문서 루트 `/var/www/riav` 구조(경로 목록·no-cache 정책).
- 실증 수치·기관 관계 표현(대표 확인 없이 강화 금지 — 대외 공개·근거 사안).
