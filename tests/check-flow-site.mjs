import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const routes = ["", "guide", "flow", "evidence", "technology", "resources", "company", "capacity-lab", "contact", "privacy", "terms", "accessibility"];
const errors = [];
const banned = ["국내 유일", "세계 최고", "완전 자율 공장", "100% 정확도", "모든 ERP·MES 연동", "검증된 보안", "Iruvy Go", "[TODO]", "Lorem ipsum"];

for (const route of routes) {
  const path = join(root, route, "index.html");
  if (!existsSync(path)) { errors.push(`${route || "/"}: 파일 누락`); continue; }
  const html = readFileSync(path, "utf8");
  if (!/<html lang="ko">/.test(html)) errors.push(`${route || "/"}: 언어 누락`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${route || "/"}: h1 오류`);
  if (!/<meta name="description" content="[^"]{30,}">/.test(html)) errors.push(`${route || "/"}: 설명 누락`);
  if (!/class="skip-link" href="#main"/.test(html) || !/<main id="main">/.test(html)) errors.push(`${route || "/"}: 랜드마크 누락`);
  for (const phrase of banned) if (html.includes(phrase)) errors.push(`${route || "/"}: 금지 문구 ${phrase}`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)) {
    const clean = match[1];
    const target = clean.endsWith("/") ? join(root, clean, "index.html") : join(root, clean);
    if (!existsSync(target)) errors.push(`${route || "/"}: 없는 경로 ${clean}`);
  }
}

const home = readFileSync(join(root, "index.html"), "utf8");
for (const phrase of ["SPATIAL DECISION AI", "현장의 다음", "Iruvy Guide", "Iruvy Flow", "관리자 최종 승인"]) {
  if (!home.includes(phrase)) errors.push(`홈 핵심 메시지 누락: ${phrase}`);
}
const pricing = readFileSync(join(root, "pricing", "index.html"), "utf8");
if (!pricing.includes("noindex,follow") || !pricing.includes("/contact/")) errors.push("pricing 비공개 전환 누락");
const go = readFileSync(join(root, "go", "index.html"), "utf8");
if (!go.includes("noindex,follow") || !go.includes("/guide/")) errors.push("Go 통합 리디렉션 누락");
const robots = readFileSync(join(root, "robots.txt"), "utf8");
if (!robots.includes("Disallow: /pricing/")) errors.push("pricing robots 차단 누락");
const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
for (const route of ["guide", "flow", "evidence", "technology", "company", "contact"]) {
  if (!sitemap.includes(`https://iruvy.com/${route}/`)) errors.push(`sitemap 누락: ${route}`);
}

if (errors.length) {
  console.error("Site check failed:\n" + errors.map((error) => ` - ${error}`).join("\n"));
  process.exit(1);
}
console.log(`Iruvy site check passed: ${routes.length} public pages`);
