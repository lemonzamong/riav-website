# Iruvy 사이트 전환 감사

- 기존 구조: 의존성 없는 정적 HTML·CSS·JavaScript, Python 동일 출처 문의 API, Caddy 배포
- 기존 공개 루트: `/var/www/riav`
- 문의 저장: SQLite + SMTP 알림, `/api/contact`
- 분석: 동일 출처 `/api/events`, 이벤트 허용목록 방식
- 새 공개 경로: `/`, `/flow/`, `/use-cases/production-planning/`, `/technology/`, `/security/`, `/design-partners/`, `/company/`, `/contact/`, `/privacy/`, `/terms/`, `/accessibility/`
- 과거 제품·가격·복지·병원·사례·리소스 경로: 공개 빌드에서 제외하고 운영 서버에서 410 처리
- 이미지: 새 공개 빌드는 브랜드 로고, 자체 호스팅 폰트와 신규 OG 이미지만 포함
- 운영 배포: 대표의 명시적 승인 전에는 iruvy.com에 반영하지 않음
