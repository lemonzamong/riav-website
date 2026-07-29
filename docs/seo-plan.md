# SEO·GEO 운영 기준

마지막 검토일: 2026-07-30

## 브랜드 엔터티

- 공식 영문명: `Iruvy`
- 공식 한글명: `이루비`
- 법인명: `주식회사 이루비`
- 회사 카테고리: `Spatial Decision AI(공간 의사결정 AI)`
- 대표 주소: `https://iruvy.com/`
- 공식 설명: 공간과 상황을 이해해 다음 최적 행동을 결정하는 Spatial Decision AI를 개발하는 기업

한글 브랜드 검색을 위해 검색 결과용 title·description, Organization/WebSite JSON-LD와 이미지 대체텍스트에서 `Iruvy`, `이루비`, `주식회사 이루비`를 같은 엔터티로 연결한다. 홈의 눈에 보이는 히어로 제목과 설명은 브랜드 디자인 원칙에 따라 한글 키워드를 억지로 추가하지 않는다.

## 페이지별 검색 의도와 스키마

| 경로 | 핵심 검색 의도 | 페이지 스키마 | 추가 엔터티 |
|---|---|---|---|
| `/` | 이루비, Iruvy, 공간 의사결정 AI | WebPage | Organization, WebSite |
| `/guide/` | 전시회 AI 에이전트, 방문자 동선 추천 | WebPage | SoftwareApplication |
| `/flow/` | 제조 생산계획 AI, 제약공정·병목 최적화 | WebPage | SoftwareApplication |
| `/evidence/` | AI 성과 검증, PoC·Replay·라이브 성과 구분 | CollectionPage | BreadcrumbList |
| `/technology/` | Spatial Decision AI 기술, 의사결정 AI 신뢰 | WebPage | BreadcrumbList |
| `/company/` | 이루비 회사, Spatial Decision AI 기업 | AboutPage | Organization |
| `/resources/` | 공간·제조 의사결정 AI 인사이트 | CollectionPage | BreadcrumbList |
| `/capacity-lab/` | 제조 납기·병목 진단, Capacity Audit | WebPage | Service |
| `/contact/` | 이루비 도입 상담, Guide·Flow 문의 | ContactPage | BreadcrumbList |
| `/privacy/` | 이루비 개인정보 처리방침 | WebPage | BreadcrumbList |
| `/terms/` | 이루비 이용약관 | WebPage | BreadcrumbList |
| `/accessibility/` | 이루비 웹 접근성 | WebPage | BreadcrumbList |

## 구현 규칙

- 모든 공개 페이지는 고유한 title과 description, 자기 참조 canonical을 사용한다.
- 모든 공개 페이지는 `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`을 사용한다.
- 모든 공개 페이지는 서버 렌더링 HTML, 하나의 H1과 한국어 `lang` 속성을 제공한다.
- 홈과 회사 페이지의 Organization 스키마는 `Iruvy`, `이루비`, `주식회사 이루비`를 연결한다.
- 제품과 서비스 스키마는 실제 공개 본문에 있는 범위만 기술하며 가격·성과·완전자율을 임의로 추가하지 않는다.
- sitemap에는 canonical 공개 URL만 포함하고 lastmod를 실제 배포일과 맞춘다.
- robots.txt는 일반 검색 크롤러와 주요 AI 검색 크롤러의 공개 페이지 접근을 허용한다.
- `llms.txt`와 `llms-full.txt`는 비구글 AI 시스템을 위한 보조 문맥이다. Google 검색 순위 신호로 간주하지 않는다.
- 대표 이미지는 검색 미리보기와 모바일 성능을 위해 500KB 이하 JPEG를 사용한다.

## 측정과 다음 운영

- Google Search Console에서 도메인 속성, sitemap 처리와 URL 색인 상태를 확인한다.
- `이루비`, `Iruvy`, `이루비 AI`, `공간 의사결정 AI`, 제품별 핵심 검색어의 노출·클릭·평균순위를 월별로 기록한다.
- Google 검색의 GEO는 별도 해킹이 아니라 색인 가능성, 사람에게 유용한 고유 콘텐츠, 명확한 엔터티와 Search Console 상태를 중심으로 운영한다.
- ChatGPT·Perplexity·Claude 등 비구글 AI 검색은 동일한 질문 세트로 월별 인용 여부와 인용 URL을 점검한다.
