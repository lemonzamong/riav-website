import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const version = `20260730-${Date.now()}`;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
mkdirSync(join(out, "en"), { recursive: true });
mkdirSync(join(out, "assets"), { recursive: true });
mkdirSync(join(out, ".openai"), { recursive: true });

cpSync(join(root, ".openai", "hosting.json"), join(out, ".openai", "hosting.json"));
cpSync(join(root, "site-src", "styles.css"), join(out, "assets", "site.css"));
cpSync(join(root, "site-src", "site.js"), join(out, "assets", "site.js"));
cpSync(join(root, "assets", "iruvy-logo.svg"), join(out, "assets", "iruvy-logo.svg"));
cpSync(join(root, "assets", "iruvy-logo-white.svg"), join(out, "assets", "iruvy-logo-white.svg"));
cpSync(join(root, "assets", "og.jpg"), join(out, "assets", "og.jpg"));
cpSync(join(root, "assets", "hero-spatial-decision.jpg"), join(out, "assets", "hero-spatial-decision.jpg"));
cpSync(join(root, "assets", "guide-exhibition.jpg"), join(out, "assets", "guide-exhibition.jpg"));
cpSync(join(root, "assets", "flow-factory.jpg"), join(out, "assets", "flow-factory.jpg"));
cpSync(join(root, "assets", "fonts-web", "Pretendard-Regular.woff2"), join(out, "assets", "Pretendard-Regular.woff2"));
cpSync(join(root, "assets", "fonts-web", "Pretendard-SemiBold.woff2"), join(out, "assets", "Pretendard-SemiBold.woff2"));
cpSync(join(root, "favicon.ico"), join(out, "favicon.ico"));

const siteOrigin = "https://iruvy.com";
const lastModified = "2026-07-31";

const pageUrl = (route = "", lang = "ko") => {
  if (lang === "en") {
    return route ? `${siteOrigin}/en/${route}/` : `${siteOrigin}/en/`;
  }
  return route ? `${siteOrigin}/${route}/` : `${siteOrigin}/`;
};

const imageUrl = (file) => `${siteOrigin}/assets/${file}`;

const makeNav = (route, lang) => {
  const isEn = lang === "en";
  const prefix = isEn ? "/en" : "";
  const guideHref = `${prefix}/guide/`;
  const flowHref = `${prefix}/flow/`;
  const evidenceHref = `${prefix}/evidence/`;
  const techHref = `${prefix}/technology/`;
  const resourcesHref = `${prefix}/resources/`;
  const companyHref = `${prefix}/company/`;
  const contactHref = `${prefix}/contact/`;

  const koUrl = pageUrl(route, "ko");
  const enUrl = pageUrl(route, "en");

  const menuText = isEn ? "Menu" : "메뉴";
  const solText = isEn ? "Solutions" : "솔루션";
  const guideDesc = isEn ? "Visitor Experience & Mobility Optimization" : "방문자 경험과 이동 최적화";
  const flowDesc = isEn ? "Industrial Operation & Capacity Amplification" : "산업현장 운영 의사결정 최적화";
  const evidenceText = isEn ? "Evidence" : "성과";
  const techText = isEn ? "Tech & Trust" : "기술·신뢰";
  const insightsText = isEn ? "Insights" : "인사이트";
  const companyText = isEn ? "Company" : "회사";
  const contactText = isEn ? "Contact" : "도입 상담";

  return `
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav" data-nav-toggle>${menuText}</button>
  <nav class="nav" id="nav" aria-label="${isEn ? "Main Menu" : "주요 메뉴"}" data-nav>
    <div class="nav-products">
      <button class="nav-product-trigger" type="button" aria-expanded="false" data-product-toggle>${solText} <span aria-hidden="true">⌄</span></button>
      <div class="nav-product-menu" data-product-menu>
        <a href="${guideHref}"><b>Iruvy Guide</b><span>${guideDesc}</span></a>
        <a href="${flowHref}"><b>Iruvy Flow</b><span>${flowDesc}</span></a>
      </div>
    </div>
    <a href="${evidenceHref}">${evidenceText}</a>
    <a href="${techHref}">${techText}</a>
    <a href="${resourcesHref}">${insightsText}</a>
    <a href="${companyHref}">${companyText}</a>
    <a class="button button-small" href="${contactHref}">${contactText}</a>
    <div class="lang-switch" aria-label="${isEn ? "Language Selection" : "언어 선택"}">
      <a href="${koUrl}" class="${!isEn ? "active" : ""}" ${!isEn ? 'aria-current="page"' : ''}>KO</a>
      <a href="${enUrl}" class="${isEn ? "active" : ""}" ${isEn ? 'aria-current="page"' : ''}>EN</a>
    </div>
  </nav>`;
};

const makeHeader = (route, lang) => {
  const homeHref = lang === "en" ? "/en/" : "/";
  return `
<a class="skip-link" href="#main">${lang === "en" ? "Skip to main content" : "본문으로 이동"}</a>
<header class="site-header" data-header>
  <div class="shell header-inner">
    <a class="brand" href="${homeHref}" aria-label="${lang === "en" ? "Iruvy Home" : "이루비 Iruvy 홈"}"><img src="/assets/iruvy-logo-white.svg" alt="Iruvy · 이루비" width="132" height="54"></a>
    ${makeNav(route, lang)}
  </div>
</header>`;
};

const makeFooter = (lang) => {
  const isEn = lang === "en";
  const prefix = isEn ? "/en" : "";
  return `
<footer class="site-footer">
  <div class="shell footer-grid">
    <div class="footer-lead">
      <a class="brand invert" href="${prefix}/" aria-label="Iruvy Home"><img src="/assets/iruvy-logo-white.svg" alt="Iruvy · 이루비" width="116" height="48"></a>
      <p>${isEn ? "Developing Spatial Decision AI to compute the Next Best Action for visitor experiences and industrial operations." : "공간과 현장 상황을 이해해 최적의 다음 조치를 제시하는 Spatial Decision AI를 개발합니다."}</p>
    </div>
    <div><strong>${isEn ? "Solutions" : "솔루션"}</strong><a href="${prefix}/guide/">Iruvy Guide</a><a href="${prefix}/flow/">Iruvy Flow</a></div>
    <div><strong>${isEn ? "Verification" : "검증"}</strong><a href="${prefix}/evidence/">Evidence</a><a href="${prefix}/technology/">${isEn ? "Tech & Trust" : "기술·신뢰"}</a><a href="${prefix}/accessibility/">${isEn ? "Accessibility" : "웹 접근성"}</a></div>
    <div><strong>${isEn ? "Company" : "회사"}</strong><a href="${prefix}/company/">${isEn ? "About Us" : "회사 소개"}</a><a href="${prefix}/resources/">${isEn ? "Insights" : "인사이트"}</a><a href="${prefix}/contact/">${isEn ? "Contact" : "도입 상담"}</a></div>
  </div>
  <div class="shell footer-bottom">
    <span>© 2026 주식회사 이루비 · IRUVY INC. <time datetime="2026-07-31">${isEn ? "Updated 2026.07.31" : "사이트 업데이트 2026.07.31"}</time></span>
    <span><a href="mailto:iruvy.official@gmail.com">iruvy.official@gmail.com</a> · <a href="${prefix}/privacy/">${isEn ? "Privacy Policy" : "개인정보 처리방침"}</a> · <a href="${prefix}/terms/">${isEn ? "Terms of Service" : "이용약관"}</a></span>
  </div>
</footer>`;
};

const makeSchema = ({ route = "", title, description, pageType = "WebPage", lang = "ko" }) => {
  const url = pageUrl(route, lang);
  const isEn = lang === "en";
  const orgName = isEn ? "Iruvy" : "주식회사 이루비";
  const orgDesc = isEn ? "Spatial Decision AI company optimizing visitor experience and manufacturing capacity." : "공간과 상황을 이해해 다음 최적 행동을 결정하는 Spatial Decision AI를 개발하는 기업";

  const organizationSchema = {
    "@type": "Organization",
    "@id": `${siteOrigin}/#organization`,
    name: "Iruvy",
    alternateName: "이루비",
    legalName: orgName,
    url: `${siteOrigin}/`,
    logo: { "@type": "ImageObject", url: imageUrl("iruvy-logo.svg") },
    image: imageUrl("og.jpg"),
    description: orgDesc,
    email: "iruvy.official@gmail.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales and customer support",
      email: "iruvy.official@gmail.com",
      availableLanguage: ["Korean", "English"],
    },
    knowsAbout: [
      "Spatial Decision AI",
      "Spatial Intelligence",
      "Decision Intelligence",
      "Visitor Decision Platform",
      "Manufacturing capacity optimization",
    ],
  };

  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${siteOrigin}/#website`,
    url: `${siteOrigin}/`,
    name: "Iruvy",
    alternateName: "이루비",
    description: "Iruvy Spatial Decision AI Official Website",
    inLanguage: isEn ? "en-US" : "ko-KR",
    publisher: { "@id": `${siteOrigin}/#organization` },
  };

  const webPage = {
    "@type": pageType,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: isEn ? "en-US" : "ko-KR",
    isPartOf: { "@id": `${siteOrigin}/#website` },
    about: { "@id": `${siteOrigin}/#organization` },
    publisher: { "@id": `${siteOrigin}/#organization` },
    dateModified: lastModified,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl(route === "guide" ? "guide-exhibition.jpg" : route === "flow" ? "flow-factory.jpg" : "og.jpg"),
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema, webPage],
  };
};

