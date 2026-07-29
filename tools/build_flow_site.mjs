import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const version = `20260730-${Date.now()}`;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
mkdirSync(join(out, "assets"), { recursive: true });
cpSync(join(root, "site-src", "styles.css"), join(out, "assets", "site.css"));
cpSync(join(root, "site-src", "site.js"), join(out, "assets", "site.js"));
cpSync(join(root, "assets", "iruvy-logo.svg"), join(out, "assets", "iruvy-logo.svg"));
cpSync(join(root, "assets", "og.jpg"), join(out, "assets", "og.jpg"));
cpSync(join(root, "assets", "hero-spatial-decision.jpg"), join(out, "assets", "hero-spatial-decision.jpg"));
cpSync(join(root, "assets", "guide-exhibition.jpg"), join(out, "assets", "guide-exhibition.jpg"));
cpSync(join(root, "assets", "flow-factory.jpg"), join(out, "assets", "flow-factory.jpg"));
cpSync(join(root, "assets", "fonts-web", "Pretendard-Regular.woff2"), join(out, "assets", "Pretendard-Regular.woff2"));
cpSync(join(root, "assets", "fonts-web", "Pretendard-SemiBold.woff2"), join(out, "assets", "Pretendard-SemiBold.woff2"));
cpSync(join(root, "favicon.ico"), join(out, "favicon.ico"));

const routes = [
  ["", "홈"], ["guide", "Iruvy Guide"], ["flow", "Iruvy Flow"],
  ["evidence", "성과"], ["technology", "기술·신뢰"], ["resources", "인사이트"],
  ["company", "회사"], ["contact", "도입 상담"],
];

const nav = `
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav" data-nav-toggle>메뉴</button>
  <nav class="nav" id="nav" aria-label="주요 메뉴" data-nav>
    <div class="nav-products">
      <button class="nav-product-trigger" type="button" aria-expanded="false" data-product-toggle>솔루션 <span aria-hidden="true">⌄</span></button>
      <div class="nav-product-menu" data-product-menu>
        <a href="/guide/"><b>Iruvy Guide</b><span>방문자 경험과 이동 최적화</span></a>
        <a href="/flow/"><b>Iruvy Flow</b><span>산업현장 운영 의사결정 최적화</span></a>
      </div>
    </div>
    <a href="/evidence/">성과</a>
    <a href="/technology/">기술·신뢰</a>
    <a href="/resources/">인사이트</a>
    <a href="/company/">회사</a>
    <a class="button button-small" href="/contact/">도입 상담</a>
  </nav>`;

const header = `
<a class="skip-link" href="#main">본문으로 이동</a>
<header class="site-header" data-header>
  <div class="shell header-inner">
    <a class="brand" href="/" aria-label="이루비 Iruvy 홈"><img src="/assets/iruvy-logo.svg" alt="이루비 Iruvy" width="113" height="34"></a>
    ${nav}
  </div>
</header>`;

const footer = `
<footer class="site-footer">
  <div class="shell footer-grid">
    <div class="footer-lead">
      <a class="brand invert" href="/" aria-label="이루비 Iruvy 홈"><img src="/assets/iruvy-logo.svg" alt="이루비 Iruvy" width="113" height="34"></a>
      <p>공간과 상황을 이해해 다음 최적 행동을 결정하는 Spatial Decision AI를 개발합니다.</p>
    </div>
    <div><strong>솔루션</strong><a href="/guide/">Iruvy Guide</a><a href="/flow/">Iruvy Flow</a></div>
    <div><strong>검증</strong><a href="/evidence/">Evidence</a><a href="/technology/">기술·신뢰</a><a href="/accessibility/">웹 접근성</a></div>
    <div><strong>회사</strong><a href="/company/">회사 소개</a><a href="/resources/">인사이트</a><a href="/contact/">도입 상담</a></div>
  </div>
  <div class="shell footer-bottom">
    <span>© 2026 IRUVY INC. <time datetime="2026-07-30">사이트 업데이트 2026.07.30</time></span>
    <span><a href="mailto:iruvy.official@gmail.com">iruvy.official@gmail.com</a> · <a href="/privacy/">개인정보 처리방침</a> · <a href="/terms/">이용약관</a></span>
  </div>
</footer>`;

const siteOrigin = "https://iruvy.com";
const lastModified = "2026-07-30";
const pageLabels = {
  "": "Iruvy",
  guide: "Iruvy Guide",
  flow: "Iruvy Flow",
  evidence: "성과와 Evidence",
  technology: "기술과 신뢰",
  company: "회사 소개",
  resources: "인사이트와 자료실",
  "capacity-lab": "Capacity Audit",
  contact: "도입 상담",
  privacy: "개인정보 처리방침",
  terms: "이용약관",
  accessibility: "웹 접근성",
};

const pageUrl = (route = "") => `${siteOrigin}/${route ? `${route}/` : ""}`;
const imageUrl = (file) => `${siteOrigin}/assets/${file}`;

const organizationSchema = {
  "@type": "Organization",
  "@id": `${siteOrigin}/#organization`,
  name: "Iruvy",
  alternateName: "이루비",
  legalName: "주식회사 이루비",
  url: `${siteOrigin}/`,
  logo: {
    "@type": "ImageObject",
    url: imageUrl("iruvy-logo.svg"),
  },
  image: imageUrl("og.jpg"),
  description: "공간과 상황을 이해해 다음 최적 행동을 결정하는 Spatial Decision AI를 개발하는 기업",
  email: "iruvy.official@gmail.com",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales and customer support",
    email: "iruvy.official@gmail.com",
    availableLanguage: "Korean",
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
  description: "Iruvy Spatial Decision AI 공식 웹사이트",
  inLanguage: "ko-KR",
  publisher: { "@id": `${siteOrigin}/#organization` },
};

const entitySchema = (route) => {
  if (route === "guide") {
    return {
      "@type": "SoftwareApplication",
      "@id": `${pageUrl(route)}#software`,
      name: "Iruvy Guide",
      url: pageUrl(route),
      image: imageUrl("guide-exhibition.jpg"),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "방문자의 관심과 위치를 이해해 다음 부스·콘텐츠·동선을 추천하는 전시회 AI 에이전트",
      provider: { "@id": `${siteOrigin}/#organization` },
      audience: [
        { "@type": "BusinessAudience", audienceType: "산업·기업 전시회 주최사와 전시장" },
        { "@type": "Audience", audienceType: "전시회 방문자와 참가기업" },
      ],
      featureList: [
        "앱 설치가 필요 없는 QR 웹",
        "지도와 검색",
        "승인된 원문 기반 콘텐츠",
        "개인화 추천과 동선",
        "저장과 상담 연결",
      ],
    };
  }
  if (route === "flow") {
    return {
      "@type": "SoftwareApplication",
      "@id": `${pageUrl(route)}#software`,
      name: "Iruvy Flow",
      alternateName: "Iruvy Flow — Industrial Autonomy and Capacity Amplification System",
      url: pageUrl(route),
      image: imageUrl("flow-factory.jpg"),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "산업현장의 사람·설비·자재·로봇을 최적화하는 산업현장 자율운영 및 유효 생산능력 증폭 AI 시스템",
      provider: { "@id": `${siteOrigin}/#organization` },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "주문생산형·다품종 소량생산 중소·중견 이산제조 사업장",
      },
      featureList: [
        "납기 위험과 병목 조기 발견",
        "작업순서와 자원배치 대안 비교",
        "읽기 중심 데이터 연결",
        "생산관리자 승인형 추천",
        "결정과 실제 결과 기록",
      ],
    };
  }
  if (route === "capacity-lab") {
    return {
      "@type": "Service",
      "@id": `${pageUrl(route)}#service`,
      name: "Iruvy Flow Capacity Audit",
      url: pageUrl(route),
      serviceType: "제조현장 납기·병목·데이터 준비도 진단",
      description: "최근 납기 지연 사건 한 건에서 핵심 제약공정, 경제 KPI, 데이터 준비도와 검증 조건을 확인하는 진단",
      provider: { "@id": `${siteOrigin}/#organization` },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "생산관리자·공장장·제조 경영진",
      },
    };
  }
  return null;
};

