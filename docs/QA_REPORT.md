# Iruvy 웹사이트 QA 보고서

- 검수일: 2026-07-20
- 대상: `https://iruvy.com`
- 기준: Iruvy 웹사이트 마스터 플랜, WCAG 2.2 AA 실무 기준, 운영 Caddy·문의 API

## 최종 결과

| 영역 | 결과 | 증거 |
|---|---:|---|
| 정적 사이트 검사 | 통과 | `node tests/check-site.mjs` · 24페이지 |
| 문의 API 단위 테스트 | 통과 | `python3 -m unittest -v server/test_contact_api.py` · 5개 |
| JavaScript 문법 | 통과 | `node --check scripts/site.js` |
| 운영 사이트맵 URL | 통과 | 20개 URL 모두 HTTP 200 |
| 없는 경로 | 통과 | 실제 임의 URL HTTP 404와 전용 404 화면 |
| HTTPS 전환 | 통과 | HTTP → HTTPS 308 |
| Caddy 설정 | 통과 | 운영 설정 검증·reload, 서비스 active |
| 문의 서비스 | 통과 | localhost `/health` 200, 서비스 enabled·active |
| Lighthouse 모바일 성능 | 98 | FCP 1.7초, LCP 2.3초, TBT 0ms, CLS 0.001 |
| Lighthouse 접근성 | 100 | 자동 감사 실패 항목 0 |
| Lighthouse 모범 사례 | 100 | 모바일 운영 URL 측정 |
| Lighthouse SEO | 100 | 모바일 운영 URL 측정 |

## 페이지와 콘텐츠

- 공개 사이트맵 20개 URL과 404·500 화면을 포함한 24개 HTML을 검사했다.
- 모든 검사 대상 페이지에 고유 title·description·canonical·H1·main·본문 바로가기·푸터 이메일이 있다.
- 모든 이미지에 대체 텍스트와 명시적 크기가 있다.
- iframe 영상이 있는 페이지는 장면별 텍스트 대본을 제공한다.
- 홈과 Go 페이지 FAQ는 각각 12개 이상이다.
- 홈·회사·문의의 제품 순서는 `Go → Guide → Flow`다.
- 제품 상태는 Go `실증 완료`, Guide `개발·확장`, Flow `파일럿 준비`로 구분한다.
- 병원·병동은 Flow의 첫 유즈케이스로만 사용하며 회사의 상위 정의로 쓰지 않는다.

## 브라우저 동작

- 운영 주요 페이지 22개를 1280×720 환경에서 순회했다.
- 모든 페이지에서 H1 1개, main 1개, 테마 버튼, 가로 넘침 0을 확인했다.
- 시스템 테마를 기본으로 따르고 버튼으로 `자동 → 반대 테마 → 시스템 테마 → 자동`을 선택할 수 있다.
- Flow 테스트베드는 H1·테마 버튼·차트·가로 넘침 0을 확인했다.
- 모바일 성능 감사 기본 뷰포트에서도 레이아웃 이동과 가로 넘침 문제가 보고되지 않았다.

## 문의·리드·분석

- 2단계 문의 폼은 기관명, 기관 유형, 이름, 부서·직책, 이메일, 연락처, 제품, 문제, 시설 범위, 도입 시점과 동의를 서버에서 다시 검증한다.
- 오류 요약, 필드별 오류 문구, `aria-invalid`, 오류 설명 연결과 첫 오류 포커스를 구현했다.
- UTM, landing page, referrer, first/last touch, session ID와 동의 버전을 저장한다.
- 정상 리드는 SQLite에 저장되고 공개 접수 번호를 반환한다.
- 내부 알림과 문의자 접수 메일 상태를 별도로 기록하며 실패 건만 재시도할 수 있다.
- CRM 상태 16개, 상태 변경 이력, CSV 내보내기, 7일 대시보드를 제공한다.
- 운영 DB 권한은 `600`, 서비스 UMask는 `0077`이다.
- 잘못된 운영 API 요청은 HTTP 400으로 거부됨을 확인했다.
- 실제 테스트 리드를 남기지 않았다.

## 보안·성능

- HSTS, CSP, `X-Content-Type-Options`, `X-Frame-Options`, Referrer Policy와 Permissions Policy를 적용했다.
- HTML은 재검증하고 정적 CSS·JS·이미지·폰트는 30일 캐시한다.
- 히어로 앱 이미지를 화면 크기에 맞게 별도 최적화해 약 381KB에서 약 85KB로 줄였다.
- 정적 파일 경로, 환경 파일과 Git 경로는 공개하지 않는다.
- 문의 Origin 확인, 본문 크기 제한, 허니팟과 IP별 속도 제한을 적용했다.

## 아직 사람이 확인해야 하는 항목

- iPhone VoiceOver, Android TalkBack, Windows NVDA의 실제 기기·OS 조합 테스트
- 200% 확대와 키보드 전용 흐름의 최종 사용자 확인
- 실제 기관명·로고·사진·수치 공개 허가서
- 실제 내부 알림과 문의자 접수 메일 수신: Gmail 앱 비밀번호가 아직 설정되지 않음
- 실제 서버 오류를 강제로 발생시키는 500 라우팅 시험: 500 파일과 Caddy 오류 분기는 검증했지만 운영 장애를 만들지 않기 위해 강제하지 않음

자동 감사 100점은 실기기 접근성 검수를 대체하지 않는다.