const renderPage = ({
  route = "",
  lang = "ko",
  title,
  description,
  body,
  pageType = "WebPage",
  robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
}) => {
  const canonical = pageUrl(route, lang);
  const koCanonical = pageUrl(route, "ko");
  const enCanonical = pageUrl(route, "en");

  const socialImage = route === "guide" ? "guide-exhibition.jpg" : route === "flow" ? "flow-factory.jpg" : "og.jpg";
  const socialImageAlt = lang === "en"
    ? "Iruvy Spatial Decision AI calculating Next Best Actions"
    : "현장의 다음 최적 조치를 계산하는 Iruvy Spatial Decision AI";

  const schema = makeSchema({ route, title, description, pageType, lang });

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="${robots}">
  <meta name="author" content="Iruvy">
  <meta name="application-name" content="Iruvy · 이루비">
  <meta name="naver-site-verification" content="df2331ce1a5255e211d4f471851a16af986c19b3">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="ko" href="${koCanonical}">
  <link rel="alternate" hreflang="en" href="${enCanonical}">
  <link rel="alternate" hreflang="x-default" href="${koCanonical}">
  <link rel="alternate" type="text/plain" href="/llms.txt" title="Iruvy AI context">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Iruvy · 이루비">
  <meta property="og:locale" content="${lang === "en" ? "en_US" : "ko_KR"}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${imageUrl(socialImage)}">
  <meta property="og:image:secure_url" content="${imageUrl(socialImage)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1731">
  <meta property="og:image:height" content="909">
  <meta property="og:image:alt" content="${socialImageAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl(socialImage)}">
  <meta name="twitter:image:alt" content="${socialImageAlt}">
  <meta name="theme-color" content="#0c0a12">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/assets/site.css?v=${version}">
  <script src="/assets/site.js?v=${version}" defer></script>
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
</head>
<body>${makeHeader(route, lang)}<main id="main">${body}</main>${makeFooter(lang)}</body>
</html>`;
};

// ==================== CONTENT DICTIONARY (KO & EN) ====================

const statusPill = (label, tone = "") => `<span class="status ${tone}">${label}</span>`;

// --- HOME ---
const homeKo = `
<section class="hero hero-cinematic">
  <img class="hero-media" src="/assets/hero-spatial-decision.jpg" alt="산업 전시 공간과 정밀 제조 현장을 하나의 선택 경로로 연결한 장면" width="1586" height="992" fetchpriority="high">
  <div class="hero-scrim" aria-hidden="true"></div>
  <div class="shell hero-content" data-reveal>
    <p class="eyebrow">SPATIAL DECISION AI</p>
    <h1>현장에 필요한<br><em>최적의 다음 조치</em>를 제시합니다</h1>
    <p class="lede">공간과 현장 상황을 실시간으로 읽고, 목표와 제약 조건에 맞는 가장 확실한 행동을 제안합니다.</p>
    <div class="actions"><a class="button" href="/guide/">Iruvy Guide</a><a class="button ghost" href="/flow/">Iruvy Flow</a></div>
  </div>
</section>

<section class="signal-band" aria-label="Iruvy의 제품 구조">
  <div class="shell signal-grid">
    <div><span>Visitor</span><b>방문자의 위치에서<br>최적의 동선으로</b></div>
    <div class="signal-core"><span>Spatial Decision Core</span><b>State + Goal + Constraints<br>Next Best Action</b></div>
    <div><span>Industry</span><b>생산 제약과 장애에서<br>최적의 복구 조치로</b></div>
  </div>
</section>

<section class="decision-story">
  <div class="shell story-grid">
    <div class="story-sticky">
      <p class="eyebrow">DECISION, NOT ANOTHER DASHBOARD</p>
      <h2>기록만 되던 데이터를<br>실행할 조치로</h2>
      <p>단순 모니터링을 넘어, 기존 시스템 위에서 지금 실행 가능한 선택을 비교하고 관리자가 즉시 조치할 최적 대안을 좁혀줍니다.</p>
      <a class="text-link" href="/technology/">Iruvy Core 보기</a>
    </div>
    <div class="story-steps">
      <article data-reveal>
        <span>현재 상태</span>
        <h3>현장 상황을 한 시점으로 연결합니다</h3>
        <p>사람, 공간, 설비, 작업과 시간을 하나의 통합 상태로 묶습니다.</p>
        <div class="state-ribbon" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      </article>
      <article data-reveal>
        <span>목표와 제약</span>
        <h3>‘막연한 추정’ 대신<br>‘검증된 대안’만 남깁니다</h3>
        <p>납기 시간, 작업 공간, 안전 규정 및 품질 기준을 완벽히 통과한 행동만 추출합니다.</p>
        <div class="constraint-words" aria-hidden="true"><b>TIME</b><b>SPACE</b><b>SAFETY</b><b>QUALITY</b></div>
      </article>
      <article class="story-selected" data-reveal>
        <span>최적 조치</span>
        <h3>사람이 판단할 최종 대안을 제시합니다</h3>
        <p>명확한 근거와 예상 파급 효과를 함께 제시하여, 관리자가 안전하게 승인하거나 수정할 수 있게 돕습니다.</p>
        <div class="choice-line" aria-hidden="true"><i></i><i></i><i class="selected"></i></div>
      </article>
    </div>
  </div>
</section>

<section class="product-worlds">
  <div class="shell">
    <div class="section-head"><h2>동일한 핵심 기술.<br>전혀 다른 두 현장.</h2><p>핵심 AI 엔진은 공유하되, 고객 데이터와 원본 보안 모델은 철저히 분리합니다.</p></div>
    <article class="world world-guide" data-reveal>
      <div class="world-media"><img src="/assets/guide-exhibition.jpg" alt="산업 전시회에서 모바일 가이드를 확인하며 이동하는 방문자" width="1448" height="1086" loading="lazy"></div>
      <div class="world-copy">
        <span>IRUVY GUIDE</span>
        <h3>관심사 맞춤<br>방문 추천</h3>
        <p>방문자의 관람 목적, 현재 위치와 남은 시간을 분석하여 최적의 부스와 콘텐츠 동선을 추천합니다.</p>
        <a href="/guide/">Guide 살펴보기</a>
      </div>
    </article>
    <article class="world world-flow" data-reveal>
      <div class="world-copy">
        <span>IRUVY FLOW</span>
        <h3>갑작스러운 생산 장애에도<br>최적의 복구 순서를 제시합니다</h3>
        <p>설비, 작업순서, 자재 및 납기 제약을 종합적으로 계산하여 생산관리자가 검토할 복구 대안을 계산합니다.</p>
        <a href="/flow/">Flow 살펴보기</a>
      </div>
      <div class="world-media"><img src="/assets/flow-factory.jpg" alt="정밀 제조 현장에서 생산 일정을 검토하는 관리자와 엔지니어" width="1448" height="1086" loading="lazy"></div>
    </article>
  </div>
</section>

<section class="operating-loop">
  <div class="shell">
    <h2>Sense <span>World</span>, Decide <span>Act</span></h2>
    <div class="loop-copy">
      <p>현장 상황을 실시간으로 읽고 실행 가능한 조치를 비교합니다.</p>
      <p>관리자의 승인과 실제 조치 결과를 다음 판단의 검증 근거로 축적합니다.</p>
    </div>
  </div>
</section>

<section class="trust-manifesto">
  <div class="shell trust-layout">
    <div>
      <h2>자동화보다 먼저,<br>사람이 통제할 수 있는 조치</h2>
      <p>과장된 무인 자동화 대신, 현재 기술로 안전하게 검증 가능한 최적 범위부터 제공합니다.</p>
      <a class="text-link" href="/evidence/">Evidence 체계 보기</a>
    </div>
    <dl>
      <div><dt>기존 시스템</dt><dd>교체 없이 그대로 연동</dd></div>
      <div><dt>초기 연결</dt><dd>안전한 읽기 중심 연동</dd></div>
      <div><dt>최종 결정</dt><dd>관리자 최종 승인 필수</dd></div>
      <div><dt>제품 데이터</dt><dd>Guide와 Flow 데이터 완벽 분리</dd></div>
      <div><dt>개인 감시</dt><dd>기본 범위에서 엄격히 제외</dd></div>
    </dl>
  </div>
</section>

<section class="final-cta">
  <div class="shell">
    <h2>어떤 현장의 업무 조치를<br>개선하고자 하시나요?</h2>
    <div class="actions center"><a class="button pale" href="/contact/?product=guide">전시 도입 상담</a><a class="button outline-light" href="/contact/?product=flow">제조 현장 진단</a></div>
  </div>
</section>`;

const homeEn = `
<section class="hero hero-cinematic">
  <img class="hero-media" src="/assets/hero-spatial-decision.jpg" alt="Industrial exhibition and manufacturing environment connected via Spatial Decision AI" width="1586" height="992" fetchpriority="high">
  <div class="hero-scrim" aria-hidden="true"></div>
  <div class="shell hero-content" data-reveal>
    <p class="eyebrow">SPATIAL DECISION AI</p>
    <h1>Calculating the<br><em>Next Best Action</em><span class="mobile-break"><br></span> for your operations</h1>
    <p class="lede">Reading spatial context and operational state to recommend verifiable decisions within goals and constraints.</p>
    <div class="actions"><a class="button" href="/en/guide/">Iruvy Guide</a><a class="button ghost" href="/en/flow/">Iruvy Flow</a></div>
  </div>
</section>

<section class="signal-band" aria-label="Product Architecture">
  <div class="shell signal-grid">
    <div><span>Visitor</span><b>From location &amp; interest<br>to guided experience</b></div>
    <div class="signal-core"><span>Spatial Decision Core</span><b>State + Goal + Constraints<br>Next Best Action</b></div>
    <div><span>Industry</span><b>From disruptions &amp; bottlenecks<br>to optimal recovery decisions</b></div>
  </div>
</section>

<section class="decision-story">
  <div class="shell story-grid">
    <div class="story-sticky">
      <p class="eyebrow">DECISION, NOT ANOTHER DASHBOARD</p>
      <h2>From recorded data<br>to actionable decisions</h2>
      <p>Comparing viable options on top of existing infrastructure to narrow down the single best choice for human supervisors.</p>
      <a class="text-link" href="/en/technology/">View Iruvy Core</a>
    </div>
    <div class="story-steps">
      <article data-reveal>
        <span>Current State</span>
        <h3>Unifying reality into a single point in time</h3>
        <p>Connecting people, spaces, equipment, tasks, and time into one operational state.</p>
        <div class="state-ribbon" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      </article>
      <article data-reveal>
        <span>Goals &amp; Constraints</span>
        <h3>Filtering out assumptions to leave verified choices</h3>
        <p>Passing only actions that satisfy time, location, safety, quality, and operational rules.</p>
        <div class="constraint-words" aria-hidden="true"><b>TIME</b><b>SPACE</b><b>SAFETY</b><b>QUALITY</b></div>
      </article>
      <article class="story-selected" data-reveal>
        <span>Next Best Action</span>
        <h3>Presenting decision options for human sign-off</h3>
        <p>Allowing managers to inspect rationale, forecast impact, and safely approve or override.</p>
        <div class="choice-line" aria-hidden="true"><i></i><i></i><i class="selected"></i></div>
      </article>
    </div>
  </div>
</section>

<section class="product-worlds">
  <div class="shell">
    <div class="section-head"><h2>One core technology.<br>Two distinct environments.</h2><p>Sharing core decision algorithms while isolating customer data and models.</p></div>
    <article class="world world-guide" data-reveal>
      <div class="world-media"><img src="/assets/guide-exhibition.jpg" alt="Visitor reviewing mobile exhibition guide" width="1448" height="1086" loading="lazy"></div>
      <div class="world-copy">
        <span>IRUVY GUIDE</span>
        <h3>From visitor interest<br>to next booth recommendation</h3>
        <p>Reading visitor preferences, location, and remaining time to recommend optimal booths and navigation.</p>
        <a href="/en/guide/">Explore Guide</a>
      </div>
    </article>
    <article class="world world-flow" data-reveal>
      <div class="world-copy">
        <span>IRUVY FLOW</span>
        <h3>From production disruption<br>to optimal recovery decisions</h3>
        <p>Connecting machine outages, order priority, and capacity bottlenecks to compute recovery schedules.</p>
        <a href="/en/flow/">Explore Flow</a>
      </div>
      <div class="world-media"><img src="/assets/flow-factory.jpg" alt="Manufacturing managers inspecting production schedule" width="1448" height="1086" loading="lazy"></div>
    </article>
  </div>
</section>

<section class="operating-loop">
  <div class="shell">
    <h2>Sense <span>World</span>, Decide <span>Act</span></h2>
    <div class="loop-copy">
      <p>Sensing real-world state and comparing feasible operational actions.</p>
      <p>Logging human decisions and actual outcomes as verifiable evidence for future models.</p>
    </div>
  </div>
</section>

<section class="trust-manifesto">
  <div class="shell trust-layout">
    <div>
      <h2>Controllable decisions<br>before full automation</h2>
      <p>Prioritizing human-in-the-loop safety and verifiability over unproven hype.</p>
      <a class="text-link" href="/en/evidence/">View Evidence Framework</a>
    </div>
    <dl>
      <div><dt>Legacy Systems</dt><dd>No overhaul required</dd></div>
      <div><dt>Data Integration</dt><dd>Read-only focus</dd></div>
      <div><dt>Final Control</dt><dd>Supervisor approval mandatory</dd></div>
      <div><dt>Product Data</dt><dd>Guide and Flow strictly isolated</dd></div>
      <div><dt>Surveillance</dt><dd>Excluded by design</dd></div>
    </dl>
  </div>
</section>

<section class="final-cta">
  <div class="shell">
    <h2>Which operational decisions<br>are you looking to optimize?</h2>
    <div class="actions center"><a class="button pale" href="/en/contact/?product=guide">Exhibition Consultation</a><a class="button outline-light" href="/en/contact/?product=flow">Manufacturing Capacity Audit</a></div>
  </div>
</section>`;

// --- GUIDE ---
const guideKo = `
<section class="product-hero product-hero-guide">
  <img src="/assets/guide-exhibition.jpg" alt="산업 전시회에서 모바일 가이드를 확인하며 이동하는 방문자" width="1448" height="1086" fetchpriority="high">
  <div class="product-hero-scrim"></div>
  <div class="shell product-hero-content" data-reveal>
    <p class="eyebrow">IRUVY GUIDE</p>
    <h1>방문자의 관심에 맞춘<br><em>최적 동선 안내</em></h1>
    <p>방문자의 관람 관심사, 현재 위치, 남은 시간을 고려하여 최적의 부스와 전시 콘텐츠를 안내합니다.</p>
    <a class="button" href="/contact/?product=guide">행사 적합성 진단</a>
  </div>
</section>

<section class="guide-route" id="journey">
  <div class="shell">
    <h2>앱 설치 없이 시작하고,<br>실제 방문으로 연결합니다</h2>
    <div class="route-stage" aria-label="Iruvy Guide 방문 흐름">
      <div class="route-line" aria-hidden="true"></div>
      <article data-reveal><b>관심사를 확인합니다</b><p>보고 싶은 산업, 주요 제품과 관람 가능 시간을 입력합니다.</p></article>
      <article data-reveal><b>최적 동선을 추천합니다</b><p>현재 위치에서 관람 가치가 가장 높은 부스를 순서대로 연결합니다.</p></article>
      <article data-reveal><b>검증된 정보만 보여줍니다</b><p>주최자와 기업이 직접 검수한 제품 자료를 기반으로 안내합니다.</p></article>
      <article data-reveal><b>현장 상담으로 이어집니다</b><p>부스 저장, 기업 자료 요청 및 비즈니스 상담으로 연계합니다.</p></article>
    </div>
  </div>
</section>

<section class="stakeholder-stage">
  <div class="shell">
    <div class="section-head"><h2>한 번의 방문.<br>모두를 위한 3가지 가치.</h2></div>
    <div class="tab-shell editorial-tabs" data-tabs>
      <div class="tabs" role="tablist">
        <button role="tab" aria-selected="true" aria-controls="visitor" id="tab-visitor">방문자</button>
        <button role="tab" aria-selected="false" aria-controls="organizer" id="tab-organizer">주최자</button>
        <button role="tab" aria-selected="false" aria-controls="exhibitor" id="tab-exhibitor">참가기업</button>
      </div>
      <div class="tab-panel" role="tabpanel" id="visitor" aria-labelledby="tab-visitor">
        <span>VISITOR</span><h3>제한된 시간 안에<br>핵심 부스 탐색</h3>
        <p>관심사와 위치에 맞춘 명확한 부스 안내로 관람 만족도를 높입니다.</p>
        <div class="feature-chips"><span>맞춤 추천 동선</span><span>검증된 정보</span><span>웹 즉시 접속</span></div>
      </div>
      <div class="tab-panel" role="tabpanel" id="organizer" aria-labelledby="tab-organizer" hidden>
        <span>ORGANIZER</span><h3>추정이 아닌<br>실제 동선 데이터로 개선</h3>
        <p>검색 키워드, 부스 방문 흐름을 분석하여 차기 전시 기획에 반영합니다.</p>
        <div class="feature-chips"><span>콘텐츠 승인</span><span>동선 분석</span><span>성과 리포트</span></div>
      </div>
      <div class="tab-panel" role="tabpanel" id="exhibitor" aria-labelledby="tab-exhibitor" hidden>
        <span>EXHIBITOR</span><h3>부스 방문을<br>비즈니스 상담으로 전환</h3>
        <p>검증된 기업 자료를 설명하고 미팅 상담으로 자연스럽게 이어줍니다.</p>
        <div class="feature-chips"><span>기업 안내</span><span>자료 전송</span><span>상담 연결</span></div>
      </div>
    </div>
  </div>
</section>

<section class="scope-story">
  <div class="shell scope-layout">
    <div>
      <h2>실제 가치가 입증된<br>기능부터 단계별 적용</h2>
      <p>현장에서 즉시 활용할 수 있는 웹 기반 핵심 기능부터 안정적으로 구축합니다.</p>
    </div>
    <div class="scope-track">
      <article><span>기본 경험</span><h3>QR 웹, 지도, 빠른 검색</h3><p>앱 설치 없이 QR 스캔으로 바로 시작하는 경험</p></article>
      <article><span>핵심 검증</span><h3>맞춤 추천, 동선, 상담 연계</h3><p>추천 동선이 실제 방문과 미팅 전환으로 이어지는지 검증</p></article>
      <article><span>선택적 확장</span><h3>정밀 위치 측위, WebAR</h3><p>가치가 확인된 구역에 한해 단계별로 확장</p></article>
    </div>
  </div>
</section>

<section class="grounded-statement">
  <div class="shell">
    <h2>안내 문구는 주최자가 검수한 원문만 사용합니다</h2>
    <p>생성형 AI 환각 우려 없이, 사전 승인된 데이터만 공개합니다. 방문자 동선 데이터는 Flow 제품 학습에 사용되지 않습니다.</p>
    <div class="grounded-points"><span>원문 출처 연결</span><span>주최자 사전 승인</span><span>개인정보 동의</span><span>제품 간 데이터 분리</span></div>
  </div>
</section>

<section class="final-cta"><div class="shell"><h2>다음 전시회에서 검증할<br>핵심 동선은 무엇인가요?</h2><a class="button pale" href="/contact/?product=guide">행사 적합성 진단</a></div></section>`;

const guideEn = `
<section class="product-hero product-hero-guide">
  <img src="/assets/guide-exhibition.jpg" alt="Visitor checking mobile exhibition guide" width="1448" height="1086" fetchpriority="high">
  <div class="product-hero-scrim"></div>
  <div class="shell product-hero-content" data-reveal>
    <p class="eyebrow">IRUVY GUIDE</p>
    <h1>From visitor interest<br><em>to optimal booth navigation</em></h1>
    <p>Reading visitor preferences, location, and remaining time to recommend optimal booths, content, and routes.</p>
    <a class="button" href="/en/contact/?product=guide">Exhibition Suitability Audit</a>
  </div>
</section>

<section class="guide-route" id="journey">
  <div class="shell">
    <h2>Zero app installation.<br>Direct visitor engagement.</h2>
    <div class="route-stage" aria-label="Iruvy Guide Visitor Journey">
      <div class="route-line" aria-hidden="true"></div>
      <article data-reveal><b>Capture Preferences</b><p>Understanding visitor goals, topics of interest, and available time.</p></article>
      <article data-reveal><b>Recommend Routes</b><p>Connecting high-value booths based on current location and schedule.</p></article>
      <article data-reveal><b>Verified Insights</b><p>Delivering factual product details backed by approved organizer sources.</p></article>
      <article data-reveal><b>Convert to Meetings</b><p>Enabling booth saves, material requests, and opt-in sales consultations.</p></article>
    </div>
  </div>
</section>

<section class="stakeholder-stage">
  <div class="shell">
    <div class="section-head"><h2>One event visit.<br>Three distinct value perspectives.</h2></div>
    <div class="tab-shell editorial-tabs" data-tabs>
      <div class="tabs" role="tablist">
        <button role="tab" aria-selected="true" aria-controls="visitor" id="tab-visitor">Visitors</button>
        <button role="tab" aria-selected="false" aria-controls="organizer" id="tab-organizer">Organizers</button>
        <button role="tab" aria-selected="false" aria-controls="exhibitor" id="tab-exhibitor">Exhibitors</button>
      </div>
      <div class="tab-panel" role="tabpanel" id="visitor" aria-labelledby="tab-visitor">
        <span>VISITOR</span><h3>Maximize value<br>in limited time</h3>
        <p>Discovering relevant booths and technical content matching your agenda.</p>
        <div class="feature-chips"><span>Personalized Route</span><span>Verified Sources</span><span>Web Access</span></div>
      </div>
      <div class="tab-panel" role="tabpanel" id="organizer" aria-labelledby="tab-organizer" hidden>
        <span>ORGANIZER</span><h3>Data-driven spatial insights<br>over guesswork</h3>
        <p>Analyzing search intents and foot traffic to optimize future floor plans.</p>
        <div class="feature-chips"><span>Content Approval</span><span>Traffic Analytics</span><span>Outcome Report</span></div>
      </div>
      <div class="tab-panel" role="tabpanel" id="exhibitor" aria-labelledby="tab-exhibitor" hidden>
        <span>EXHIBITOR</span><h3>Converting foot traffic<br>into verified leads</h3>
        <p>Showcasing pre-approved media and driving opt-in follow-up meetings.</p>
        <div class="feature-chips"><span>Product Guide</span><span>Document Request</span><span>Lead Capture</span></div>
      </div>
    </div>
  </div>
</section>

<section class="scope-story">
  <div class="shell scope-layout">
    <div>
      <h2>Building in order<br>of proven value</h2>
      <p>Focusing first on seamless web experiences utilized on event day.</p>
    </div>
    <div class="scope-track">
      <article><span>CORE WEDGE</span><h3>QR Web, Maps, Search</h3><p>Instant start without downloading mobile apps</p></article>
      <article><span>VALIDATION</span><h3>Recommendations &amp; Leads</h3><p>Verifying conversion from routes to exhibitor meetings</p></article>
      <article><span>FUTURE EXPANSION</span><h3>Precise Indoor Positioning, AR</h3><p>Selectively deployed for validated high-traffic zones</p></article>
    </div>
  </div>
</section>

<section class="grounded-statement">
  <div class="shell">
    <h2>Grounded strictly in approved source documents</h2>
    <p>Eliminating AI hallucinations by relying solely on verified organizer assets. Visitor data is never used to train Flow models.</p>
    <div class="grounded-points"><span>Source Attribution</span><span>Organizer Sign-off</span><span>Opt-in Privacy</span><span>Product Data Isolation</span></div>
  </div>
</section>

<section class="final-cta"><div class="shell"><h2>Ready to optimize visitor experience<br>at your next event?</h2><a class="button pale" href="/en/contact/?product=guide">Exhibition Suitability Audit</a></div></section>`;

// --- FLOW ---
const flowKo = `
<section class="product-hero product-hero-flow">
  <img src="/assets/flow-factory.jpg" alt="정밀 제조 현장에서 생산 일정을 검토하는 관리자와 엔지니어" width="1448" height="1086" fetchpriority="high">
  <div class="product-hero-scrim"></div>
  <div class="shell product-hero-content" data-reveal>
    <p class="eyebrow">IRUVY FLOW</p>
    <h1>갑작스러운 생산 장애에도<br><em>최적의 복구 순서</em>를 제안합니다</h1>
    <p>설비 고장, 긴급 주문, 자재 지연 등의 제약 조건을 실시간 계산하여 생산관리자가 즉시 적용할 복구 대안을 조율합니다.</p>
    <a class="button" href="/capacity-lab/">Capacity Audit 진단</a>
  </div>
</section>

<section class="disturbance-story">
  <div class="shell disturbance-grid">
    <div class="disturbance-sticky">
      <span>WHEN THE PLAN BREAKS</span>
      <h2>생산 계획이 틀어졌을 때,<br>가장 먼저 바꿀 조치는?</h2>
      <p>단 한 건의 돌발 사건이 전체 작업 공정과 약속된 납기에 미치는 영향을 정확히 추적합니다.</p>
    </div>
    <div class="disturbance-cases">
      <article data-reveal><b>설비 돌발 고장</b><p>대체 설비 투입과 작업 순서 변경 시 납기 파급 효과를 비교합니다.</p></article>
      <article data-reveal><b>긴급 주문 투입</b><p>새로운 작업 우선순위가 기존 약속된 납기들과 충돌하는 시점을 정밀 파악합니다.</p></article>
      <article data-reveal><b>자재·외주 납기 지연</b><p>실제 진행 가능한 공정을 재배열하여 다음 병목 구간을 사전 예측합니다.</p></article>
      <article data-reveal><b>작업 인력 변동</b><p>작업자 숙련도와 작업 안전 규칙 제약 안에서 실행 가능한 대체 순서를 남깁니다.</p></article>
    </div>
  </div>
</section>

<section class="flow-transform">
  <div class="shell">
    <div class="transform-input">
      <span>현장 실시간 상태</span>
      <h2>주문. 공정. 설비.<br>자재. 외주. 작업시간.</h2>
    </div>
    <div class="transform-axis" aria-hidden="true"><i></i></div>
    <div class="transform-output">
      <span>검증된 최적 대안</span>
      <h2>위험 주문 선별.<br>병목 구간 이동.<br>최적 복구 순서.</h2>
      <p>각 대안별 예상 납기 준수율, 잔업 비용, 외주 비용 및 실제 실행 가능성을 종합 비교합니다.</p>
    </div>
  </div>
</section>

<section class="flow-boundary">
  <div class="shell">
    <div class="section-head"><h2>최소한의 시스템 연동으로,<br>현장 부담 없이 성과를 증명합니다</h2></div>
    <div class="boundary-editorial">
      <article><b>안전한 읽기 연동</b><p>기존 ERP, MES 또는 Excel 데이터에서 필요한 항목만 안전하게 읽어옵니다.</p></article>
      <article><b>관리자 최종 승인</b><p>AI는 최적 대안을 추천하고, 최종 적용은 생산관리자가 직접 확인 후 승인합니다.</p></article>
      <article><b>핵심 제약 공정부터</b><p>전체 공장을 한 번에 바꾸지 않고, 가장 병목이 심한 1~2개 핵심 공정부터 시작합니다.</p></article>
      <article><b>직접 제어 제외</b><p>현 단계에서 PLC나 현장 설비를 직접 제어하지 않아 위험이 없습니다.</p></article>
    </div>
    <p class="boundary-note">현재 외부 제공 단계는 L0 Observe(관찰)에서 L1 Recommend(추천) 단계입니다.</p>
  </div>
</section>

<section class="fit-stage">
  <div class="shell fit-layout">
    <div>
      <h2>모든 공장이 아닌,<br>작업 변수가 많은 제조 현장에<br>가장 먼저 찾아갑니다</h2>
      <p>주문생산 및 다품종 소량 생산 공장의 반복되는 예외 상황부터 검증합니다.</p>
    </div>
    <div class="fit-columns">
      <article><span>가장 적합한 현장</span><h3>데이터와 생산 결정권자가 함께 있는 곳</h3><p>예외 상황과 일주일 단위 재계획이 잦고, ERP·MES 또는 Excel 실적 데이터가 준비된 현장</p></article>
      <article><span>현재 부적합한 현장</span><h3>즉시 무인 자동화를 원하는 곳</h3><p>전체 시스템 교체, 현장 작업자 감시 또는 전액 무상 개발을 원하는 현장</p></article>
    </div>
  </div>
</section>

<section class="final-cta"><div class="shell"><h2>최근 발생한 납기 지연 사건 1건으로<br>현장 진단을 시작합니다</h2><a class="button pale" href="/capacity-lab/">Capacity Audit 진단</a></div></section>`;

const flowEn = `
<section class="product-hero product-hero-flow">
  <img src="/assets/flow-factory.jpg" alt="Manufacturing managers reviewing capacity schedule" width="1448" height="1086" fetchpriority="high">
  <div class="product-hero-scrim"></div>
  <div class="shell product-hero-content" data-reveal>
    <p class="eyebrow">IRUVY FLOW</p>
    <h1>From production disruption<br><em>to optimal recovery decisions</em></h1>
    <p>Calculating machine constraints, task sequences, and material bottlenecks to recommend actionable recovery options for plant managers.</p>
    <a class="button" href="/en/capacity-lab/">Capacity Audit</a>
  </div>
</section>

<section class="disturbance-story">
  <div class="shell disturbance-grid">
    <div class="disturbance-sticky">
      <span>WHEN THE PLAN BREAKS</span>
      <h2>When equipment stops,<br>what decision comes next?</h2>
      <p>Tracking how a single operational event propagates through orders, bottlenecks, and delivery commitments.</p>
    </div>
    <div class="disturbance-cases">
      <article data-reveal><b>Machine Outages</b><p>Comparing impact of alternate machine assignments and sequence changes.</p></article>
      <article data-reveal><b>Rush Orders</b><p>Identifying conflict points between new order priority and committed delivery dates.</p></article>
      <article data-reveal><b>Material &amp; Subcontract Delays</b><p>Re-sequencing viable work orders and predicting downstream bottlenecks.</p></article>
      <article data-reveal><b>Labor Shift Changes</b><p>Leaving feasible schedule options matching worker skill levels and safety constraints.</p></article>
    </div>
  </div>
</section>

<section class="flow-transform">
  <div class="shell">
    <div class="transform-input">
      <span>Real-time Operational State</span>
      <h2>Orders. Tasks. Machines.<br>Materials. Outsourcing. Time.</h2>
    </div>
    <div class="transform-axis" aria-hidden="true"><i></i></div>
    <div class="transform-output">
      <span>Calculated Options</span>
      <h2>At-risk order alert.<br>Bottleneck shift.<br>Optimal recovery plan.</h2>
      <p>Comparing delivery compliance, overtime cost, outsourcing fees, and execution feasibility.</p>
    </div>
  </div>
</section>

<section class="flow-boundary">
  <div class="shell">
    <div class="section-head"><h2>Proving performance with minimal integration<br>and zero operational risk</h2></div>
    <div class="boundary-editorial">
      <article><b>Read-only Focus</b><p>Connecting only necessary data from CSV, Excel, ERP, or MES.</p></article>
      <article><b>Manager Sign-off</b><p>System recommends options; human supervisors review and approve.</p></article>
      <article><b>Single Constraint Bottleneck</b><p>Starting with 1-2 critical bottleneck processes per manufacturing line.</p></article>
      <article><b>No Direct Automation Control</b><p>System does not issue direct PLC or machine control commands at this stage.</p></article>
    </div>
    <p class="boundary-note">Current external product boundary: Level 0 Observe to Level 1 Recommend.</p>
  </div>
</section>

<section class="fit-stage">
  <div class="shell fit-layout">
    <div>
      <h2>Targeted at discrete manufacturing<br>with high operational variability</h2>
      <p>Starting with recurring disruptions in make-to-order and high-mix low-volume environments.</p>
    </div>
    <div class="fit-columns">
      <article><span>Best Fit</span><h3>Data &amp; Decision Makers Present</h3><p>Frequent exceptions, weekly re-planning needs, and accessible ERP/MES/Excel records</p></article>
      <article><span>Not A Fit</span><h3>Seeking Immediate Lights-out Automation</h3><p>Demanding total system overhaul, worker surveillance, or free custom software builds</p></article>
    </div>
  </div>
</section>

<section class="final-cta"><div class="shell"><h2>Diagnose capacity bottlenecks starting<br>from one recent delivery delay event</h2><a class="button pale" href="/en/capacity-lab/">Capacity Audit</a></div></section>`;

// --- EVIDENCE ---
const evidenceKo = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">EVIDENCE &amp; TRUST</p><h1>성과를 과장하기 전에,<br><span>검증 단계를 정확하게 공개합니다</span></h1><p>기술 실측, 현장 PoC, 과거 데이터 Replay, 유료 검증 및 실제 라이브 성과를 명확히 구분하여 관리합니다.</p></div></section>
<section class="section"><div class="shell"><div class="evidence-levels"><article>${statusPill("MEASURED","measured")}<h2>기술 실측</h2><p>실제 환경에서 측정한 기술적 성능 지표. 측정 방식과 한계를 명시합니다.</p></article><article>${statusPill("FIELD PoC","current")}<h2>현장 PoC</h2><p>제한된 고객 사업장 환경에서 제품 가설을 실증한 단계입니다.</p></article><article>${statusPill("CUSTOMER REPLAY","validating")}<h2>고객 데이터 Replay</h2><p>과거 시율 데이터로 검증한 결과로, 실시간 운영 성과와 구분합니다.</p></article><article>${statusPill("PAID AUDIT / SPRINT")}<h2>유료 검증</h2><p>목표 KPI, 검수 조건 및 대가가 사전에 합의된 정식 검증입니다.</p></article><article>${statusPill("LIVE")}<h2>라이브 운영</h2><p>실제 생산 업무에 반영되어 검증 중인 운용 성과입니다.</p></article><article>${statusPill("VERIFIED OUTCOME")}<h2>검증된 경제 성과</h2><p>사전 합의된 기준선(Baseline) 대비 증명된 실질 경제 가치입니다.</p></article></div></div></section>
<section class="section tinted"><div class="shell two-col"><div><p class="eyebrow dark">PUBLIC EVIDENCE POLICY</p><h2>숫자보다 먼저 공개하는 성과 원칙</h2></div><div class="evidence-fields"><span>지표 정의</span><span>측정 기간 및 표본</span><span>기준선(Baseline)</span><span>데이터 출처</span><span>측정 방법론</span><span>적용 한계</span><span>검수 책임자</span><span>최종 점검일</span></div></div></section>
<section class="section"><div class="shell"><div class="empty-evidence"><p class="eyebrow dark">CURRENT PUBLIC REGISTER</p><h2>제품별 공개 성과는 정합성을 검토한 뒤 순차 게시합니다</h2><p>Guide와 Flow의 성과 수치를 섞지 않고, 원본 데이터와 검수 책임이 확인된 항목만 공개 레지스트리에 게재합니다.</p><a class="button dark-button" href="/contact/?product=media">근거 및 자료 문의</a></div></div></section>`;

const evidenceEn = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">EVIDENCE &amp; TRUST</p><h1>Verifiable evidence<br><span>before bold claims</span></h1><p>Distinguishing technical lab measurements, field PoCs, customer data replays, paid audits, live operations, and verified economic outcomes.</p></div></section>
<section class="section"><div class="shell"><div class="evidence-levels"><article>${statusPill("MEASURED","measured")}<h2>Lab Measurement</h2><p>Technical performance metrics evaluated under controlled conditions with disclosed scope.</p></article><article>${statusPill("FIELD PoC","current")}<h2>Field PoC</h2><p>Validating product hypothesis within limited customer production environments.</p></article><article>${statusPill("CUSTOMER REPLAY","validating")}<h2>Customer Data Replay</h2><p>Re-running historical records, strictly distinguished from live operational KPIs.</p></article><article>${statusPill("PAID AUDIT / SPRINT")}<h2>Paid Audit</h2><p>Structured evaluations with mutually agreed baseline KPIs and검수 scope.</p></article><article>${statusPill("LIVE")}<h2>Live Operations</h2><p>Results actively integrated into real-world operational workflows.</p></article><article>${statusPill("VERIFIED OUTCOME")}<h2>Verified Economic Outcome</h2><p>Incremental economic value verified against an agreed baseline ledger.</p></article></div></div></section>
<section class="section tinted"><div class="shell two-col"><div><p class="eyebrow dark">PUBLIC EVIDENCE POLICY</p><h2>Transparency principles before presenting numbers</h2></div><div class="evidence-fields"><span>Metric Definition</span><span>Sample &amp; Timeframe</span><span>Baseline Ledger</span><span>Data Provenance</span><span>Methodology</span><span>Scope Limitations</span><span>Sign-off Executive</span><span>Last Review Date</span></div></div></section>
<section class="section"><div class="shell"><div class="empty-evidence"><p class="eyebrow dark">CURRENT PUBLIC REGISTER</p><h2>Public claims are published sequentially after audit</h2><p>Never blending Guide and Flow outcomes into a single marketing figure. Publishing only audited items with verified data provenance.</p><a class="button dark-button" href="/en/contact/?product=media">Evidence Inquiry</a></div></div></section>`;

// --- TECHNOLOGY ---
const techKo = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">IRUVY CORE</p><h1>현장 상태·목표·제약을 연결해<br><span>실행 가능한 최적 조치를 계산합니다</span></h1><p>Spatial Intelligence와 Decision Intelligence의 결합. Iruvy Guide와 Flow가 공유하는 핵심 AI 엔진과 제품별 데이터 보안 경계를 설계합니다.</p></div></section>
<section class="section"><div class="shell"><div class="core-grid"><article><span>01</span><h2>Reality Graph</h2><p>현장의 인력, 공간, 설비, 작업 관계를 표준 데이터 모델로 통합합니다.</p></article><article><span>02</span><h2>Context Engine</h2><p>현재 작업 상태, 돌발 돌발 장애 및 운영 불확실성을 실시간 추적합니다.</p></article><article><span>03</span><h2>Strategy Simulation</h2><p>실행 가능한 조치들과 예상 파급 결과를 목표와 제약 조건 안에서 정밀 시뮬레이션합니다.</p></article><article><span>04</span><h2>Outcome Loop</h2><p>관리자의 최종 승인, 조치 실행, 실제 결과 및 외부 요인을 축적하여 개선합니다.</p></article></div></div></section>
<section class="section process"><div class="shell"><div class="section-head light"><p class="eyebrow">AI BOUNDARY</p><h2>설명하는 언어 AI와 검증하는 계산 계층의 구분</h2></div><div class="ai-boundary"><article><small>LANGUAGE AI (LLM)</small><h3>문서 구조화 및 추천 근거 설명</h3><p>승인된 자료를 구조화하고, AI 추천 대안의 이유와 차이점을 관리자가 이해할 수 있는 언어로 설명합니다.</p></article><article><small>VERIFIABLE COMPUTATION</small><h3>제약 조건 계산 및 수리 최적화</h3><p>하드 제약 조건, 작업 순서 및 자원 배치는 최적화 알고리즘과 검증 가능한 계산 엔진이 구동합니다.</p></article></div></div></section>
<section class="section"><div class="shell two-col"><div><p class="eyebrow dark">DATA &amp; HUMAN CONTROL</p><h2>기술 코어 공유와<br>고객 데이터의 철저한 격리</h2><p>Guide와 Flow는 의사결정 시뮬레이션의 공통 모듈을 공유하지만, 고객사의 원본 생산 데이터와 도메인 모델, 학습 권한은 철저하게 분리됩니다.</p></div><div class="trust-list"><span>고객사별 데이터 완벽 격리</span><span>Guide 데이터를 Flow 학습에 전용 금지</span><span>최소 수집·권한 제어·보관 및 파기</span><span>생산관리자의 수정·거절·승인 통제</span><span>데이터 부족 시 무리한 추정 배제</span><span>모델 평가 및 안전한 롤백 시스템</span></div></div></section>`;

const techEn = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">IRUVY CORE</p><h1>Connecting state, goals &amp; constraints<br><span>to compute actionable decisions</span></h1><p>Fusing Spatial Intelligence and Decision Intelligence. Architecting shared core modules while enforcing strict product-level data boundaries.</p></div></section>
<section class="section"><div class="shell"><div class="core-grid"><article><span>01</span><h2>Reality Graph</h2><p>Modeling people, space, equipment, and task relationships into a unified schema.</p></article><article><span>02</span><h2>Context Engine</h2><p>Tracking real-world state, disruption events, and operational uncertainty in real time.</p></article><article><span>03</span><h2>Strategy Simulation</h2><p>Comparing viable operational choices and forecasted impacts within hard constraints.</p></article><article><span>04</span><h2>Outcome Loop</h2><p>Logging approvals, executions, actual outcomes, and external factors for continuous refinement.</p></article></div></div></section>
<section class="section process"><div class="shell"><div class="section-head light"><p class="eyebrow">AI BOUNDARY</p><h2>Separating explanatory LLMs from verifiable computation</h2></div><div class="ai-boundary"><article><small>LANGUAGE AI (LLM)</small><h3>Document Structuring &amp; Rationale Explanation</h3><p>Structuring approved content and explaining recommendation trade-offs in plain natural language.</p></article><article><small>VERIFIABLE COMPUTATION</small><h3>Constraint Optimization &amp; Scheduling Engine</h3><p>Hard constraints, task sequences, and resource allocation are executed by mathematical optimization layers.</p></article></div></div></section>
<section class="section"><div class="shell two-col"><div><p class="eyebrow dark">DATA &amp; HUMAN CONTROL</p><h2>Shared tech engine with<br>strict customer data isolation</h2><p>Guide and Flow share core simulation candidate modules, but customer source data, domain models, and training rights remain strictly isolated.</p></div><div class="trust-list"><span>Tenant Data Isolation</span><span>Zero Cross-Product Data Training</span><span>Least-Privilege Collection &amp; Retention</span><span>Human Manager Override &amp; Approval</span><span>Confidence-based Decision Abstention</span><span>Version Evaluation &amp; Rollback Controls</span></div></div></section>`;

// --- COMPANY ---
const companyKo = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">ABOUT IRUVY</p><h1>공간과 현장 상황을 이해해<br><span>최적의 다음 조치를 제시합니다</span></h1><p>주식회사 이루비는 Spatial Decision AI를 개발하는 기업입니다. 전시 방문자의 동선을 최적화하는 Iruvy Guide와 제조 현장의 유효 생산능력을 증폭하는 Iruvy Flow를 만듭니다.</p></div></section>
<section class="section"><div class="shell two-col"><div><p class="eyebrow dark">MISSION</p><h2>복잡한 현장 문제를<br>곧바로 실행 가능한 결정으로</h2></div><div class="manifesto"><p>산업 현장은 정적인 데이터판이 아닙니다. 사람과 설비, 공간과 시간이 계속 바뀌며, 올바른 의사결정은 목표와 제약 조건을 동시에 이해해야 합니다.</p><p>이루비는 단순히 현장에서 '무슨 일이 일어났는지' 보여주는 데서 멈추지 않고, '지금 당장 실행 가능한 최적 대안'을 비교하고 그 결과를 다음 판단의 근거로 남깁니다.</p></div></div></section>
<section class="section tinted"><div class="shell"><div class="section-head"><p class="eyebrow dark">ONE COMPANY, TWO FRONTS</p><h2>빠른 상용화 제품과 장기 고부가가치 기술을 함께 설계합니다</h2></div><div class="company-products"><article><small>COMMERCIALIZATION FRONT</small><h3>Iruvy Guide</h3><p>산업 전시회에서 별도 앱 설치 없는 맞춤형 방문자 의사결정 웹 경험을 제공합니다.</p></article><article><small>HIGH-VALUE FRONT</small><h3>Iruvy Flow</h3><p>주문생산형 제조 공장의 핵심 제약 공정에서 유효 생산능력 증폭을 검증합니다.</p></article></div></div></section>
<section class="section"><div class="shell principles-head"><p class="eyebrow dark">OUR PRINCIPLES</p><h2>가설과 검증된 사실을 명확히 구분하고,<br>실제 성과로 제품을 완성합니다</h2><p>과장된 장밋빛 비전 대신, 실제 현장 데이터와 결과로 증명합니다.</p></div><div class="principle-grid"><article><span>01</span><h3>증명 전에는 가설</h3><p>검증되지 않은 성과나 성능 수치를 사전에 확정된 사실처럼 말하지 않습니다.</p></article><span>02</span><h3>사람이 최종 결정</h3><p>모든 제품은 관찰(Observe)과 추천(Recommend) 단계에서 안전하게 사람이 통제합니다.</p></article><span>03</span><h3>고객 데이터 엄격 격리</h3><p>제품과 고객사를 넘어 데이터를 임의 전용하거나 모델 학습에 사용하지 않습니다.</p></article><span>04</span><h3>조치와 결과를 함께 축적</h3><p>단순 승인을 넘어 실제 조치 결과와 외부 요인을 기록해 모델을 완성합니다.</p></article></div></div></section>
<section class="final-cta"><div class="shell"><p class="eyebrow">LONG-TERM VISION</p><h2>제조 현장의 숨은 생산능력을<br>실행 가능한 결정으로 깨우는 자율운영 AI</h2><p>현재의 L1 추천형 제품에서 충분한 검증을 거쳐 단계별로 안전하게 확장합니다.</p><a class="button pale" href="/contact/?product=partner">파트너십 문의</a></div></section>`;

const companyEn = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">ABOUT IRUVY</p><h1>Calculating the Next Best Action<br><span>for spatial &amp; industrial operations</span></h1><p>Iruvy Inc. develops Spatial Decision AI, building Iruvy Guide for visitor mobility optimization and Iruvy Flow for manufacturing capacity amplification.</p></div></section>
<section class="section"><div class="shell two-col"><div><p class="eyebrow dark">MISSION</p><h2>Turning complex reality<br>into actionable decisions</h2></div><div class="manifesto"><p>Industrial environments are not static databases. People, equipment, space, and time shift continuously. Effective decisions require evaluating goals and hard constraints simultaneously.</p><p>Iruvy goes beyond showing 'what happened' on another dashboard. We compute and compare viable actions right now, logging outcomes to refine future choices.</p></div></div></section>
<section class="section tinted"><div class="shell"><div class="section-head"><p class="eyebrow dark">ONE COMPANY, TWO FRONTS</p><h2>Combining rapid commercialization with high-value technical depth</h2></div><div class="company-products"><article><small>COMMERCIALIZATION FRONT</small><h3>Iruvy Guide</h3><p>Deploying web-based visitor decision experiences at major industrial expos with zero app downloads.</p></article><article><small>HIGH-VALUE FRONT</small><h3>Iruvy Flow</h3><p>Validating capacity amplification across critical bottleneck processes in make-to-order manufacturing.</p></article></div></div></section>
<section class="section"><div class="shell principles-head"><p class="eyebrow dark">OUR PRINCIPLES</p><h2>Separating hypotheses from facts,<br>refining software through verified outcomes</h2><p>Relying on empirical evidence over marketing hype.</p></div><div class="principle-grid"><article><span>01</span><h3>Hypothesis Until Proven</h3><p>We never present unverified targets or metrics as established facts.</p></article><article><span>02</span><h3>Human Control Mandatory</h3><p>Products operate strictly in Observe and Recommend stages under supervisor control.</p></article><article><span>03</span><h3>Isolated Source Data</h3><p>Customer data is never repurposed across accounts or products without explicit consent.</p></article><article><span>04</span><h3>Log Actions &amp; Outcomes</h3><p>Recording approvals, actual execution, and environmental factors to measure true impact.</p></article></div></div></section>
<section class="final-cta"><div class="shell"><p class="eyebrow">LONG-TERM VISION</p><h2>Unlocking hidden industrial capacity<br>through autonomous decision intelligence</h2><p>Expanding safely from Level 1 recommendations through rigorous empirical verification.</p><a class="button pale" href="/en/contact/?product=partner">Partnership Inquiry</a></div></section>`;

// --- RESOURCES ---
const resourcesKo = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">INSIGHTS &amp; RESOURCES</p><h1>현장 실무자의 언어로 풀어서 다루는<br><span>Spatial Decision AI 인사이트</span></h1><p>전시 방문 경험, 제조 병목 지연, 의사결정 AI의 경계와 성과 검증법을 실무 관점에서 정갈하게 정리합니다.</p></div></section>
<section class="section"><div class="shell"><div class="resource-grid"><article><small>DECISION LAYER</small><h2>기존 ERP·MES 위에 의사결정 레이어가 필요한 이유</h2><p>기록 시스템(System of Record)과 예외 대응 시스템의 역할 구분을 다룹니다.</p><span>발간 준비 중</span></article><article><small>GUIDE METHOD</small><h2>전시회 방문자가 핵심 부스를 놓치고 피로한 이유</h2><p>정보 과다 환경에서 관람 목적·시간·위치 기반 동선 추천이 필요한 이유를 다룹니다.</p><span>발간 준비 중</span></article><article><small>EVIDENCE</small><h2>고객 데이터 Replay와 실제 라이브 KPI의 차이</h2><p>데모 데이터, 과거 데이터 시뮬레이션, 라이브 성과 지표를 올바르게 구별하는 법을 다룹니다.</p><span>발간 준비 중</span></article><article><small>CAPACITY</small><h2>최근 발생한 납기 지연 사건 1건으로 공장 병목을 진단하는 법</h2><p>Capacity Audit 진단의 첫 핵심 질문과 필요한 최소 데이터 범위를 소개합니다.</p><span>발간 준비 중</span></article><article><small>TRUST</small><h2>Human-in-the-loop 방식과 데이터 격리 원칙</h2><p>생산관리자의 결정권 보장과 제품별 데이터 보안 처리 방식을 다룹니다.</p><span>발간 준비 중</span></article><article><small>PRESS KIT</small><h2>Iruvy 공식 브랜드 및 미디어 자료</h2><p>검증된 주식회사 이루비의 공식 로고 자산 및 제품 소개서 자료입니다.</p><a href="/contact/?product=media">자료 요청 →</a></article></div></div></section>`;

const resourcesEn = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">INSIGHTS &amp; RESOURCES</p><h1>Practical insights on<br><span>Spatial Decision AI &amp; Operations</span></h1><p>Examining visitor mobility, manufacturing bottlenecks, decision AI boundaries, and empirical verification methods.</p></div></section>
<section class="section"><div class="shell"><div class="resource-grid"><article><small>DECISION LAYER</small><h2>Why an execution decision layer is needed above ERP/MES</h2><p>Distinguishing Systems of Record from exception response platforms.</p><span>Coming Soon</span></article><article><small>GUIDE METHOD</small><h2>Why trade show visitors miss key exhibitor booths</h2><p>Solving choice overload through time- and location-aware recommendations.</p><span>Coming Soon</span></article><article><small>EVIDENCE</small><h2>Distinguishing customer data replays from live operational KPIs</h2><p>How to evaluate lab demos, historical simulations, and audited live outcomes.</p><span>Coming Soon</span></article><article><small>CAPACITY</small><h2>Diagnosing capacity bottlenecks from a single delivery delay event</h2><p>Key audit questions and minimum required dataset scope for manufacturing.</p><span>Coming Soon</span></article><article><small>TRUST</small><h2>Human-in-the-loop control &amp; tenant data isolation</h2><p>Ensuring supervisor control and zero cross-account data leak.</p><span>Coming Soon</span></article><article><small>PRESS KIT</small><h2>Official Iruvy Brand &amp; Media Kit</h2><p>Approved brand assets, executive summaries, and product documentation.</p><a href="/en/contact/?product=media">Request Kit →</a></article></div></div></section>`;

// --- CAPACITY LAB ---
const capacityLabKo = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">CAPACITY AUDIT</p><h1>최근 납기 지연 사건 1건으로<br><span>적합성 진단부터 시작합니다</span></h1><p>첫 문의에서 생산 원본 파일을 요구하지 않습니다. 현장의 지연 문제와 데이터 준비 상태를 먼저 검토한 뒤 맞춤 유료 진단을 제안합니다.</p></div></section>
<section class="section"><div class="shell audit-grid"><div><p class="eyebrow dark">WHAT WE REVIEW</p><h2>첫 진단에서 확인하는 4가지</h2><ol class="number-list"><li><span>01</span><b>최근 발생한 돌발 지연 및 병목 사건</b></li><li><span>02</span><b>핵심 제약 공정 및 지평 KPI</b></li><li><span>03</span><b>ERP·MES·Excel 실적 데이터 준비도</b></li><li><span>04</span><b>생산 담당자·검수 및 계약 조건</b></li></ol></div><div class="audit-card"><small>NEXT STEP</small><h2>Capacity Audit 진단 신청</h2><p>회사명과 현장 상황, 최근 발생한 지연 사건 1건을 알려주세요. 민감한 원본 파일은 첨부하지 마세요.</p><a class="button" href="/contact/?product=flow">Flow 진단 상담 작성</a><ul><li>민감한 원본 데이터 첨부 불필요</li><li>안전한 읽기 연동 가능 여부 우선 검토</li><li>무상 개발이 아닌 유료 성과 검증 위주</li></ul></div></div></section>`;

const capacityLabEn = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">CAPACITY AUDIT</p><h1>Diagnose manufacturing fit starting<br><span>from one recent delivery delay event</span></h1><p>We do not request raw production datasets on first contact. We evaluate disruption context and data readiness before proposing a paid audit sprint.</p></div></section>
<section class="section"><div class="shell audit-grid"><div><p class="eyebrow dark">WHAT WE REVIEW</p><h2>Four key areas evaluated during initial review</h2><ol class="number-list"><li><span>01</span><b>Recent disruption &amp; delivery delay incident</b></li><li><span>02</span><b>Critical bottleneck process &amp; economic KPIs</b></li><li><span>03</span><b>ERP, MES, or Excel data readiness</b></li><li><span>04</span><b>Supervisor sign-off &amp; evaluation criteria</b></li></ol></div><div class="audit-card"><small>NEXT STEP</small><h2>Apply for Capacity Audit</h2><p>Tell us your plant location and describe one recent delivery delay event. Do not attach sensitive files.</p><a class="button" href="/en/contact/?product=flow">Flow Audit Request</a><ul><li>No raw production file attachments required</li><li>Read-only data connection feasibility review</li><li>Paid verification sprint over free custom dev</li></ul></div></div></section>`;

// --- CONTACT ---
const contactKo = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">START A CONVERSATION</p><h1>어떤 현장의 업무 조치를<br><span>개선하고자 하시나요?</span></h1><p>목적에 맞는 세부 유형을 선택해주시면, 담당자가 검토 가능한 이메일 문의 초안을 생성해드립니다.</p></div></section>
<section class="section"><div class="shell contact-layout"><div class="contact-choice"><button type="button" class="choice active" data-choice="guide"><small>EXHIBITION &amp; SPACE</small><b>Iruvy Guide</b><span>전시회·행사 동선 적합성 진단</span></button><button type="button" class="choice" data-choice="flow"><small>MANUFACTURING</small><b>Iruvy Flow</b><span>Capacity Audit·제조 현장 진단</span></button><button type="button" class="choice" data-choice="partner"><small>COMPANY</small><b>미디어·파트너십</b><span>보도·기술협력·투자 문의</span></button></div><form class="contact-form" data-contact-form><input type="hidden" name="product" value="guide"><label>회사·기관명<input name="organization" required autocomplete="organization"></label><label>담당자 성함<input name="name" required autocomplete="name"></label><label>회신 이메일<input name="email" type="email" required autocomplete="email"></label><label>문의 및 현장 내용<textarea name="message" rows="6" required placeholder="행사 일정 및 규모, 또는 최근 발생한 제조 납기·병목 지연 사건을 간략히 적어주세요."></textarea></label><label class="consent"><input type="checkbox" required> <span><a href="/privacy/">개인정보 처리방침</a>에 동의합니다.</span></label><button class="button" type="submit">이메일 초안 생성하기</button><p class="form-note" aria-live="polite" data-form-note>민감한 원본 생산 데이터는 첫 문의에 첨부하지 마세요.</p></form></div></section>`;

const contactEn = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">START A CONVERSATION</p><h1>Which operational decisions<br><span>are you looking to optimize?</span></h1><p>Select your inquiry type below to draft a structured email for our team to review.</p></div></section>
<section class="section"><div class="shell contact-layout"><div class="contact-choice"><button type="button" class="choice active" data-choice="guide"><small>EXHIBITION &amp; SPACE</small><b>Iruvy Guide</b><span>Exhibition Visitor Decision Platform</span></button><button type="button" class="choice" data-choice="flow"><small>MANUFACTURING</small><b>Iruvy Flow</b><span>Capacity Audit &amp; Bottleneck Review</span></button><button type="button" class="choice" data-choice="partner"><small>COMPANY</small><b>Media &amp; Partnership</b><span>Press, tech partnership, or investor inquiry</span></button></div><form class="contact-form" data-contact-form><input type="hidden" name="product" value="guide"><label>Organization / Company<input name="organization" required autocomplete="organization"></label><label>Your Name<input name="name" required autocomplete="name"></label><label>Work Email<input name="email" type="email" required autocomplete="email"></label><label>Operational Context / Inquiry<textarea name="message" rows="6" required placeholder="Describe your upcoming event scale, or summarize one recent delivery delay event in your plant."></textarea></label><label class="consent"><input type="checkbox" required> <span>I agree to the <a href="/en/privacy/">Privacy Policy</a>.</span></label><button class="button" type="submit">Draft Email Inquiry</button><p class="form-note" aria-live="polite" data-form-note>Please do not attach sensitive raw production datasets on initial contact.</p></form></div></section>`;

// --- LEGAL ---
const privacyKo = `
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">PRIVACY</p><h1>개인정보 처리방침</h1><p>웹사이트 문의 과정에서 수집된 정보는 문의 대응 목적으로 최소한 처리합니다.</p></div></section><section class="section"><div class="shell prose"><h2>수집 항목 및 이용 목적</h2><p>회사·기관명, 이름, 이메일 주소, 문의 내용을 문의 접수 및 회신 목적으로 이용합니다. 민감한 생산 원본 데이터는 첫 문의 시 수집하지 않습니다.</p><h2>보관 및 파기</h2><p>관계 법령 및 합의된 보관 기간 동안 보관 후 안전하게 파기합니다. 정보 열람 및 삭제 요청은 iruvy.official@gmail.com으로 접수할 수 있습니다.</p><h2>제품 데이터 분리 원칙</h2><p>Guide와 Flow 제품의 고객 데이터는 엄격히 분리되며, 개별 동의 없이 타 제품 모델 학습에 전용하지 않습니다.</p></div></section>`;

const privacyEn = `
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">PRIVACY</p><h1>Privacy Policy</h1><p>Information submitted through website forms is processed strictly for inquiry response purposes.</p></div></section><section class="section"><div class="shell prose"><h2>Collection &amp; Purpose</h2><p>We process organization name, contact name, email address, and inquiry messages strictly to evaluate and respond to your request. We do not collect raw production data on initial web contact.</p><h2>Retention &amp; Deletion</h2><p>Data is stored for the duration required by applicable regulations and agreed business communication, after which it is securely purged. Requests for deletion can be sent to iruvy.official@gmail.com.</p><h2>Product Data Isolation</h2><p>Customer datasets across Guide and Flow are strictly segregated and never repurposed for model training across different products.</p></div></section>`;

const termsKo = `
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">TERMS</p><h1>이용약관</h1><p>본 공개 웹사이트 정보의 이용 범위와 책임 한계를 안내합니다.</p></div></section><section class="section"><div class="shell prose"><h2>사이트 정보의 성격</h2><p>본 웹사이트는 주식회사 이루비의 현재 제품 방향을 안내하며, 정식 계약 체결 전에는 가격, 성능, SLA를 확정 보장하지 않습니다.</p><h2>지식재산권 보호</h2><p>별도 표기가 없는 웹사이트 자산 및 브랜드 상표권은 주식회사 이루비에 귀속됩니다.</p><h2>계약 확정</h2><p>제품 도입 조건 및 서비스 범위는 별도 개별 계약 및 제안서에서 최종 확정됩니다.</p></div></section>`;

const termsEn = `
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">TERMS</p><h1>Terms of Service</h1><p>Terms governing the access and use of information on this public website.</p></div></section><section class="section"><div class="shell prose"><h2>Information Scope</h2><p>This website provides current product directions for Iruvy Inc. Content published here does not constitute a binding guarantee of performance, pricing, or SLA without a formal contract.</p><h2>Intellectual Property</h2><p>All brand assets, content, and trademarks belong to Iruvy Inc. unless otherwise stated.</p><h2>Formal Agreements</h2><p>Specific service scope, SLAs, and commercial terms are established exclusively through executed individual contracts.</p></div></section>`;

const accessibilityKo = `
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">ACCESSIBILITY</p><h1>웹 접근성 원칙</h1><p>모든 사용자가 키보드, 화면 읽기 프로그램, 고대비 환경에서 웹사이트를 이용할 수 있도록 개선합니다.</p></div></section><section class="section"><div class="shell prose"><h2>접근성 기준</h2><p>WCAG 2.2 AA를 실무 기준으로 준수하며 명확한 제목 구조, 키보드 포커스 표시, 충분한 명암 대비를 제공합니다.</p><h2>모션 조절</h2><p>화면 모션은 관계 이해를 돕는 필요 범위로 제한하며, 브라우저의 '동작 줄이기' 설정을 존중합니다.</p><h2>피드백 접수</h2><p>웹 이용 중 보완이 필요한 부분은 iruvy.official@gmail.com으로 편하게 알려주시기 바랍니다.</p></div></section>`;

const accessibilityEn = `
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">ACCESSIBILITY</p><h1>Accessibility Statement</h1><p>Ensuring information accessibility across keyboard navigation, screen readers, and high-contrast settings.</p></div></section><section class="section"><div class="shell prose"><h2>Accessibility Standard</h2><p>We aim to comply with WCAG 2.2 AA guidelines, providing semantic heading structures, visible focus indicators, and sufficient contrast ratios.</p><h2>Reduced Motion</h2><p>UI animations are designed for context clarity and respect user browser preferences for reduced motion.</p><h2>Feedback</h2><p>If you encounter accessibility barriers, please notify us at iruvy.official@gmail.com.</p></div></section>`;

// Pages map for both languages
const pageContent = {
  ko: {
    "": { title: "이루비(Iruvy) | 공간 의사결정 AI", description: "주식회사 이루비는 공간과 상황을 실시간으로 분석하여 최적의 다음 조치를 제안하는 Spatial Decision AI 기업입니다. Iruvy Guide와 Iruvy Flow를 제공합니다.", body: homeKo, pageType: "WebPage" },
    guide: { title: "전시회 AI 에이전트 | Iruvy Guide · 이루비", description: "이루비의 Iruvy Guide는 전시회 방문자의 관심사와 위치를 분석하여 최적의 부스 탐색 동선을 추천하는 Visitor Decision Platform입니다.", body: guideKo, pageType: "WebPage" },
    flow: { title: "제조 생산계획·제약공정 최적화 AI | Iruvy Flow", description: "이루비 Iruvy Flow는 제조 현장의 돌발 정체와 납기 위험을 추적하여 최적의 작업 순서와 복구 대안을 제안하는 산업 자율운영 AI 시스템입니다.", body: flowKo, pageType: "WebPage" },
    evidence: { title: "AI 성과 검증과 Evidence 기준 | 이루비 Iruvy", description: "주식회사 이루비는 기술 실측, 현장 PoC, 과거 데이터 Replay, 유료 검증 및 실제 라이브 운영 성과를 명확히 구분하여 공개합니다.", body: evidenceKo, pageType: "CollectionPage" },
    technology: { title: "공간 의사결정 AI 기술과 신뢰 | 이루비 Iruvy Core", description: "이루비 Iruvy Core는 현장 상태, 목표, 제약 조건을 연결하여 실행 가능한 최적 대안을 계산합니다. Spatial Intelligence와 Decision Intelligence의 구조를 설명합니다.", body: techKo, pageType: "WebPage" },
    company: { title: "Spatial Decision AI 기업 | 이루비(Iruvy) 소개", description: "주식회사 이루비(Iruvy)는 공간과 상황을 이해해 최적의 다음 조치를 계산하는 Spatial Decision AI 개발 기업입니다.", body: companyKo, pageType: "AboutPage" },
    resources: { title: "공간·제조 의사결정 AI 인사이트 | 이루비", description: "전시회 방문 경험, 제조 병목 현장, 공간 의사결정 AI의 경계와 성과 검증법을 실무 관점에서 풀어낸 이루비 인사이트 자료실입니다.", body: resourcesKo, pageType: "CollectionPage" },
    "capacity-lab": { title: "제조 납기·병목 진단 | Iruvy Flow Capacity Audit", description: "최근 발생한 납기 지연 사건 1건을 기준으로 제조 현장의 핵심 제약 공정, 경제 KPI 및 실적 데이터 준비도를 진단합니다.", body: capacityLabKo, pageType: "WebPage" },
    contact: { title: "이루비 Iruvy 도입 상담 | Guide·Flow", description: "전시회 방문자 동선 최적화 Iruvy Guide 및 제조 현장 병목 진단 Iruvy Flow 도입 상담 안내입니다.", body: contactKo, pageType: "ContactPage" },
    privacy: { title: "개인정보 처리방침 | 이루비 Iruvy", description: "주식회사 이루비의 개인정보 처리방침 안내입니다.", body: privacyKo, pageType: "WebPage" },
    terms: { title: "이용약관 | 이루비 Iruvy", description: "주식회사 이루비 웹사이트 이용약관 안내입니다.", body: termsKo, pageType: "WebPage" },
    accessibility: { title: "웹 접근성 원칙 | 이루비 Iruvy", description: "주식회사 이루비의 웹 접근성 준수 원칙 안내입니다.", body: accessibilityKo, pageType: "WebPage" }
  },
  en: {
    "": { title: "Iruvy | Spatial Decision AI", description: "Iruvy Inc. develops Spatial Decision AI calculating Next Best Actions for visitor experience and manufacturing operations. Introducing Iruvy Guide & Iruvy Flow.", body: homeEn, pageType: "WebPage" },
    guide: { title: "Exhibition AI Agent | Iruvy Guide", description: "Iruvy Guide is a Visitor Decision Platform optimizing exhibition booth recommendations and visitor navigation without app downloads.", body: guideEn, pageType: "WebPage" },
    flow: { title: "Industrial Decision AI | Iruvy Flow", description: "Iruvy Flow optimizes manufacturing scheduling and capacity bottlenecks, presenting supervisor-approved recovery options.", body: flowEn, pageType: "WebPage" },
    evidence: { title: "Evidence Framework & Verification | Iruvy", description: "Iruvy transparently categorizes lab measurements, field PoCs, data replays, paid audits, and audited economic outcomes.", body: evidenceEn, pageType: "CollectionPage" },
    technology: { title: "Spatial Decision Core & AI Trust | Iruvy", description: "Iruvy Core connects real-time state, goals, and hard constraints to calculate actionable decision alternatives.", body: techEn, pageType: "WebPage" },
    company: { title: "About Iruvy | Spatial Decision AI Company", description: "Iruvy Inc. builds Spatial Decision AI, pioneering visitor experience optimization and manufacturing capacity amplification.", body: companyEn, pageType: "AboutPage" },
    resources: { title: "Spatial & Industrial Decision Insights | Iruvy", description: "Practitioner insights on visitor mobility, manufacturing capacity bottlenecks, AI boundaries, and empirical verification.", body: resourcesEn, pageType: "CollectionPage" },
    "capacity-lab": { title: "Manufacturing Capacity Audit | Iruvy Flow", description: "Diagnose plant capacity bottlenecks starting from one recent delivery delay event.", body: capacityLabEn, pageType: "WebPage" },
    contact: { title: "Contact Us & Audit Consultation | Iruvy", description: "Consultation request for Iruvy Guide exhibition deployment and Iruvy Flow manufacturing capacity audit.", body: contactEn, pageType: "ContactPage" },
    privacy: { title: "Privacy Policy | Iruvy", description: "Privacy policy and data processing guidelines for Iruvy Inc.", body: privacyEn, pageType: "WebPage" },
    terms: { title: "Terms of Service | Iruvy", description: "Terms of service and website usage rules for Iruvy Inc.", body: termsEn, pageType: "WebPage" },
    accessibility: { title: "Accessibility Statement | Iruvy", description: "Accessibility guidelines and WCAG 2.2 AA commitment for Iruvy Inc.", body: accessibilityEn, pageType: "WebPage" }
  }
};

const routes = ["", "guide", "flow", "evidence", "technology", "resources", "company", "capacity-lab", "contact", "privacy", "terms", "accessibility"];

for (const lang of ["ko", "en"]) {
  for (const route of routes) {
    const info = pageContent[lang][route];
    if (!info) continue;

    const html = renderPage({
      route,
      lang,
      title: info.title,
      description: info.description,
      body: info.body,
      pageType: info.pageType
    });

    const targetDir = lang === "en" ? join(out, "en", route) : join(out, route);
    mkdirSync(targetDir, { recursive: true });
    writeFileSync(join(targetDir, "index.html"), html, "utf8");
  }
}

// Write llms.txt & llms-full.txt
const llmsKo = `Iruvy (이루비) — Spatial Decision AI
공통 도메인: https://iruvy.com/
법인명: 주식회사 이루비 (IRUVY INC.)
주요 이메일: iruvy.official@gmail.com

제품 목록:
- Iruvy Guide: 전시회 방문자 최적 동선 및 부스 맞춤 추천 AI 에이전트 (https://iruvy.com/guide/)
- Iruvy Flow: 제조 현장 돌발 정체 및 납기 위험 최적 복구 순서 계산 AI (https://iruvy.com/flow/)
`;
writeFileSync(join(out, "llms.txt"), llmsKo, "utf8");
writeFileSync(join(out, "llms-full.txt"), llmsKo, "utf8");

console.log("Successfully generated dual-language site (KO & EN) into dist/");