const makeSchema = ({ route = "", title, description, pageType = "WebPage" }) => {
  const url = pageUrl(route);
  const breadcrumb = route ? {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Iruvy", item: `${siteOrigin}/` },
      { "@type": "ListItem", position: 2, name: pageLabels[route], item: url },
    ],
  } : null;
  const entity = entitySchema(route);
  const webPage = {
    "@type": pageType,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "ko-KR",
    isPartOf: { "@id": `${siteOrigin}/#website` },
    about: { "@id": `${siteOrigin}/#organization` },
    publisher: { "@id": `${siteOrigin}/#organization` },
    dateModified: lastModified,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl(route === "guide" ? "guide-exhibition.jpg" : route === "flow" ? "flow-factory.jpg" : "og.jpg"),
    },
    ...(breadcrumb ? { breadcrumb: { "@id": breadcrumb["@id"] } } : {}),
    ...(entity ? { mainEntity: { "@id": entity["@id"] } } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      websiteSchema,
      ...(breadcrumb ? [breadcrumb] : []),
      ...(entity ? [entity] : []),
      webPage,
    ],
  };
};

const page = ({
  route = "",
  title,
  description,
  body,
  pageType = "WebPage",
  robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
}) => {
  const canonical = pageUrl(route);
  const socialImage = route === "guide" ? "guide-exhibition.jpg" : route === "flow" ? "flow-factory.jpg" : "og.jpg";
  const socialImageWidth = route === "guide" || route === "flow" ? 1448 : 1731;
  const socialImageHeight = route === "guide" || route === "flow" ? 1086 : 909;
  const socialImageAlt = route === "guide"
    ? "산업 전시회 방문자의 이동 경로를 표현한 Iruvy Guide 이미지"
    : route === "flow"
      ? "정밀 제조 현장의 병목 경로를 표현한 Iruvy Flow 이미지"
      : "현장의 다음 최적 행동을 계산하는 Iruvy Spatial Decision AI";
  const schema = makeSchema({ route, title, description, pageType });
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="${robots}">
  <meta name="author" content="Iruvy">
  <meta name="application-name" content="Iruvy">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="ko" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <link rel="alternate" type="text/plain" href="/llms.txt" title="Iruvy AI context">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Iruvy">
  <meta property="og:locale" content="ko_KR">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${imageUrl(socialImage)}">
  <meta property="og:image:secure_url" content="${imageUrl(socialImage)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="${socialImageWidth}">
  <meta property="og:image:height" content="${socialImageHeight}">
  <meta property="og:image:alt" content="${socialImageAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl(socialImage)}">
  <meta name="twitter:image:alt" content="${socialImageAlt}">
  <meta name="theme-color" content="#0c0a12">
  ${route === "" ? '<link rel="preload" as="image" href="/assets/hero-spatial-decision.jpg">' : route === "guide" ? '<link rel="preload" as="image" href="/assets/guide-exhibition.jpg">' : route === "flow" ? '<link rel="preload" as="image" href="/assets/flow-factory.jpg">' : ""}
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/assets/site.css?v=${version}">
  <script src="/assets/site.js?v=${version}" defer></script>
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
</head>
<body>${header}<main id="main">${body}</main>${footer}</body>
</html>`;
};

const statusPill = (label, tone = "") => `<span class="status ${tone}">${label}</span>`;

const home = `
<section class="hero hero-cinematic">
  <img class="hero-media" src="/assets/hero-spatial-decision.jpg" alt="산업 전시 공간과 정밀 제조 현장을 하나의 선택 경로로 연결한 장면" width="1586" height="992" fetchpriority="high">
  <div class="hero-scrim" aria-hidden="true"></div>
  <div class="shell hero-content" data-reveal>
    <p class="eyebrow">SPATIAL DECISION AI</p>
    <h1>현장의 다음<br><em>최적 행동</em>을<span class="mobile-break"><br></span> 계산합니다</h1>
    <p class="lede">공간과 운영 상태를 읽고, 목표와 제약 안에서 다음 행동을 제안합니다.</p>
    <div class="actions"><a class="button" href="/guide/">Iruvy Guide</a><a class="button ghost" href="/flow/">Iruvy Flow</a></div>
  </div>
</section>

<section class="signal-band" aria-label="Iruvy의 제품 구조">
  <div class="shell signal-grid">
    <div><span>Visitor</span><b>관심과 위치에서<br>다음 경험으로</b></div>
    <div class="signal-core"><span>Spatial Decision Core</span><b>State + Goal + Constraints<br>Next Best Action</b></div>
    <div><span>Industry</span><b>제약과 예외에서<br>다음 운영 결정으로</b></div>
  </div>
</section>

<section class="decision-story">
  <div class="shell story-grid">
    <div class="story-sticky">
      <p class="eyebrow">DECISION, NOT ANOTHER DASHBOARD</p>
      <h2>기록된 상태를<br>실행할 결정으로</h2>
      <p>기존 시스템 위에서 지금 가능한 선택을 비교하고, 사람이 실행할 한 가지 행동을 분명하게 만듭니다.</p>
      <a class="text-link" href="/technology/">Iruvy Core 보기</a>
    </div>
    <div class="story-steps">
      <article data-reveal>
        <span>현재 상태</span>
        <h3>현실을 한 시점으로 연결합니다</h3>
        <p>사람, 공간, 설비, 작업과 시간을 현재 상태로 묶습니다.</p>
        <div class="state-ribbon" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      </article>
      <article data-reveal>
        <span>목표와 제약</span>
        <h3>좋아 보이는 답을 지웁니다</h3>
        <p>시간, 위치, 안전, 품질과 운영 규칙을 통과한 행동만 남깁니다.</p>
        <div class="constraint-words" aria-hidden="true"><b>TIME</b><b>SPACE</b><b>SAFETY</b><b>QUALITY</b></div>
      </article>
      <article class="story-selected" data-reveal>
        <span>다음 행동</span>
        <h3>사람이 결정할 대안을 제시합니다</h3>
        <p>근거와 예상 결과를 함께 보고 수정, 승인 또는 거절합니다.</p>
        <div class="choice-line" aria-hidden="true"><i></i><i></i><i class="selected"></i></div>
      </article>
    </div>
  </div>
</section>

<section class="product-worlds">
  <div class="shell">
    <div class="section-head"><h2>하나의 질문.<br>서로 다른 두 현장.</h2><p>공통 기술은 공유하고 고객, 원본 데이터와 학습권은 분리합니다.</p></div>
    <article class="world world-guide" data-reveal>
      <div class="world-media"><img src="/assets/guide-exhibition.jpg" alt="산업 전시회에서 모바일 가이드를 확인하며 이동하는 방문자" width="1448" height="1086" loading="lazy"></div>
      <div class="world-copy">
        <span>IRUVY GUIDE</span>
        <h3>관심에서<br>다음 방문으로</h3>
        <p>방문자의 관심, 위치와 남은 시간을 읽어 다음 부스와 콘텐츠, 동선을 추천합니다.</p>
        <a href="/guide/">Guide 살펴보기</a>
      </div>
    </article>
    <article class="world world-flow" data-reveal>
      <div class="world-copy">
        <span>IRUVY FLOW</span>
        <h3>차질에서<br>복구 결정으로</h3>
        <p>설비, 작업, 자재와 납기 제약을 연결해 생산관리자가 검토할 복구 대안을 계산합니다.</p>
        <a href="/flow/">Flow 살펴보기</a>
      </div>
      <div class="world-media"><img src="/assets/flow-factory.jpg" alt="정밀 제조 현장에서 생산 일정을 검토하는 관리자와 엔지니어" width="1448" height="1086" loading="lazy"></div>
    </article>
  </div>
</section>

<section class="operating-loop">
  <div class="shell">
    <h2>Sense <span>World</span> Decide <span>Act</span> Proof</h2>
    <div class="loop-copy">
      <p>현장을 읽고 가능한 행동을 비교합니다.</p>
      <p>사람의 결정과 실제 결과를 다음 판단의 근거로 남깁니다.</p>
    </div>
  </div>
</section>

<section class="trust-manifesto">
  <div class="shell trust-layout">
    <div>
      <h2>자동화보다 먼저,<br>통제 가능한 결정</h2>
      <p>과장된 자율성보다 현재 검증 가능한 범위를 정확히 말합니다.</p>
      <a class="text-link" href="/evidence/">Evidence 체계 보기</a>
    </div>
    <dl>
      <div><dt>기존 시스템</dt><dd>교체하지 않음</dd></div>
      <div><dt>초기 연결</dt><dd>읽기 중심</dd></div>
      <div><dt>최종 결정</dt><dd>관리자 최종 승인</dd></div>
      <div><dt>제품 데이터</dt><dd>Guide와 Flow 분리</dd></div>
      <div><dt>개인 감시</dt><dd>기본 범위에서 제외</dd></div>
    </dl>
  </div>
</section>

<section class="final-cta">
  <div class="shell">
    <h2>어떤 현장의 다음 결정을<br>개선하시나요?</h2>
    <div class="actions center"><a class="button pale" href="/contact/?product=guide">전시 도입 상담</a><a class="button outline-light" href="/contact/?product=flow">제조 현장 진단</a></div>
  </div>
</section>`;

const guide = `
<section class="product-hero product-hero-guide">
  <img src="/assets/guide-exhibition.jpg" alt="산업 전시회에서 모바일 가이드를 확인하며 이동하는 방문자" width="1448" height="1086" fetchpriority="high">
  <div class="product-hero-scrim"></div>
  <div class="shell product-hero-content" data-reveal>
    <p class="eyebrow">IRUVY GUIDE</p>
    <h1>관심에서<br><em>다음 방문</em>으로</h1>
    <p>방문자의 관심, 위치와 시간을 읽어 다음 부스와 콘텐츠, 동선을 추천합니다.</p>
    <a class="button" href="/contact/?product=guide">행사 적합성 진단</a>
  </div>
</section>

<section class="guide-route" id="journey">
  <div class="shell">
    <h2>설치 없이 시작하고,<br>행동으로 이어집니다</h2>
    <div class="route-stage" aria-label="Iruvy Guide 방문 흐름">
      <div class="route-line" aria-hidden="true"></div>
      <article data-reveal><b>관심을 묻습니다</b><p>보고 싶은 산업, 제품과 남은 시간을 확인합니다.</p></article>
      <article data-reveal><b>동선을 제안합니다</b><p>현재 위치에서 방문 가치가 높은 부스를 연결합니다.</p></article>
      <article data-reveal><b>근거를 설명합니다</b><p>승인된 기업과 제품 자료에서 필요한 정보를 보여줍니다.</p></article>
      <article data-reveal><b>상담으로 연결합니다</b><p>저장, 자료 요청과 동의 기반 상담을 이어갑니다.</p></article>
    </div>
  </div>
</section>

<section class="stakeholder-stage">
  <div class="shell">
    <div class="section-head"><h2>한 번의 방문.<br>세 개의 다른 가치.</h2></div>
    <div class="tab-shell editorial-tabs" data-tabs>
      <div class="tabs" role="tablist">
        <button role="tab" aria-selected="true" aria-controls="visitor" id="tab-visitor">방문자</button>
        <button role="tab" aria-selected="false" aria-controls="organizer" id="tab-organizer">주최자</button>
        <button role="tab" aria-selected="false" aria-controls="exhibitor" id="tab-exhibitor">참가기업</button>
      </div>
      <div class="tab-panel" role="tabpanel" id="visitor" aria-labelledby="tab-visitor">
        <span>VISITOR</span><h3>짧은 시간에<br>놓치지 않는 경험</h3>
        <p>관심, 시간과 위치에 맞는 부스와 콘텐츠를 발견합니다.</p>
        <div class="feature-chips"><span>개인화 동선</span><span>근거 있는 설명</span><span>웹 접근</span></div>
      </div>
      <div class="tab-panel" role="tabpanel" id="organizer" aria-labelledby="tab-organizer" hidden>
        <span>ORGANIZER</span><h3>감이 아니라<br>방문 흐름으로 개선</h3>
        <p>검색 실패, 관심과 동선 신호를 다음 행사 운영에 반영합니다.</p>
        <div class="feature-chips"><span>콘텐츠 승인</span><span>방문 흐름</span><span>결과 리포트</span></div>
      </div>
      <div class="tab-panel" role="tabpanel" id="exhibitor" aria-labelledby="tab-exhibitor" hidden>
        <span>EXHIBITOR</span><h3>관심을<br>상담으로 연결</h3>
        <p>승인된 기업 자료를 설명하고 동의 기반 후속 행동을 만듭니다.</p>
        <div class="feature-chips"><span>기업 안내</span><span>자료 요청</span><span>상담 연결</span></div>
      </div>
    </div>
  </div>
</section>

<section class="scope-story">
  <div class="shell scope-layout">
    <div>
      <h2>가치가 검증된<br>순서로 만듭니다</h2>
      <p>첫 제품은 행사 당일 실제로 쓰이는 웹 경험에 집중합니다.</p>
    </div>
    <div class="scope-track">
      <article><span>FIRST WEDGE</span><h3>QR 웹, 지도, 검색</h3><p>앱 설치 없이 시작하는 기본 경험</p></article>
      <article><span>VALIDATING</span><h3>추천, 동선, 상담</h3><p>추천이 실제 방문과 전환으로 이어지는지 검증</p></article>
      <article><span>AFTER VALUE</span><h3>정밀 위치, WebAR</h3><p>가치가 확인된 구역에 선택적으로 적용</p></article>
    </div>
  </div>
</section>

<section class="grounded-statement">
  <div class="shell">
    <h2>설명은 승인된 원문에 고정합니다</h2>
    <p>AI 생성 콘텐츠는 담당자 승인 이후 공개합니다. 방문자 원본 데이터는 Flow 학습에 사용하지 않습니다.</p>
    <div class="grounded-points"><span>출처 연결</span><span>담당자 승인</span><span>동의 기반</span><span>제품 간 분리</span></div>
  </div>
</section>

<section class="final-cta"><div class="shell"><h2>다음 행사에서 무엇을<br>먼저 검증할까요?</h2><a class="button pale" href="/contact/?product=guide">행사 적합성 진단</a></div></section>`;

const flow = `
<section class="product-hero product-hero-flow">
  <img src="/assets/flow-factory.jpg" alt="정밀 제조 현장에서 생산 일정을 검토하는 관리자와 엔지니어" width="1448" height="1086" fetchpriority="high">
  <div class="product-hero-scrim"></div>
  <div class="shell product-hero-content" data-reveal>
    <p class="eyebrow">IRUVY FLOW</p>
    <h1>차질에서<br><em>복구 결정</em>으로</h1>
    <p>제약과 납기 위험을 읽고 생산관리자가 검토할 작업 대안을 계산합니다.</p>
    <a class="button" href="/capacity-lab/">Capacity Audit</a>
  </div>
</section>

<section class="disturbance-story">
  <div class="shell disturbance-grid">
    <div class="disturbance-sticky">
      <span>WHEN THE PLAN BREAKS</span>
      <h2>설비가 멈춘 뒤<br>무엇을 바꿀 것인가</h2>
      <p>하나의 사건이 주문, 공정과 납기에 미치는 영향을 따라갑니다.</p>
    </div>
    <div class="disturbance-cases">
      <article data-reveal><b>설비 고장</b><p>대체 설비와 작업순서 변경의 영향을 비교합니다.</p></article>
      <article data-reveal><b>긴급 주문</b><p>새 우선순위가 기존 약속 납기와 충돌하는 지점을 찾습니다.</p></article>
      <article data-reveal><b>자재와 외주 지연</b><p>가능한 작업을 다시 배열하고 다음 병목을 예상합니다.</p></article>
      <article data-reveal><b>인력 부족</b><p>역할과 기술등급 제약 안에서 실행 가능한 대안을 남깁니다.</p></article>
    </div>
  </div>
</section>

<section class="flow-transform">
  <div class="shell">
    <div class="transform-input">
      <span>현장 상태</span>
      <h2>주문. 공정. 설비.<br>자재. 외주. 시간.</h2>
    </div>
    <div class="transform-axis" aria-hidden="true"><i></i></div>
    <div class="transform-output">
      <span>결정 대안</span>
      <h2>위험 주문.<br>병목 이동.<br>복구 선택.</h2>
      <p>각 대안의 납기, 잔업, 외주와 실행 가능성을 함께 비교합니다.</p>
    </div>
  </div>
</section>

<section class="flow-boundary">
  <div class="shell">
    <div class="section-head"><h2>작게 연결하고,<br>섀도 모드에서 증명합니다</h2></div>
    <div class="boundary-editorial">
      <article><b>읽기 중심</b><p>CSV, Excel과 기존 시스템에서 필요한 데이터만 연결합니다.</p></article>
      <article><b>관리자 승인</b><p>시스템은 추천하고 생산관리자가 수정, 승인 또는 거절합니다.</p></article>
      <article><b>한 제약공정</b><p>한 사업장, 한 가치흐름과 1-2개 의사결정부터 시작합니다.</p></article>
      <article><b>자동제어 제외</b><p>현재 단계에서 PLC와 설비를 직접 제어하지 않습니다.</p></article>
    </div>
    <p class="boundary-note">현재 외부 단계는 L0 Observe에서 L1 Recommend입니다.</p>
  </div>
</section>

<section class="fit-stage">
  <div class="shell fit-layout">
    <div>
      <h2>모든 공장을 위한<br>첫 제품은 아닙니다</h2>
      <p>주문생산과 다품종 소량 환경의 반복되는 예외부터 검증합니다.</p>
    </div>
    <div class="fit-columns">
      <article><span>적합한 현장</span><h3>데이터와 결정권자가 함께 있는 곳</h3><p>예외와 재계획이 잦고 ERP, MES 또는 Excel 실적을 연결할 수 있는 현장</p></article>
      <article><span>현재 부적합</span><h3>즉시 무인 자동화를 원하는 곳</h3><p>전체 시스템 교체, 개인 감시 또는 담당자 없는 무료 개발을 원하는 현장</p></article>
    </div>
  </div>
</section>

<section class="final-cta"><div class="shell"><h2>최근 납기 지연 사건 1건에서<br>진단을 시작합니다</h2><a class="button pale" href="/capacity-lab/">Capacity Audit</a></div></section>`;

const evidence = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">EVIDENCE &amp; TRUST</p><h1>성과를 크게 말하기 전에,<br><span>검증 단계를 정확히 표시합니다</span></h1><p>측정, 현장 PoC, 고객 데이터 Replay, 유료 검증, 라이브 운영과 경제성과를 서로 다른 증거로 관리합니다.</p></div></section>
<section class="section"><div class="shell"><div class="evidence-levels"><article>${statusPill("MEASURED","measured")}<h2>실측</h2><p>실제 환경에서 측정된 기술 성과. 적용 범위와 방법, 한계를 함께 기록합니다.</p></article><article>${statusPill("FIELD PoC","current")}<h2>현장 PoC</h2><p>제한된 고객 환경에서 제품 가설을 검증한 단계입니다.</p></article><article>${statusPill("CUSTOMER REPLAY","validating")}<h2>고객 데이터 Replay</h2><p>과거 데이터를 재생한 결과로, 라이브 운영 KPI와 구분합니다.</p></article><article>${statusPill("PAID AUDIT / SPRINT")}<h2>유료 검증</h2><p>대가·데이터·기준 KPI·검수 범위가 합의된 검증입니다.</p></article><article>${statusPill("LIVE")}<h2>라이브 운영</h2><p>실제 업무에 반영된 결과와 외부요인을 함께 기록합니다.</p></article><article>${statusPill("VERIFIED OUTCOME")}<h2>검증된 경제성과</h2><p>합의된 기준선과 Outcome Ledger로 검증한 증분 가치입니다.</p></article></div></div></section>
<section class="section tinted"><div class="shell two-col"><div><p class="eyebrow dark">PUBLIC EVIDENCE POLICY</p><h2>숫자보다 먼저 공개할 것</h2></div><div class="evidence-fields"><span>지표 정의</span><span>측정 기간·표본</span><span>기준선</span><span>데이터 출처</span><span>측정 방법</span><span>한계</span><span>승인 책임자</span><span>마지막 검토일</span></div></div></section>
<section class="section"><div class="shell"><div class="empty-evidence"><p class="eyebrow dark">CURRENT PUBLIC REGISTER</p><h2>제품별 외부 공개 성과는 근거 정합성 검토 중입니다</h2><p>Guide와 Flow의 성과 수치를 하나의 숫자판에 섞지 않습니다. 원자료·범위·승인 상태가 확인된 항목만 이 레지스트리에 순차 공개합니다.</p><a class="button dark-button" href="/contact/?product=media">근거·미디어 문의</a></div></div></section>`;

const technology = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">IRUVY CORE</p><h1>상태·목표·제약을 연결해<br><span>실행 가능한 대안을 계산합니다</span></h1><p>Spatial Intelligence × Decision Intelligence. Guide와 Flow가 공유할 기술 구조와 각 제품이 분리해야 할 데이터 경계를 함께 설계합니다.</p></div></section>
<section class="section"><div class="shell"><div class="core-grid"><article><span>01</span><h2>Reality Graph</h2><p>현장의 객체·관계·공간을 공통 언어로 모델링합니다.</p></article><article><span>02</span><h2>Context Engine</h2><p>현재 상태와 변화, 예외 사건과 불확실성을 추적합니다.</p></article><article><span>03</span><h2>Strategy Simulation</h2><p>가능한 행동과 예상 결과를 목표·제약 안에서 비교합니다.</p></article><article><span>04</span><h2>Outcome Loop</h2><p>승인·실행·실제 결과와 외부요인을 기록합니다.</p></article></div></div></section>
<section class="section process"><div class="shell"><div class="section-head light"><p class="eyebrow">AI BOUNDARY</p><h2>설명하는 AI와 계산하는 계층을 구분합니다</h2></div><div class="ai-boundary"><article><small>LANGUAGE AI</small><h3>문서 구조화·질의·근거 설명</h3><p>승인된 자료를 구조화하고 추천의 가정과 차이를 사람이 이해하도록 설명합니다.</p></article><article><small>VERIFIABLE COMPUTATION</small><h3>제약·작업순서·자원배치</h3><p>하드 제약과 계획은 규칙·통계·수리최적화·시뮬레이션 등 검증 가능한 계산 계층이 담당합니다.</p></article></div></div></section>
<section class="section"><div class="shell two-col"><div><p class="eyebrow dark">DATA &amp; HUMAN CONTROL</p><h2>공유 코어와<br>제품 데이터의 경계</h2><p>Guide와 Flow는 공간·지식·의사결정 인터페이스의 공통 기술 후보를 공유하지만 고객·원본 데이터·도메인 모델과 학습권은 분리합니다.</p></div><div class="trust-list"><span>고객별 데이터 격리</span><span>Guide 방문자 데이터의 Flow 학습 금지</span><span>최소수집·권한·보관·삭제</span><span>관리자 수정·거절·승인</span><span>데이터 부족 시 판단 기권</span><span>평가·승격·롤백 통제</span></div></div></section>`;

const company = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">ABOUT IRUVY</p><h1>공간과 상황을 이해해<br><span>다음 최적 행동을 결정합니다</span></h1><p>주식회사 이루비는 Spatial Decision AI를 개발하는 기업입니다. 방문자의 경험과 이동을 최적화하는 Iruvy Guide와 산업현장의 운영을 최적화하는 Iruvy Flow를 만듭니다.</p></div></section>
<section class="section"><div class="shell two-col"><div><p class="eyebrow dark">MISSION</p><h2>복잡한 현실을<br>실행 가능한 결정으로</h2></div><div class="manifesto"><p>현장은 정적인 데이터가 아닙니다. 사람과 설비, 공간과 시간이 계속 바뀌고, 좋은 결정은 목표와 제약을 동시에 이해해야 합니다.</p><p>Iruvy는 무엇이 일어났는지를 보여주는 데서 멈추지 않고, 지금 가능한 행동을 비교하고 그 결과를 다음 결정의 근거로 남깁니다.</p></div></div></section>
<section class="section tinted"><div class="shell"><div class="section-head"><p class="eyebrow dark">ONE COMPANY, TWO FRONTS</p><h2>빠른 상용화와 장기 고부가가치를 함께 설계합니다</h2></div><div class="company-products"><article><small>COMMERCIALIZATION FRONT</small><h3>Iruvy Guide</h3><p>산업 전시회에서 앱 설치 없는 방문자 의사결정 경험을 반복 배포합니다.</p></article><article><small>HIGH-VALUE FRONT</small><h3>Iruvy Flow</h3><p>주문생산형 제조의 한 제약공정에서 유효 생산능력 증폭을 검증합니다.</p></article></div></div></section>
<section class="section"><div class="shell"><div class="section-head"><p class="eyebrow dark">OUR PRINCIPLES</p><h2>현재와 비전을 분리하고, 결과로 학습합니다</h2></div><div class="principle-grid"><article><span>01</span><h3>증명 전에는 가설</h3><p>목표·가격·성과를 현재 사실처럼 표현하지 않습니다.</p></article><article><span>02</span><h3>사람이 최종 결정</h3><p>현재 제품은 관찰과 추천 단계에서 안전하게 검증합니다.</p></article><article><span>03</span><h3>원본과 학습권 분리</h3><p>제품과 고객을 넘어 데이터를 임의로 전용하지 않습니다.</p></article><article><span>04</span><h3>행동과 결과를 연결</h3><p>승인만이 아니라 실행·결과·외부요인을 함께 기록합니다.</p></article></div></div></section>
<section class="final-cta"><div class="shell"><p class="eyebrow">LONG-TERM VISION</p><h2>산업현장의 숨은 생산능력을<br>실행으로 깨우는 자율운영 AI</h2><p>현재의 L1 추천형 제품에서 충분한 검증과 통제를 거쳐 단계적으로 확장합니다.</p><a class="button pale" href="/contact/?product=partner">파트너십 문의</a></div></section>`;

const resources = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">INSIGHTS &amp; RESOURCES</p><h1>고객의 문제 언어로<br><span>Spatial Decision AI를 설명합니다</span></h1><p>전시 방문 경험, 제조 병목, 의사결정 AI의 경계와 검증 방법을 실무 관점에서 정리합니다.</p></div></section>
<section class="section"><div class="shell"><div class="resource-grid"><article><small>DECISION LAYER</small><h2>ERP·MES 위에 의사결정 계층이 필요한 이유</h2><p>기록 시스템과 예외 대응 시스템의 역할을 구분합니다.</p><span>준비 중</span></article><article><small>GUIDE METHOD</small><h2>전시회 방문자가 핵심 부스를 놓치는 이유</h2><p>정보 과다에서 관심·시간·위치 기반 추천이 필요한 이유를 설명합니다.</p><span>준비 중</span></article><article><small>EVIDENCE</small><h2>고객 데이터 Replay와 실제 KPI의 차이</h2><p>데모, 과거 데이터 재생, 섀도, 라이브 성과를 구분하는 법을 다룹니다.</p><span>준비 중</span></article><article><small>CAPACITY</small><h2>최근 납기 지연 사건 1건으로 병목을 진단하는 법</h2><p>Capacity Audit의 첫 질문과 필요한 데이터 범위를 소개합니다.</p><span>준비 중</span></article><article><small>TRUST</small><h2>Human-in-the-loop와 데이터 격리 원칙</h2><p>사람의 결정권과 제품별 원본 데이터 경계를 설명합니다.</p><span>준비 중</span></article><article><small>PRESS KIT</small><h2>Iruvy 브랜드·회사 소개 자료</h2><p>승인된 회사·제품 소개문과 로고 자산을 제공합니다.</p><a href="/contact/?product=media">자료 요청 →</a></article></div></div></section>`;

const capacityLab = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">CAPACITY AUDIT</p><h1>최근 납기 지연 사건 1건으로<br><span>적합성부터 판단합니다</span></h1><p>원본 생산 데이터를 첫 문의에 받지 않습니다. 현장 문제와 데이터 준비도를 먼저 확인한 뒤 유료 진단 범위를 제안합니다.</p></div></section>
<section class="section"><div class="shell audit-grid"><div><p class="eyebrow dark">WHAT WE REVIEW</p><h2>첫 미팅에서 확인하는 네 가지</h2><ol class="number-list"><li><span>01</span><b>최근 발생한 지연·병목 사건</b></li><li><span>02</span><b>핵심 제약공정과 경제 KPI</b></li><li><span>03</span><b>ERP·MES·Excel 데이터 준비도</b></li><li><span>04</span><b>담당자·검수·구매 조건</b></li></ol></div><div class="audit-card"><small>NEXT STEP</small><h2>진단 신청</h2><p>회사·현장·최근 사건만 간단히 알려주세요. 민감한 원본 파일은 보내지 마세요.</p><a class="button" href="/contact/?product=flow">Flow 상담 작성</a><ul><li>원본 데이터 첨부 없음</li><li>읽기 중심 연결 검토</li><li>무료 PoC가 아닌 유료 검증 우선</li></ul></div></div></section>`;

const contact = `
<section class="simple-hero"><div class="shell"><p class="eyebrow">START A CONVERSATION</p><h1>어떤 현장의 다음 결정을<br><span>개선하시나요?</span></h1><p>제품과 목적에 맞는 정보를 선택하면 담당자가 검토할 수 있는 이메일 초안을 만들어 드립니다.</p></div></section>
<section class="section"><div class="shell contact-layout"><div class="contact-choice"><button type="button" class="choice active" data-choice="guide"><small>EXHIBITION &amp; SPACE</small><b>Iruvy Guide</b><span>행사 적합성·전시장·공간 상담</span></button><button type="button" class="choice" data-choice="flow"><small>MANUFACTURING</small><b>Iruvy Flow</b><span>Capacity Audit·제조 현장 진단</span></button><button type="button" class="choice" data-choice="partner"><small>COMPANY</small><b>미디어·파트너십</b><span>보도·협력·투자·채용 문의</span></button></div><form class="contact-form" data-contact-form><input type="hidden" name="product" value="guide"><label>회사·기관<input name="organization" required autocomplete="organization"></label><label>이름<input name="name" required autocomplete="name"></label><label>이메일<input name="email" type="email" required autocomplete="email"></label><label>문의 내용<textarea name="message" rows="6" required placeholder="행사 일정과 규모, 또는 최근 발생한 납기·병목 사건을 알려주세요."></textarea></label><label class="consent"><input type="checkbox" required> <span><a href="/privacy/">개인정보 처리방침</a>에 동의합니다.</span></label><button class="button" type="submit">이메일 초안 열기</button><p class="form-note" aria-live="polite" data-form-note>원본 생산 데이터와 민감정보는 첫 문의에 첨부하지 마세요.</p></form></div></section>`;

const legal = (kind) => kind === "privacy" ? `
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">PRIVACY</p><h1>개인정보 처리방침</h1><p>웹 문의 과정에서 제공한 정보를 문의 대응 목적으로 최소한으로 처리합니다.</p></div></section><section class="section"><div class="shell prose"><h2>수집 항목과 목적</h2><p>회사·기관, 이름, 이메일, 문의 내용을 상담 요청 확인과 회신에 사용합니다. 민감한 생산 원본 데이터는 첫 문의에서 수집하지 않습니다.</p><h2>보관과 삭제</h2><p>관계 법령과 합의된 목적에 필요한 기간 동안 보관한 뒤 삭제합니다. 삭제 또는 열람 요청은 iruvy.official@gmail.com으로 접수할 수 있습니다.</p><h2>제품 데이터</h2><p>Guide와 Flow의 고객 원본 데이터와 학습권은 분리하며, 별도 동의 없이 다른 제품 학습에 사용하지 않습니다.</p></div></section>` : kind === "terms" ? `
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">TERMS</p><h1>이용약관</h1><p>본 웹사이트의 정보 이용 범위와 책임 한계를 안내합니다.</p></div></section><section class="section"><div class="shell prose"><h2>정보의 성격</h2><p>웹사이트는 회사와 제품의 현재 방향을 소개하며, 별도 계약 없이 가격·성과·SLA를 보장하지 않습니다.</p><h2>지식재산권</h2><p>별도 표기가 없는 Iruvy 브랜드와 콘텐츠의 권리는 주식회사 이루비에 있습니다.</p><h2>문의</h2><p>서비스 조건과 계약 범위는 개별 제안과 계약에서 확정합니다.</p></div></section>` : `
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">ACCESSIBILITY</p><h1>웹 접근성 원칙</h1><p>다양한 사용자가 키보드·화면낭독기·고대비 환경에서 정보를 이용할 수 있도록 개선합니다.</p></div></section><section class="section"><div class="shell prose"><h2>목표</h2><p>WCAG 2.2 AA를 실무 기준으로 삼아 명확한 제목 구조, 키보드 탐색, 포커스 표시, 충분한 대비와 큰 터치 영역을 유지합니다.</p><h2>모션</h2><p>운영 흐름의 모션은 장식이 아니라 관계 이해를 돕는 범위로 제한하며, 동작 줄이기 환경설정을 존중합니다.</p><h2>피드백</h2><p>이용이 어려운 부분은 iruvy.official@gmail.com으로 알려주세요.</p></div></section>`;

const pages = new Map([
  ["", {
    title: "이루비(Iruvy) | 공간 의사결정 AI",
    description: "이루비(Iruvy)는 공간과 상황을 이해해 다음 최적 행동을 결정하는 Spatial Decision AI 기업입니다. Iruvy Guide와 Iruvy Flow를 소개합니다.",
    body: home,
    pageType: "WebPage",
  }],
  ["guide", {
    title: "전시회 AI 에이전트 | Iruvy Guide · 이루비",
    description: "이루비의 Iruvy Guide는 방문자의 관심과 위치를 이해해 다음 부스·콘텐츠·동선을 추천하는 전시회 AI 에이전트이자 Visitor Decision Platform입니다.",
    body: guide,
    pageType: "WebPage",
  }],
  ["flow", {
    title: "제조 생산계획·제약공정 최적화 AI | Iruvy Flow",
    description: "이루비의 Iruvy Flow는 제조 현장의 납기 위험과 병목을 찾고 작업순서·자원배치 대안을 비교하는 산업현장 자율운영 및 유효 생산능력 증폭 AI 시스템입니다.",
    body: flow,
    pageType: "WebPage",
  }],
  ["evidence", {
    title: "AI 성과 검증과 Evidence 기준 | 이루비 Iruvy",
    description: "이루비는 실측, 현장 PoC, 고객 데이터 Replay, 유료 검증, 라이브 운영과 검증된 경제성과를 서로 다른 Evidence 단계로 투명하게 구분합니다.",
    body: evidence,
    pageType: "CollectionPage",
  }],
  ["technology", {
    title: "공간 의사결정 AI 기술과 신뢰 | 이루비 Iruvy Core",
    description: "이루비 Iruvy Core는 현재 상태·목표·제약조건을 연결해 실행 가능한 대안을 계산합니다. Spatial Intelligence와 Decision Intelligence의 구조와 신뢰 원칙을 설명합니다.",
    body: technology,
    pageType: "WebPage",
  }],
  ["company", {
    title: "Spatial Decision AI 기업 | 이루비(Iruvy) 소개",
    description: "주식회사 이루비(Iruvy)는 공간과 상황을 이해해 다음 최적 행동을 결정하는 Spatial Decision AI를 개발하며 Iruvy Guide와 Iruvy Flow를 만듭니다.",
    body: company,
    pageType: "AboutPage",
  }],
  ["resources", {
    title: "공간·제조 의사결정 AI 인사이트 | 이루비",
    description: "이루비가 전시 방문 경험, 제조 병목, 공간 의사결정 AI의 경계와 성과 검증 방법을 실무 관점에서 설명하는 인사이트와 자료실입니다.",
    body: resources,
    pageType: "CollectionPage",
  }],
  ["capacity-lab", {
    title: "제조 납기·병목 진단 | Iruvy Flow Capacity Audit",
    description: "최근 납기 지연 사건 한 건을 기준으로 제조 현장의 핵심 제약공정, 경제 KPI, ERP·MES·Excel 데이터 준비도와 Iruvy Flow 적합성을 진단합니다.",
    body: capacityLab,
    pageType: "WebPage",
  }],
  ["contact", {
    title: "이루비 Iruvy 도입 상담 | Guide·Flow",
    description: "Iruvy Guide 전시회 행사 적합성 진단, Iruvy Flow 제조 Capacity Audit, 이루비 미디어·파트너십 문의를 시작하세요.",
    body: contact,
    pageType: "ContactPage",
  }],
  ["privacy", {
    title: "개인정보 처리방침 | 이루비 Iruvy",
    description: "이루비 Iruvy 웹사이트 문의와 Guide·Flow 제품 데이터의 개인정보 수집, 이용, 보관, 삭제 및 제품 간 원본 데이터 분리 원칙을 안내합니다.",
    body: legal("privacy"),
    pageType: "WebPage",
  }],
  ["terms", {
    title: "이용약관 | 이루비 Iruvy",
    description: "이루비 Iruvy 웹사이트가 제공하는 회사·제품 정보의 이용 범위, 지식재산권과 책임 한계를 안내합니다.",
    body: legal("terms"),
    pageType: "WebPage",
  }],
  ["accessibility", {
    title: "웹 접근성 원칙 | 이루비 Iruvy",
    description: "이루비 Iruvy 웹사이트의 WCAG 2.2 AA 기준, 키보드 탐색, 화면낭독기, 대비, 터치 영역과 동작 줄이기 지원 원칙을 안내합니다.",
    body: legal("accessibility"),
    pageType: "WebPage",
  }],
]);

for (const [route, { title, description, body, pageType }] of pages) {
  const dir = route ? join(out, route) : out;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page({ route, title, description, body, pageType }));
}

