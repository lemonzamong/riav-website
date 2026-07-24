import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const today = "2026-07-24";

const routes = [
  ["", "Iruvy | 제조 운영 의사결정 AI", "납기 위험과 공정 병목을 먼저 파악하고, 생산관리자가 검토할 수 있는 작업순서와 자원배치 대안을 제시합니다."],
  ["flow", "Iruvy Flow | 제조 운영 의사결정 AI", "주문·공정·설비·작업 데이터를 연결해 납기 지연과 병목을 예측하고 작업순서와 자원배치 대안을 제시합니다."],
  ["use-cases/production-planning", "생산계획·납기 최적화 | Iruvy Flow", "긴급 주문과 설비 정지, 외주 지연이 생길 때 납기 위험과 병목을 다시 계산합니다."],
  ["technology", "산업 운영 AI 기술 | Iruvy", "운영 관계 모델, 예측, 제약 최적화와 인간 승인으로 구성된 Iruvy Flow의 기술 구조를 설명합니다."],
  ["security", "데이터·보안 원칙 | Iruvy", "읽기 전용 우선, 최소 권한, 고객별 데이터 경계와 감사 가능한 운영 원칙을 설명합니다."],
  ["design-partners", "제조 디자인 파트너 | Iruvy", "한 공정과 한 가지 납기·병목 의사결정을 8~12주 동안 검증하는 유료 파일럿 프로그램입니다."],
  ["company", "회사 소개 | Iruvy", "Iruvy는 복잡한 산업현장의 데이터를 실행 가능한 의사결정으로 바꾸는 산업 운영 소프트웨어 회사입니다."],
  ["contact", "문의 | Iruvy", "제조 디자인 파트너, 기술·데이터 연동, 산업 파트너십과 투자 문의를 남겨 주세요."],
  ["privacy", "개인정보 처리방침 | Iruvy", "Iruvy 웹사이트의 개인정보 수집, 이용, 보관과 권리 행사 방법을 안내합니다."],
  ["terms", "이용약관 | Iruvy", "Iruvy 웹사이트의 정보 이용 범위와 책임 한계를 안내합니다."],
  ["accessibility", "웹 접근성 | Iruvy", "Iruvy 웹사이트가 지향하는 WCAG 2.2 AA 수준의 접근성 원칙과 피드백 방법을 안내합니다."]
];

const nav = [
  ["/flow/", "제품"],
  ["/use-cases/production-planning/", "사용 사례"],
  ["/technology/", "기술"],
  ["/design-partners/", "디자인 파트너"],
  ["/company/", "회사"]
];

