import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = normalize(join(dirname(fileURLToPath(import.meta.url)), ".."));
const pages = [
  "index.html",
  "flow/index.html",
  "go/index.html",
  "guide/index.html",
  "pricing/index.html",
  "solutions/index.html",
  "solutions/welfare/index.html",
  "solutions/public/index.html",
  "solutions/hospital/index.html",
  "cases/index.html",
  "cases/complex-indoor-route-poc/index.html",
  "technology/index.html",
  "security/index.html",
  "resources/index.html",
  "resources/videos/index.html",
  "resources/reports/index.html",
  "proof/index.html",
  "company/index.html",
  "contact/index.html",
  "thank-you/index.html",
  "privacy/index.html",
  "terms/index.html",
  "accessibility/index.html",
  "404.html",
  "500.html",
];

const errors = [];
const routeAliases = new Map([
  ["/go/use-cases/index.html", "solutions/index.html"],
  ["/go/how-it-works/index.html", "technology/index.html"],
  ["/go/evidence/index.html", "proof/index.html"],
]);
const localPath = (url) => {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean) return null;
  if (/^(mailto:|tel:|data:|javascript:)/.test(clean)) return null;
  if (/^https?:\/\//.test(clean) && !clean.startsWith("https://iruvy.com/")) return null;
  const path = clean.replace(/^https:\/\/iruvy\.com/, "");
  if (!path.startsWith("/")) return null;
  const target = path.endsWith("/") ? `${path}index.html` : path;
  if (routeAliases.has(target)) return join(root, routeAliases.get(target));
  return join(root, target.replace(/^\//, ""));
};

for (const page of pages) {
  const path = join(root, page);
  const html = readFileSync(path, "utf8");
  const label = relative(root, path);
  const count = (pattern) => (html.match(pattern) || []).length;

  if (!/<html lang="ko">/.test(html)) errors.push(`${label}: lang=ko 누락`);
  if (!/<title>[^<]{8,}<\/title>/.test(html)) errors.push(`${label}: 유효한 title 누락`);
  if (!/<meta name="description" content="[^"]{30,}">/.test(html)) errors.push(`${label}: 설명 메타 누락 또는 너무 짧음`);
  if (!/<link rel="canonical" href="https:\/\/iruvy\.com\//.test(html)) errors.push(`${label}: canonical 누락`);
  if (count(/<h1(?:\s|>)/g) !== 1) errors.push(`${label}: h1은 정확히 1개여야 함`);
  if (/\b(Riav|Atmos)\b/i.test(html)) errors.push(`${label}: 이전 브랜드명 발견`);
  if (/lorem ipsum|TODO|href="#"/i.test(html)) errors.push(`${label}: 임시 콘텐츠 발견`);
  if (!/<footer[\s\S]*mailto:iruvy\.official@gmail\.com/.test(html)) errors.push(`${label}: 푸터 이메일 누락`);
  if (!/<a[^>]*class="[^"]*skip-link[^"]*"[^>]*href="#main"/.test(html)) errors.push(`${label}: 본문 바로가기 링크 누락`);
  if (!/<main[^>]*id="main"/.test(html)) errors.push(`${label}: main 랜드마크 id 누락`);
  if (!/<script[^>]*src="\/scripts\/site\.js/.test(html)) errors.push(`${label}: 공통 테마·상호작용 스크립트 누락`);
  if (/<iframe\b/.test(html) && !/class="video-transcript"/.test(html)) errors.push(`${label}: 영상 텍스트 대본 누락`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) errors.push(`${label}: 중복 id ${[...new Set(duplicateIds)].join(", ")}`);

  const headingLevels = [...html.matchAll(/<h([1-6])(?:\s|>)[\s\S]*?<\/h\1>/g)].map((match) => Number(match[1]));
  for (let index = 1; index < headingLevels.length; index += 1) {
    if (headingLevels[index] > headingLevels[index - 1] + 1) errors.push(`${label}: 제목 단계 건너뜀 h${headingLevels[index - 1]}→h${headingLevels[index]}`);
  }
  for (const match of html.matchAll(/<h[1-3](?:\s[^>]*)?>([\s\S]*?)<\/h[1-3]>/g)) {
    const text = match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (/[.!?。！？]$/.test(text)) errors.push(`${label}: 제목 문장부호 ${text}`);
  }

  for (const match of html.matchAll(/<(?:input|select|textarea)\b[^>]*\brequired\b[^>]*>/g)) {
    const id = match[0].match(/\bid="([^"]+)"/)?.[1];
    if (id && !new RegExp(`<label[^>]*for="${id}"`).test(html)) errors.push(`${label}: 필수 필드 라벨 누락 ${id}`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(match[0])) errors.push(`${label}: alt 없는 이미지 ${match[0]}`);
    if (!/\bwidth="\d+"/.test(match[0]) || !/\bheight="\d+"/.test(match[0])) errors.push(`${label}: 크기 없는 이미지 ${match[0]}`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = localPath(match[1]);
    if (target && !existsSync(target)) errors.push(`${label}: 없는 경로 ${match[1]}`);
  }
}

for (const page of ["index.html", "go/index.html"]) {
  const html = readFileSync(join(root, page), "utf8");
  const faqBlock = html.match(/<div class="faq-list">([\s\S]*?)<\/div>/)?.[1] || "";
  const faqCount = (faqBlock.match(/<details>/g) || []).length;
  if (faqCount < 12) errors.push(`${page}: 도입 FAQ 12개 미만`);
}

for (const css of ["tokens.css", "base.css", "components.css", "pages.css", "home.css", "v2.css", "theme-light.css", "v3.css", "sales.css"]) {
  const text = readFileSync(join(root, "styles", css), "utf8");
  if (/@import\s+url\(["']?https?:/i.test(text)) errors.push(`styles/${css}: 외부 CSS 요청 발견`);
}

if (!existsSync(join(root, "assets/og-iruvy.png"))) errors.push("공유 이미지 누락");
if (!existsSync(join(root, "sitemap.xml"))) errors.push("사이트맵 누락");
if (!existsSync(join(root, "robots.txt"))) errors.push("robots.txt 누락");
if (!existsSync(join(root, "content", "claims.json"))) errors.push("주장·근거 레지스트리 누락");
if (!existsSync(join(root, "content", "permissions.json"))) errors.push("공개 권한 레지스트리 누락");

const contactHtml = readFileSync(join(root, "contact", "index.html"), "utf8");
const siteScript = readFileSync(join(root, "scripts", "site.js"), "utf8");
if (!/data-contact-form novalidate/.test(contactHtml)) errors.push("문의 폼 접근성 오류 처리 설정 누락");
if (!/data-form-status[^>]*aria-atomic="true"/.test(contactHtml)) errors.push("문의 오류 요약 상태 영역 누락");
if (!/v2-field-error/.test(siteScript) || !/aria-invalid/.test(siteScript)) errors.push("문의 필드별 오류 설명 연결 누락");
if (!/fetch\("\/api\/contact"/.test(siteScript)) errors.push("문의 폼 직접 전송 API 연결 누락");
if (/이메일 앱에서 직접|이메일로 문의 내용 작성하기/.test(contactHtml)) errors.push("문의 폼에 이전 mailto 안내가 남아 있음");
if (!/name="website"/.test(contactHtml)) errors.push("문의 폼 스팸 방지 필드 누락");
if (!/이메일로 직접 문의하려면[\s\S]*mailto:iruvy\.official@gmail\.com/.test(contactHtml)) errors.push("문의 영역 직접 이메일 안내 누락");
if (!/대표 이메일[\s\S]*mailto:iruvy\.official@gmail\.com/.test(contactHtml)) errors.push("문의 페이지 대표 이메일 블록 누락");
if ((contactHtml.match(/data-form-step=/g) || []).length !== 2) errors.push("문의 2단계 폼 구조 누락");
for (const field of ["phone", "role", "environment", "scope", "timeline", "privacy"]) {
  if (!new RegExp(`name="${field}"`).test(contactHtml)) errors.push(`문의 폼 필수 맥락 필드 누락: ${field}`);
}
for (const field of ["first_touch_at", "last_touch_at"]) {
  if (!new RegExp(`name="${field}"`).test(contactHtml)) errors.push(`문의 유입 시각 필드 누락: ${field}`);
}
for (const label of ["12개월 이내", "정보 수집 중"]) {
  if (!contactHtml.includes(label)) errors.push(`문의 예상 시점 선택지 누락: ${label}`);
}
if (!existsSync(join(root, "server", "contact_api.py"))) errors.push("문의 API 서버 파일 누락");
if (!existsSync(join(root, "server", "lead_admin.py"))) errors.push("문의 상태 관리 도구 누락");
const contactApi = readFileSync(join(root, "server", "contact_api.py"), "utf8");
const leadAdmin = readFileSync(join(root, "server", "lead_admin.py"), "utf8");
const contactService = readFileSync(join(root, "server", "iruvy-contact.service"), "utf8");
const caddyConfig = readFileSync(join(root, "server", "Caddyfile.production"), "utf8");
if (!/CREATE TABLE IF NOT EXISTS leads/.test(contactApi)) errors.push("문의 리드 저장 구조 누락");
if (!/public_reference/.test(contactApi)) errors.push("문의 공개 접수 번호 누락");
if (!/CREATE TABLE IF NOT EXISTS analytics_events/.test(contactApi)) errors.push("1차 분석 이벤트 저장 구조 누락");
for (const field of ["internal_notification_status", "receipt_notification_status"]) {
  if (!contactApi.includes(field)) errors.push(`문의 알림 상태 분리 누락: ${field}`);
}
if (!/retry-notifications/.test(leadAdmin)) errors.push("실패한 문의 알림 재시도 기능 누락");
if (!/UMask=0077/.test(contactService)) errors.push("문의 서비스 파일 권한 기본값 누락");
for (const header of ["Strict-Transport-Security", "Content-Security-Policy", "X-Frame-Options"]) {
  if (!caddyConfig.includes(header)) errors.push(`운영 보안 헤더 누락: ${header}`);
}
if (!/max-age=2592000/.test(caddyConfig)) errors.push("정적 파일 캐시 정책 누락");
if (!/value="guide"/.test(contactHtml)) errors.push("문의 페이지 Iruvy Guide 선택지 누락");
if (!/guide:\s*\{[\s\S]*?Iruvy Guide 디자인 파트너/.test(siteScript)) errors.push("문의 화면 Iruvy Guide 문맥 누락");
if (!/"guide":\s*"Iruvy Guide 디자인 파트너"/.test(contactApi)) errors.push("문의 API Iruvy Guide 유형 누락");
for (const status of ["discovery_scheduled", "site_assessment", "pilot_active", "annual_contract", "nurture"]) {
  if (!contactApi.includes(`"${status}"`)) errors.push(`문의 CRM 상태 누락: ${status}`);
}
for (const event of ["contact_form_start", "contact_form_step_1_complete", "contact_form_submit", "contact_form_success", "contact_form_error"]) {
  if (!siteScript.includes(`trackEvent("${event}"`)) errors.push(`문의 분석 이벤트 누락: ${event}`);
  if (!contactApi.includes(`"${event}"`)) errors.push(`문의 분석 이벤트 서버 허용 누락: ${event}`);
}
if (!/fetch\("\/api\/events"/.test(siteScript)) errors.push("1차 분석 이벤트 전송 누락");
for (const field of ["phone", "utm_source", "landing_page", "referrer", "session_id"]) {
  if (!new RegExp(`name="${field}"`).test(contactHtml)) errors.push(`문의 추적 필드 누락: ${field}`);
}

for (const page of ["index.html", "company/index.html", "contact/index.html"]) {
  const html = readFileSync(join(root, page), "utf8");
  const go = html.indexOf('href="/go/"');
  const guide = html.indexOf('href="/guide/"');
  const flow = html.indexOf('href="/flow/"');
  if (go < 0 || guide < 0 || flow < 0 || !(go < guide && guide < flow)) {
    errors.push(`${page}: 제품 순서 Go → Guide → Flow 누락`);
  }
}

const publicCopy = pages.map((page) => readFileSync(join(root, page), "utf8")).join("\n");
const claimRegistry = JSON.parse(readFileSync(join(root, "content", "claims.json"), "utf8"));
const caseRegistry = JSON.parse(readFileSync(join(root, "content", "cases.json"), "utf8"));
const permissionRegistry = JSON.parse(readFileSync(join(root, "content", "permissions.json"), "utf8"));
for (const claim of claimRegistry.claims) {
  if (claim.approvalStatus === "not_public" && publicCopy.includes(claim.publicText)) {
    errors.push(`비공개 주장 노출: ${claim.claimId}`);
  }
  if (claim.approvalStatus !== "not_public") {
    for (const field of ["sourceOwner", "requiredFootnote", "approvedBy", "reviewDate"]) {
      if (!claim[field]) errors.push(`${claim.claimId}: 공개 주장 필드 누락 ${field}`);
    }
  }
}
for (const item of caseRegistry.cases) {
  for (const field of ["status", "products", "facilityType", "methodology", "permissions", "reviewAt"]) {
    if (item[field] == null) errors.push(`${item.id}: 사례 필드 누락 ${field}`);
  }
}
if (!Array.isArray(permissionRegistry.items) || permissionRegistry.items.length < 1) errors.push("공개 권한 항목 누락");
for (const phrase of ["PROVEN FOUNDATION", "CURRENT FOCUS", "최신 투자 설명자료", "NURSING WORKLOAD INTELLIGENCE", "현장의 실시간 행동", "Physical AI의 새로운 기준"]) {
  if (publicCopy.includes(phrase)) errors.push(`삭제 대상 문구가 남아 있음: ${phrase}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Iruvy site check passed: ${pages.length} pages, links and assets verified.`);