const redirect = (from, to, label) => {
  const dir = join(out, from);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="https://iruvy.com${to}"><title>${label} | Iruvy</title><meta name="description" content="새로운 Iruvy 페이지로 이동합니다."></head><body><main><h1>${label}</h1><p><a href="${to}">새 페이지로 이동</a></p></main></body></html>`);
};
redirect("go", "/guide/", "Iruvy Guide로 이동");
redirect("pricing", "/contact/", "도입 범위 상담으로 이동");

const sitemapPriority = {
  "": "1.0",
  guide: "0.9",
  flow: "0.9",
  evidence: "0.8",
  technology: "0.8",
  company: "0.8",
  resources: "0.7",
  "capacity-lab": "0.7",
  contact: "0.7",
  privacy: "0.3",
  terms: "0.3",
  accessibility: "0.3",
};
const urls = [...pages.keys()].map((route) => `  <url>
    <loc>${pageUrl(route)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${route === "" || route === "guide" || route === "flow" ? "weekly" : "monthly"}</changefreq>
    <priority>${sitemapPriority[route]}</priority>
  </url>`).join("\n");
writeFileSync(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

const aiCrawlers = ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "anthropic-ai", "Google-Extended", "bingbot"];
const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  ...aiCrawlers.flatMap((crawler) => [`User-agent: ${crawler}`, "Allow: /", ""]),
  "Host: iruvy.com",
  "Sitemap: https://iruvy.com/sitemap.xml",
  "",
].join("\n");
writeFileSync(join(out, "robots.txt"), robots);

const llms = `# Iruvy (이루비)

> 이루비(Iruvy)는 공간과 상황을 이해해 다음 최적 행동을 결정하는 Spatial Decision AI를 개발하는 기업입니다.

- Official name: Iruvy
- Korean name: 이루비
- Legal name: 주식회사 이루비
- Category: Spatial Decision AI (공간 의사결정 AI)
- Core technology: Spatial Intelligence × Decision Intelligence
- Website: https://iruvy.com/
- Last updated: ${lastModified}

## Company and products

- [Iruvy home](https://iruvy.com/): 회사 정의와 Iruvy Guide, Iruvy Flow의 공식 제품 구조
- [Iruvy Guide](https://iruvy.com/guide/): 방문자의 관심과 위치를 이해해 다음 부스·콘텐츠·동선을 추천하는 전시회 AI 에이전트
- [Iruvy Flow](https://iruvy.com/flow/): 산업현장의 사람·설비·자재·로봇을 최적화하는 산업현장 자율운영 및 유효 생산능력 증폭 AI 시스템
- [Company](https://iruvy.com/company/): 주식회사 이루비의 미션, 제품 전선과 운영 원칙

## Technology, evidence, and insights

- [Technology and trust](https://iruvy.com/technology/): Spatial Decision Core, 계산 계층, 데이터와 사람의 통제 원칙
- [Evidence](https://iruvy.com/evidence/): 실측, PoC, Replay, 유료 검증, 라이브 운영과 검증된 경제성과의 구분
- [Insights and resources](https://iruvy.com/resources/): 전시 방문 경험, 제조 병목과 의사결정 AI의 경계
- [Capacity Audit](https://iruvy.com/capacity-lab/): 최근 납기 지연 사건에서 제조 현장 적합성과 데이터 준비도를 확인하는 진단

## Contact and policies

- [Contact](https://iruvy.com/contact/): Guide 행사 적합성, Flow Capacity Audit, 미디어와 파트너십 문의
- [Privacy](https://iruvy.com/privacy/): 문의 정보와 제품 데이터 처리 원칙
- [Terms](https://iruvy.com/terms/): 웹사이트 정보 이용 범위와 책임 한계
- [Accessibility](https://iruvy.com/accessibility/): WCAG 2.2 AA를 기준으로 한 웹 접근성 원칙

## Scope boundaries

- Guide와 Flow는 공통 Spatial Decision Core를 공유하도록 설계하지만 고객, 원본 데이터, 핵심 도메인 모델과 학습권은 분리합니다.
- Iruvy Flow는 ERP·MES를 교체하지 않으며 현재 외부 단계는 L0 Observe에서 L1 Recommend입니다.
- 관리자 승인 없는 설비 직접제어와 완전 자율운영은 현재 제품 성과로 주장하지 않습니다.
- 제품별 외부 공개 성과는 근거, 범위와 승인 상태가 확인된 항목만 공개합니다.

## Contact

- Email: iruvy.official@gmail.com
- Canonical domain: https://iruvy.com/
`;
writeFileSync(join(out, "llms.txt"), llms);

const llmsFull = `# Iruvy (이루비) official knowledge file

Last updated: ${lastModified}
Canonical source: https://iruvy.com/

## Official entity definition

Iruvy의 한국어 이름은 이루비이며 법인명은 주식회사 이루비입니다. 이루비(Iruvy)의 회사 카테고리는 Spatial Decision AI, 한국어로 공간 의사결정 AI입니다. 공식 기업 소개는 "공간과 상황을 이해해 다음 최적 행동을 결정하는 Spatial Decision AI를 개발하는 기업"입니다. 핵심 기술 표현은 Spatial Intelligence × Decision Intelligence입니다.

## Product portfolio

### Iruvy Guide

Canonical page: https://iruvy.com/guide/

Iruvy Guide는 방문자(일반인, 교통약자 등)의 경험과 이동을 최적화하는 상용화 제품입니다. 첫 시장인 산업·기업 전시회에서는 방문자의 관심, 위치와 남은 시간을 이해해 다음 부스, 콘텐츠와 동선을 추천하는 전시회 AI 에이전트이자 Visitor Decision Platform입니다. 첫 제품 범위는 앱 설치가 필요 없는 QR 웹, 지도와 검색, 승인된 원문 기반 콘텐츠, 개인화 추천과 동선, 저장과 상담, 운영자 대시보드입니다. 정밀 실시간 위치, AR와 전용 하드웨어는 가치가 검증된 뒤 선택적으로 추가합니다.

### Iruvy Flow

Canonical page: https://iruvy.com/flow/

Iruvy Flow의 공식 아이템명은 "Iruvy Flow — 산업현장 자율운영 및 유효 생산능력 증폭 AI 시스템"이며 영문은 "Iruvy Flow — Industrial Autonomy and Capacity Amplification System"입니다. 산업현장의 사람, 설비, 자재와 로봇을 최적화하는 고부가가치 제품입니다. 첫 고객 가설은 주문생산형·다품종 소량생산 중소·중견 이산제조 사업장입니다. 첫 문제는 핵심 제약공정의 시간당 양품 산출량을 높이는 것이며, 납기 위험과 병목을 찾고 실제 제약을 반영한 작업순서와 자원배치 대안을 생산관리자가 검토하도록 설계합니다.

Iruvy Flow는 ERP, MES와 APS를 교체하지 않습니다. 초기에는 CSV, Excel과 읽기 중심 연동으로 시작하고 시스템은 추천하며 생산관리자가 수정, 승인 또는 거절합니다. 현재 외부 단계는 L0 Observe에서 L1 Recommend입니다. 관리자 승인 없는 설비와 로봇 직접제어, 폐루프 완전 자율실행과 검증 전 성과 수치는 현재 제공 범위가 아닙니다.

## Spatial Decision Core

Canonical page: https://iruvy.com/technology/

Spatial Decision Core는 현실의 객체와 관계를 표현하는 Reality Graph, 현재 상태와 사건을 추적하는 Context Engine, 목표와 제약 안에서 가능한 행동을 비교하는 Strategy Simulation, 승인과 실행 결과를 기록하는 Outcome Loop로 설명합니다. 언어 AI는 승인된 문서의 구조화, 질의와 근거 설명에 사용할 수 있습니다. 납기 위험, 하드 제약, 작업순서와 자원배치는 규칙, 통계, 수리최적화와 시뮬레이션 등 검증 가능한 계산 계층이 담당합니다.

Guide와 Flow는 공간·지식·의사결정 인터페이스의 공통 기술 후보를 공유하지만 고객, 원본 데이터, 도메인 모델과 학습권은 분리합니다. Guide 방문자 원본 데이터를 Flow 학습에 사용하지 않습니다.

## Evidence policy

Canonical page: https://iruvy.com/evidence/

이루비는 실측, 현장 PoC, 고객 데이터 Replay, 유료 검증, 라이브 운영과 검증된 경제성과를 서로 다른 증거 단계로 구분합니다. 외부 공개 성과에는 지표 정의, 측정 기간과 표본, 기준선, 데이터 출처, 측정 방법, 한계, 승인 책임자와 마지막 검토일이 필요합니다. Guide와 Flow의 성과를 하나의 숫자로 섞지 않으며 근거 정합성과 승인 상태가 확인된 항목만 공개합니다.

## Capacity Audit

Canonical page: https://iruvy.com/capacity-lab/

Iruvy Flow Capacity Audit은 최근 발생한 납기 지연 또는 병목 사건 한 건에서 시작합니다. 첫 미팅에서는 사건, 핵심 제약공정과 경제 KPI, ERP·MES·Excel 데이터 준비도, 담당자·검수·구매 조건을 확인합니다. 민감한 생산 원본 데이터는 첫 문의에 받지 않습니다.

## Company, resources, contact, and policies

- Company: https://iruvy.com/company/
- Insights and resources: https://iruvy.com/resources/
- Contact: https://iruvy.com/contact/
- Privacy: https://iruvy.com/privacy/
- Terms: https://iruvy.com/terms/
- Accessibility: https://iruvy.com/accessibility/

공식 문의 이메일은 iruvy.official@gmail.com입니다. 도입 범위, 가격, 성과와 SLA는 개별 제안과 계약에서 확정합니다.
`;
writeFileSync(join(out, "llms-full.txt"), llmsFull);
writeFileSync(join(out, "404.html"), page({ route: "404", title: "페이지를 찾을 수 없습니다 | Iruvy", description: "요청한 페이지를 찾을 수 없습니다. Iruvy 홈에서 원하는 정보를 확인해 주세요.", robots: "noindex", body: `<section class="simple-hero compact"><div class="shell"><p class="eyebrow">404</p><h1>페이지를 찾을 수 없습니다</h1><p>주소가 바뀌었거나 더 이상 제공하지 않는 페이지입니다.</p><a class="button" href="/">Iruvy 홈으로</a></div></section>` }));

mkdirSync(join(out, "server"), { recursive: true });
writeFileSync(join(out, "server", "index.js"), "export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n");

console.log(`Built ${pages.size + 3} pages into ${out}`);
