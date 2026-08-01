import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const routes = ["", "guide", "flow", "evidence", "technology", "resources", "company", "capacity-lab", "contact", "privacy", "terms", "accessibility"];
const errors = [];
if (!existsSync(join(root, ".openai", "hosting.json"))) errors.push("Sites 배포 메타파일 누락");
if (!existsSync(join(root, "assets", "iruvy-logo-white.svg"))) errors.push("흰글씨 헤더 로고 누락");

const banned = ["국내 유일", "세계 최고", "완전 자율 공장", "100% 정확도", "모든 ERP·MES 연동", "검증된 보안", "Iruvy Go", "[TODO]", "Lorem ipsum"];
const expectedPageTypes = {
  "": "WebPage",
  guide: "WebPage",
  flow: "WebPage",
  evidence: "CollectionPage",
  technology: "WebPage",
  resources: "CollectionPage",
  company: "AboutPage",
  "capacity-lab": "WebPage",
  contact: "ContactPage",
  privacy: "WebPage",
  terms: "WebPage",
  accessibility: "WebPage",
};

for (const lang of ["ko", "en"]) {
  const titles = new Set();
  const descriptions = new Set();

  for (const route of routes) {
    const relPath = lang === "en" ? join("en", route, "index.html") : join(route, "index.html");
    const path = join(root, relPath);
    if (!existsSync(path)) { errors.push(`${relPath}: 파일 누락`); continue; }
    const html = readFileSync(path, "utf8");

    if (!new RegExp(`<html lang="${lang}">`).test(html)) errors.push(`${relPath}: 언어 (${lang}) 지정 누락`);
    if (!html.includes('class="brand"') || !html.includes('src="/assets/iruvy-logo-white.svg"')) {
      errors.push(`${relPath}: 브랜드 로고 누락`);
    }
    if (!html.includes("iruvy.official@gmail.com")) errors.push(`${relPath}: 공식 이메일 누락`);
    if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${relPath}: h1 오류`);
    if (!/<meta name="description" content="[^"]{20,}">/.test(html)) errors.push(`${relPath}: 설명 메타 누락`);

    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];

    if (!title) errors.push(`${relPath}: title 누락`);
    else if (titles.has(title)) errors.push(`${relPath}: title 중복`);
    else titles.add(title);

    if (!description) errors.push(`${relPath}: description 누락`);
    else if (descriptions.has(description)) errors.push(`${relPath}: description 중복`);
    else descriptions.add(description);

    const canonical = `https://iruvy.com/${lang === "en" ? "en/" : ""}${route ? `${route}/` : ""}`;
    const koUrl = `https://iruvy.com/${route ? `${route}/` : ""}`;
    const enUrl = `https://iruvy.com/en/${route ? `${route}/` : ""}`;

    if (!html.includes(`<link rel="canonical" href="${canonical}">`)) errors.push(`${relPath}: canonical 오류`);
    if (!html.includes(`<link rel="alternate" hreflang="ko" href="${koUrl}">`)) errors.push(`${relPath}: ko hreflang 누락`);
    if (!html.includes(`<link rel="alternate" hreflang="en" href="${enUrl}">`)) errors.push(`${relPath}: en hreflang 누락`);
    if (!html.includes('class="lang-switch"')) errors.push(`${relPath}: 언어 토글 위젯 누락`);

    const schemaMatch = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s);
    if (!schemaMatch) errors.push(`${relPath}: JSON-LD 누락`);

    for (const phrase of banned) if (html.includes(phrase)) errors.push(`${relPath}: 금지 문구 ${phrase}`);
  }
}

const homeKo = readFileSync(join(root, "index.html"), "utf8");
for (const phrase of ["SPATIAL DECISION AI", "최적의 다음 조치", "Iruvy Guide", "Iruvy Flow", "관리자 최종 승인"]) {
  if (!homeKo.includes(phrase)) errors.push(`한글 홈 핵심 메시지 누락: ${phrase}`);
}

const homeEn = readFileSync(join(root, "en", "index.html"), "utf8");
for (const phrase of ["SPATIAL DECISION AI", "Next Best Action", "Iruvy Guide", "Iruvy Flow", "Next Best Action"]) {
  if (!homeEn.includes(phrase)) errors.push(`영문 홈 핵심 메시지 누락: ${phrase}`);
}

for (const file of ["hero-spatial-decision.jpg", "guide-exhibition.jpg", "flow-factory.jpg", "og.jpg"]) {
  const path = join(root, "assets", file);
  if (!existsSync(path)) errors.push(`최적화 이미지 누락: ${file}`);
}

if (errors.length) {
  console.error("Site check failed:\n" + errors.map((error) => ` - ${error}`).join("\n"));
  process.exit(1);
}
console.log(`Iruvy site check passed: ${routes.length * 2} public pages (KO & EN) verified cleanly.`);
