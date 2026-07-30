import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const routes = ["", "guide", "flow", "evidence", "technology", "resources", "company", "capacity-lab", "contact", "privacy", "terms", "accessibility"];
const errors = [];
if (!existsSync(join(root, ".openai", "hosting.json"))) errors.push("Sites 배포 메타파일 누락");
if (!existsSync(join(root, "assets", "iruvy-logo-white.svg"))) errors.push("흰글씨 헤더 로고 누락");
const banned = ["국내 유일", "세계 최고", "완전 자율 공장", "100% 정확도", "모든 ERP·MES 연동", "검증된 보안", "Iruvy Go", "[TODO]", "Lorem ipsum"];
const titles = new Set();
const descriptions = new Set();
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

for (const route of routes) {
  const path = join(root, route, "index.html");
  if (!existsSync(path)) { errors.push(`${route || "/"}: 파일 누락`); continue; }
  const html = readFileSync(path, "utf8");
  if (!/<html lang="ko">/.test(html)) errors.push(`${route || "/"}: 언어 누락`);
  if (!html.includes('class="brand"') || !html.includes('src="/assets/iruvy-logo-white.svg"')) {
    errors.push(`${route || "/"}: 흰글씨 브랜드 로고 적용 누락`);
  }
  if (!html.includes("iruvy.official@gmail.com")) errors.push(`${route || "/"}: 공식 이메일 누락`);
  if (/contact@iruvy\.com|security@iruvy\.com/.test(html)) errors.push(`${route || "/"}: 이전 이메일 잔존`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${route || "/"}: h1 오류`);
  if (!/<meta name="description" content="[^"]{30,}">/.test(html)) errors.push(`${route || "/"}: 설명 누락`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
  if (!title) errors.push(`${route || "/"}: title 누락`);
  else if (titles.has(title)) errors.push(`${route || "/"}: title 중복`);
  else titles.add(title);
  if (!description) errors.push(`${route || "/"}: description 누락`);
  else if (descriptions.has(description)) errors.push(`${route || "/"}: description 중복`);
  else descriptions.add(description);
  const canonical = `https://iruvy.com/${route ? `${route}/` : ""}`;
  if (!html.includes(`<link rel="canonical" href="${canonical}">`)) errors.push(`${route || "/"}: canonical 오류`);
  if (!html.includes(`<link rel="alternate" hreflang="ko" href="${canonical}">`)) errors.push(`${route || "/"}: ko hreflang 누락`);
  if (!html.includes(`<link rel="alternate" hreflang="x-default" href="${canonical}">`)) errors.push(`${route || "/"}: x-default 누락`);
  for (const meta of ["og:site_name", "og:locale", "og:image:alt", "twitter:title", "twitter:description", "twitter:image:alt"]) {
    if (!html.includes(meta)) errors.push(`${route || "/"}: 소셜 메타 누락 ${meta}`);
  }
  if (!html.includes("max-image-preview:large")) errors.push(`${route || "/"}: 확장 robots 지시자 누락`);
  const schemaMatch = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s);
  if (!schemaMatch) errors.push(`${route || "/"}: JSON-LD 누락`);
  else {
    try {
      const schema = JSON.parse(schemaMatch[1]);
      const graph = schema["@graph"] || [];
      const organization = graph.find((node) => node["@type"] === "Organization");
      if (organization?.alternateName !== "이루비" || organization?.legalName !== "주식회사 이루비") {
        errors.push(`${route || "/"}: 한영 브랜드 엔터티 연결 누락`);
      }
      const webPage = graph.find((node) => node["@id"] === `${canonical}#webpage`);
      if (!webPage || webPage["@type"] !== expectedPageTypes[route]) errors.push(`${route || "/"}: 페이지 스키마 유형 오류`);
      if (route && !graph.some((node) => node["@type"] === "BreadcrumbList")) errors.push(`${route}: breadcrumb 스키마 누락`);
      if (["guide", "flow"].includes(route) && !graph.some((node) => node["@type"] === "SoftwareApplication")) {
        errors.push(`${route}: 제품 스키마 누락`);
      }
      if (route === "capacity-lab" && !graph.some((node) => node["@type"] === "Service")) errors.push("capacity-lab: 서비스 스키마 누락");
    } catch {
      errors.push(`${route || "/"}: JSON-LD 파싱 실패`);
    }
  }
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
for (const phrase of ["‘좋아 보이는 것’ 대신", "‘확실한 것’만 남깁니다", "생산 장애에서,", "최적의 복구 결정으로"]) {
  if (!home.includes(phrase)) errors.push(`홈 피드백 문구 누락: ${phrase}`);
}

const flow = readFileSync(join(root, "flow", "index.html"), "utf8");
for (const phrase of ["생산 장애에서,", "최적의 복구 결정", "최소한의 연동으로,", "운영 영향 없이 성능을 증명합니다", "변수가 많은 현장에", "가장 먼저 찾아갑니다"]) {
  if (!flow.includes(phrase)) errors.push(`Flow 피드백 문구 누락: ${phrase}`);
}

const company = readFileSync(join(root, "company", "index.html"), "utf8");
for (const phrase of ["가설과 사실을 구분하고,", "결과로 솔루션을 완성합니다", "기대가 아닌 실제 데이터와 결과로 증명합니다", "비전과 현재를 명확히 나누고, 실제 결과로 학습합니다"]) {
  if (!company.includes(phrase)) errors.push(`회사소개 피드백 문구 누락: ${phrase}`);
}
if (!home.includes("<title>이루비(Iruvy) | 공간 의사결정 AI</title>")) errors.push("홈 한영 브랜드 title 누락");
if (!home.includes("이루비(Iruvy)는 공간과 상황을 이해해")) errors.push("홈 검색 설명 한영 브랜드 연결 누락");
if (!home.includes('<p class="lede">공간과 운영 상태를 읽고, 목표와 제약 안에서 다음 행동을 제안합니다.</p>')) {
  errors.push("홈 표시 설명이 검색 키워드 때문에 변경됨");
}
const pricing = readFileSync(join(root, "pricing", "index.html"), "utf8");
if (!pricing.includes("noindex,follow") || !pricing.includes("/contact/")) errors.push("pricing 비공개 전환 누락");
const edgeWorker = readFileSync(join(root, "server", "index.js"), "utf8");
if (!edgeWorker.includes('url.pathname.startsWith("/pricing/")') || !edgeWorker.includes('new URL("/contact/", url), 301')) {
  errors.push("pricing 301 리디렉션 누락");
}
if (!edgeWorker.includes('url.pathname.startsWith("/go/")') || !edgeWorker.includes('new URL("/guide/", url), 301')) {
  errors.push("go 301 리디렉션 누락");
}
const go = readFileSync(join(root, "go", "index.html"), "utf8");
if (!go.includes("noindex,follow") || !go.includes("/guide/")) errors.push("Go 통합 리디렉션 누락");
const robots = readFileSync(join(root, "robots.txt"), "utf8");
for (const crawler of ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "anthropic-ai", "Google-Extended", "bingbot"]) {
  if (!robots.includes(`User-agent: ${crawler}\nAllow: /`)) errors.push(`AI 크롤러 허용 누락: ${crawler}`);
}
if (robots.includes("Disallow: /pricing/")) errors.push("리디렉션 크롤링 차단 잔존");
const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
for (const route of routes) {
  const canonical = `https://iruvy.com/${route ? `${route}/` : ""}`;
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) errors.push(`sitemap 누락: ${route || "/"}`);
}
if ((sitemap.match(/<lastmod>2026-07-31<\/lastmod>/g) || []).length !== routes.length) errors.push("sitemap lastmod 누락");
if (sitemap.includes("/go/") || sitemap.includes("/pricing/")) errors.push("sitemap에 비정규 URL 포함");