const header = (route = "", light = false) => `
<a class="skip-link" href="#main">본문으로 이동</a>
<header class="site-header${light ? " light-page" : ""}" data-header>
  <div class="shell header-inner">
    <a class="brand" href="/" aria-label="Iruvy 홈"><img src="/assets/iruvy-logo.svg" width="110" height="29" alt="Iruvy"></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>메뉴</button>
    <nav class="site-nav" id="site-nav" aria-label="주요 메뉴" data-nav>
      ${nav.map(([href, label]) => `<a href="${href}"${route && href.includes(`/${route.split("/")[0]}/`) ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
      <a class="button primary" href="/design-partners/#fit-check" data-event="nav_primary_cta_click">파일럿 적합성 확인</a>
    </nav>
  </div>
</header>`;

const footer = `
<footer class="site-footer">
  <div class="shell">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/"><img src="/assets/iruvy-logo.svg" width="110" height="29" alt="Iruvy"></a>
        <p>복잡한 산업현장의 데이터를 실행 가능한 의사결정으로 바꿉니다.</p>
      </div>
      <div class="footer-col"><strong>제품</strong><a href="/flow/">Iruvy Flow</a><a href="/use-cases/production-planning/">생산계획·납기</a></div>
      <div class="footer-col"><strong>기술</strong><a href="/technology/">기술 구조</a><a href="/security/">데이터·보안</a></div>
      <div class="footer-col"><strong>협력</strong><a href="/design-partners/">디자인 파트너</a><a href="/contact/">기술·산업 파트너십</a></div>
      <div class="footer-col"><strong>회사</strong><a href="/company/">회사 소개</a><a href="/privacy/">개인정보 처리방침</a><a href="/terms/">이용약관</a><a href="/accessibility/">접근성</a></div>
    </div>
    <div class="footer-bottom"><span>© 2026 Iruvy. All rights reserved.</span><span><a href="mailto:contact@iruvy.com" data-event="email_link_click">contact@iruvy.com</a> · <a href="mailto:security@iruvy.com" data-event="email_link_click">security@iruvy.com</a></span></div>
  </div>
</footer>`;

const document = ({ route = "", title, description, content, light = false, schema = "" }) => `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://iruvy.com/${route ? `${route}/` : ""}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://iruvy.com/${route ? `${route}/` : ""}">
  <meta property="og:image" content="https://iruvy.com/assets/og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Iruvy 제조 운영 의사결정 AI">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://iruvy.com/assets/og.png">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/assets/site.css?v=20260724">
  <script src="/assets/site.js?v=20260724" defer></script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Iruvy","url":"https://iruvy.com/","email":"contact@iruvy.com","logo":"https://iruvy.com/assets/iruvy-logo.svg"}</script>
  ${schema}
</head>
<body>
  ${header(route, light)}
  <main id="main">${content}</main>
  ${footer}
</body>
</html>`;

const demo = `
<div class="operation-demo" data-demo data-stage="0" aria-label="합성 데이터 기반 생산계획 시나리오">
  <div class="demo-top"><span>SYNTHETIC DATA · 09:10 KST</span><span class="demo-status" data-demo-state aria-live="polite">운영 데이터 연결</span></div>
  <div class="demo-body">
    <div class="machine-row">
      <div class="machine"><b>M-01</b>CUT · ACTIVE</div><div class="machine"><b>M-02</b>MILL · ACTIVE</div><div class="machine"><b>M-03</b>GRIND · QUEUE</div><div class="machine down"><b>M-04</b>MILL · DOWN</div>
    </div>
    <div class="timeline">
      <div class="timeline-head"><span>PRODUCTION TIMELINE</span><span>납기선 → 18:00</span></div>
      <div class="timeline-row"><span>O-4821</span><div class="timeline-track"><i class="job warn" style="left:4%;width:42%"></i><i class="job risk" style="left:49%;width:32%"></i></div></div>
      <div class="timeline-row"><span>O-4822</span><div class="timeline-track"><i class="job" style="left:12%;width:56%"></i></div></div>
      <div class="timeline-row"><span>O-4824</span><div class="timeline-track"><i class="job risk" style="left:34%;width:48%"></i></div></div>
    </div>
    <div class="decision-grid">
      <div class="risk-card"><span>납기 위험 주문</span><strong data-risk-count>1건</strong><span>M-04 정지 · 외주 회수 지연</span></div>
      <div class="alternatives"><small>DECISION ALTERNATIVES</small><div class="alt selected"><span>A · 작업순서 변경</span><b>검토</b></div><div class="alt"><span>B · 대체설비 배치</span><b>비교</b></div><div class="alt"><span>C · 외주 전환</span><b>비교</b></div></div>
    </div>
  </div>
  <div class="demo-controls" aria-label="데모 단계">
    <button class="demo-step" type="button" data-demo-step="connect">1 · 연결</button><button class="demo-step" type="button" data-demo-step="risk">2 · 위험</button><button class="demo-step" type="button" data-demo-step="alternatives">3 · 대안</button><button class="demo-step" type="button" data-demo-step="approve">4 · 승인</button>
  </div>
</div>`;

const home = `
<section class="hero">
  <div class="shell hero-grid">
    <div>
      <p class="eyebrow">Manufacturing Operations AI</p>
      <h1>납기와 병목을 먼저 보고,<br>다음 작업을 결정합니다.</h1>
      <p class="lede">Iruvy Flow는 주문·공정·설비·작업 데이터를 연결해 지연 위험을 예측하고, 생산관리자가 검토할 수 있는 작업 순서와 자원 배치 대안을 제시합니다.</p>
      <div class="actions"><a class="button primary" href="/design-partners/#fit-check" data-event="hero_primary_cta_click">파일럿 적합성 확인</a><a class="button" href="#demo" data-event="hero_demo_open">합성 데이터 데모 보기</a></div>
      <div class="trust-line"><span>읽기 전용 연동</span><span>관리자 승인 기반</span><span>한 공정부터 검증</span></div>
      <p class="stage-note">현재 단계 · 첫 제조 디자인 파트너 모집</p>
    </div>
    ${demo}
  </div>
</section>
<section class="trust-strip" aria-label="제품 범위"><div class="shell trust-grid">
  <div class="trust-item"><small>대상</small><strong>다품종 소량생산 제조</strong></div><div class="trust-item"><small>첫 결정</small><strong>납기 위험과 공정 병목</strong></div><div class="trust-item"><small>연결</small><strong>ERP · MES · Excel · 로그</strong></div><div class="trust-item"><small>운영</small><strong>사람의 승인 후 실행</strong></div>
</div></section>
<section class="section paper"><div class="shell">
  <div class="section-head"><p class="eyebrow">The operating gap</p><h2>생산 데이터는 쌓여도,<br>일정은 매일 다시 짭니다.</h2><p>긴급 주문, 설비 정지, 외주 지연, 작업자 가용성은 서로 영향을 주지만 기존 시스템은 각 사건을 따로 보여줍니다. 결국 다음 작업 순서는 전화, 엑셀, 숙련자의 기억에 의존합니다.</p></div>
  <div class="grid-3"><article class="card"><span class="num">01</span><h3>변화가 생긴 뒤에야 지연을 압니다</h3><p>납기 위험이 주문, 공정, 설비 데이터 사이에 흩어져 선제 대응이 어렵습니다.</p></article><article class="card"><span class="num">02</span><h3>병목의 원인을 연결해 보기 어렵습니다</h3><p>설비 가동률은 보여도 어떤 주문과 공정이 왜 대기하는지는 남지 않습니다.</p></article><article class="card"><span class="num">03</span><h3>계획 변경의 근거와 결과가 사라집니다</h3><p>매일 반복되는 판단이 다음 의사결정에 쓸 수 있는 기록으로 축적되지 않습니다.</p></article></div>
</div></section>
<section class="section"><div class="shell">
  <div class="section-head"><p class="eyebrow">How Flow works</p><h2>Iruvy Flow는 현장을 하나의 운영 모델로 연결합니다.</h2></div>
  <div class="pipeline"><article><span class="step">01 CONNECT</span><h3>필요한 데이터부터 연결</h3><p>CSV·Excel·API·DB에서 읽기 전용으로 시작합니다.</p></article><article><span class="step">02 MODEL</span><h3>관계와 시간을 구성</h3><p>주문·공정·설비·역할·사건을 연결합니다.</p></article><article><span class="step">03 DECIDE</span><h3>위험과 대안을 계산</h3><p>예측, 규칙과 제약 최적화로 대안을 비교합니다.</p></article><article><span class="step">04 APPROVE</span><h3>관리자가 근거를 검토</h3><p>추천을 승인·수정·거절하고 이유를 남깁니다.</p></article><article><span class="step">05 VERIFY</span><h3>실제 결과를 검증</h3><p>예상과 실제를 같은 KPI로 비교합니다.</p></article></div>
</div></section>
<section class="section paper" id="demo"><div class="shell scenario">
  <div><p class="eyebrow">First use case · 09:10</p><h2>긴급 주문과 설비 정지가 동시에 발생했습니다.</h2><p>첫 번째로 해결할 결정은 납기와 병목입니다. 변화가 생길 때 영향을 받는 주문을 다시 계산하고, 현장 제약을 충족하는 작업순서를 비교합니다.</p><div class="notice">이 화면은 합성 제조 데이터를 사용한 제품 시나리오입니다. 실제 파일럿에서는 고객이 합의한 데이터와 제약조건으로 검증합니다.</div><div class="actions"><a class="button dark" href="/use-cases/production-planning/" data-event="use_case_view">생산계획 사용 사례 보기</a></div></div>
  <ol class="event-list"><li><b>09:10</b><span>긴급 주문 O-4824가 추가됩니다.</span></li><li><b>09:12</b><span>핵심 설비 M-04가 정지합니다.</span></li><li><b>09:13</b><span>외주 공정 회수 일정이 하루 늦어집니다.</span></li><li><b>09:14</b><span>Flow가 위험 주문 세 건과 병목 공정을 표시합니다.</span></li><li><b>09:16</b><span>생산관리자가 대안 A를 수정하고 승인합니다.</span></li></ol>
</div></section>
<section class="section dark"><div class="shell">
  <div class="section-head"><p class="eyebrow">Decision console</p><h2>경보가 아니라,<br>선택 가능한 다음 행동을 보여줍니다.</h2><p>합성 데이터 데모 · 실제 제품 범위는 파일럿에서 데이터와 제약조건을 합의해 검증합니다.</p></div>
  <div class="product-console">
    <div class="console-tabs" role="tablist" aria-label="제품 화면"><button class="console-tab" role="tab" aria-selected="true" aria-controls="panel-risk" data-console-tab>Risk</button><button class="console-tab" role="tab" aria-selected="false" aria-controls="panel-bottleneck" data-console-tab>Bottleneck</button><button class="console-tab" role="tab" aria-selected="false" aria-controls="panel-decisions" data-console-tab>Decisions</button><button class="console-tab" role="tab" aria-selected="false" aria-controls="panel-audit" data-console-tab>Audit</button></div>
    <div class="console-panel active" id="panel-risk" role="tabpanel" data-console-panel><table class="console-table"><thead><tr><th>주문</th><th>약속 납기</th><th>예상 영향</th><th>원인</th></tr></thead><tbody><tr><td>O-4821</td><td>오늘 18:00</td><td class="risk-text">+4.2h DEMO</td><td>M-04 정지</td></tr><tr><td>O-4824</td><td>내일 11:00</td><td class="risk-text">+3.1h DEMO</td><td>외주 지연</td></tr></tbody></table></div>
    <div class="console-panel" id="panel-bottleneck" role="tabpanel" data-console-panel><table class="console-table"><thead><tr><th>공정</th><th>설비</th><th>대기 작업</th><th>상류 영향</th></tr></thead><tbody><tr><td>MILL</td><td>M-04</td><td>6 DEMO</td><td>O-4821 · O-4824</td></tr><tr><td>GRIND</td><td>M-03</td><td>3 DEMO</td><td>INSPECT 대기</td></tr></tbody></table></div>
    <div class="console-panel" id="panel-decisions" role="tabpanel" data-console-panel><table class="console-table"><thead><tr><th>대안</th><th>변경</th><th>제약</th><th>상태</th></tr></thead><tbody><tr><td>A</td><td>O-4821 우선</td><td>자재 준비 확인</td><td>수정 검토</td></tr><tr><td>B</td><td>M-02 대체</td><td>셋업 40분</td><td>비교</td></tr></tbody></table></div>
    <div class="console-panel" id="panel-audit" role="tabpanel" data-console-panel><table class="console-table"><thead><tr><th>시간</th><th>행동</th><th>이유</th><th>결과</th></tr></thead><tbody><tr><td>09:16</td><td>대안 A 수정 승인</td><td>자재 도착 확인</td><td>섀도 비교 중</td></tr><tr><td>17:40</td><td>실제 완료 기록</td><td>계획 대비 비교</td><td>DEMO</td></tr></tbody></table></div>
  </div>
</div></section>
<section class="section paper"><div class="shell"><div class="section-head"><p class="eyebrow">Pilot outcomes</p><h2>성과는 예쁜 대시보드가 아니라<br>운영 지표로 판단합니다.</h2><p>파일럿 시작 전에 기준선, 측정방법과 데이터 기간을 합의하고 같은 기준으로 전후를 비교합니다. 아래는 측정할 지표이며 현재 성과 수치가 아닙니다.</p></div><div class="metric-grid"><div class="metric"><small>KPI 01</small><strong>납기 준수율</strong></div><div class="metric"><small>KPI 02</small><strong>위험 조기발견 시간</strong></div><div class="metric"><small>KPI 03</small><strong>생산계획 수립시간</strong></div><div class="metric"><small>KPI 04</small><strong>일정 재수립 횟수</strong></div><div class="metric"><small>KPI 05</small><strong>공정 대기시간</strong></div><div class="metric"><small>KPI 06</small><strong>잔업·긴급 외주비</strong></div></div></div></section>
<section class="section"><div class="shell scenario"><div><p class="eyebrow">Integration</p><h2>기존 시스템을 교체하지 않고,<br>필요한 데이터부터 연결합니다.</h2><p>초기 파일럿은 읽기 전용 데이터와 한 개 공정부터 시작합니다. 연결 방식, 갱신주기, 데이터 보관 위치는 현장 진단에서 합의합니다.</p><div class="actions"><a class="button dark" href="/technology/" data-event="technology_view">기술 구조 보기</a></div></div><div class="data-line"><span class="data-chip">ERP</span><span class="data-chip">MES</span><span class="data-chip">Excel · CSV</span><span class="data-chip">설비 가동 로그</span><span class="data-chip">작업실적</span><span class="data-chip">외주·자재 일정</span><span class="data-chip">역할·교대 정보</span></div></div></section>
<section class="section dark"><div class="shell"><div class="section-head"><p class="eyebrow">Human control</p><h2>자동화보다 먼저,<br>통제 가능성을 설계합니다.</h2></div><div class="control-grid"><article><span>01</span><h3>사람의 승인</h3><p>중요한 변경은 관리자가 근거를 확인한 뒤 승인합니다.</p></article><article><span>02</span><h3>설명 가능한 추천</h3><p>영향을 준 주문, 공정, 설비와 제약조건을 함께 봅니다.</p></article><article><span>03</span><h3>감사 가능한 기록</h3><p>추천, 수정, 승인, 거절과 실제 결과를 남깁니다.</p></article><article><span>04</span><h3>최소 권한</h3><p>가능한 한 읽기 전용 연결과 역할별 접근으로 시작합니다.</p></article><article><span>05</span><h3>데이터 경계</h3><p>명시적 합의 없이 원본 데이터를 다른 고객 학습에 쓰지 않습니다.</p></article></div><div class="actions"><a class="button" href="/security/" data-event="security_view">데이터·보안 원칙 보기</a></div></div></section>
<section class="section"><div class="shell partner-panel"><div><p class="eyebrow">Design partner</p><h2>한 공정, 한 가지 결정,<br>8~12주.</h2><p class="lede">생산관리의 모든 문제를 한 번에 바꾸지 않습니다. 반복되는 한 가지 결정을 정하고 필요한 데이터와 기준선을 합의한 뒤 실제 운영에서 효과를 검증합니다.</p><div class="actions"><a class="button primary" href="/design-partners/#fit-check" data-event="design_partner_view">우리 현장 적합성 확인</a></div></div><ul class="check-list"><li>다품종 소량생산 또는 주문생산</li><li>생산계획을 주 1회 이상 변경</li><li>ERP·MES·Excel 중 하나 이상의 운영 데이터 보유</li><li>대표·공장장과 생산관리자가 함께 참여</li><li>같은 KPI로 결과를 검수할 의지</li></ul></div></section>
<section class="section paper"><div class="shell scenario"><div><p class="eyebrow">About Iruvy</p><h2>현장의 판단을<br>계산 가능한 시스템으로.</h2></div><div><p>Iruvy는 공간과 이동처럼 현실의 관계를 소프트웨어로 모델링해 온 경험을 바탕으로, 제조현장의 주문·공정·설비·작업·시간을 연결하는 운영 의사결정 기술을 만듭니다.</p><div class="grid-3"><article><h3>현장부터</h3><p>현장에서 확인한 문제부터 만듭니다.</p></article><article><h3>책임 분리</h3><p>모델의 추천과 사람의 책임을 구분합니다.</p></article><article><h3>변화 측정</h3><p>기능보다 실제 운영지표를 봅니다.</p></article></div><div class="actions"><a class="button dark" href="/company/">회사와 원칙 보기</a></div></div></div></section>
<section class="section"><div class="shell cta-panel"><p class="eyebrow">Start with one decision</p><h2>생산관리에서 가장 반복되는<br>한 가지 결정을 알려주세요.</h2><p>현재 데이터 상태와 업무 흐름을 확인한 뒤, Iruvy Flow로 검증할 수 있는 범위인지 솔직하게 답합니다.</p><div class="actions"><a class="button dark" href="/design-partners/#fit-check">파일럿 적합성 확인</a><a class="button" href="mailto:contact@iruvy.com" data-event="email_link_click">이메일로 문의</a></div></div></section>`;

const pageHero = (eyebrow, title, lede, actions = "") => `<section class="page-hero"><div class="shell"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lede">${lede}</p>${actions ? `<div class="actions">${actions}</div>` : ""}</div></section>`;
const pageLayout = (sections, links = []) => `<section class="page-body"><div class="shell page-grid"><aside class="page-aside" aria-label="페이지 목차">${links.map(([id,label]) => `<a href="#${id}">${label}</a>`).join("")}</aside><div class="prose">${sections}</div></div></section>`;

const flow = pageHero("Iruvy Flow", "생산관리자가 매일 내리는 결정을,<br>데이터와 함께 검토합니다.", "흩어진 운영 데이터를 시간 기반 관계로 연결하고, 납기 위험과 병목의 원인을 분석해 실행 가능한 대안을 제시합니다.", `<a class="button dark" href="/#demo">합성 데이터 데모 보기</a><a class="button" href="/design-partners/#fit-check">파일럿 적합성 확인</a>`) + pageLayout(`
<section id="structure"><h2>한 가지 결정에 필요한 구조를 연결합니다.</h2><div class="grid-2"><article class="card"><h3>Data Connect</h3><p>주문·납기, 공정순서, 작업실적, 설비상태, 외주·자재 일정과 역할 가용성을 읽기 전용으로 연결합니다.</p></article><article class="card"><h3>Operational Model</h3><p>주문이 어떤 공정을 거치고 어떤 설비와 역할이 필요하며 어떤 사건이 납기에 영향을 주는지 연결합니다.</p></article><article class="card"><h3>Decision Engine</h3><p>납기 위험, 병목, 작업순서와 자원배치 대안을 규칙·통계·제약 최적화와 시뮬레이션으로 계산합니다.</p></article><article class="card"><h3>Human Control</h3><p>추천 근거와 제약을 확인하고 승인·수정·거절하며 예상과 실제 결과를 함께 기록합니다.</p></article></div></section>
<section id="status"><h2>현재 제품 단계와 경계를 구분합니다.</h2><div class="status-list"><div class="status-row"><span class="status-badge">VERIFIED</span><div><h3>제품 정의와 승인형 워크플로</h3><p>납기 위험·병목 의사결정에 집중하고 관리자가 최종 결정을 내리는 제품 범위를 현재 결정으로 관리합니다.</p></div></div><div class="status-row"><span class="status-badge pilot">PILOT SCOPE</span><div><h3>고객 데이터 연결과 현장 검증</h3><p>한 공정, 한 가지 결정의 8~12주 유료 섀도 파일럿에서 데이터와 제약조건을 합의해 구축·검증합니다.</p></div></div><div class="status-row"><span class="status-badge boundary">OUT OF SCOPE</span><div><h3>자동 제어와 개인 감시</h3><p>설비 직접제어, 사람 승인 없는 자동 계획, 개인 생산성 순위와 상시 CCTV 분석은 첫 단계 범위가 아닙니다.</p></div></div></div></section>
<section id="boundary"><h2>첫 단계에 적합하지 않은 사용처</h2><p>Iruvy Flow는 안전 중요 제어, 교전 판단, 개인별 작업자 감시, 의료 판단과 품질 합격 자동판정에 사용하지 않습니다. ERP·MES·APS 전체를 교체하거나 전 공장을 한 번에 디지털화하는 프로젝트도 첫 범위가 아닙니다.</p></section>
<section id="faq" class="faq"><h2>자주 묻는 질문</h2><details><summary>ERP나 MES를 바꿔야 하나요?</summary><p>아닙니다. 기존 시스템에서 필요한 데이터를 읽기 전용으로 연결하는 방식부터 검토합니다.</p></details><details><summary>데이터가 Excel뿐이어도 가능한가요?</summary><p>주문, 납기, 공정과 작업실적이 일정 기간 축적되어 있다면 가능성을 진단할 수 있습니다. 데이터 품질에 따라 첫 범위가 달라집니다.</p></details><details><summary>AI가 생산계획을 자동으로 바꾸나요?</summary><p>초기 범위에서는 자동 변경하지 않습니다. 가능한 대안과 근거를 제시하고 관리자가 승인·수정·거절합니다.</p></details><details><summary>어떤 데이터 기간이 필요한가요?</summary><p>가능하면 6~12개월의 주문·공정·실적을 권장합니다. 현장에 따라 더 짧은 기간으로 데이터 준비도 진단부터 시작할 수 있습니다.</p></details><details><summary>CCTV가 필요한가요?</summary><p>첫 사용 사례에는 필요하지 않습니다. 구조화된 주문·공정·작업·설비 데이터로 먼저 검증합니다.</p></details></section>`, [["structure","제품 구조"],["status","제품 단계"],["boundary","사용 경계"],["faq","FAQ"]]);

const useCase = pageHero("Use case · Production planning", "일정이 바뀔 때마다,<br>납기 위험을 다시 계산합니다.", "긴급 주문, 설비 정지, 외주 지연과 역할 가용성의 변화를 함께 반영해 어떤 주문이 위험한지 찾고 가능한 작업순서 대안을 비교합니다.", `<a class="button dark" href="/design-partners/#fit-check">데이터 조건 확인</a>`) + pageLayout(`
<section id="signals"><h2>이런 징후가 반복된다면 먼저 살펴볼 문제입니다.</h2><div class="grid-2"><article class="card"><h3>계획이 매일 바뀝니다</h3><p>아침에 만든 일정이 긴급 주문, 고장과 외주 지연 때문에 오후에 다시 바뀝니다.</p></article><article class="card"><h3>특정 사람에게 의존합니다</h3><p>숙련 생산관리자가 없으면 주문별 영향과 대체 순서를 빠르게 판단하기 어렵습니다.</p></article><article class="card"><h3>지연을 늦게 발견합니다</h3><p>고객에게 연락하기 직전에야 납기 위험을 알거나 전체 일정 영향을 수작업으로 계산합니다.</p></article><article class="card"><h3>변경 이유가 남지 않습니다</h3><p>어떤 대안을 왜 선택했고 실제 결과가 어땠는지 비교할 기록이 없습니다.</p></article></div></section>
<section id="data"><h2>최소한의 데이터부터 연결 가능성을 확인합니다.</h2><div class="status-list"><div class="status-row"><b>주문·납기</b><span>주문 ID, 품목, 수량, 약속 납기, 실제 완료일</span></div><div class="status-row"><b>공정경로</b><span>품목군, 공정순서, 가능 설비, 표준 또는 예상시간</span></div><div class="status-row"><b>작업실적</b><span>시작·종료, 공정, 설비, 수량과 중단사유</span></div><div class="status-row"><b>설비·사건</b><span>가동·정지, 정비, 긴급주문, 외주지연과 재작업</span></div></div><p class="notice">가능하면 6~12개월을 권장하지만, 첫 진단 범위는 현장의 데이터 품질과 문제에 따라 달라집니다.</p></section>
<section id="decisions"><h2>Flow가 검토 가능한 선택지를 만듭니다.</h2><ul><li>납기 위험 주문의 우선순위</li><li>현재·예상 병목 공정과 원인</li><li>제약을 충족하는 작업순서 변경안</li><li>대체설비와 역할·자원 배치 가능성</li><li>잔업·외주가 필요한 시점과 영향</li><li>각 대안의 가정, 제약조건과 데이터 충분성</li></ul></section>
<section id="fit"><h2>적합성 자가진단</h2><p>아래 항목 중 네 개 이상이라면 문제 인터뷰 우선순위가 높습니다.</p><ul class="check-list"><li>주문마다 공정순서나 작업시간이 달라집니다.</li><li>생산계획을 주 1회 이상 바꿉니다.</li><li>약속 납기와 실제 완료 데이터를 보유합니다.</li><li>작업 시작·종료 또는 생산실적을 기록합니다.</li><li>설비별 처리 가능 공정을 알고 있습니다.</li><li>긴급 주문 또는 외주 지연이 반복됩니다.</li><li>대표·공장장과 생산관리자가 파일럿에 참여할 수 있습니다.</li></ul><div class="actions"><a class="button dark" href="/design-partners/#fit-check">우리 현장 적합성 확인</a></div></section>`, [["signals","현장 징후"],["data","필요 데이터"],["decisions","제공 결정"],["fit","자가진단"]]);

const technology = pageHero("Technology", "현장의 데이터, 관계, 결정, 실행을<br>하나의 흐름으로 연결합니다.", "Iruvy Flow는 LLM 하나에 모든 판단을 맡기지 않습니다. 데이터 연결, 시간 기반 운영 모델, 예측, 제약 최적화, 설명, 승인과 실행 기록을 역할별 기술로 구성합니다.", `<a class="button dark" href="/contact/?type=technology" data-event="technology_view">기술 검토 문의</a>`) + pageLayout(`
<section id="architecture"><h2>운영 의사결정 구조</h2><div class="architecture"><div>ERP · MES · Excel · 설비 · 작업실적</div><i>↓ 수집 · 정합 · 이벤트 처리</i><div>시간 기반 운영 관계 모델</div><i>↓ 예측 · 병목분석 · 제약 최적화 · 시뮬레이션</i><div>대안 생성 · 근거 설명 · 영향 비교</div><i>↓ 관리자 승인 · 수정 · 거절</i><div>작업계획 반영 · 결과 측정 · 감사 기록</div></div></section>
<section id="roles"><h2>문제별로 검증 가능한 기술을 사용합니다.</h2><div class="grid-2"><article class="card"><h3>예측·이벤트 분석</h3><p>납기 위험과 병목은 주문·공정 실적, 시간과 사건 데이터를 바탕으로 계산합니다.</p></article><article class="card"><h3>제약 최적화·시뮬레이션</h3><p>작업순서와 자원배치는 가능한 설비, 셋업, 역할, 외주와 선후관계를 반영합니다.</p></article><article class="card"><h3>LLM·정보추출</h3><p>작업일지 구조화, 자연어 질의, 추천 근거 설명과 결과 보고에 사용합니다.</p></article><article class="card"><h3>워크플로·감사로그</h3><p>승인·수정·거절, 모델 버전과 실제 실행 결과를 함께 기록합니다.</p></article></div></section>
<section id="model"><h2>현장을 운영 객체와 관계로 표현합니다.</h2><p>주문, 품목, 공정, 설비, 작업지시, 역할, 자재, 외주와 시간이 서로 어떤 영향을 주는지 연결합니다. 긴급 주문, 설비 정지, 외주 지연, 자재 부족과 재작업은 상태를 바꾸는 사건으로 기록합니다.</p></section>
<section id="llm"><h2>LLM의 역할과 경계를 분리합니다.</h2><div class="grid-2"><article class="card"><h3>사용하는 영역</h3><ul><li>비정형 작업일지 구조화</li><li>관리자 자연어 질의</li><li>추천 근거와 시나리오 차이 설명</li><li>회의·결과 보고 보조</li></ul></article><article class="card"><h3>단독 위임하지 않는 영역</h3><ul><li>하드 제약 검증</li><li>작업순서·자원배치 확정</li><li>설비 직접제어와 안전판단</li><li>출처 없는 수치 생성</li></ul></article></div></section>
<section id="learning"><h2>승인만으로 모델이 즉시 바뀌지 않습니다.</h2><p>추천, 입력 데이터와 모델 버전, 근거·가정, 승인·수정·거절 이유, 실제 실행과 결과를 함께 기록합니다. 새 규칙과 모델은 오프라인 평가, 승인, 버전관리와 롤백을 거쳐 배포합니다.</p></section>`, [["architecture","아키텍처"],["roles","기술별 역할"],["model","운영 관계 모델"],["llm","LLM 경계"],["learning","개선 구조"]]);

const security = pageHero("Data & Security", "산업 데이터는 기능보다 먼저<br>경계를 정해야 합니다.", "어떤 데이터를 왜 처리하고, 누가 접근하며, 어디에 저장하고, 언제 삭제하는지를 파일럿 전에 합의합니다.", `<a class="button dark" href="/contact/?type=security" data-event="security_view">보안 검토 문의</a>`) + pageLayout(`
<section id="principles"><h2>첫 파일럿부터 적용하는 원칙</h2><div class="grid-2"><article class="card"><h3>데이터 최소화</h3><p>첫 사용 사례에 필요하지 않은 CCTV, 생체정보와 개인식별정보를 수집하지 않습니다.</p></article><article class="card"><h3>읽기 전용 우선</h3><p>가능한 한 읽기 전용 계정과 최소 권한으로 시작합니다.</p></article><article class="card"><h3>고객별 경계</h3><p>고객 데이터는 목적과 범위를 분리하고 명시적 합의 없이 다른 고객 학습에 사용하지 않습니다.</p></article><article class="card"><h3>인간 통제</h3><p>중요한 생산계획 변경은 근거를 확인하는 승인 절차를 거칩니다.</p></article></div></section>
<section id="agreement"><h2>구현 범위는 계약 전에 문서로 합의합니다.</h2><ul><li>수집할 데이터와 처리 목적</li><li>연결 계정의 권한과 갱신 주기</li><li>저장 위치, 암호화와 보관 기간</li><li>역할별 접근·다운로드 범위</li><li>추천, 승인, 변경과 삭제 이력</li><li>외부 API 사용 여부와 허용 필드</li><li>파일럿 종료 시 반환·삭제 절차</li></ul><p class="notice">현재 제공 여부가 확인되지 않은 인증, 폐쇄망·온프레미스 배포와 SLA를 약속하지 않습니다. 필요한 조건은 기술 검토에서 확인합니다.</p></section>
<section id="workers"><h2>사람보다 공정과 제약을 분석합니다.</h2><p>개인 이름보다 역할·팀·기술등급을 우선합니다. 얼굴인식, 개인 생산성 순위, 징계·인사평가 자동화와 상시 감시는 기본 기능이 아닙니다.</p></section>
<section id="contact"><h2>보안 문의</h2><p>민감한 도면과 생산 데이터는 공개 문의폼에 첨부하지 마세요. 일반 보안·데이터 처리 검토는 <a href="mailto:security@iruvy.com" data-event="email_link_click">security@iruvy.com</a>으로 연락해 주세요.</p></section>`, [["principles","보안 원칙"],["agreement","사전 합의"],["workers","근로자 원칙"],["contact","보안 문의"]]);

const fitForm = (contact = false) => `
<form class="fit-form" data-fit-form data-form-type="${contact ? "contact" : "fit"}" novalidate>
  <input type="hidden" name="inquiry" value="${contact ? "company" : "flow"}">
  <div class="form-progress" aria-label="진행 단계"><span class="active" data-progress></span><span data-progress></span><span data-progress></span></div>
  <div class="form-step" data-form-step>
    <h2>${contact ? "문의 기본정보" : "담당자와 현장 기본정보"}</h2>
    <div class="fields">
      <div class="field"><label for="${contact ? "c-" : ""}name">이름 *</label><input id="${contact ? "c-" : ""}name" name="name" maxlength="80" required autocomplete="name"><div class="field-error"></div></div>
      <div class="field"><label for="${contact ? "c-" : ""}organization">회사·기관 *</label><input id="${contact ? "c-" : ""}organization" name="organization" maxlength="120" required autocomplete="organization"><div class="field-error"></div></div>
      <div class="field"><label for="${contact ? "c-" : ""}role">직책·역할 *</label><input id="${contact ? "c-" : ""}role" name="role" maxlength="120" required autocomplete="organization-title"><div class="field-error"></div></div>
      <div class="field"><label for="${contact ? "c-" : ""}email">회사 이메일 *</label><input id="${contact ? "c-" : ""}email" name="email" type="email" maxlength="254" required autocomplete="email"><div class="field-error"></div></div>
      <div class="field"><label for="${contact ? "c-" : ""}phone">연락처 *</label><input id="${contact ? "c-" : ""}phone" name="phone" type="tel" maxlength="40" required autocomplete="tel"><div class="field-error"></div></div>
      <div class="field"><label for="${contact ? "c-" : ""}environment">${contact ? "문의 분야" : "업종·현장 유형"} *</label><select id="${contact ? "c-" : ""}environment" name="environment" required><option value="">선택해 주세요</option>${contact ? '<option>제조 디자인 파트너</option><option>기술·데이터 연동</option><option>산업·공급 파트너십</option><option>투자</option><option>미디어</option><option>기타</option>' : '<option>정밀가공</option><option>금속가공</option><option>금형</option><option>기계·장비</option><option>전기장비</option><option>기타 이산제조</option>'}</select><div class="field-error"></div></div>
    </div>
    <div class="form-actions"><span></span><button class="button dark" type="button" data-next>다음 · 현장 범위</button></div>
  </div>
  <div class="form-step" data-form-step hidden>
    <h2>${contact ? "문의 범위" : "검증할 문제와 데이터"}</h2>
    <div class="fields">
      <div class="field full"><label for="${contact ? "c-" : ""}scope">${contact ? "논의 범위" : "대상 라인·공정과 데이터 상태"} *</label><textarea id="${contact ? "c-" : ""}scope" name="scope" maxlength="240" required placeholder="${contact ? "예: 읽기 전용 ERP 데이터 연동 검토" : "예: 정밀가공 생산셀 1개, ERP 주문·납기와 Excel 계획 보유"}"></textarea><div class="field-error"></div></div>
      <div class="field full"><label for="${contact ? "c-" : ""}challenge">${contact ? "문의 내용" : "최근 실제로 발생한 문제"} *</label><textarea id="${contact ? "c-" : ""}challenge" name="challenge" minlength="10" maxlength="5000" required placeholder="${contact ? "함께 논의하고 싶은 내용을 적어 주세요." : "납기 지연, 일정 재수립, 병목, 외주 지연 등 최근 실제 사례를 적어 주세요."}"></textarea><div class="field-error"></div></div>
      <div class="field full"><label for="${contact ? "c-" : ""}constraints">데이터·보안·연동 제약</label><textarea id="${contact ? "c-" : ""}constraints" name="constraints" maxlength="1000" placeholder="예: 원본 데이터 외부 전송 불가, 읽기 전용만 가능"></textarea><div class="field-error"></div></div>
    </div>
    <div class="form-actions"><button class="button" type="button" data-prev>이전</button><button class="button dark" type="button" data-next>다음 · 일정과 동의</button></div>
  </div>
  <div class="form-step" data-form-step hidden>
    <h2>검토 일정과 개인정보 동의</h2>
    <div class="fields">
      <div class="field full"><label for="${contact ? "c-" : ""}timeline">검토 희망 시점 *</label><select id="${contact ? "c-" : ""}timeline" name="timeline" required><option value="">선택해 주세요</option><option>1개월 이내</option><option>3개월 이내</option><option>6개월 이내</option><option>12개월 이내</option><option>정보 수집 중</option></select><div class="field-error"></div></div>
      <div class="field full"><label class="check-field"><input type="checkbox" name="privacy" value="agreed" required><span><a href="/privacy/" target="_blank">개인정보 처리방침</a>을 확인했으며 문의 처리에 동의합니다. *</span></label><div class="field-error"></div></div>
      <div class="field honeypot" aria-hidden="true"><label for="${contact ? "c-" : ""}website">웹사이트</label><input id="${contact ? "c-" : ""}website" name="website" tabindex="-1" autocomplete="off"></div>
    </div>
    <div class="form-actions"><button class="button" type="button" data-prev>이전</button><button class="button primary" type="submit">${contact ? "문의 접수" : "적합성 정보 접수"}</button></div>
  </div>
  <div class="form-status" data-form-status role="status" aria-live="polite" aria-atomic="true"></div>
</form>`;

const partners = pageHero("Design partner", "생산관리의 한 가지 반복 결정을<br>함께 검증합니다.", "Iruvy는 첫 제조 파트너와 납기 위험·병목 대응을 검증합니다. 전 공장을 한 번에 바꾸지 않고 한 공정, 한 데이터 범위, 한 KPI부터 시작합니다.", `<a class="button dark" href="#fit-check">파일럿 적합성 확인</a>`) + pageLayout(`
<section id="scope"><h2>한 공정, 한 가지 결정, 8~12주.</h2><div class="grid-2"><article class="card"><h3>적합한 현장</h3><ul><li>다품종 소량생산 또는 주문생산</li><li>생산계획 변경이 반복됨</li><li>주문·납기·작업실적 데이터 보유</li><li>대표·공장장과 생산관리자 참여</li></ul></article><article class="card"><h3>첫 범위에서 제외</h3><ul><li>전 공장 자동제어</li><li>개인 생산성 감시</li><li>무제한 커스텀 개발</li><li>기존 ERP·MES 전체 교체</li></ul></article></div></section>
<section id="process"><h2>진단부터 효과 검수까지 함께 진행합니다.</h2><ol><li><b>문제 인터뷰</b> · 최근 납기 지연과 일정변경 사례를 확인합니다.</li><li><b>데이터 적합성 확인</b> · 소량 샘플로 주문, 공정과 실적의 연결 가능성을 봅니다.</li><li><b>범위·KPI 합의</b> · 한 공정과 한 가지 결정을 정하고 기준선을 문서화합니다.</li><li><b>섀도 파일럿</b> · 데이터 연결, 분석, 대안 생성과 관리자 검수를 진행합니다.</li><li><b>효과 검수</b> · 합의한 KPI로 전후 결과와 재사용 가능성을 평가합니다.</li><li><b>본계약 또는 종료</b> · 효과와 조건이 맞으면 확장하고, 아니면 종료합니다.</li></ol><p class="notice">유료 파일럿을 기본으로 하며 대상 공정, 데이터 준비도, 연동과 보안 범위에 따라 제안합니다.</p></section>
<section id="commitment"><h2>양쪽의 투입을 미리 문서화합니다.</h2><div class="grid-2"><article class="card"><h3>Iruvy</h3><p>운영·데이터 진단, 파일럿 설계, 데이터 연결과 분석, 운영 화면, 주간 검수와 결과 리포트를 제공합니다.</p></article><article class="card"><h3>디자인 파트너</h3><p>합의한 데이터, 현장 접근, 생산관리 담당자, 주간 검수시간, 기준 KPI와 파일럿 후 구매검토 회의를 제공합니다.</p></article></div></section>
<section id="fit-check"><p class="eyebrow">Fit check</p>${fitForm(false)}</section>`, [["scope","파일럿 범위"],["process","진행 구조"],["commitment","상호 제공"],["fit-check","적합성 확인"]]);

const company = pageHero("Company", "현실의 운영을 이해하고,<br>더 나은 결정을 가능하게 합니다.", "Iruvy는 물리적 현장에서 발생하는 설비, 작업, 공간과 시간의 관계를 데이터로 연결해 운영 의사결정에 사용하는 기술을 만듭니다.") + pageLayout(`
<section id="mission"><h2>현장의 판단을 계산 가능한 시스템으로.</h2><p>Iruvy는 복잡한 산업현장의 데이터를 실행 가능한 의사결정으로 바꾸는 산업 운영 소프트웨어 회사입니다. 다품종 소량생산 제조현장의 납기·병목 의사결정부터 시작합니다.</p></section>
<section id="origin"><h2>현실의 관계를 모델링해 온 경험에서 출발했습니다.</h2><p>Iruvy는 복잡한 실내 환경의 공간과 이동을 모델링하는 기술에서 출발했습니다. 현실의 상태를 소프트웨어가 이해하려면 좌표만이 아니라 목적, 제약, 사건과 다음 행동이 함께 연결되어야 한다는 점을 배웠습니다. 이제 그 경험을 제조현장의 주문, 공정, 설비, 작업과 시간 관계로 확장합니다.</p></section>
<section id="principles"><h2>우리가 제품을 만드는 원칙</h2><div class="grid-2"><article class="card"><h3>Field before claim</h3><p>현장에서 반복적으로 확인한 문제만 제품 범위로 고정합니다.</p></article><article class="card"><h3>Human accountable</h3><p>모델의 추천과 사람의 최종 책임을 분리합니다.</p></article><article class="card"><h3>Measurable change</h3><p>기능 수보다 납기, 대기와 계획시간 같은 운영지표 변화를 측정합니다.</p></article><article class="card"><h3>Reusable system</h3><p>한 현장의 구축 경험을 두 번째 현장에서 재사용할 수 있는 제품 구조로 바꿉니다.</p></article></div></section>
<section id="vision"><h2>한 공장의 한 가지 결정에서 시작합니다.</h2><p>같은 납기·병목 사용사례를 서로 다른 제조현장에 반복 적용하는 것이 현재 가장 중요한 증명입니다. 충분한 고객 성과와 보안·파트너십이 쌓인 뒤 인접 공정과 고신뢰 산업 운영으로 확장합니다.</p><div class="actions"><a class="button dark" href="/design-partners/">디자인 파트너 프로그램 보기</a></div></section>`, [["mission","미션"],["origin","기원"],["principles","구축 원칙"],["vision","현재와 비전"]]);

const contact = pageHero("Contact", "한 가지 문제부터<br>함께 검토합니다.", "제조 디자인 파트너, 기술·데이터 연동, 산업 파트너십, 투자와 미디어 문의를 남겨 주세요.") + pageLayout(`<section id="contact-form">${fitForm(true)}</section><section id="email"><h2>이메일로 직접 문의</h2><p>일반 문의 · <a href="mailto:contact@iruvy.com" data-event="email_link_click">contact@iruvy.com</a><br>파트너십 · <a href="mailto:partners@iruvy.com" data-event="email_link_click">partners@iruvy.com</a><br>보안 · <a href="mailto:security@iruvy.com" data-event="email_link_click">security@iruvy.com</a></p><p class="notice">민감한 도면, 상세 생산수치와 원본 데이터는 첫 문의에 첨부하지 마세요.</p></section>`, [["contact-form","문의 접수"],["email","이메일"]]);

const legalPage = (eyebrow, title, lede, sections) => pageHero(eyebrow, title, lede) + pageLayout(sections);
const privacy = legalPage("Privacy", "개인정보 처리방침", "문의 처리에 필요한 정보만 수집하고 목적과 기간을 분명히 합니다.", `<section><h2>1. 수집 항목과 목적</h2><p>이름, 회사·기관, 직책·역할, 회사 이메일, 연락처, 문의 분야, 현장 범위, 문의 내용과 검토 희망 시점을 수집합니다. 문의 확인, 적합성 검토, 후속 연락과 접수 기록을 위해 사용합니다.</p></section><section><h2>2. 보관과 삭제</h2><p>관계 법령 또는 분쟁 대응에 필요한 기간을 제외하고 문의 목적이 끝난 정보는 내부 정책에 따라 삭제합니다. 세부 보관기간은 실제 운영체계 확정 후 이 방침에 반영합니다.</p></section><section><h2>3. 분석 정보</h2><p>사이트 개선을 위해 페이지와 CTA 이벤트를 기록할 수 있으나 분석 이벤트에 이름, 이메일, 전화번호, 회사명과 문의본문을 넣지 않습니다.</p></section><section><h2>4. 권리와 문의</h2><p>개인정보 열람, 정정과 삭제 요청은 <a href="mailto:contact@iruvy.com">contact@iruvy.com</a>으로 보내 주세요.</p><p>시행일 · 2026년 7월 24일</p></section>`);
const terms = legalPage("Terms", "이용약관", "웹사이트의 정보 범위와 책임 한계를 안내합니다.", `<section><h2>1. 정보 제공 목적</h2><p>이 사이트는 Iruvy와 Iruvy Flow의 현재 제품 방향, 파일럿 범위와 협력 절차를 설명합니다.</p></section><section><h2>2. 제품 범위</h2><p>합성 데이터 데모와 파일럿 설명은 특정 고객의 성과를 보증하지 않습니다. 실제 기능, 연동, 보안, 일정과 비용은 별도 계약에서 합의합니다.</p></section><section><h2>3. 지식재산권</h2><p>사이트의 브랜드, 문구, 디자인과 소프트웨어 자료는 관련 법령의 보호를 받습니다. 사전 동의 없는 상업적 복제와 재배포를 금합니다.</p></section><section><h2>4. 문의</h2><p>이용 관련 문의는 <a href="mailto:contact@iruvy.com">contact@iruvy.com</a>으로 보내 주세요.</p><p>시행일 · 2026년 7월 24일</p></section>`);
const accessibility = legalPage("Accessibility", "웹 접근성", "Iruvy는 제품뿐 아니라 정보를 전달하는 방식에서도 사람의 통제와 접근성을 중요하게 봅니다.", `<section><h2>접근성 목표</h2><p>WCAG 2.2 AA를 목표로 의미 있는 제목 구조, 키보드 접근, 명확한 초점 표시, 충분한 색상 대비, 모션 감소 설정과 폼 오류 연결을 구현합니다.</p></section><section><h2>지원하는 방식</h2><ul><li>본문 바로가기 링크와 의미 있는 랜드마크</li><li>키보드로 조작 가능한 메뉴, 탭과 폼</li><li>색상 외 텍스트로 제공하는 위험·상태 정보</li><li>합성 데이터 차트의 표와 텍스트 대안</li><li>작은 화면에서 가로 스크롤을 줄이는 카드형 레이아웃</li></ul></section><section><h2>피드백</h2><p>접근이 어려운 콘텐츠나 기능을 발견하면 사용한 기기, 브라우저와 페이지 주소를 <a href="mailto:contact@iruvy.com">contact@iruvy.com</a>으로 알려 주세요.</p></section>`);

const pages = new Map([
  ["", home], ["flow", flow], ["use-cases/production-planning", useCase], ["technology", technology],
  ["security", security], ["design-partners", partners], ["company", company], ["contact", contact],
  ["privacy", privacy], ["terms", terms], ["accessibility", accessibility]
]);

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "assets", "fonts"), { recursive: true });
writeFileSync(join(out, "assets", "site.css"), readFileSync(join(root, "site-src", "styles.css")));
writeFileSync(join(out, "assets", "site.js"), readFileSync(join(root, "site-src", "site.js")));
for (const file of ["Pretendard-Regular.woff2", "Pretendard-SemiBold.woff2", "Pretendard-ExtraBold.woff2"]) {
  cpSync(join(root, "assets", "fonts-web", file), join(out, "assets", "fonts", file));
}
for (const file of ["iruvy-logo.svg"]) cpSync(join(root, "assets", file), join(out, "assets", file));
for (const file of ["favicon.ico"]) cpSync(join(root, file), join(out, file));
if (existsSync(join(root, "assets", "og-flow.png"))) cpSync(join(root, "assets", "og-flow.png"), join(out, "assets", "og.png"));
else if (existsSync(join(root, "assets", "og-iruvy.png"))) cpSync(join(root, "assets", "og-iruvy.png"), join(out, "assets", "og.png"));

