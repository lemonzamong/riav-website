import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = normalize(join(dirname(fileURLToPath(import.meta.url)), ".."));
const dist = join(root, "dist");
const pages = [
  "index.html", "flow/index.html", "how-it-works/index.html",
  "capacity-lab/index.html", "evidence/index.html",
  "company/index.html", "privacy/index.html",
  "terms/index.html", "accessibility/index.html", "404.html"
];
const errors = [];
const banned = [
  "한국형 팔란티어", "국내 유일", "세계 최고", "완전 자율 공장",
  "100% 정확도", "모든 ERP·MES 연동", "검증된 보안", "엔터프라이즈급 보안",
  "Iruvy Go", "Iruvy Guide", "/go/", "/guide/", "[확인 필요]", "[TODO]", "Lorem ipsum"
];

for (const page of pages) {
  const path = join(dist, page);
  if (!existsSync(path)) {
    errors.push(`${page}: 파일 누락`);
    continue;
  }
  const html = readFileSync(path, "utf8");
  if (!/<html lang="ko">/.test(html)) errors.push(`${page}: lang 누락`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${page}: h1 개수 오류`);
  if (!/<meta name="description" content="[^"]{30,}">/.test(html)) errors.push(`${page}: description 누락`);
  if (!/<link rel="canonical" href="https:\/\/iruvy\.com\//.test(html)) errors.push(`${page}: canonical 누락`);
  if (!/class="skip-link" href="#main"/.test(html) || !/<main id="main">/.test(html)) errors.push(`${page}: 접근성 랜드마크 누락`);
  if (!/href="\/flow\/"/.test(html) || !/href="\/capacity-lab\//.test(html)) errors.push(`${page}: 핵심 내비게이션 누락`);
  if (!/mailto:contact@iruvy\.com/.test(html)) errors.push(`${page}: 공식 이메일 누락`);
  for (const phrase of banned) if (html.includes(phrase)) errors.push(`${page}: 금지 문구 ${phrase}`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)) {
    const clean = match[1];
    if (clean.startsWith("/api/")) continue;
    let target = clean.endsWith("/") ? join(dist, clean, "index.html") : join(dist, clean);
    if (!existsSync(target)) errors.push(`${page}: 없는 로컬 경로 ${clean}`);
  }
}

const home = readFileSync(join(dist, "index.html"), "utf8");
if (!home.includes("설비가 멈추고 납기가 밀릴 때")) errors.push("홈 핵심 헤드라인 누락");
if (!home.includes("SYNTHETIC DATA")) errors.push("합성 데이터 표기 누락");
if (!/관리자.*승인/.test(home)) errors.push("관리자 승인 메시지 누락");
if (!home.includes("우리 공장 적합성 확인")) errors.push("홈 전환 CTA 누락");
if (!home.includes("첫 문의에 원본 데이터 불필요")) errors.push("홈 위험 완화 문구 누락");

const capacityLab = readFileSync(join(dist, "capacity-lab", "index.html"), "utf8");
if (!capacityLab.includes("적합성부터 판단")) errors.push("Capacity Lab 다음 단계 안내 누락");
if (!capacityLab.includes("신청 전에 가장 많이 확인하는 것")) errors.push("Capacity Lab FAQ 누락");
if (/name="phone"[^>]*required/.test(capacityLab)) errors.push("Capacity Lab 전화번호가 필수 항목임");
if (!capacityLab.includes("현재 데이터 준비 상태")) errors.push("Capacity Lab 데이터 준비도 선택 누락");

const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
for (const route of ["flow", "how-it-works", "capacity-lab", "evidence", "company", "privacy", "terms", "accessibility"]) {
  if (!sitemap.includes(`https://iruvy.com/${route}/`)) errors.push(`sitemap: ${route} 누락`);
}
for (const phrase of ["/go/", "/guide/", "/pricing/", "/solutions/", "/design-partners/", "/technology/"]) if (sitemap.includes(phrase)) errors.push(`sitemap: 과거 경로 ${phrase}`);

if (errors.length > 0) {
  console.error("Site check failed:\n" + errors.map(e => ` - ${e}`).join("\n"));
  process.exit(1);
} else {
  console.log(`Iruvy Flow site check passed: ${pages.length} pages`);
}
