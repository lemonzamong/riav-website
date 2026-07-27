# Implementation Plan

## 현재 아키텍처
정적 다중 페이지(HTML/CSS/JS), 프레임워크 없음. Caddy 정적 서빙(`/var/www/riav`), HTML no-cache. self-host Pretendard. 검사기 `tests/check-site.mjs`.

## 제안 아키텍처
현행 유지(§13 결정: 정적). 콘텐츠 중심·접근성·운영 안전성에 최적. 프레임워크·서버 상태 도입 이유 없음.

## 왜
서버 렌더링·큰 JS 불필요. 스크립트 없이 전 콘텐츠 판독. JS는 모바일 네비·연도·탭 위젯·문의 mailto만.

## 의존성
Pretendard woff2(self-host), YouTube 임베드는 제거됨. 외부 런타임 의존 최소.

## 리스크
- 공통 헤더/푸터 반복 → 검사기·규칙으로 관리.
- 수동 배포 → 백업+원자 교체 절차(AGENTS.md).

## 마이그레이션 플랜
해당 없음(스택 유지). 변경은 페이지·스타일·스크립트 단위 편집 + 검사 + 브라우저 검증 + rsync.

## 컴포넌트 플랜
버튼·히어로·섹션·탭·폼 (DESIGN_SYSTEM). 히어로는 라이트 목업형.

## 데이터/콘텐츠 모델
정적. 문의는 mailto 인계(서버 수집 없음 KI-003 — 후속: 폼 백엔드 도입 시 전송 성공 위장 금지).

## 접근성 플랜
`docs/ACCESSIBILITY.md`. WCAG 2.2 AA 실무 기준, 수동 점검 병행.

## 성능 플랜
self-host 폰트·프리로드, 이미지 width/height·lazy, 최소 JS, 대용량 미디어 배포 제외. `docs/performance-audit.md` 참조.

## 테스트 플랜
`node tests/check-site.mjs`(링크·자산·메타·제목·alt) + `node -c scripts/site.js` + 브라우저 육안(데스크톱/모바일) + §14 QA.

## 배포 고려
자동 배포 없음(KI-004). SSH `iruvy-prod` + 백업 + 변경 파일 rsync(대용량 미디어 제외) + 라이브 검증. 대외 공개라 대표 확인 후.

## 롤백 전략
`/var/www/iruvy-backups/riav-<TS>` 타임스탬프 백업으로 즉시 복원. (최근: riav-20260711-084533 등.)