for (const [route, title, description] of routes) {
  const path = route ? join(out, route, "index.html") : join(out, "index.html");
  mkdirSync(dirname(path), { recursive: true });
  const schema = route === "flow" ? `<script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Iruvy Flow","applicationCategory":"BusinessApplication","description":"제조 운영 의사결정 소프트웨어","operatingSystem":"Web"}</script>` : "";
  writeFileSync(path, document({ route, title, description, content: pages.get(route), light: route !== "", schema }));
}

const notFound = document({
  route: "404", light: true, title: "페이지를 찾을 수 없습니다 | Iruvy",
  description: "요청한 페이지를 찾을 수 없습니다. Iruvy Flow 제품과 제조 디자인 파트너 정보를 확인하세요.",
  content: `${pageHero("404", "요청한 페이지를<br>찾을 수 없습니다.", "주소가 바뀌었거나 더 이상 제공하지 않는 페이지입니다.", `<a class="button dark" href="/">홈으로 이동</a><a class="button" href="/flow/">Iruvy Flow 보기</a>`)}`
});
writeFileSync(join(out, "404.html"), notFound);

writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: https://iruvy.com/sitemap.xml\n`);
writeFileSync(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(([route]) => `  <url><loc>https://iruvy.com/${route ? `${route}/` : ""}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);

const worker = `export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n`;
mkdirSync(join(out, "server"), { recursive: true });
writeFileSync(join(out, "server", "index.js"), worker);
mkdirSync(join(out, ".openai"), { recursive: true });
cpSync(join(root, ".openai", "hosting.json"), join(out, ".openai", "hosting.json"));

console.log(`Built Iruvy Flow site: ${routes.length + 1} pages`);
