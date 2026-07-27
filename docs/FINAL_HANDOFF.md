# Iruvy 웹사이트 운영 인수인계

- 기준일: 2026-07-20
- 운영 URL: `https://iruvy.com`
- 서버 별칭: `iruvy-prod`
- 문서 루트: `/var/www/riav`
- 웹 서버: Caddy
- 문의 서비스: `iruvy-contact.service`

## 현재 구조

- 정적 한국어 마케팅 사이트 24페이지
- Go 중심 홈페이지와 Go·Guide·Flow 제품 페이지
- 공공·복지·병원 세그먼트, 사례, 기술, 보안, 자료실, 회사, 문의와 법적 문서
- 로컬 JSON 기반 주장·사례·권한 레지스트리
- Python 표준 라이브러리 기반 same-origin 문의·분석 API
- SQLite 기반 리드 저장·상태 이력·분석 이벤트
- Caddy의 `/api/contact`, `/api/events` 역방향 프록시

## 콘텐츠 수정

생성 대상 17페이지는 `tools/build_marketing_pages.mjs`를 수정한 뒤 생성한다.

```bash
node tools/build_marketing_pages.mjs
node tests/check-site.mjs
node --check scripts/site.js
(cd server && python3 -m unittest -v test_contact_api.py)
git diff --check
```

홈, 회사, 문의, 개인정보, 접근성과 기존 증거 페이지는 각 HTML을 직접 수정한다. CSS·JS를 변경하면 HTML의 쿼리 버전도 올려 정적 캐시를 무효화한다.

## 리드 운영

서버에서 다음 명령을 `sudo`로 실행한다.

```bash
sudo python3 /opt/iruvy-contact/lead_admin.py list --limit 30
sudo python3 /opt/iruvy-contact/lead_admin.py dashboard --days 7
sudo python3 /opt/iruvy-contact/lead_admin.py update IRV-YYYYMMDD-XXXXXX qualified --note "발견 미팅 대상"
sudo python3 /opt/iruvy-contact/lead_admin.py export --output /root/iruvy-leads.csv
sudo python3 /opt/iruvy-contact/lead_admin.py retry-notifications --limit 50
```

리드 상태는 new부터 discovery, site assessment, proposal, pilot, annual contract, nurture, won/lost/spam까지 기록한다. 분석 이벤트와 리드 개인정보는 외부 분석 서비스로 보내지 않는다.

## 이메일 활성화

`/etc/iruvy-contact.env`의 `CONTACT_SMTP_PASSWORD`가 비어 있다. 일반 Gmail 로그인 비밀번호가 아니라 2단계 인증 후 발급한 앱 비밀번호가 필요하다.

설정 후:

```bash
sudo systemctl restart iruvy-contact
sudo python3 /opt/iruvy-contact/lead_admin.py retry-notifications --limit 50
```

내부 알림과 문의자 접수 메일은 별도 상태로 기록되므로 하나만 실패한 경우 성공한 메일을 중복 전송하지 않는다.

## 배포

1. `/var/www/riav` 전체 백업
2. 변경 파일만 `rsync -avzR --rsync-path="sudo rsync"`
3. Caddy 변경 시 `caddy validate`
4. reload 후 공개 URL, 헤더와 문의 health 확인

운영 백업 예시:

```bash
stamp=$(date +%Y%m%d-%H%M%S)
ssh iruvy-prod "sudo cp -a /var/www/riav /var/www/iruvy-backups/riav-$stamp"
```

최근 배포 직전 전체 백업은 `/var/www/iruvy-backups/riav-20260720-050116`이다. 이전 원본 사이트는 GitHub의 `codex/archive-live-site-20260720` 브랜치와 서버 백업에 보존되어 있다.

## 롤백

```bash
ssh iruvy-prod
sudo mv /var/www/riav /var/www/riav-failed-$(date +%Y%m%d-%H%M%S)
sudo cp -a /var/www/iruvy-backups/riav-20260720-050116 /var/www/riav
sudo systemctl reload caddy
```

문의 서비스는 `/var/backups/iruvy-contact/`의 타임스탬프별 파일로 되돌린 뒤 daemon-reload와 restart를 수행한다.

## 남은 외부 확인

- Gmail 앱 비밀번호 설정과 실제 두 종류 메일 수신
- 기관명·로고·사진·실증 수치 공개 승인
- 회사 주소·전화·사업자 정보의 공식 확인
- VoiceOver·TalkBack·NVDA 실기기 확인
- 실제 영업 담당자의 1영업일 응답 SLA 운영

이 항목은 사실이나 자격 증명을 만들지 않고 담당자가 확인한 뒤 반영한다.
