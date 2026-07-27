import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const email = "iruvy.official@gmail.com";

const header = () => `
<header class="sales-header"><div class="sales-shell sales-header-inner">
  <a class="sales-brand" href="/"><img src="/assets/iruvy-logo.svg" alt="Iruvy" width="1180" height="320"></a>
  <button class="sales-menu" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>메뉴</button>
  <nav class="sales-nav" id="site-nav" data-nav data-open="false" aria-label="주요 메뉴">
    <details><summary>솔루션</summary><div class="sales-dropdown"><a href="/go/"><strong>Iruvy Go</strong><span>실증 완료 · 현재 도입 상담</span></a><a href="/guide/"><strong>Iruvy Guide</strong><span>개발·확장 · 디자인 파트너</span></a><a href="/flow/"><strong>Iruvy Flow</strong><span>파일럿 준비 · 기관 운영 효율화</span></a></div></details>
    <details><summary>적용 분야</summary><div class="sales-dropdown"><a href="/solutions/welfare/">장애인·복지기관</a><a href="/solutions/public/">공공·문화·교육시설</a><a href="/solutions/hospital/">병원·대형 복합시설</a></div></details>
    <a href="/cases/">실증·사례</a><a href="/technology/">기술·보안</a><a href="/resources/">자료실</a><a class="sales-nav-cta" href="/contact/?product=go" data-event="nav_contact_click">기관 도입 상담</a>
  </nav>
</div></header>`;

const footer = () => `
<footer class="sales-footer">
  <div class="sales-shell sales-footer-grid">
    <div class="sales-footer-brand"><img src="/assets/iruvy-logo.svg" alt="Iruvy" width="1180" height="320"><p>사람·공간·사물의 상호작용을 데이터화해 이동 경험과 운영 의사결정을 개선합니다.</p></div>
    <div><strong>제품</strong><a href="/go/">Iruvy Go</a><a href="/guide/">Iruvy Guide</a><a href="/flow/">Iruvy Flow</a></div>
    <div><strong>검토 자료</strong><a href="/cases/">실증·사례</a><a href="/technology/">기술</a><a href="/security/">보안</a><a href="/resources/">자료실</a></div>
    <div><strong>연락</strong><a href="/contact/">기관 도입 상담</a><a href="mailto:${email}" data-event="email_click">${email}</a><a href="/company/">회사소개</a></div>
  </div>
  <div class="sales-shell sales-footer-bottom"><span>© <span data-year>2026</span> Iruvy</span><nav aria-label="법적 문서"><a href="/privacy/">개인정보 처리방침</a><a href="/terms/">이용약관</a><a href="/accessibility/">접근성</a></nav></div>
</footer>`;

const page = ({ title, description, canonical, eyebrow, h1, lede, status, statusClass = "preparation", actions = "", body, schema = "", ogImage = "/assets/og-iruvy-brand.jpg", robots = "" }) => `<!doctype html>
<html lang="ko"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title><meta name="description" content="${description}">${robots ? `<meta name="robots" content="${robots}">` : ""}<link rel="canonical" href="https://iruvy.com${canonical}">
  <meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:url" content="https://iruvy.com${canonical}"><meta property="og:image" content="https://iruvy.com${ogImage}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Iruvy 제품과 현장 기술">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://iruvy.com${ogImage}"><link rel="icon" href="/favicon.ico">
  <script>(function(){try{var m=localStorage.getItem("iruvy-theme-mode")||"auto";document.documentElement.dataset.themeMode=m;if(m==="dark"||(m==="auto"&&window.matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.dataset.theme="dark"}catch(e){}})();</script>
  <link rel="stylesheet" href="/styles/sales.css?v=20260720-4"><script src="/scripts/site.js?v=20260720-4" defer></script>${schema}
</head><body class="sales-site"><a class="skip-link" href="#main">본문으로 이동</a>${header()}
<main id="main"><section class="page-hero"><div class="sales-shell page-hero-grid${status ? "" : " single"}"><div><p class="sales-kicker">${eyebrow}</p><h1>${h1}</h1><p>${lede}</p>${actions ? `<div class="sales-actions">${actions}</div>` : ""}</div>${status ? `<aside class="page-status"><span class="status-badge ${statusClass}">${status}</span><strong>현재 공개 범위</strong><p>확인된 기능, 검증 중인 가설과 장기 방향을 구분합니다.</p></aside>` : ""}</div></section>${body}</main>${footer()}</body></html>`;