for (const file of ["hero-spatial-decision.jpg", "guide-exhibition.jpg", "flow-factory.jpg", "og.jpg"]) {
  const path = join(root, "assets", file);
  if (!existsSync(path)) errors.push(`최적화 이미지 누락: ${file}`);
  else if (statSync(path).size > 500_000) errors.push(`이미지 용량 초과: ${file}`);
}
for (const removed of ["hero-spatial-decision.png", "guide-exhibition.png", "flow-factory.png", "og.png"]) {
  if (existsSync(join(root, "assets", removed))) errors.push(`비최적화 이미지가 배포본에 포함됨: ${removed}`);
}

const llms = readFileSync(join(root, "llms.txt"), "utf8");
const llmsFull = readFileSync(join(root, "llms-full.txt"), "utf8");
for (const route of routes) {
  const canonical = `https://iruvy.com/${route ? `${route}/` : ""}`;
  if (!llms.includes(canonical)) errors.push(`llms.txt 페이지 누락: ${route || "/"}`);
}
for (const phrase of ["Iruvy (이루비)", "주식회사 이루비", "Spatial Decision AI", "Iruvy Guide", "Iruvy Flow"]) {
  if (!llms.includes(phrase) || !llmsFull.includes(phrase)) errors.push(`AI 문맥 핵심 엔터티 누락: ${phrase}`);
}
for (const text of [llms, llmsFull, readFileSync(join(root, "assets", "site.js"), "utf8")]) {
  if (!text.includes("iruvy.official@gmail.com")) errors.push("공식 이메일이 AI 문맥 또는 문의 스크립트에 누락");
  if (/contact@iruvy\.com|security@iruvy\.com/.test(text)) errors.push("이전 이메일이 배포 파일에 잔존");
}

if (errors.length) {
  console.error("Site check failed:\n" + errors.map((error) => ` - ${error}`).join("\n"));
  process.exit(1);
}
console.log(`Iruvy site check passed: ${routes.length} public pages`);
