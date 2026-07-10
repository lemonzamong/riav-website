import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = normalize(join(dirname(fileURLToPath(import.meta.url)), ".."));
const pages = [
  "index.html",
  "product/index.html",
  "solutions/index.html",
  "technology/index.html",
  "proof/index.html",
  "company/index.html",
  "contact/index.html",
  "privacy/index.html",
  "accessibility/index.html",
];

const errors = [];
const localPath = (url) => {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean) return null;
  if (/^(mailto:|tel:|data:|javascript:)/.test(clean)) return null;
  if (/^https?:\/\//.test(clean) && !clean.startsWith("https://iruvy.com/")) return null;
  const path = clean.replace(/^https:\/\/iruvy\.com/, "");
  if (!path.startsWith("/")) return null;
  const target = path.endsWith("/") ? `${path}index.html` : path;
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

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(match[0])) errors.push(`${label}: alt 없는 이미지 ${match[0]}`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = localPath(match[1]);
    if (target && !existsSync(target)) errors.push(`${label}: 없는 경로 ${match[1]}`);
  }
}

for (const css of ["tokens.css", "base.css", "components.css", "pages.css"]) {
  const text = readFileSync(join(root, "styles", css), "utf8");
  if (/@import\s+url\(["']?https?:/i.test(text)) errors.push(`styles/${css}: 외부 CSS 요청 발견`);
}

if (!existsSync(join(root, "assets/og-iruvy.png"))) errors.push("공유 이미지 누락");
if (!existsSync(join(root, "sitemap.xml"))) errors.push("사이트맵 누락");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Iruvy site check passed: ${pages.length} pages, links and assets verified.`);