const section = (eyebrow, title, intro, content, className = "", id = "") => `<section class="sales-section page-section ${className}"${id ? ` id="${id}"` : ""}><div class="sales-shell"><div class="section-heading"><p class="sales-kicker">${eyebrow}</p><h2>${title}</h2>${intro ? `<p>${intro}</p>` : ""}</div>${content}</div></section>`;
const cards = (items, className = "page-card-grid") => `<div class="${className}">${items.map(({ tag = "", title, text, meta = "" }) => `<article>${tag ? `<span>${tag}</span>` : ""}<h3>${title}</h3><p>${text}</p>${meta ? `<small>${meta}</small>` : ""}</article>`).join("")}</div>`;
const process = (items) => `<ol class="process-grid ${items.length > 4 ? "five" : ""}">${items.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><h3>${item.title}</h3><p>${item.text}</p></li>`).join("")}</ol>`;
const cta = (title, text, primary = "/contact/?product=go", primaryText = "기관 도입 상담") => `<section class="sales-final"><div class="sales-shell sales-final-grid"><div><p class="sales-kicker">다음 단계</p><h2>${title}</h2><p>${text}</p></div><div class="sales-final-actions"><a class="sales-button primary" href="${primary}">${primaryText}</a><a class="sales-button" href="mailto:${email}">${email}</a></div></div></section>`;
const goVideoTranscript = () => `<details class="video-transcript"><summary>영상 내용 보기</summary><p>43초 동안 배경 음악과 화면 문구로 구성된 영상입니다. 음성 설명은 없습니다.</p><ol><li><time>00:00–00:04</time><span>Iruvy와 서울대학교 캠퍼스타운의 교통약자 실내 내비게이션 실증 소개</span></li><li><time>00:05–00:08</time><span>휴대폰으로 실내 동선과 주요 지점을 기록하는 공간 등록</span></li><li><time>00:09–00:13</time><span>상담실, 안내 데스크와 엘리베이터를 실제 방문 흐름에 맞게 연결하는 안내 구축</span></li><li><time>00:14–00:18</time><span>음성 입력, 큰 글씨와 진동 안내를 제공하는 Iruvy Go 앱 화면</span></li><li><time>00:19–00:25</time><span>눈가리개를 착용한 사용자가 큰 글씨, 음성과 진동 안내를 따라 복도를 이동하는 장면</span></li><li><time>00:26–00:32</time><span>엘리베이터와 갈림길에서 다음 행동을 안내받는 장면</span></li><li><time>00:33–00:38</time><span>방문객에게 더 쉬운 공간을 만든다는 제품 메시지. 안내 민원 감소는 이 영상에서 별도로 측정한 결과가 아님</span></li><li><time>00:39–00:43</time><span>복잡한 실내를 누구에게나 쉬운 길로 만든다는 문구와 도입 문의 이메일</span></li></ol></details>`;

const pages = [
  {
    path: "404.html",
    html: page({title:"페이지를 찾을 수 없음｜Iruvy",description:"요청한 Iruvy 페이지를 찾을 수 없습니다. 제품, 실증 자료 또는 문의 페이지로 이동할 수 있습니다.",canonical:"/404.html",robots:"noindex,follow",eyebrow:"404",h1:"페이지를<br>찾을 수 없음",lede:"주소가 바뀌었거나 삭제된 페이지입니다.",actions:'<a class="sales-button primary" href="/">홈으로</a><a class="sales-button" href="/contact/">문의</a>',body:""})
  },
  {
    path: "500.html",
    html: page({title:"일시적인 오류｜Iruvy",description:"Iruvy 사이트에서 일시적인 오류가 발생했습니다. 잠시 후 다시 시도하거나 이메일로 문의할 수 있습니다.",canonical:"/500.html",robots:"noindex,nofollow",eyebrow:"오류",h1:"잠시 후<br>다시 시도",lede:"요청을 처리하는 중 일시적인 문제가 발생했습니다. 입력한 문의 내용은 다시 제출하기 전에 확인해 주세요.",actions:'<a class="sales-button primary" href="/">홈으로</a><a class="sales-button" href="mailto:iruvy.official@gmail.com">이메일 문의</a>',body:""})
  },
  {
    path: "go/index.html",
    html: page({
      title: "Iruvy Go｜접근성 중심 실내 길안내",
      description: "Iruvy Go는 시각장애인·고령자·초행 방문자가 음성·진동 안내로 복잡한 실내 목적지까지 이동하도록 돕는 접근성 중심 길안내 제품입니다.",
      canonical: "/go/",
      ogImage: "/assets/og-iruvy-go.jpg",
      eyebrow: '<img class="product-wordmark" src="/assets/iruvy-go-logo.svg" alt="Iruvy Go" width="1040" height="260">',
      h1: "복잡한 실내에서도<br>목적지까지 스스로",
      lede: "사용자는 음성·진동·큰 화면으로 이동하고, 시설 담당자는 목적지와 접근성 경로, 공간 변화를 관리합니다.",
      actions: "",
      body:
        `<section class="product-fact-strip" aria-label="Iruvy Go 제품 상태"><div class="sales-shell"><span>현재 단계</span><strong>2차 내부 실증 완료</strong><span>약 300m 복합 실내 경로</span><strong>90명 중 87명 도착</strong><small>팀 제공 결과 · 특정 환경 · 제삼자 인증 아님</small></div></section>` +
        section("이용 과정", "선택부터 도착까지 이어지는 안내", "목적지를 고른 뒤 현재 위치와 방향을 확인하고, 이동 중 경로를 벗어나면 다시 안내합니다.", `<div class="product-screen-grid"><figure><img src="/assets/product/destination-home.jpg" alt="목적지를 선택하는 Iruvy Go 화면" width="1242" height="2688" loading="lazy"><figcaption><span>01</span><strong>목적지 선택</strong><p>검색하거나 음성으로 실제 방문 지점을 선택합니다.</p></figcaption></figure><figure><img src="/assets/product/turn-guidance.jpg" alt="방향과 거리를 안내하는 Iruvy Go 화면" width="1242" height="2688" loading="lazy"><figcaption><span>02</span><strong>이동 안내</strong><p>현재 위치와 방향을 바탕으로 음성·진동·큰 화면 안내를 제공합니다.</p></figcaption></figure><figure><img src="/assets/product/voice-destination.jpg" alt="음성으로 목적지를 찾는 Iruvy Go 화면" width="1242" height="2688" loading="lazy"><figcaption><span>03</span><strong>도착과 재안내</strong><p>경로 이탈 시 다시 안내하고 목적지 도착을 확인합니다.</p></figcaption></figure></div>`, "", "journey") +
        `<section class="sales-section demo-section"><div class="sales-shell demo-grid"><div class="section-heading"><p class="sales-kicker">제품 영상</p><h2>실제 이용 흐름</h2><p>목적지 선택과 이동 안내가 실제 공간에서 어떻게 이어지는지 확인할 수 있습니다.</p><dl class="media-meta"><div><dt>구성</dt><dd>사용자 이동과 접근성 안내</dd></div><div><dt>출처</dt><dd>Iruvy × 서울대학교 캠퍼스타운</dd></div></dl></div><div><div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/RpktEiPSRG0?rel=0" title="Iruvy Go 이용 영상" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>${goVideoTranscript()}</div></div></section>` +
        section("시설 운영", "안내가 지속되는 관리 구조", "사용자 앱만 제공하는 데서 끝나지 않고 시설의 목적지, 경로와 변경 사항을 운영할 수 있어야 합니다.", cards([
          {tag:"공간", title:"목적지와 이동 그래프", text:"건물, 층, 구역과 실제 방문 지점을 경로 구조로 등록합니다."},
          {tag:"접근성", title:"사용자 조건별 경로", text:"계단, 경사로, 문턱과 통제 구간을 반영한 이동 경로를 구성합니다."},
          {tag:"운영", title:"공간 변화와 실패 지점", text:"변경된 경로와 반복 이탈·도착 실패 지점을 확인해 안내를 갱신합니다."}
        ]), "", "venue") +
        section("작동 구조", "경로 전체와 불확실성의 관리", "출발부터 도착까지의 경로 그래프, 연속 추적과 필요한 구간의 확인·보정을 결합합니다.", process([
          {title:"공간 등록", text:"도면과 현장 확인으로 목적지와 접근 경로를 구조화합니다."},
          {title:"경로 계산", text:"접근 조건을 반영해 목적지까지의 검증 가능한 경로를 계산합니다."},
          {title:"연속 추적", text:"스마트폰 센서와 보행자 추측항법으로 이동을 이어서 추적합니다."},
          {title:"확인과 보정", text:"불확실한 구간에서 사용자 확인과 필요한 보정 수단을 적용합니다."}
        ])) +
        section("도입 조건", "시설별 구축 범위", "특정 하드웨어 구성을 모든 시설에 일괄 적용하지 않습니다. 공간과 안전 요구를 확인해 범위를 정합니다.", cards([
          {title:"시설 자료", text:"도면, 목적지, 접근 조건과 현장 확인 범위"},
          {title:"보정 수단", text:"소프트웨어 단독형과 보정이 필요한 구간의 구분"},
          {title:"운영 책임", text:"목적지와 경로 변경을 관리할 담당자와 갱신 절차"},
          {title:"지원 조건", text:"단말, 네트워크, 오프라인과 기존 시스템 연동 범위"}
        ], "page-card-grid four")) +
        section("적용 공간", "길을 자주 묻는 동선부터", "건물 전체보다 방문자가 자주 길을 묻거나 이동이 어려운 목적지부터 시작합니다.", `<div class="segment-grid"><a href="/solutions/welfare/"><span>장애인·복지기관</span><h3>독립 이동</h3><p>핵심 목적지의 도착과 직원 개입을 확인합니다.</p><small>적용 방식 보기 →</small></a><a href="/solutions/public/"><span>공공·문화·교육시설</span><h3>민원과 방문</h3><p>복잡한 층 이동과 주요 창구를 연결합니다.</p><small>적용 방식 보기 →</small></a><a href="/solutions/hospital/"><span>병원·대형 복합시설</span><h3>초행 이동</h3><p>접수, 진료·검사와 편의시설 사이의 동선을 안내합니다.</p><small>적용 방식 보기 →</small></a></div>`) +
        `<section class="sales-section results-section" id="evidence"><div class="sales-shell"><div class="section-heading split"><div><p class="sales-kicker">2차 내부 실증</p><h2>목적지 도착 결과</h2></div><p>약 300m 복합 실내 경로에서 90명 중 87명이 목적지에 도착했습니다. 팀 제공 결과이며 제삼자 인증이나 모든 환경의 성능 보장은 아닙니다.</p></div><div class="result-comparison"><article><span>안내 전 도착 성공률</span><strong>26.6%</strong><p>처음 방문한 특정 경로의 자력 도착 기준</p></article><div class="result-arrow" aria-hidden="true">→</div><article class="highlight"><span>Iruvy Go 안내 후</span><strong>96.7%</strong><p>2차 내부 실증 90명 중 87명 도착</p></article></div><div class="method-note"><strong>지표의 경계</strong><p>도착 성공률은 위치 추정 정확도, 기준점 인식률이나 상용 안전성과 서로 다른 지표입니다.</p><a href="/go/evidence/">측정 조건과 한계</a></div></div></section>` +
        section("파일럿 KPI", "도착만 보지 않는 검증 기준", "측정 정의와 제외 기준을 시작 전에 합의하고, 좋은 결과뿐 아니라 이탈·개입·장애와 안전 이슈를 함께 보고합니다.", cards([
          {title:"사용과 도착", text:"유효 안내 세션, 목적지 도착 성공률, 안내 완료 시간과 중도 이탈"},
          {title:"경로 품질", text:"경로 이탈, 재확인·복구와 목적지별 혼란 구간"},
          {title:"현장 개입", text:"직원 안내·동행 요청과 사용자 피드백"},
          {title:"운영 안정성", text:"경로 수정, 서비스 가용성, 장애와 중대한 안전 이슈"}
        ], "page-card-grid four")) +
        section("데이터 원칙", "안내에 필요한 범위의 정보", "문의·실증·정식 운영의 데이터 범위를 구분하고, 실제 수집 항목과 보관 기간은 도입 전에 문서로 합의합니다.", cards([
          {title:"목적과 최소 수집", text:"길안내와 검증에 필요한 목적지, 경로, 위치·센서 정보의 최소 범위"},
          {title:"권한과 보관", text:"처리 위치, 접근 담당자, 로그, 보관 기간과 파기 절차의 사전 합의"},
          {title:"안전 기능의 경계", text:"일반 목적지 안내와 비상 대피·의료 안전 기능을 구분하고 검증되지 않은 보장을 하지 않음"}
        ])) +
        section("도입 과정", "한 경로에서 유료 운영까지", "시설 규모와 보안·연동 범위에 따라 기간은 달라지며, 납기와 성능은 현장 진단 전에 확정하지 않습니다.", process([
          {title:"도입 상담", text:"사용자, 시설 문제, 예산 시점과 담당 부서를 확인합니다."},
          {title:"현장 진단", text:"도면, 목적지, 접근 조건, 위험 구간과 기존 인프라를 확인합니다."},
          {title:"파일럿 설계", text:"대상 공간, 사용자, KPI, 기간, 책임자와 제외 기준을 합의합니다."},
          {title:"구축과 검증", text:"공간을 등록하고 경로를 만든 뒤 실제 사용자 흐름에서 보완합니다."},
          {title:"결과와 전환", text:"같은 KPI로 결과와 한계를 검토하고 유료 운영 범위를 결정합니다."}
        ])) +
        section("자주 묻는 질문", "도입 전 확인", "", `<div class="faq-list"><details><summary>설치 장비가 반드시 필요한가요</summary><p>시설 구조와 보정이 필요한 구간에 따라 달라집니다. 도면과 현장 조건을 확인한 뒤 구성을 정합니다.</p></details><details><summary>건물 전체를 한 번에 구축해야 하나요</summary><p>아닙니다. 핵심 사용자와 목적지, 반복 안내가 많은 구간을 정한 뒤 작은 파일럿으로 시작할 수 있습니다.</p></details><details><summary>어떤 시설에서 사용할 수 있나요</summary><p>복지기관, 공공·문화·교육시설과 복합시설의 실내 경로를 우선 검토합니다. 시설별 위험도와 운영 조건에 따라 지원 범위는 달라집니다.</p></details><details><summary>시각장애인 외의 이용자도 사용할 수 있나요</summary><p>고령자, 이동약자와 초행 방문자의 사용 가능성을 검토할 수 있습니다. 사용자군별 안내 방식과 안전 조건은 별도 테스트가 필요합니다.</p></details><details><summary>인터넷 연결이 불안정한 곳에서도 가능한가요</summary><p>오프라인 동작과 네트워크 의존 범위는 앱 버전, 지도 갱신과 연동 조건에 따라 달라집니다. 현장 진단에서 통신 환경과 실패 대응을 확인합니다.</p></details><details><summary>도입 전에 어떤 자료가 필요한가요</summary><p>도면, 층수, 주요 목적지, 접근 조건, 현재 안내 방식, 담당자와 보안·연동 제약을 준비하면 첫 범위를 빠르게 정할 수 있습니다.</p></details><details><summary>파일럿에서는 어떤 KPI를 측정하나요</summary><p>도착 성공률만 보지 않고 유효 세션, 이탈, 경로 이탈, 직원 개입, 사용자 피드백, 장애와 안전 이슈를 사전에 합의합니다.</p></details><details><summary>위치 정보는 어떻게 처리하나요</summary><p>목적에 필요한 최소 범위를 우선하며 실제 항목, 처리 위치, 접근권한, 보관 기간과 파기는 도입 전 안내하고 합의합니다.</p></details><details><summary>가격은 무엇에 따라 달라지나요</summary><p>건물·층수·면적·목적지·경로 복잡도·보조 하드웨어·연동·보안·교육·유지보수와 SLA 범위에 따라 달라집니다.</p></details><details><summary>기존 키오스크나 시설 앱과 연동할 수 있나요</summary><p>기존 시스템의 API, 인증, 보안과 운영 책임을 확인한 뒤 연동 가능 범위를 검토합니다. 모든 시스템과의 연동을 현재 제공한다고 약속하지 않습니다.</p></details><details><summary>비상 대피 안내를 제공하나요</summary><p>현재 일반적인 목적지 이동 안내와 별개입니다. 법적·기술적 검증 없이 비상 대피나 의료 안전을 보장하는 기능으로 홍보하지 않습니다.</p></details><details><summary>유지보수와 장애 대응은 어떻게 정하나요</summary><p>경로 변경, 문의 접수, 복구 목표와 지원 시간은 시설 규모와 위험도에 맞춰 계약에서 정합니다. 표준화되지 않은 SLA를 사전에 단정하지 않습니다.</p></details><details><summary>실증 결과를 모든 시설에 적용할 수 있나요</summary><p>현재 공개 수치는 특정 경로의 내부 실증 결과입니다. 다른 시설과 사용자군에서는 같은 KPI로 반복 검증해야 합니다.</p></details></div>`, "faq-section") +
        cta("우리 시설의 첫 안내 경로", "시설 유형, 주요 사용자와 목적지를 알려주시면 현장 진단과 첫 구축 범위를 함께 정리합니다.")
    })
  },
  {
    path: "flow/index.html",
    html: page({
      title: "Iruvy Flow｜기관 업무 흐름 분석",
      description: "Iruvy Flow는 기관 안의 이동, 탐색, 대기와 업무중단을 측정하고 현장 확인을 거쳐 운영 병목 후보와 변경 전후 효과를 분석하는 파일럿 준비 제품입니다.",
      canonical: "/flow/",
      ogImage: "/assets/og-iruvy-flow.jpg",
      eyebrow: '<img class="product-wordmark flow" src="/assets/iruvy-flow-logo.svg" alt="Iruvy Flow" width="1320" height="260">',
      h1: "기관의 실제 움직임에서<br>확인할 운영 병목",
      lede: "개인을 평가하지 않고 이동, 탐색, 대기와 업무중단을 공간·시간대·업무 구조 단위로 측정합니다. 현장 확인을 거쳐 바꿔볼 지점과 같은 기준의 전후 비교를 만듭니다.",
      actions: "",
      body:
        `<section class="product-fact-strip" aria-label="Iruvy Flow 제품 상태"><div class="sales-shell"><span>현재 단계</span><strong>파일럿 준비</strong><span>분석 단위</span><strong>공간·시간대·업무 구조</strong><small>개인 평가·감시 목적 제외</small></div></section>` +
        section("문제", "완료 기록 뒤의 보이지 않는 과정", "업무 결과와 근무표만으로는 그 과정에서 길어진 이동, 자원 탐색, 대기와 비계획 업무중단의 원인을 설명하기 어렵습니다.", cards([
          {tag:"이동", title:"길어진 동선", text:"공간과 물품 배치 때문에 같은 구간을 반복해서 오가는 상황"},
          {tag:"탐색과 대기", title:"찾고 기다리는 시간", text:"필요한 자원과 사람을 찾거나 다음 단계가 열리기를 기다리는 상황"},
          {tag:"업무중단", title:"끊어진 흐름", text:"예상하지 못한 요청과 이동으로 본래 업무를 다시 시작해야 하는 상황"}
        ])) +
        section("검증 결과물", "발견에서 변경 전후 비교까지", "분석 화면만 전달하지 않고 현장에서 확인하고 바꿀 수 있는 단위로 정리합니다. 실제 제공 범위는 기관의 문제와 데이터 조건을 먼저 합의합니다.", cards([
          {title:"업무 흐름 지도", text:"공간·시간대·업무 구조별 이동과 체류 후보"},
          {title:"병목 후보", text:"반복 이동·탐색·대기와 알 수 없음 구간의 분리"},
          {title:"운영 변경 후보", text:"현장 워크숍을 거친 공간·자원 배치와 흐름 변경안"},
          {title:"전후 비교", text:"합의한 같은 지표로 다시 측정한 실제 변화"}
        ], "page-card-grid four")) +
        section("분석 구조", "현실 데이터에서 현장 조치까지", "각 단계의 근거와 한계를 보존하며 관측 신호를 사람의 판단과 운영 변화로 연결합니다.", process([
          {title:"현실 데이터", text:"공간, 이동, 체류와 상호작용을 새로운 사건 기록으로 만듭니다."},
          {title:"운영 맥락", text:"구역, 시간과 기존 기관 사건을 하나의 맥락으로 연결합니다."},
          {title:"병목 후보", text:"반복 이동, 탐색, 대기와 업무중단에서 확인할 지점을 찾습니다."},
          {title:"현장 판단", text:"위치만으로 단정하지 않고 현장 자료와 사람의 확인을 거칩니다."},
          {title:"운영 변경", text:"담당, 기한과 조치를 기록하고 같은 기준으로 전후 효과를 확인합니다."}
        ]), "", "approach") +
        section("책임 있는 추론", "업무 확정이 아닌 검증 가능한 후보", "위치만으로 구체적인 업무를 확정하지 않습니다. 여러 신호와 현장 정답 자료를 결합하고 확인되지 않은 구간은 알 수 없음으로 남깁니다.", cards([
          {tag:"관측", title:"위치·시간·이동 양상", text:"공간에서 직접 관측할 수 있는 물리적 신호"},
          {tag:"맥락", title:"기관 사건·상호작용", text:"기존 시스템 사건과 현장 자료를 결합하는 맥락"},
          {tag:"판단", title:"큰 업무 범주 또는 알 수 없음", text:"근거 수준을 보존하고 현장 확인을 거친 결과"}
        ])) +
        section("신뢰 원칙", "사람이 아닌 운영 구조", "현장 참여와 신뢰가 무너지면 데이터도 의미를 잃습니다. 제품 설계와 파일럿 범위에서 다음 원칙을 먼저 합의합니다.", cards([
          {tag:"제외", title:"개인별 생산성 평가", text:"개인 순위보다 부담을 키우는 공간·시간대·업무 구조를 우선합니다."},
          {tag:"제외", title:"감시와 인력 감축", text:"직원 감시나 인력 감축을 제품의 목적과 성과로 두지 않습니다."},
          {tag:"합의", title:"목적·권한·보관", text:"참여 안내, 접근권한, 보관 기간과 삭제 절차를 먼저 정합니다."},
          {tag:"승인", title:"사람이 결정하는 변화", text:"운영 변경은 현장 전문가의 판단과 승인을 전제로 합니다."}
        ], "page-card-grid four"), "", "trust") +
        section("첫 유즈케이스", "한 기관과 한 문제의 검증", "첫 적용 후보는 병원 내 물품 탐색과 반복 이동이지만, Flow의 제품 범주는 병원 하나가 아니라 기관 운영 효율화입니다.", `<div class="case-card"><div class="case-card-top"><span class="status-badge preparation">파일럿 준비</span><span>병원 운영 유즈케이스</span></div><h3>물품 탐색과 반복 이동의 병목 후보</h3><dl><div><dt>관측</dt><dd>공간·시간대별 이동과 체류</dd></div><div><dt>결합</dt><dd>물품·업무 사건과 현장 정답 자료</dd></div><div><dt>판단</dt><dd>현장 확인을 거친 병목 후보</dd></div><div><dt>결과</dt><dd>변경 전후 동일 지표 비교</dd></div></dl></div>`) +
        cta("함께 검증할 한 가지 운영 문제", "기관 유형, 반복해서 발생하는 문제와 현재 확인 가능한 데이터를 알려주시면 측정 범위와 제외 기준부터 정리합니다.", "/contact/?product=flow", "검증 범위 확인")
    })
  },
  {
    path: "guide/index.html",
    html: page({title:"Iruvy Guide｜상황별 행동 안내",description:"Iruvy Guide는 기관이 승인한 공간·절차 정보를 바탕으로 이용자와 현장 실무자에게 다음 행동을 단계별로 안내하는 개발·확장 제품입니다.",canonical:"/guide/",eyebrow:"Iruvy Guide",h1:"위치와 절차에 맞는<br>다음 행동 안내",lede:"기관이 승인한 공간·업무 매뉴얼을 기반으로 이용자와 현장 실무자에게 다음 행동을 단계별로 안내하는 제품 가설입니다.",status:"개발·확장",statusClass:"developing",actions:'<a class="sales-button primary" href="/contact/?product=guide">디자인 파트너 문의</a><a class="sales-button" href="#scenarios">사용 시나리오 보기</a>',body:
      section("제품 경계","완성된 상용 제품이 아닌 확장 단계","검증되지 않은 문의 감소율, 존재하지 않는 연동 기능과 목업 수치를 실사용 데이터처럼 제시하지 않습니다.",cards([
        {tag:"현재",title:"승인된 정보",text:"기관이 관리하는 공간·절차·준비사항을 안내의 기준으로 사용합니다."},
        {tag:"검증",title:"상황 인지",text:"현재 위치, 방문 목적, 절차 단계와 시간에 맞는 안내 범위를 좁게 검증합니다."},
        {tag:"경계",title:"직원 연결",text:"자동 안내가 부적절하거나 위험한 질문은 직원 확인으로 넘기는 기준이 필요합니다."}
      ]))+
      section("우선 시나리오","한 기관 유형과 한 절차부터","공공기관·병원·교육시설을 동시에 제품화하지 않고, 구매자와 전후 비교가 가능한 비임상 사용사례 하나를 선택합니다.",cards([
        {title:"민원 절차",text:"현재 위치와 예약·서류 상태에 맞는 다음 창구와 준비사항"},
        {title:"시설 이용 순서",text:"접수·이용·반납 등 기관이 승인한 단계별 행동"},
        {title:"현장 체크리스트",text:"반복 업무의 준비·확인·완료 단계를 놓치지 않도록 지원"}
      ]),"", "scenarios")+
      cta("함께 검증할 한 가지 안내 문제","반복 질문이 발생하는 위치와 절차, 담당자와 성공 기준을 알려주세요.","/contact/?product=guide","디자인 파트너 문의")})
  },
  {
    path: "solutions/welfare/index.html",
    html: page({title:"복지기관 실내 접근성｜Iruvy Go",description:"장애인·복지기관에서 이용자의 독립 이동 경험과 직원의 반복 안내 부담을 함께 검증하는 Iruvy Go 적용 방식입니다.",canonical:"/solutions/welfare/",eyebrow:"장애인·복지기관",h1:"독립 이동 경험의<br>실제 경로 검증",lede:"주요 목적지까지의 접근성 경로를 구축하고 실제 이용자의 도착, 직원 개입 요청과 혼란 구간을 같은 기준으로 확인합니다.",actions:'<a class="sales-button primary" href="/contact/?product=go&type=welfare">우리 시설 진단</a><a class="sales-button" href="/cases/">실증 근거 보기</a>',body:
      section("현장 문제","안내가 있어도 남는 이동 장벽","시설 구조를 잘 아는 직원에게는 쉬운 경로도 처음 방문한 이용자에게는 연속된 판단 과제가 됩니다.",cards([
        {title:"복잡한 목적지",text:"상담실·교육실·강당 등 목적지와 층 이동을 연속해서 이해하기 어려움"},
        {title:"반복 동행",text:"같은 경로를 직원이 반복 설명하거나 직접 동행해야 하는 상황"},
        {title:"성과 증명",text:"접근성 개선 활동이 실제 도착 경험을 바꿨는지 확인할 지표 부족"}
      ]))+
      section("권장 파일럿","한 건물과 핵심 목적지부터","기간과 표본은 기관 운영 일정과 사용자 모집 조건을 확인한 뒤 합의합니다.",process([
        {title:"경로 선정",text:"주요 이용자와 3~5개 핵심 목적지를 선정합니다."},
        {title:"공간 구축",text:"접근성 경로와 위험·확인 구간을 등록합니다."},
        {title:"사용자 테스트",text:"실제 이용자의 도착과 개입 요청을 관찰합니다."},
        {title:"결과 보고",text:"실패·혼란 구간과 개선안을 함께 정리합니다."}
      ]))+
      section("권장 KPI","도착과 개입의 분리","좋은 만족도만 모으지 않고 실패와 중단을 포함한 운영 지표를 합의합니다.",cards([
        {title:"도착 성공률",text:"유효 안내 세션 중 목적지 도착이 확인된 비율"},
        {title:"직원 개입 요청률",text:"안내 중 직원의 설명이나 동행을 요청한 세션 비율"},
        {title:"사용자 피드백",text:"이해하기 어려운 안내와 위험·혼란 구간의 정성 기록"}
      ]))+
      cta("우리 시설의 첫 검증 경로","건물, 핵심 목적지와 현재 안내 방식을 알려주시면 현장 진단 범위를 제안합니다.")})
  },
  {
    path: "solutions/public/index.html",
    html: page({title:"공공기관 접근성 실내 안내｜Iruvy Go",description:"공공·문화·교육시설의 방문 동선과 접근성 개선을 실제 이용 경험과 측정 가능한 결과로 연결하는 Iruvy Go 적용 방식입니다.",canonical:"/solutions/public/",eyebrow:"공공·문화·교육시설",h1:"접근성 개선과<br>측정 가능한 결과",lede:"정적인 안내물을 늘리는 데서 끝나지 않고 방문자의 실제 경로와 직원 개입, 혼란 구간을 파일럿 KPI로 확인합니다.",actions:'<a class="sales-button primary" href="/contact/?product=go&type=public">도입 검토 자료 요청</a><a class="sales-button" href="/security/">보안 원칙 보기</a>',body:
      section("구매자별 가치","같은 제품과 서로 다른 검토 기준","시설관리, 공공사업, 정보화와 민원 담당자가 필요한 근거를 분리해 제공합니다.",cards([
        {tag:"시설관리",title:"공간 변경 관리",text:"도면, 목적지와 경로 변경 시 갱신 범위와 책임을 확인합니다."},
        {tag:"공공·ESG",title:"접근성 KPI",text:"유효 세션, 도착, 개입 요청과 사용자 피드백을 결과 보고서로 정리합니다."},
        {tag:"정보화·보안",title:"데이터 흐름",text:"수집 항목, 처리 위치, 접근권한, 보관과 파기를 사전에 검토합니다."}
      ]))+
      section("내부 검토 자료","조달 논의 전 준비 항목","확보되지 않은 인증이나 표준 납기를 약속하지 않고 실제 검토에 필요한 문서를 먼저 정리합니다.",cards([
        {title:"제품 개요",text:"지원 사용자, 작동 흐름과 구축 조건"},
        {title:"실증 요약",text:"표본, KPI 정의, 결과와 한계"},
        {title:"보안 원칙",text:"데이터 최소화, 권한, 보관과 파기"},
        {title:"파일럿 범위",text:"대상 구역, 목적지, 기간, 책임자와 결과 보고"}
      ],"page-card-grid four"))+
      cta("기관 내부 검토의 시작","시설 유형, 담당 부서와 검토 시점을 알려주시면 필요한 자료와 현장 진단 순서를 안내합니다.")})
  },
  {
    path: "solutions/hospital/index.html",
    html: page({title:"병원·대형시설 이동과 운영｜Iruvy",description:"병원과 대형 복합시설에서 Iruvy Go의 길안내로 시작해 Guide와 Flow의 운영 개선으로 확장하는 검증 경로입니다.",canonical:"/solutions/hospital/",eyebrow:"병원·대형 복합시설",h1:"길찾기에서 시작하는<br>기관 운영의 확장",lede:"환자·보호자·이동약자의 목적지 안내는 Go로, 단계별 행동 안내는 Guide로, 물리적 업무 흐름 분석은 Flow로 구분합니다.",actions:'<a class="sales-button primary" href="/contact/?type=hospital">파일럿 범위 설계</a><a class="sales-button" href="/flow/">Flow 범위 보기</a>',body:
      section("제품 단계","동일한 상용 제품이 아닌 확장 경로","각 단계의 구매자, 데이터, KPI와 검증 상태가 다릅니다.",cards([
        {tag:"Go · 실증 완료",title:"실내 길안내",text:"환자·보호자·이동약자의 목적지 경로와 직원 반복 안내 문제"},
        {tag:"Guide · 개발·확장",title:"절차 안내",text:"원무·검사 등 기관이 승인한 비임상 절차의 다음 행동 안내"},
        {tag:"Flow · 파일럿 준비",title:"업무 흐름",text:"병동의 물품 탐색·이동·대기와 변경 전후 측정의 첫 유즈케이스"}
      ]))+
      section("안전 경계","의료 판단을 대신하지 않는 범위","경로 안내와 비임상 절차 안내가 진료, 응급, 투약과 의료 안전 판단을 대체한다고 표현하지 않습니다.",cards([
        {title:"비임상 우선",text:"시설 길찾기와 운영 흐름처럼 안전 범위를 통제할 수 있는 문제부터 검증"},
        {title:"사람의 승인",text:"업무 추론과 운영 변경은 현장 전문가 확인을 전제로 함"},
        {title:"데이터 합의",text:"위치만으로 업무를 확정하지 않고 병원 사건과 현장 정답 자료를 결합"}
      ]))+
      cta("한 병원과 한 문제의 파일럿","길찾기, 반복 안내 또는 물품 탐색 중 먼저 검증할 문제와 구매 부서를 알려주세요.","/contact/?type=hospital","파일럿 범위 설계")})
  },
  {
    path: "cases/index.html",
    html: page({title:"Iruvy 실증과 사례｜상태·방법·한계",description:"Iruvy의 실증, 협력, 유료 논의를 구분하고 공개 가능한 방법과 결과, 한계를 확인합니다.",canonical:"/cases/",eyebrow:"실증·사례",h1:"상태와 한계를 포함한<br>현장 근거",lede:"로고의 수보다 어떤 문제를 어떤 조건에서 검증했고 무엇이 아직 확인되지 않았는지를 함께 공개합니다.",actions:'<a class="sales-button primary" href="/contact/?product=go">사례 기반 상담</a><a class="sales-button" href="/go/evidence/">측정 방법 보기</a>',body:
      section("상태 체계","관계의 정확한 이름","유료 도입, 유료 파일럿, 실증, 협력과 시연을 카드마다 구분합니다.",cards([
        {tag:"유료 도입",title:"계약·운영",text:"계약, 발주·입금과 운영 범위가 확인된 관계"},
        {tag:"유료 파일럿",title:"대가 있는 검증",text:"구매 조건과 KPI를 합의하고 비용을 지불한 파일럿"},
        {tag:"실증",title:"현장 검증",text:"제품·사용자·기술 가설을 실제 공간에서 검증한 관계"},
        {tag:"협력",title:"지원·논의",text:"지원, 육성, 공동 검토와 접점을 계약과 구분"}
      ],"page-card-grid four"))+
      `<section class="sales-section page-section"><div class="sales-shell"><div class="section-heading"><p class="sales-kicker">공개 사례</p><h2>복합 실내 경로 사용자 실증</h2><p>기관명·로고 공개 권한이 확인되지 않아 공간 유형으로 공개합니다.</p></div><article class="case-card"><div class="case-card-top"><span class="status-badge pilot">실증</span><span>대학 복합시설</span></div><h3>약 300m 경로의 목적지 도착 과제</h3><dl><div><dt>표본</dt><dd>2차 실증 90명</dd></div><div><dt>도착</dt><dd>87명</dd></div><div><dt>안내 전</dt><dd>도착 성공률 26.6%</dd></div><div><dt>안내 후</dt><dd>도착 성공률 96.7%</dd></div></dl><p class="card-limit">팀 제공 결과·제삼자 인증 아님·특정 환경. 세부 참여 조건과 도움 허용 범위는 외부 공개 전 원자료 정리가 필요합니다.</p><a class="inline-link" href="/cases/complex-indoor-route-poc/">사례 상세 보기 →</a></article></div></section>`+
      cta("같은 유형의 검증 설계","시설과 이용자, 목적지와 성공 기준을 알려주시면 과장 없는 파일럿 범위를 함께 정리합니다.")})
  },
  {
    path: "cases/complex-indoor-route-poc/index.html",
    html: page({title:"복합 실내 경로 사용자 실증｜Iruvy Go",description:"약 300m의 특정 복합 실내 경로에서 수행한 Iruvy Go 2차 실증의 과제, 결과, 한계와 다음 검증을 설명합니다.",canonical:"/cases/complex-indoor-route-poc/",eyebrow:"실증 · 대학 복합시설",h1:"목적지 도착 과제의<br>2차 내부 실증",lede:"특정 복합 실내 경로에서 안내 전과 Iruvy Go 안내 후의 목적지 도착을 확인했습니다. 기관명은 공개 권한 확인 전 비공개합니다.",status:"실증",statusClass:"pilot",actions:'<a class="sales-button primary" href="/contact/?product=go">같은 유형 상담</a><a class="sales-button" href="/go/evidence/">근거 표 보기</a>',body:
      section("실증 범위","확인된 사실과 미확인 조건","수치가 강할수록 측정 방법과 한계를 같은 화면에서 확인할 수 있어야 합니다.",`<div class="evidence-table-wrap"><table class="evidence-table"><caption>복합 실내 경로 2차 실증</caption><tbody><tr><th scope="row">상태</th><td>실증</td></tr><tr><th scope="row">공간 유형</th><td>대학 복합시설</td></tr><tr><th scope="row">경로</th><td>약 300m 복합 실내 경로</td></tr><tr><th scope="row">표본</th><td>2차 실증 90명</td></tr><tr><th scope="row">안내 전</th><td>도착 성공률 26.6%</td></tr><tr><th scope="row">안내 후</th><td>90명 중 87명 도착, 도착 성공률 96.7%</td></tr><tr><th scope="row">성공 정의</th><td>지정 목적지 도착 기준. 세부 도움 허용 조건은 외부 공개 전 확인 필요</td></tr><tr><th scope="row">검증 주체</th><td>팀 제공 결과, 제삼자 인증 아님</td></tr></tbody></table></div>`)+
      section("한계","모르는 조건의 공개","좋은 결과만 남기지 않고 추가 확인이 필요한 항목을 다음 검증의 입력으로 관리합니다.",cards([
        {title:"참여자 구성",text:"외부 공개 전 원자료 확인 필요"},
        {title:"실패 3건",text:"현재 공개 가능한 원인 분류 없음"},
        {title:"일반화",text:"다른 시설·사용자군·기기 조건의 반복 검증 필요"}
      ]))+
      cta("다른 시설에서의 반복 검증","같은 KPI와 명확한 실패 기준으로 시설별 적용 가능성을 확인합니다.")})
  },
  {
    path: "technology/index.html",
    html: page({title:"Iruvy 기술｜실내 위치·경로와 현실 사건",description:"Iruvy의 공간 그래프, 연속 이동 추적, 선택적 절대 위치 보정과 현실 사건 데이터의 기술 원칙을 설명합니다.",canonical:"/technology/",eyebrow:"공통 기술",h1:"공간과 이동을 연결하는<br>검증 가능한 구조",lede:"Iruvy Go는 전체 경로 그래프와 연속 이동 추적, 필요한 구간의 확인·보정을 결합합니다. 장기적으로 이 기반을 기관의 물리적 사건과 운영 분석으로 확장합니다.",actions:'<a class="sales-button primary" href="/contact/?type=technology">기술 검토 요청</a><a class="sales-button" href="/security/">보안 구조 보기</a>',body:
      section("Go 핵심 구조","경로 전체와 불확실성의 관리","주변 설명 하나나 고정 지점 안내만으로 끝나지 않고 출발부터 도착까지의 사용자 여정을 다룹니다.",process([
        {title:"공간 그래프",text:"구역, 목적지, 이동 구간과 접근 제약을 구조화합니다."},
        {title:"경로 계산",text:"목적지까지의 결정론적 경로를 계산합니다."},
        {title:"연속 추적",text:"스마트폰 관성·PDR 기반으로 이동을 이어서 추적합니다."},
        {title:"확인과 보정",text:"불확실한 구간에서 사용자 확인과 보조 기준점을 적용합니다."}
      ]))+
      section("기술 경계","현재 구현과 장기 아키텍처","Reality Engine은 장기 공통 아키텍처 가설이며 하나의 완성된 범용 플랫폼으로 주장하지 않습니다.",cards([
        {tag:"현재",title:"Go 공간·이동 기술",text:"공간 등록, 위치추정, 경로 탐색, 안내와 현장 배포 경험"},
        {tag:"검증",title:"현실 사건 계층",text:"이동·체류·탐색·대기 후보와 기관 사건의 맥락 결합"},
        {tag:"장기",title:"운영과 로봇 맥락",text:"기관의 공간·업무·예외를 실행 계층에 제공하는 방향"}
      ]))+
      cta("시설 조건에 맞는 기술 검토","도면, 공간 규모, 기기·네트워크와 기존 인프라 조건을 함께 확인합니다.","/contact/?type=technology","기술 검토 요청")})
  },
  {
    path: "security/index.html",
    html: page({title:"Iruvy 보안과 개인정보 원칙",description:"Iruvy 제품과 실증의 데이터 최소화, 접근권한, 보관·파기, 문의 데이터 처리와 현재 보장 범위를 설명합니다.",canonical:"/security/",eyebrow:"보안·개인정보",h1:"기능보다 먼저 정하는<br>데이터의 목적과 경계",lede:"기관별 제품·실증 환경에서 무엇을 왜 처리하는지, 누가 접근하고 언제 지우는지를 계약과 참여 안내에서 먼저 합의합니다.",actions:'<a class="sales-button primary" href="/contact/?type=security">보안 검토 미팅</a><a class="sales-button" href="/privacy/">개인정보 처리방침</a>',body:
      section("현재 웹사이트","문의 데이터 처리","문의 양식은 서버에서 검증하고 접근이 제한된 저장소에 접수 기록을 남긴 뒤 지정 메일로 알립니다. 문의 기록은 최대 1년 보관하며 삭제 요청을 접수합니다.",cards([
        {title:"HTTPS",text:"공개 사이트와 문의 API의 전송 구간을 암호화합니다."},
        {title:"서버 검증",text:"필수 항목, 형식, 요청 크기, 출처와 요청 빈도를 서버에서 확인합니다."},
        {title:"최소 공개",text:"비밀키와 메일 자격증명을 클라이언트 코드에 포함하지 않습니다."}
      ]))+
      section("제품·실증","사전 합의가 필요한 항목","아래 항목은 모든 환경에 이미 동일하게 구현되었다는 인증 목록이 아니라 계약 전 확인할 통제 기준입니다.",cards([
        {title:"수집 최소화",text:"목적에 필요한 원시 센서·위치 데이터만 검토"},
        {title:"처리 위치",text:"가능한 경우 기기·엣지에서 파생 사건으로 변환"},
        {title:"접근권한",text:"기관·제품 역할에 따른 최소 권한과 접근 기록"},
        {title:"보관과 파기",text:"원시 데이터와 파생 사건의 기간·삭제 절차 분리"},
        {title:"개인 평가 제한",text:"Flow는 개인 순위·징계·감시 목적 기능으로 제공하지 않음"},
        {title:"제3자 처리",text:"실제 클라우드·외부 서비스와 데이터 위치를 계약별 안내"}
      ],"page-card-grid three"))+
      section("현재 한계","인증과 법률 표현","확보되지 않은 보안 인증을 암시하지 않으며, 의료·공공기관 환경은 실제 계약 범위와 전문가 검토가 필요합니다.",cards([
        {title:"인증",text:"현재 공개 가능한 독립 보안 인증 없음"},
        {title:"법적 적합성",text:"사이트 설명만으로 개별 서비스의 법률 적합성을 단정하지 않음"},
        {title:"취약점 제보",text:`${email}으로 대상 URL, 영향과 재현 절차를 보내면 확인`}
      ]))+
      cta("기관 보안 검토의 시작","예상 데이터, 보안 담당자와 금지 조건을 알려주시면 확인 항목을 정리합니다.","/contact/?type=security","보안 검토 미팅")})
  },
  {
    path: "resources/index.html",
    html: page({title:"Iruvy 자료실｜영상·실증·검토 자료",description:"Iruvy Go 도입 검토에 필요한 제품 영상, 실증 근거, 보안 원칙과 보고서 구조를 확인합니다.",canonical:"/resources/",eyebrow:"자료실",h1:"설명보다 빠른<br>기관 검토 자료",lede:"제품 작동, 실증 조건, 보안 원칙과 파일럿 KPI를 담당 부서가 검토하기 쉬운 단위로 정리합니다.",actions:'<a class="sales-button primary" href="/resources/videos/">영상 보기</a><a class="sales-button" href="/resources/reports/">보고서 구조 보기</a>',body:
      section("자료 유형","도입 판단의 순서","다운로드 수보다 실제 상담과 내부 검토에 도움이 되는 자료만 우선 제작합니다.",cards([
        {tag:"영상",title:"제품 소개와 작동",text:"목적지 선택, 경로 안내와 관리자 운영 화면"},
        {tag:"근거",title:"실증 결과와 방법",text:"표본, KPI 정의, 결과, 실패와 한계"},
        {tag:"보안",title:"데이터 처리 원칙",text:"수집, 권한, 보관, 파기와 현재 한계"},
        {tag:"파일럿",title:"범위와 KPI",text:"대상 구역, 사용자, 책임자와 결과 보고 구조"}
      ],"page-card-grid four"))+
      cta("기관 내부 검토에 필요한 자료","부서와 검토 목적을 알려주시면 현재 공개 가능한 자료를 안내합니다.","/contact/?type=resources","자료 요청")})
  },
  {
    path: "resources/videos/index.html",
    html: page({title:"Iruvy Go 영상｜제품 소개와 작동",description:"Iruvy Go의 목적지 선택, 음성·진동 안내와 현장 이동 흐름을 영상으로 확인합니다.",canonical:"/resources/videos/",eyebrow:"영상 자료",h1:"목적지 선택에서<br>이동 안내까지",lede:"현재 공개 가능한 공식 제품 소개 영상을 제공합니다. 시설·기기별 구축 조건과 현재 제품 버전은 상담에서 다시 확인합니다.",body:
      `<section class="sales-section page-section"><div class="sales-shell demo-grid"><div class="section-heading"><p class="sales-kicker">공식 소개 영상</p><h2>Iruvy Go 현장 시연</h2><p>영상은 배경 음악과 화면 문구로 구성되며, 아래에서 장면별 내용을 텍스트로 확인할 수 있습니다.</p></div><div><div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/RpktEiPSRG0?rel=0" title="Iruvy Go 제품 소개와 현장 시연 영상" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>${goVideoTranscript()}</div></div></section>`+
      section("제작 기준","다음 영상 패키지","영상의 역할을 하나로 합치지 않고 의사결정자 소개, 작동 데모와 실증 사례로 분리합니다.",cards([
        {title:"60초 소개",text:"사용자 문제, 기관 가치, 작동과 검증 결과"},
        {title:"90초 데모",text:"입구, 목적지 선택, 회전·층 이동, 이탈 복구와 도착"},
        {title:"사례 영상",text:"기관 문제, 실증 범위, KPI, 결과, 한계와 다음 단계"}
      ]))+
      cta("우리 시설의 실제 시연","시설 도면과 목적지를 바탕으로 데모 범위를 검토합니다.")})
  },
  {
    path: "resources/reports/index.html",
    html: page({title:"Iruvy 파일럿 보고서 구조",description:"Iruvy Go 파일럿의 KPI 정의서, 4주·8주·12주 결과 보고와 공개 임팩트 리포트 운영 기준입니다.",canonical:"/resources/reports/",eyebrow:"보고서",h1:"파일럿 결과에서<br>유료 운영 판단까지",lede:"월간 홍보 리포트를 먼저 만들지 않고 기관별 KPI 정의와 4주·8주·12주 결과 보고를 표준화합니다.",body:
      section("보고 순서","측정 전에 KPI 합의","기관별 기간은 계약과 운영 일정에 따라 달라질 수 있으며, 아래는 표준 보고 구조입니다.",process([
        {title:"시작 전",text:"목적, 공간, 사용자, KPI 정의와 제외 기준"},
        {title:"4주 점검",text:"사용량, 오류, 안전·운영 이슈와 데이터 품질"},
        {title:"8주 중간",text:"경로별 도착·이탈과 직원 개입 변화"},
        {title:"12주 최종",text:"결과, 한계, 개선안과 유료 운영 전환 제안"}
      ]))+
      section("최종 보고서","구성 항목","좋은 수치만 뽑지 않고 범위, 실패, 데이터 누락과 운영 이슈를 함께 남깁니다.",cards([
        {title:"범위와 표본",text:"기간·대상·공간·유효 세션 정의"},
        {title:"사용과 도착",text:"사용량·도착·이탈·경로별 혼란"},
        {title:"운영 변화",text:"직원 개입·문의·경로 수정과 장애"},
        {title:"한계와 다음 단계",text:"일반화할 수 없는 조건과 다음 검증"}
      ],"page-card-grid four"))+
      cta("파일럿 KPI 정의서 요청","검증하려는 기관 문제와 현재 측정 가능한 데이터를 알려주세요.","/contact/?type=reports","보고서 구조 상담")})
  },
  {
    path: "thank-you/index.html",
    html: page({title:"문의 접수 완료｜Iruvy",description:"Iruvy 기관 도입 문의가 접수된 뒤 준비하면 좋은 자료와 다음 절차를 안내합니다.",canonical:"/thank-you/",eyebrow:"문의 접수",h1:"보내주신 내용을<br>확인하겠습니다",lede:"담당자가 접수 내용을 확인한 뒤 입력하신 이메일로 답변드립니다.",body:
      `<section class="product-fact-strip" data-contact-reference-section hidden><div class="sales-shell"><span>접수 번호</span><strong data-contact-reference></strong><small>문의 확인 시 이 번호를 알려주세요</small></div></section>`+
      section("준비 자료","다음 대화를 빠르게 만드는 정보","민감한 도면이나 개인정보는 이메일로 바로 보내지 말고 먼저 공개 가능 범위와 전달 방식을 합의해 주세요.",cards([
        {title:"공간 개요",text:"건물 수, 층수, 주요 목적지와 이용자 유형"},
        {title:"현재 문제",text:"반복 질문, 동행, 실패·혼란이 자주 발생하는 구간"},
        {title:"검토 일정",text:"예산 시점, 내부 담당 부서와 의사결정 절차"}
      ]))+
      `<section class="sales-final"><div class="sales-shell sales-final-grid"><div><p class="sales-kicker">기다리는 동안</p><h2>제품과 실증 근거</h2><p>작동 영상과 측정 조건을 먼저 확인할 수 있습니다.</p></div><div class="sales-final-actions"><a class="sales-button primary" href="/resources/videos/" data-event="thank_you_resource_click">제품 영상 보기</a><a class="sales-button" href="/go/evidence/">실증 근거 보기</a></div></div></section>`})
  },
  {
    path: "terms/index.html",
    html: page({title:"이용약관｜Iruvy",description:"Iruvy 공개 웹사이트의 정보 제공 범위, 지식재산, 외부 링크, 책임 범위와 문의 방법을 안내합니다.",canonical:"/terms/",eyebrow:"Legal",h1:"이용약관",lede:"본 약관은 Iruvy 공개 웹사이트 이용에 관한 기본 사항을 안내합니다. 제품 도입·실증·운영 조건은 별도 계약과 참여 안내가 우선합니다.",body:
      section("정보 제공","사이트 콘텐츠의 범위","사이트의 제품 단계, 실증 수치와 기술 설명은 게시 시점의 공개 가능한 정보를 기준으로 하며 개별 시설의 성능·납기·가격을 보장하지 않습니다.",cards([
        {title:"계약의 분리",text:"제품·파일럿의 범위, 가격, SLA, 개인정보와 책임은 별도 계약에서 정함"},
        {title:"지식재산",text:"로고, 문서, 제품 화면과 콘텐츠의 권리는 Iruvy 또는 정당한 권리자에게 있음"},
        {title:"외부 링크",text:"외부 사이트의 내용과 개인정보 처리는 해당 운영자의 정책을 따름"}
      ]))+
      section("문의","약관과 권리 요청","사이트 이용, 콘텐츠 권리 또는 수정 요청은 문의 양식이나 대표 이메일로 접수할 수 있습니다.",`<p class="legal-contact"><a href="/contact/?type=company">문의 양식</a> · <a href="mailto:${email}">${email}</a></p>`)})
  }
];

for (const item of pages) {
  const destination = join(root, item.path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, item.html.trimStart());
}

console.log(`Generated ${pages.length} marketing pages`);
