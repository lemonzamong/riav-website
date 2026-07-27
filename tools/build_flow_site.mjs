import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const today = "2026-07-27";

const routes = [
  ["", "Iruvy | 산업현장의 숨은 캐파를 실행 가능한 결정으로", "Iruvy Flow는 제조현장의 병목과 납기 위험을 실시간 감지하고, 관리자가 검토할 최적의 작업순서와 자원배치 대안을 제시합니다."],
  ["flow", "Iruvy Flow | 제약공정 캐파 증폭 AI System", "ERP·MES·Excel 데이터 연결로 제약공정 병목을 풀고 납기를 지키는 최적 생산 대안을 계산하는 산업 자율운영 AI."],
  ["how-it-works", "작동 방식 | Iruvy Flow (IDFM Engine)", "Sense에서 Proof까지, 운영 월드모델(IDFM)과 수리 최적화로 연결되는 지능형 의사결정 체계."],
  ["capacity-lab", "Iruvy Capacity Lab | 현장 맞춤 적합성 진단", "최근 납기·병목 사건 데이터로 우리 공장의 숨은 캐파 증폭 가능성과 실효성을 검증하는 실무 프로그램."],
  ["evidence", "Evidence & Trust | Iruvy", "과거 경험과 현재 제조 AI 검증을 분리하여 투명하고 정직하게 성과 기록을 공개합니다."],
  ["company", "회사 소개 | Iruvy", "Iruvy는 복잡한 산업 현장의 운영 관계를 모델링하여 의사결정을 혁신하는 산업 자율운영 AI 기업입니다."],
  ["privacy", "개인정보 처리방침 | Iruvy", "Iruvy 웹사이트의 개인정보 수집, 이용, 보관과 권리 행사 방법을 안내합니다."],
  ["terms", "이용약관 | Iruvy", "Iruvy 웹사이트의 정보 이용 범위와 책임 한계를 안내합니다."],
  ["accessibility", "웹 접근성 | Iruvy", "Iruvy 웹사이트가 지향하는 WCAG 2.2 AA 수준의 접근성 원칙과 피드백 방법을 안내합니다."]
];

const nav = [
  ["/flow/", "Iruvy Flow"],
  ["/how-it-works/", "작동 방식"],
  ["/capacity-lab/", "Capacity Lab"],
  ["/evidence/", "Evidence"],
  ["/company/", "회사"]
];

const header = (route = "") => `
<a class="skip-link" href="#main">본문으로 이동</a>
<header class="site-header" data-header>
  <div class="shell header-inner">
    <a class="brand" href="/" aria-label="Iruvy 홈">
      <span class="brand-word" aria-hidden="true"><i>I</i>ruvy</span>
      <span class="brand-system-tag">SYS // FLOW-CORE</span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>메뉴</button>
    <nav class="site-nav" id="site-nav" aria-label="주요 메뉴" data-nav>
      ${nav.map(([href, label]) => `<a href="${href}"${route && href.includes(`/${route.split("/")[0]}/`) ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
      <a class="button primary" href="/capacity-lab/#apply" data-event="nav_primary_cta_click">우리 공장 적합성 확인</a>
    </nav>
  </div>
</header>`;

const footer = `
<footer class="site-footer">
  <div class="shell">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/" aria-label="Iruvy 홈"><span class="brand-word" aria-hidden="true"><i>I</i>ruvy</span></a>
        <p>제조·산업 현장의 멈춰있는 시간과 병목을 최적의 유효 생산 흐름(Capacity Amplification)으로 바꿉니다.</p>
      </div>
      <div class="footer-col"><strong>SYSTEM</strong><a href="/flow/">Iruvy Flow</a><a href="/how-it-works/">IDFM Architecture</a></div>
      <div class="footer-col"><strong>GOVERNANCE</strong><a href="/evidence/">Evidence</a><a href="/evidence/#governance">Trust &amp; Security</a></div>
      <div class="footer-col"><strong>PROGRAM</strong><a href="/capacity-lab/">Capacity Lab</a><a href="/capacity-lab/#apply">적합성 진단 신청</a></div>
      <div class="footer-col"><strong>COMPANY</strong><a href="/company/">회사 소개</a><a href="/privacy/">개인정보 처리방침</a><a href="/terms/">이용약관</a><a href="/accessibility/">접근성</a></div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 IRUVY INC. INDUSTRIAL AUTONOMY AI SYSTEM // ALL RIGHTS RESERVED.</span>
      <span><a href="mailto:contact@iruvy.com" data-event="email_link_click">contact@iruvy.com</a> · <a href="mailto:security@iruvy.com" data-event="email_link_click">security@iruvy.com</a></span>
    </div>
  </div>
</footer>`;

const document = ({ route = "", title, description, content, schema = "" }) => `<!doctype html>
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
  <meta property="og:image:alt" content="Iruvy Flow 산업 자율운영 AI System">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://iruvy.com/assets/og.png">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/assets/site.css?v=${today}">
  <script src="/assets/site.js?v=${today}" defer></script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Iruvy","url":"https://iruvy.com/","email":"contact@iruvy.com","logo":"https://iruvy.com/assets/iruvy-logo.svg"}</script>
  ${schema}
</head>
<body>
  ${header(route)}
  <main id="main">${content}</main>
  ${footer}
</body>
</html>`;

const demo = `
<div class="operation-demo" data-demo data-stage="0" aria-label="산업 현장 실시간 관제 및 의사결정 콘솔">
  <div class="demo-top">
    <span class="window-title">IRUVY FLOW CONSOLE · SYNTHETIC DATA</span>
    <span class="demo-status" data-demo-state aria-live="polite">01 SENSE · ERP/MES 데이터 연결</span>
  </div>
  <div class="digital-twin-canvas" aria-label="디지털 트윈 공정 노드 그래프">
    <svg class="svg-flow-node" viewBox="0 0 540 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 60 40 L 160 40 L 260 40 L 360 40 L 460 40" class="svg-line active" />
      <path d="M 160 40 L 260 85 L 360 85 L 460 40" class="svg-line" />
      <g transform="translate(60, 40)"><circle r="18" fill="#0e1017" stroke="#735ff0" stroke-width="2" /><circle r="6" fill="#10b981" /><text x="0" y="32" text-anchor="middle" class="svg-node-title">M-01 CUT</text><text x="0" y="44" text-anchor="middle" class="svg-node-text">가동중 98%</text></g>
      <g transform="translate(160, 40)"><circle r="18" fill="#0e1017" stroke="#735ff0" stroke-width="2" /><circle r="6" fill="#10b981" /><text x="0" y="32" text-anchor="middle" class="svg-node-title">M-02 MILL</text><text x="0" y="44" text-anchor="middle" class="svg-node-text">가동중 94%</text></g>
      <g transform="translate(260, 40)"><circle r="22" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" stroke-width="2" /><circle r="7" fill="#ef4444" /><text x="0" y="34" text-anchor="middle" class="svg-node-title" fill="#fca5a5">M-04 MILL</text><text x="0" y="46" text-anchor="middle" class="svg-node-text alert">정지 · 병목 감지</text></g>
      <g transform="translate(260, 85)"><circle r="16" fill="#0e1017" stroke="#64748b" stroke-width="1.5" /><circle r="5" fill="#f59e0b" /><text x="0" y="28" text-anchor="middle" class="svg-node-title">M-03 GRIND</text></g>
      <g transform="translate(360, 40)"><circle r="18" fill="#0e1017" stroke="#735ff0" stroke-width="2" /><circle r="6" fill="#10b981" /><text x="0" y="32" text-anchor="middle" class="svg-node-title">조립 (ASSY)</text><text x="0" y="44" text-anchor="middle" class="svg-node-text">대안 A안 대기</text></g>
      <g transform="translate(460, 40)"><circle r="18" fill="#0e1017" stroke="#10b981" stroke-width="2" /><path d="M-5 -2 L0 4 L8 -4" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /><text x="0" y="32" text-anchor="middle" class="svg-node-title">출하 (SHIP)</text><text x="0" y="44" text-anchor="middle" class="svg-node-text">목표 18:00</text></g>
    </svg>
  </div>
  <div class="demo-body">
    <div class="machine-row">
      <div class="machine"><b>M-01 CUT</b>가동률 98.4%</div>
      <div class="machine"><b>M-02 MILL</b>가동률 94.1%</div>
      <div class="machine"><b>M-03 GRIND</b>자원대기 0.4h</div>
      <div class="machine down"><b>M-04 MILL</b>긴급정지 STOP</div>
    </div>
    <div class="timeline">
      <div class="timeline-head"><span>PRODUCTION TIMELINE TELEMETRY</span><span>약속 납기선 → 오늘 18:00</span></div>
      <div class="timeline-row"><span>O-4821</span><div class="timeline-track"><i class="job warn" style="left:4%;width:42%"></i><i class="job risk" style="left:49%;width:32%"></i></div></div>
      <div class="timeline-row"><span>O-4822</span><div class="timeline-track"><i class="job" style="left:12%;width:56%"></i></div></div>
      <div class="timeline-row"><span>O-4824</span><div class="timeline-track"><i class="job risk" style="left:34%;width:48%"></i></div></div>
    </div>
    <div class="decision-grid">
      <div class="risk-card">
        <span>RISK // DETECTED</span>
        <strong data-risk-count>1건</strong>
        <span>M-04 정지 · 긴급 주문 O-4824 지연</span>
      </div>
      <div class="alternatives">
        <small>DECISION ALTERNATIVES // IDFM SOLVER</small>
        <div class="alt selected"><span>A안 · 제약공정 작업순서 최적화</span><b>추천안</b></div>
        <div class="alt"><span>B안 · 대체설비 M-02 재배치</span><b>비교</b></div>
        <div class="alt"><span>C안 · 외주 입고 일정 전환</span><b>비교</b></div>
      </div>
    </div>
  </div>
  <div class="demo-controls" aria-label="데모 단계 선택">
    <button class="demo-step active" type="button" data-demo-step="connect">01 · DATA CONNECT</button>
    <button class="demo-step" type="button" data-demo-step="risk">02 · BOTTLENECK</button>
    <button class="demo-step" type="button" data-demo-step="alternatives">03 · SOLVER OPT</button>
    <button class="demo-step" type="button" data-demo-step="approve">04 · COMMAND</button>
  </div>
</div>`;

const home = `
<section class="hero">
  <div class="shell hero-grid">
    <div>
      <div class="sys-tag">SYS // INDUSTRIAL_AUTONOMY_AI</div>
      <h1>산업현장의 숨은 캐파를,<br><span class="highlight">실행 가능한 결정으로.</span></h1>
      <p class="lede">Iruvy Flow는 ERP·MES·Excel에 흩어진 데이터를 실시간 연결하여 제약공정의 병목과 납기 지연 위험을 선제적으로 감지하고, 생산관리자가 확신을 갖고 선택할 수 있는 최적의 작업순서 대안을 제시합니다.</p>
      <div class="actions">
        <a class="button primary" href="/capacity-lab/#apply" data-event="hero_primary_cta_click">우리 공장 적합성 확인</a>
        <a class="button dark" href="#demo" data-event="hero_demo_open">Flow 관제 보기</a>
      </div>
      <div class="trust-line">
        <span>첫 문의에 원본 데이터 불필요</span>
        <span>기존 ERP/MES 시스템 교체 없음</span>
        <span>8~12주 유료 섀도 파일럿 검증</span>
      </div>
      <p class="stage-note">SYSTEM STAGE // L1 RECOMMEND (HUMAN-IN-THE-LOOP) // OPERATIONAL TWIN CONSOLE</p>
    </div>
    ${demo}
  </div>
</section>

<section class="trust-strip" aria-label="제품 핵심 가치">
  <div class="shell trust-grid">
    <div class="trust-item"><small>TARGET DOMAIN</small><strong>주문생산형 이산제조</strong></div>
    <div class="trust-item"><small>KEY METRIC</small><strong>제약공정 캐파 증폭</strong></div>
    <div class="trust-item"><small>DEPLOYMENT</small><strong>8~12주 유료 섀도 Sprint</strong></div>
    <div class="trust-item"><small>GOVERNANCE</small><strong>관리자 검토·수정·승인</strong></div>
  </div>
</section>

<section class="section references">
  <div class="shell">
    <div class="section-head">
      <div class="sys-tag">GOVERNANCE // EVIDENCE &amp; TRUST</div>
      <h2>검증된 현장 경험과 데이터로<br>신뢰할 수 있는 가치를 만듭니다.</h2>
      <p>Iruvy는 과장이나 모호한 추측 대신 검증 가능한 실증 데이터만을 바탕으로 이야기합니다. 지난 현장 경험의 자산과 새롭게 증명할 제조 AI 성과를 성격별로 명확히 구분해 공개합니다.</p>
    </div>
    <div class="reference-grid">
      <article class="reference-card current-ref">
        <div class="reference-top"><span>MANUFACTURING FLOW</span><b>VALIDATING</b></div>
        <strong>첫 유료 제조 파일럿 검증 준비 중</strong>
        <p>단 하나의 제약공정, 핵심 KPI에 집중하여 8~12주간 현장 섀도 Sprint를 진행할 제조 파트너를 모집합니다.</p>
        <small>현재 제조 분야의 고객 성과 수치는 실증 완료 전입니다.</small>
      </article>
      <article class="reference-card">
        <div class="reference-top"><span>PREVIOUS FIELD EXPERIENCE</span><b>8 SITES</b></div>
        <strong>8개 현장 공간 실증 체계 구축</strong>
        <p>이전 공간·이동 데이터 인프라를 실제 환경에 구축해 자율 운영 구조를 적용했던 현장 경험입니다.</p>
        <small>B2C/공공 실증 경험이며 제조 Flow의 직접적 매출/계약 건수가 아닙니다.</small>
      </article>
      <article class="reference-card">
        <div class="reference-top"><span>PREVIOUS PRODUCT TEST</span><b>87 / 90</b></div>
        <strong>약 300m 복합 경로 내부 실증 완료</strong>
        <p>2차 내부 실증 테스트에서 참여자 90명 중 87명이 복잡한 실내 경로를 완주하는 성과를 얻었습니다.</p>
        <small>특정 환경 테스트 결과이며 제조 Flow의 성과 수치와 구분됩니다.</small>
      </article>
    </div>
    <div class="program-line" aria-label="육성 프로그램 지원 기관">
      <span>2026 예비창업패키지</span>
      <span>KIST 홍릉강소특구 육성기업</span>
      <span>서울대학교 캠퍼스타운</span>
      <span>SNU × EO Launchpad</span>
    </div>
    <div class="reference-action">
      <p>귀사의 최근 납기·병목 문제도 Flow로 해결 가능한지 데이터로 먼저 검증하세요.</p>
      <a class="button primary" href="/capacity-lab/#apply">우리 공장 적합성 확인</a>
    </div>
  </div>
</section>

<section class="section architecture-section">
  <div class="shell">
    <div class="section-head">
      <div class="sys-tag">ARCHITECTURE // IDFM_CLOSED_LOOP</div>
      <h2>데이터 수집에서 현장 실행까지,<br>6단계 검증 프로세스로 연결합니다.</h2>
      <p>Flow는 기존 ERP/MES를 전면 교체하지 않고 지능형 의사결정 레이어를 추가합니다. 'Semantic · Temporal · Physical · Economic Twin'이 결합된 운영 월드모델이 최적 대안을 도출합니다.</p>
    </div>
    <div class="arch-pipeline-container" aria-label="데이터 분석 파이프라인 시각화">
      <svg viewBox="0 0 800 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 80 60 L 220 60 L 360 60 L 500 60 L 640 60 L 740 60" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
        <path d="M 80 60 L 500 60" stroke="#735ff0" stroke-width="2" stroke-dasharray="6 4" />
        <g transform="translate(80, 60)"><rect x="-55" y="-30" width="110" height="60" rx="6" fill="#0e1017" stroke="#735ff0" stroke-width="1.5" /><text x="0" y="-6" text-anchor="middle" font-size="10" font-weight="700" fill="#735ff0">01 · SENSE</text><text x="0" y="10" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">ERP / MES</text><text x="0" y="22" text-anchor="middle" font-size="9" fill="#94a3b8">수집연동</text></g>
        <g transform="translate(220, 60)"><rect x="-55" y="-30" width="110" height="60" rx="6" fill="#0e1017" stroke="#735ff0" stroke-width="1.5" /><text x="0" y="-6" text-anchor="middle" font-size="10" font-weight="700" fill="#735ff0">02 · WORLD</text><text x="0" y="10" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">운영 월드모델</text><text x="0" y="22" text-anchor="middle" font-size="9" fill="#94a3b8">4대 트윈</text></g>
        <g transform="translate(360, 60)"><rect x="-55" y="-30" width="110" height="60" rx="6" fill="#0e1017" stroke="#735ff0" stroke-width="1.5" /><text x="0" y="-6" text-anchor="middle" font-size="10" font-weight="700" fill="#735ff0">03 · DECIDE</text><text x="0" y="10" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">최적 대안</text><text x="0" y="22" text-anchor="middle" font-size="9" fill="#94a3b8">수리 최적화</text></g>
        <g transform="translate(500, 60)"><rect x="-55" y="-30" width="110" height="60" rx="6" fill="#141722" stroke="#735ff0" stroke-width="2" /><text x="0" y="-6" text-anchor="middle" font-size="10" font-weight="700" fill="#735ff0">04 · COMMAND</text><text x="0" y="10" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">관리자 승인</text><text x="0" y="22" text-anchor="middle" font-size="9" font-weight="700" fill="#735ff0">최종 결정권</text></g>
        <g transform="translate(640, 60)"><rect x="-55" y="-30" width="110" height="60" rx="6" fill="#050609" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-dasharray="3 3" /><text x="0" y="-6" text-anchor="middle" font-size="10" font-weight="700" fill="#64748b">05 · ACT</text><text x="0" y="10" text-anchor="middle" font-size="12" font-weight="700" fill="#94a3b8">계획 반영</text><text x="0" y="22" text-anchor="middle" font-size="9" fill="#64748b">섀도 모드</text></g>
      </svg>
    </div>
    <div class="workflow-rail">
      <article class="current"><span>01 · SENSE</span><h3>현장 데이터 연결</h3><p>ERP·MES·Excel 등 축적된 데이터를 읽기 전용으로 수집합니다.</p></article>
      <article class="current"><span>02 · WORLD</span><h3>운영 관계 모델링</h3><p>주문·공정·설비·자재·인력 및 시간 사이의 상관관계를 잇습니다.</p></article>
      <article class="current"><span>03 · DECIDE</span><h3>최적 대안 계산</h3><p>병목 및 납기 지연 위험을 계산하고 제약조건을 고려한 대안을 도출합니다.</p></article>
      <article class="current"><span>04 · COMMAND</span><h3>관리자 최종 승인</h3><p>생산관리자가 근거를 확인하고 대안을 수정·승인 또는 거절합니다.</p></article>
      <article class="validating"><span>05 · ACT</span><h3>현장 계획 반영</h3><p>승인된 최적안을 기존 워크플로 및 작업지시에 즉시 반영합니다.</p></article>
      <article class="validating"><span>06 · PROOF</span><h3>실제 성과 검증</h3><p>예상 효과와 실제 생산 지표의 차이를 분석하여 기록으로 남깁니다.</p></article>
    </div>
    <div class="architecture-boundary">
      <span><b>CURRENT SCOPE</b> Sense → World → Decide → Command (L1 Recommend)</span>
      <span><b>NEXT STEP</b> Act → Proof (섀도 파일럿 검증)</span>
      <span><b>LONG-TERM VISION</b> Governed Industrial Autonomy (L2~L4)</span>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="shell">
    <div class="section-head">
      <div class="sys-tag">PROBLEM // THE_PRODUCTION_GAP</div>
      <h2>생산 데이터는 매일 쌓여도,<br>작업 일정은 왜 매일 다시 짤까요?</h2>
      <p>긴급 주문 수주, 핵심 설비 정지, 외주 회수 지연은 순식간에 생산 일정을 꼬이게 만듭니다. 기존 ERP/MES는 결과를 사후에 보여줄 뿐, 여러 사건이 뒤얽힐 때 최선의 작업 순서를 빠르게 계산하지 못합니다.</p>
    </div>
    <div class="grid-3">
      <article class="card">
        <span class="num">01 // LATENCY</span>
        <h3>사건 발생 후에야 지연을 깨닫습니다</h3>
        <p>납기 위험이 주문·공정·설비 데이터 사이에 분산되어 있어 사전 대응이 불가능합니다.</p>
      </article>
      <article class="card">
        <span class="num">02 // BOTTLENECK</span>
        <h3>병목의 진짜 원인을 추적하기 어렵습니다</h3>
        <p>설비 가동률은 집계되어도 특정 주문이 어떤 공정에서 지연되는지 파악하기 어렵습니다.</p>
      </article>
      <article class="card">
        <span class="num">03 // RECORD_LOSS</span>
        <h3>판단의 이유와 결과 기록이 남지 않습니다</h3>
        <p>매일 수작업으로 변경하는 생산 계획의 결정 근거가 데이터로 축적되지 않습니다.</p>
      </article>
    </div>
  </div>
</section>

<section class="section dark" id="demo">
  <div class="shell">
    <div class="section-head">
      <div class="sys-tag">CONSOLE // INTERACTIVE_TELEMETRY</div>
      <h2>단순한 경보 알림을 넘어,<br>관리자가 즉시 실행할 수 있는 대안을 제시합니다.</h2>
      <p>실체 있는 데이터 콘솔 · 아래 탭을 클릭하여 시나리오별 관제 화면과 감사 기록을 확인하세요.</p>
    </div>
    <div class="product-console">
      <div class="console-tabs" role="tablist" aria-label="제품 화면 탭">
        <button class="console-tab" role="tab" aria-selected="true" aria-controls="panel-risk" data-console-tab>Risk (지연 위험)</button>
        <button class="console-tab" role="tab" aria-selected="false" aria-controls="panel-bottleneck" data-console-tab>Bottleneck (병목 분석)</button>
        <button class="console-tab" role="tab" aria-selected="false" aria-controls="panel-decisions" data-console-tab>Decisions (대안 비교)</button>
        <button class="console-tab" role="tab" aria-selected="false" aria-controls="panel-audit" data-console-tab>Audit Log (승인 기록)</button>
      </div>
      <div class="console-panel active" id="panel-risk" role="tabpanel" data-console-panel>
        <table class="console-table">
          <thead><tr><th>주문 번호</th><th>약속 납기</th><th>예상 영향</th><th>주요 원인</th></tr></thead>
          <tbody>
            <tr><td>O-4821</td><td>오늘 18:00</td><td class="risk-text">+4.2h 지연 예상</td><td>M-04 설비 고장 정지</td></tr>
            <tr><td>O-4824</td><td>내일 11:00</td><td class="risk-text">+3.1h 지연 예상</td><td>외주 입고 일정 지연</td></tr>
          </tbody>
        </table>
      </div>
      <div class="console-panel" id="panel-bottleneck" role="tabpanel" data-console-panel>
        <table class="console-table">
          <thead><tr><th>공정명</th><th>대상 설비</th><th>대기 작업 수</th><th>상류 영향 주문</th></tr></thead>
          <tbody>
            <tr><td>밀링 (MILL)</td><td>M-04</td><td>6건 대기</td><td>O-4821 · O-4824</td></tr>
            <tr><td>연삭 (GRIND)</td><td>M-03</td><td>3건 대기</td><td>검사 공정 대기 중</td></tr>
          </tbody>
        </table>
      </div>
      <div class="console-panel" id="panel-decisions" role="tabpanel" data-console-panel>
        <table class="console-table">
          <thead><tr><th>대안 구분</th><th>주요 변경 내용</th><th>검토 제약조건</th><th>진행 상태</th></tr></thead>
          <tbody>
            <tr><td>A안 (추천)</td><td>O-4821 제약공정 우선 투입</td><td>자재 준비 100% 완료 확인</td><td>검토 및 승인 대기</td></tr>
            <tr><td>B안</td><td>M-02 설비 대체 배치</td><td>셋업 교체시간 40분 소요</td><td>비교 검토 중</td></tr>
          </tbody>
        </table>
      </div>
      <div class="console-panel" id="panel-audit" role="tabpanel" data-console-panel>
        <table class="console-table">
          <thead><tr><th>시각</th><th>관리자 행동</th><th>판단 사유</th><th>성과 기록</th></tr></thead>
          <tbody>
            <tr><td>09:16</td><td>대안 A안 최종 승인</td><td>필수 자재 입고 완료 확인</td><td>섀도 모드 검증 저장</td></tr>
            <tr><td>17:40</td><td>실제 생산 완료 기록</td><td>기초 계획 대비 비교 분석</td><td>DEMO 기록 보존</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Interactive Capacity Amplification ROI Calculator -->
    <div class="roi-calculator">
      <div class="calc-grid">
        <div class="calc-inputs">
          <h3>현장 숨은 캐파 &amp; ROI 진단 시뮬레이터</h3>
          <p style="font-size:14px;color:var(--steel-light);margin:0 0 10px;">우리 공장의 설비 대수와 월평균 지연 건수를 조절하여, Iruvy Flow 도입 시 회수 가능한 유효 생산시간을 계산하세요.</p>
          <div class="calc-field">
            <label>제약 공정 설비 수: <span class="calc-val" data-val-machines>5대</span></label>
            <input type="range" min="1" max="30" value="5" data-calc-machines>
          </div>
          <div class="calc-field">
            <label>월평균 납기/일정 지연 사건: <span class="calc-val" data-val-delays>12건</span></label>
            <input type="range" min="1" max="50" value="12" data-calc-delays>
          </div>
        </div>
        <div class="calc-results">
          <small>EXPECTED RECOVERABLE CAPACITY</small>
          <strong data-calc-hours>주 111시간</strong>
          <small style="margin-top:14px;">ESTIMATED OTD (ON-TIME DELIVERY)</small>
          <strong style="font-size:24px;color:var(--lime)" data-calc-otd>+18%p (목표 88%)</strong>
          <p>※ 현장 데이터 진단(Capacity Lab)을 통해 정확한 수치를 산정합니다.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="shell">
    <div class="section-head">
      <div class="sys-tag">METRICS // OPERATIONAL_KPI</div>
      <h2>성과는 대시보드 화면이 아니라<br>실제 생산 지표의 개선으로 측정합니다.</h2>
      <p>파일럿 진단 단계에서 기준선(Baseline), 측정 방법 및 검증 기간을 고객사와 먼저 합의합니다. 아래 지표는 파일럿에서 측정·개선할 실효 KPI 항목입니다.</p>
    </div>
    <div class="metric-grid">
      <div class="metric"><small>KPI 01</small><strong>납기 준수율 (OTD)</strong></div>
      <div class="metric"><small>KPI 02</small><strong>지연 위험 조기 감지 시간</strong></div>
      <div class="metric"><small>KPI 03</small><strong>생산 계획 수립 소요 시간</strong></div>
      <div class="metric"><small>KPI 04</small><strong>일정 재수립 반복 횟수</strong></div>
      <div class="metric"><small>KPI 05</small><strong>공정 간 대기 및 병목 시간</strong></div>
      <div class="metric"><small>KPI 06</small><strong>돌발 잔업 및 긴급 외주 비용</strong></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell scenario">
    <div>
      <div class="sys-tag">INTEGRATION // ZERO_INFRA_CHANGE</div>
      <h2>기존 ERP/MES 시스템 교체 없이,<br>필요한 데이터부터 연동합니다.</h2>
      <p>초기 검증은 기존 시스템의 수정 없이 읽기 전용(Read-only) 데이터 연동으로 안전하게 시작합니다. 데이터 보안과 보관 규칙은 사전 합의 후 적용됩니다.</p>
      <div class="actions"><a class="button dark" href="/how-it-works/" data-event="technology_view">작동 방식 기술 보기</a></div>
    </div>
    <div class="data-line">
      <span class="data-chip">ERP 주문 데이터</span>
      <span class="data-chip">MES 공정 정보</span>
      <span class="data-chip">Excel / CSV 계획</span>
      <span class="data-chip">설비 가동 로그</span>
      <span class="data-chip">작업 완료 실적</span>
      <span class="data-chip">외주·자재 입고 일정</span>
      <span class="data-chip">작업자 가용 정보</span>
    </div>
  </div>
</section>

<section class="section dark">
  <div class="shell">
    <div class="section-head">
      <div class="sys-tag">LEDGER // TRANSPARENT_TRACKING</div>
      <h2>단순 추천에 그치지 않고,<br>실제 결과까지 투명하게 추적합니다.</h2>
      <p>기준 지표, 현장 제약, AI 추천 대안, 관리자의 승인 결정, 현장 실행 결과와 실제 경제적 가치를 하나의 통합 기록으로 검증합니다.</p>
    </div>
    <div class="ledger">
      <div><span>BASELINE</span><strong>기준 생산성: 시간당 양품 18.4개</strong></div>
      <div><span>CONSTRAINT</span><strong>CNC-04 셋업 전환 병목 제약</strong></div>
      <div><span>RECOMMENDATION</span><strong>작업순서 B안 최적화 제시</strong></div>
      <div><span>HUMAN DECISION</span><strong>생산관리자 검토 후 최종 승인</strong></div>
      <div><span>OBSERVED RESULT</span><strong>실제 결과 측정 및 검증 중</strong></div>
    </div>
    <div class="actions" style="justify-content:start;"><a class="button" href="/evidence/">성과 검증 방식 자세히 보기</a></div>
  </div>
</section>

<section class="section">
  <div class="shell partner-panel">
    <div>
      <div class="sys-tag">PROGRAM // CAPACITY_LAB</div>
      <h2>현장 데이터로 우리 공장의<br>숨은 캐파를 정밀 진단합니다.</h2>
      <p class="lede">최근의 납기 지연이나 공정 병목 사례를 기반으로 제약 지도 작성, 데이터 준비도 진단, 의사결정 프로토타입과 KPI 검증 계획을 함께 도출합니다.</p>
      <div class="actions"><a class="button primary" href="/capacity-lab/#apply" data-event="design_partner_view">우리 공장 적합성 확인</a></div>
    </div>
    <ul class="check-list">
      <li>제약공정 및 캐파 손실 지도 작성</li>
      <li>현장 데이터 준비도 (A~D등급) 진단</li>
      <li>관리자 맞춤 의사결정 콘솔 프로토타입</li>
      <li>KPI 및 검증 측정 체계 수립</li>
      <li>섀도 파일럿 진행 적합성 제안</li>
    </ul>
  </div>
</section>

<section class="section paper">
  <div class="shell scenario">
    <div>
      <div class="sys-tag">ABOUT // ENGINEERING_PRINCIPLES</div>
      <h2>현장의 숙련된 판단을<br>계산 가능한 정밀 시스템으로.</h2>
    </div>
    <div>
      <p>Iruvy는 복잡한 현실의 상태와 관계를 데이터 모델로 재구성해 온 기술력을 바탕으로, 제조 현장의 주문·공정·설비·자재·시간을 연결하는 지능형 운영 소프트웨어를 만듭니다.</p>
      <div class="grid-3">
        <article><h3>현장 중심 접근</h3><p>실제 현장의 핵심 병목 문제부터 시작합니다.</p></article>
        <article><h3>명확한 책임 분리</h3><p>AI의 대안 제시와 사람의 최종 책임을 구분합니다.</p></article>
        <article><h3>실효적 변화 측정</h3><p>화려한 기능보다 실제 지표의 변화를 검증합니다.</p></article>
      </div>
      <div class="actions" style="margin-top:24px;"><a class="button dark" href="/company/">회사 소개 및 경영 원칙</a></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell cta-panel">
    <div class="sys-tag">START // CAPACITY_DIAGNOSIS</div>
    <h2>최근 3개월 안에 납기나 병목 문제가 있었다면,<br>그 사례 데이터부터 알려주세요.</h2>
    <p>복잡한 원본 데이터 전송이나 긴 제안서 작성 없이 시작할 수 있습니다. 현재 데이터와 현장 상황을 바탕으로 Flow 적용 가능성을 먼저 진단해 드립니다.</p>
    <div class="actions">
      <a class="button primary" href="/capacity-lab/#apply">우리 공장 적합성 확인</a>
      <a class="button dark" href="mailto:contact@iruvy.com" data-event="email_link_click">이메일 한 줄 문의</a>
    </div>
  </div>
</section>`;

const pageHero = (eyebrow, title, lede, actions = "") => `<section class="page-hero"><div class="shell"><div class="sys-tag">${eyebrow}</div><h1>${title}</h1><p class="lede">${lede}</p>${actions ? `<div class="actions">${actions}</div>` : ""}</div></section>`;
const pageLayout = (sections, links = []) => `<section class="page-body"><div class="shell page-grid"><aside class="page-aside" aria-label="페이지 목차">${links.map(([id,label]) => `<a href="#${id}">${label}</a>`).join("")}</aside><div class="prose">${sections}</div></div></section>`;

// Flow Product Page (Palantir/Anduril Aesthetic Overhaul)
const flow = pageHero("PRODUCT // IRUVY_FLOW_SYSTEM", "제약공정의 숨은 캐파를,<br>더 나은 결정으로 깨웁니다.", "주문·공정·설비·자재·역할과 시간을 운영 월드모델로 연결하고, 납기 위험과 캐파 손실의 원인을 찾아 실행 가능한 대안을 제시합니다.", `<a class="button dark" href="/#demo">Flow 관제 보기</a><a class="button primary" href="/capacity-lab/#apply">Capacity Lab 신청</a>`) + pageLayout(`
<section id="structure">
  <h2>한 가지 결정에 필요한 4대 결합 구조</h2>
  <div class="grid-2">
    <article class="card">
      <span class="num">SYS // 01</span>
      <h3>Data Connect (읽기 전용 수집)</h3>
      <p>ERP·MES·Excel의 주문·납기, 공정순서, 작업실적, 설비상태, 외주·자재 일정과 가용성을 수정 없이 안전하게 수집합니다.</p>
    </article>
    <article class="card">
      <span class="num">SYS // 02</span>
      <h3>Operational Twin (운영 관계 모델)</h3>
      <p>주문이 어떤 공정을 거치고 어떤 설비와 역할이 필요하며 돌발 사건이 납기에 미치는 영향을 다차원 트윈 그래프로 잇습니다.</p>
    </article>
    <article class="card">
      <span class="num">SYS // 03</span>
      <h3>Decision Engine (최적 대안 계산)</h3>
      <p>납기 위험과 병목을 실시간 계산하고 수리 최적화 및 시뮬레이션을 통해 현장 제약을 충족하는 작업순서 대안을 도출합니다.</p>
    </article>
    <article class="card">
      <span class="num">SYS // 04</span>
      <h3>Human Control (관리자 최종 승인)</h3>
      <p>추천 근거와 제약을 확인하고 생산관리자가 직접 승인·수정·거절하며, 예상과 실제 결과를 Outcome Ledger로 보존합니다.</p>
    </article>
  </div>
</section>

<section id="autonomy-spectrum">
  <h2>자율운영 스펙트럼 (Autonomy Spectrum)</h2>
  <p>Iruvy Flow는 무책임한 자동 제어를 표방하지 않습니다. 현재 L1 Recommend 단계에서 사람의 명확한 책임을 보장합니다.</p>
  <div class="status-list">
    <div class="status-row">
      <span class="status-badge">CURRENT SCOPE</span>
      <div>
        <h3>L0 Observe → L1 Recommend (Human-in-the-loop)</h3>
        <p>현장 데이터 연결 및 돌발 위험 감지. 생산관리자가 근거를 검토하고 대안을 최종 승인·수정·거절합니다.</p>
      </div>
    </div>
    <div class="status-row">
      <span class="status-badge pilot">ROADMAP</span>
      <div>
        <h3>L2 Coordinate → L3 Bounded Autonomy (통제된 자율운영)</h3>
        <p>합의된 하드 제약 조건 내에서 작업 순서 재배치를 안전하게 자동 조율하는 장기 비전 단계입니다.</p>
      </div>
    </div>
    <div class="status-row">
      <span class="status-badge boundary">OUT OF SCOPE</span>
      <div>
        <h3>Direct Robot Control &amp; Worker Surveillance (제외 범위)</h3>
        <p>설비/로봇 직접 제어, 근로자 개인 생산성 평가, 상시 CCTV 감시는 Iruvy Flow의 제품 범위가 아닙니다.</p>
      </div>
    </div>
  </div>
</section>

<section id="boundary">
  <h2>사용 경계 및 적합 현장</h2>
  <div class="grid-2">
    <article class="card">
      <h3>가장 효과적인 현장</h3>
      <ul>
        <li>주문생산형 (MTO) 및 다품종 소량생산 제조</li>
        <li>정밀가공, 금속가공, 기계부품, 금형 공장</li>
        <li>긴급 주문, 설비 정지, 외주 지연이 자주 발생하는 현장</li>
        <li>ERP/MES/Excel 데이터를 일정 기간 보유한 사업장</li>
      </ul>
    </article>
    <article class="card">
      <h3>첫 사용에 적합하지 않은 프로젝트</h3>
      <ul>
        <li>ERP·MES 전체를 교체하는 초대형 IT 프로젝트</li>
        <li>안전 중요 판단 및 방산 표적/발사 자동화 시스템</li>
        <li>개인 작업자 감시 및 인사평가 목적</li>
        <li>데이터와 현장 담당자 참여가 없는 무료 개발 요청</li>
      </ul>
    </article>
  </div>
</section>

<section id="faq" class="faq">
  <h2>자주 묻는 질문</h2>
  <details><summary>ERP나 MES를 바꿔야 하나요?</summary><p>아닙니다. 기존 시스템에서 필요한 데이터를 읽기 전용으로 연결하는 방식부터 검토합니다.</p></details>
  <details><summary>데이터가 Excel뿐이어도 가능한가요?</summary><p>주문, 납기, 공정과 작업실적이 일정 기간 축적되어 있다면 가능성을 진단할 수 있습니다. 데이터 품질에 따라 첫 범위가 달라집니다.</p></details>
  <details><summary>AI가 생산계획을 자동으로 바꾸나요?</summary><p>초기 범위에서는 자동 변경하지 않습니다. 가능한 대안과 근거를 제시하고 관리자가 승인·수정·거절합니다.</p></details>
  <details><summary>어떤 데이터 기간이 필요한가요?</summary><p>가능하면 6~12개월의 주문·공정·실적을 권장합니다. 현장에 따라 더 짧은 기간으로 데이터 준비도 진단부터 시작할 수 있습니다.</p></details>
</section>`, [["structure","4대 결합 구조"],["autonomy-spectrum","자율운영 스펙트럼"],["boundary","사용 경계"],["faq","FAQ"]]);

// Technology Page (IDFM Engine)
const technology = pageHero("ENGINE // IDFM_ARCHITECTURE", "Sense에서 Proof까지,<br>하나의 결정이 만들어지는 과정.", "Iruvy Flow는 단순 LLM 하나에 판단을 의존하지 않습니다. 수리 최적화, 제약 시뮬레이션, 운영 월드모델과 관리자 승인 체계로 구성됩니다.", `<a class="button primary" href="/capacity-lab/#apply" data-event="technology_view">우리 데이터로 검토하기</a>`) + pageLayout(`
<section id="architecture">
  <h2>Iruvy Decision Foundation Model (IDFM) 4-Layer 구조</h2>
  <div class="grid-2" style="margin-bottom:30px;">
    <article class="card">
      <span class="num">LAYER 01 // ENCODER</span>
      <h3>State Encoder &amp; Language Model</h3>
      <p>ERP·MES·작업일지의 비정형 데이터와 실시간 사건(Event)을 구조화된 Decision Episode 상태로 인코딩합니다.</p>
    </article>
    <article class="card">
      <span class="num">LAYER 02 // WORLD_MODEL</span>
      <h3>Operational World Model (4 Twins)</h3>
      <p>Semantic(객체) · Temporal(시간선) · Physical(설비제약) · Economic(ROI) Twin이 현장 상태를 다차원 그래프로 유지합니다.</p>
    </article>
    <article class="card">
      <span class="num">LAYER 03 // SOLVER</span>
      <h3>Strategy Policy &amp; Solver Engine</h3>
      <p>하드 제약을 100% 준수하는 제약 최적화 및 시뮬레이션을 실행하여 최적의 작업순서와 자원배치 대안을 도출합니다.</p>
    </article>
    <article class="card">
      <span class="num">LAYER 04 // VERIFIER</span>
      <h3>Outcome &amp; Value Verifier</h3>
      <p>관리자의 승인·수정·거절 이력과 실제 실행 결과를 Outcome Ledger로 기록하고, 기권 조건 미충족 시 정직하게 판단을 기권합니다.</p>
    </article>
  </div>
</section>

<section id="roles">
  <h2>문제별 기술 분리 및 검증 경계</h2>
  <div class="grid-2">
    <article class="card">
      <h3>LLM이 담당하는 영역</h3>
      <ul>
        <li>비정형 작업일지 및 현장 텍스트 구조화</li>
        <li>생산관리자의 자연어 질의응답 처리</li>
        <li>추천 대안 A/B안의 선택 사유 및 차이점 설명</li>
        <li>주간/월간 생산 보고서 보조 생성</li>
      </ul>
    </article>
    <article class="card">
      <h3>수리 최적화·시뮬레이터가 담당하는 영역</h3>
      <ul>
        <li>납기 및 제약 조건 100% 검증</li>
        <li>제약공정 최적 작업순서(Sequencing) 계산</li>
        <li>설비 고장 시 대체 경로 재배치 계산</li>
        <li>기권 판단 및 regret 최저치 산출</li>
      </ul>
    </article>
  </div>
</section>

<section id="learning">
  <h2>자가학습 및 오프라인 안전 배포 통제</h2>
  <p>Iruvy Flow는 관리자가 승인했다고 해서 모델이 즉시 위험하게 자가학습하지 않습니다. 모든 결정과 실제 성과는 안전 검증 게이트를 거칩니다.</p>
  <div class="status-list">
    <div class="status-row"><span>01</span><div><h3>Decision Episode 기록</h3><p>상태, 제약, 대안, 관리자 승인 여부, 실제 결과와 외부 요인을 분리 저장합니다.</p></div></div>
    <div class="status-row"><span>02</span><div><h3>FlowBench 검증</h3><p>시뮬레이션 환경에서 백테스트 및 하드 제약 준수율을 오프라인 평가합니다.</p></div></div>
    <div class="status-row"><span>03</span><div><h3>Champion 승격 &amp; Rollback</h3><p>Shadow → Canary → Champion 승격 절차와 즉시 롤백 통제를 유지합니다.</p></div></div>
  </div>
</section>`, [["architecture","IDFM 4-Layer"],["roles","기술 분리 경계"],["learning","안전 배포 통제"]]);

const fitForm = (contact = false) => `
<form class="fit-form" data-fit-form data-form-type="${contact ? "contact" : "fit"}" novalidate>
  <input type="hidden" name="inquiry" value="${contact ? "company" : "flow"}">
  <div class="form-intro"><b>${contact ? "논의할 내용을 남겨주세요." : "약 3분 · 원본 데이터 업로드 없이 시작합니다."}</b><span>${contact ? "민감한 생산 데이터는 첨부하지 않아도 됩니다." : "담당자가 내용을 직접 읽고, 가능한 범위와 준비가 필요한 부분을 먼저 안내합니다."}</span></div>
  <div class="form-progress" aria-label="진행 단계"><span class="active" data-progress></span><span data-progress></span><span data-progress></span></div>
  <div class="form-step" data-form-step>
    <h2>${contact ? "문의 기본정보" : "담당자와 현장 기본정보"}</h2>
    <div class="fields">
      <div class="field"><label for="${contact ? "c-" : ""}name">이름 *</label><input id="${contact ? "c-" : ""}name" name="name" maxlength="80" required autocomplete="name"><div class="field-error"></div></div>
      <div class="field"><label for="${contact ? "c-" : ""}organization">회사·기관 *</label><input id="${contact ? "c-" : ""}organization" name="organization" maxlength="120" required autocomplete="organization"><div class="field-error"></div></div>
      <div class="field"><label for="${contact ? "c-" : ""}role">직책·역할 *</label><input id="${contact ? "c-" : ""}role" name="role" maxlength="120" required autocomplete="organization-title"><div class="field-error"></div></div>
      <div class="field"><label for="${contact ? "c-" : ""}email">회사 이메일 *</label><input id="${contact ? "c-" : ""}email" name="email" type="email" maxlength="254" required autocomplete="email"><div class="field-error"></div></div>
      <div class="field"><label for="${contact ? "c-" : ""}phone">연락처 <small>선택</small></label><input id="${contact ? "c-" : ""}phone" name="phone" type="tel" maxlength="40" autocomplete="tel"><div class="field-error"></div></div>
      <div class="field"><label for="${contact ? "c-" : ""}environment">${contact ? "문의 분야" : "업종·현장 유형"} *</label><select id="${contact ? "c-" : ""}environment" name="environment" required><option value="">선택해 주세요</option>${contact ? '<option>제조 디자인 파트너</option><option>기술·데이터 연동</option><option>산업·공급 파트너십</option><option>투자</option><option>미디어</option><option>기타</option>' : '<option>정밀가공</option><option>금속가공</option><option>금형</option><option>기계·장비</option><option>전기장비</option><option>기타 이산제조</option>'}</select><div class="field-error"></div></div>
    </div>
    <div class="form-actions"><span></span><button class="button dark" type="button" data-next>다음 · 현장 범위</button></div>
  </div>
  <div class="form-step" data-form-step hidden>
    <h2>${contact ? "문의 범위" : "검증할 문제와 데이터"}</h2>
    <div class="fields">
      <div class="field full"><label for="${contact ? "c-" : ""}scope">${contact ? "논의 범위" : "현재 데이터 준비 상태"} *</label>${contact ? '<textarea id="c-scope" name="scope" maxlength="240" required placeholder="예: 읽기 전용 ERP 데이터 연동 검토"></textarea>' : '<select id="scope" name="scope" required><option value="">가장 가까운 상태를 선택해 주세요</option><option>주문·납기·공정실적을 연결할 수 있음</option><option>ERP 주문과 Excel 계획·실적을 연결해야 함</option><option>납기와 최종 완료 데이터만 보유</option><option>과거 공정실적이 거의 없음</option><option>현재 상태를 잘 모름</option></select>'}<div class="field-error"></div></div>
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
    <div class="form-actions"><button class="button" type="button" data-prev>이전</button><button class="button primary" type="submit">${contact ? "문의 접수" : "적합성 검토 요청"}</button></div>
  </div>
  <div class="form-status" data-form-status role="status" aria-live="polite" aria-atomic="true"></div>
</form>`;

// Capacity Lab Page
const partners = pageHero("PROGRAM // CAPACITY_LAB", "최근 사건 하나로,<br>숨은 캐파를 찾을 수 있는지 확인합니다.", "최근 납기·병목 사건과 현재 보유 데이터를 바탕으로 제약공정, 데이터 준비도, 실행 대안과 검증 계획을 정의하는 실무 프로그램입니다.", `<a class="button primary" href="#apply">우리 공장 적합성 확인</a>`) + pageLayout(`
<section id="start">
  <div class="reassurance-grid">
    <article><b>첫 문의</b><strong>원본 데이터 불필요</strong><p>최근 사건과 보유 데이터 종류만 알려주세요.</p></article>
    <article><b>첫 답변</b><strong>적합성부터 판단</strong><p>가능·준비 필요·현재 부적합을 구분합니다.</p></article>
    <article><b>다음 단계</b><strong>합의 후에만 진행</strong><p>데이터·KPI·범위·비용을 문서로 정한 뒤 시작합니다.</p></article>
  </div>
</section>

<section id="outputs">
  <h2>4대 핵심 도출 산출물</h2>
  <div class="grid-2">
    <article class="card">
      <span class="num">DELIVERABLE // 01</span>
      <h3>Constraint Map (제약 지도)</h3>
      <p>주문·공정·설비·자재 사이에서 발생하는 캐파 손실과 병목 지점을 시각화합니다.</p>
    </article>
    <article class="card">
      <span class="num">DELIVERABLE // 02</span>
      <h3>Data Readiness Grade (A~D 진단)</h3>
      <p>현재 보유한 ERP/MES/Excel 데이터의 정합성과 연동 가능성을 4단계 등급으로 평가합니다.</p>
    </article>
    <article class="card">
      <span class="num">DELIVERABLE // 03</span>
      <h3>Decision Prototype (관제 콘솔)</h3>
      <p>실제 사건 시나리오를 바탕으로 공장장 및 관리자가 검토할 의사결정 프로토타입을 만듭니다.</p>
    </article>
    <article class="card">
      <span class="num">DELIVERABLE // 04</span>
      <h3>KPI &amp; M&amp;V Plan (측정 계획)</h3>
      <p>기준선(Baseline), 측정 기간, 외부 요인 분리 및 실효 ROI 검증 계획을 합의합니다.</p>
    </article>
  </div>
</section>

<section id="process">
  <h2>4단계 실무 진행 로드맵</h2>
  <div class="status-list">
    <div class="status-row"><span class="status-badge">STEP 01</span><div><h3>Problem Review</h3><p>최근 3개월 내 발생한 납기 지연 및 설비 병목 사건과 핵심 지표를 정의합니다.</p></div></div>
    <div class="status-row"><span class="status-badge">STEP 02</span><div><h3>Data Mapping</h3><p>주문, 공정, 설비, 작업실적 데이터의 결측치 및 식별자 연동 상태를 확인합니다.</p></div></div>
    <div class="status-row"><span class="status-badge">STEP 03</span><div><h3>Constraint Workshop</h3><p>하나의 제약공정에 대한 최적 작업순서 변경안과 관리자 검토 프로토타입을 시뮬레이션합니다.</p></div></div>
    <div class="status-row"><span class="status-badge pilot">STEP 04</span><div><h3>Executive Review &amp; Pilot Proposal</h3><p>Capacity Audit 및 8~12주 유료 섀도 파일럿 Sprint 진행 여부를 확정합니다.</p></div></div>
  </div>
</section>

<section id="questions" class="faq">
  <h2>신청 전에 가장 많이 확인하는 것</h2>
  <details><summary>MES가 있는데도 필요한가요?</summary><p>MES를 교체하지 않습니다. MES·ERP·Excel의 기록 위에서 납기 위험과 제약공정, 변경 대안을 검토하는 의사결정 계층으로 시작합니다.</p></details>
  <details><summary>Excel 데이터만 있어도 검토할 수 있나요?</summary><p>주문번호, 납기, 공정순서와 작업실적을 연결할 수 있다면 준비도를 진단할 수 있습니다. 부족한 데이터는 먼저 무엇을 쌓아야 하는지 안내합니다.</p></details>
  <details><summary>첫 문의부터 생산 데이터를 보내야 하나요?</summary><p>아닙니다. 최근 발생한 사건과 보유 데이터 종류만 적어주세요. 원본 데이터는 범위·권한·보안 조건을 합의한 뒤 별도로 검토합니다.</p></details>
</section>

<section id="apply">
  <div class="sys-tag">APPLY // FIT_REVIEW</div>
  <h2>최근 문제와 현재 데이터만 알려주세요.</h2>
  <p>민감한 도면, 상세 생산수치와 원본 데이터는 첫 문의에 보내지 않아도 됩니다.</p>
  ${fitForm(false)}
  <p class="direct-contact" style="margin-top:20px;">폼보다 이메일이 편하다면 <a href="mailto:contact@iruvy.com?subject=Capacity%20Lab%20적합성%20문의" data-event="email_link_click">contact@iruvy.com</a>으로 최근 문제를 한 줄만 보내주세요.</p>
</section>`, [["start","시작 방식"],["outputs","4대 산출물"],["process","진행 로드맵"],["questions","FAQ"],["apply","적합성 확인"]]);

// Evidence Page
const evidence = pageHero("GOVERNANCE // EVIDENCE_AND_TRUST", "주장이 아니라,<br>검증 가능한 결과를 쌓습니다.", "Iruvy는 참가, 협력, 유료 실증, 실제 운영과 검증된 성과를 구분합니다. Outcome Ledger는 기준선부터 실제 경제가치까지 같은 구조로 기록합니다.", `<a class="button primary" href="/capacity-lab/#apply">검증 시작하기</a>`) + pageLayout(`
<section id="standard">
  <h2>증거 인정 5대 성격 기준</h2>
  <div class="evidence-grid">
    <article><span>01</span><h3>실제 현장 데이터</h3><p>고객사와 사전 합의한 현장 범위와 기준 기간의 실데이터</p></article>
    <article><span>02</span><h3>실행 가능 대안</h3><p>현장의 하드 제약을 100% 충족하고 비교 가능한 최적안</p></article>
    <article><span>03</span><h3>사람의 승인 결정</h3><p>생산관리자의 검토·수정·승인·거절 이력 및 판단 사유</p></article>
    <article><span>04</span><h3>실제 변경 실행</h3><p>언제 무엇을 어느 공정 범위에서 실행에 반영했는지 기록</p></article>
    <article><span>05</span><h3>측정된 ROI 결과</h3><p>외부 요인을 분리 분석한 유효 캐파 증폭 지표 및 경제가치</p></article>
  </div>
</section>

<section id="levels">
  <h2>증거 단계 (Evidence Classification Scale)</h2>
  <div class="status-list">
    <div class="status-row"><span class="status-badge">EXPLORATION</span><div><h3>샘플 및 합성 데이터 (Synthetic Scenario)</h3><p>제품 시나리오 및 디지털 트윈 관제 콘솔 기능을 관제·탐색하는 초기 단계입니다.</p></div></div>
    <div class="status-row"><span class="status-badge pilot">VALIDATION</span><div><h3>실제 데이터 적합성 진단 (Capacity Lab)</h3><p>한 공정과 한 의사결정 범위에서 보유 데이터의 연결성과 제약 조건 정합성을 진단합니다.</p></div></div>
    <div class="status-row"><span class="status-badge pilot">PAID PILOT</span><div><h3>유료 섀도 파일럿 (8~12주 Sprint)</h3><p>기준선과 성공 KPI를 합의하고 기존 생산 방식과 AI 추천 대안의 성과를 섀도 모드에서 비교합니다.</p></div></div>
    <div class="status-row"><span class="status-badge">PRODUCTION</span><div><h3>실제 운영 환경 (Governed Production)</h3><p>고객사의 일상적인 생산 의사결정 워크플로에 포함되어 반복 사용하는 단계입니다.</p></div></div>
    <div class="status-row"><span class="status-badge">VERIFIED IMPACT</span><div><h3>검증된 경제 성과 (Outcome Ledger)</h3><p>합의된 측정 기준(M&amp;V)으로 회수된 캐파 및 경제 가치를 상호 확인한 최종 단계입니다.</p></div></div>
  </div>
</section>

<section id="ledger">
  <h2>Outcome Ledger 메커니즘</h2>
  <div class="architecture">
    <div>Baseline · 기준 기간과 생산성 KPI</div><i>↓</i>
    <div>Constraint · 제약 요인 및 외부 사건</div><i>↓</i>
    <div>Recommendation · IDFM 대안 및 가용성</div><i>↓</i>
    <div>Human Decision · 생산관리자 최종 승인</div><i>↓</i>
    <div>Execution · 현장 계획 반영 및 실행</div><i>↓</i>
    <div>Result &amp; ROI · 회수된 캐파 및 경제 성과</div>
  </div>
  <p class="notice">Iruvy Flow는 외부 공개 가능한 제조 성과 수치를 아직 검증 완료 전으로 표기합니다. 목표치나 모의 데이터 수치를 고객 성과처럼 과장하지 않습니다.</p>
</section>

<section id="governance">
  <h2>데이터 및 운영 거버넌스 원칙</h2>
  <div class="grid-2">
    <article class="card"><h3>읽기 전용 수집</h3><p>고객사의 원본 ERP/MES DB를 직접 수정하지 않는 읽기 전용 계정으로 연결합니다.</p></article>
    <article class="card"><h3>사람의 승인 권한</h3><p>생산 계획의 최종 변경 권한은 생산관리자에게 있으며 자동 실행을 강제하지 않습니다.</p></article>
    <article class="card"><h3>고객 데이터 격리</h3><p>명시적 동의 없이 고객사의 민감 생산 데이터를 타사 모델 학습에 공유하지 않습니다.</p></article>
    <article class="card"><h3>작업자 감시 제외</h3><p>개인 생산성 순위 매기기, 근로자 상시 감시 및 인사 처벌 목적으로 사용하지 않습니다.</p></article>
  </div>
</section>`, [["standard","5대 성격 기준"],["levels","증거 단계 Scale"],["ledger","Outcome Ledger"],["governance","거버넌스 원칙"]]);

// Company Page
const company = pageHero("COMPANY // MISSION_AND_PRINCIPLES", "현실의 운영을 이해하고,<br>더 나은 결정을 가능하게 합니다.", "Iruvy는 물리적 현장에서 발생하는 설비, 작업, 공간과 시간의 관계를 데이터로 연결해 운영 의사결정에 사용하는 지능형 소프트웨어를 만듭니다.") + pageLayout(`
<section id="mission">
  <h2>기업 미션 &amp; 카테고리 정의</h2>
  <p>Iruvy의 카테고리는 <b>산업 자율운영 AI (Industrial Autonomy AI)</b>입니다. 복잡한 산업 현장의 사람·설비·자재·작업·공간·시간 관계를 운영 월드모델로 연결하고, 제약공정의 유효 생산능력(Capacity Amplification)을 실행으로 깨우는 회사를 지향합니다.</p>
</section>

<section id="origin">
  <h2>공간 모델링 기술에서 제조 자율운영으로의 진화</h2>
  <p>Iruvy는 복잡한 실내 공간과 이동 데이터를 모델링하던 기술적 깊이에서 시작되었습니다. 물리적 현실의 상태를 소프트웨어가 이해하기 위해서는 단순 좌표가 아닌 목적, 제약, 사건, 다음 행동의 연결이 필수적임을 깨달았습니다.</p>
  <p>이 고도의 데이터 모델링 경험을 바탕으로, 주문생산형 제조 현장의 주문·공정·설비·시간 관계를 푸는 Iruvy Flow 시스템을 완성해 나가고 있습니다.</p>
</section>

<section id="principles">
  <h2>Iruvy의 4대 제품 개발 원칙</h2>
  <div class="grid-2">
    <article class="card">
      <span class="num">PRINCIPLE // 01</span>
      <h3>Field before claim (현장 우선)</h3>
      <p>실제 현장에서 반복 입증된 실체 있는 문제만을 제품의 핵심 기능 범위로 정의합니다.</p>
    </article>
    <article class="card">
      <span class="num">PRINCIPLE // 02</span>
      <h3>Human accountable (인간 중심 책임)</h3>
      <p>AI는 최고의 대안과 근거를 제공하며, 최종 의사결정 권한과 책임은 현장의 전문가가 가집니다.</p>
    </article>
    <article class="card">
      <span class="num">PRINCIPLE // 03</span>
      <h3>Measurable change (지표 중심 검증)</h3>
      <p>기능의 화려함보다 납기 준수율(OTD), 지연 시간 감축 등 측정 가능한 운영 지표 개선을 최우선합니다.</p>
    </article>
    <article class="card">
      <span class="num">PRINCIPLE // 04</span>
      <h3>Reusable system (모듈화 구조)</h3>
      <p>단발성 custom 코드가 아닌 Kernel + Domain Pack 구조로 재사용 가능한 표준 엔터프라이즈 제품을 만듭니다.</p>
    </article>
  </div>
</section>

<section id="vision">
  <h2>로드맵 및 비전</h2>
  <p>한 공장의 제약공정 캐파 증폭 사례에서 출발하여, 방산·조선 공급망, MRO/정비/군수, 고신뢰 부분 자율운영으로 단계적 확장을 추진합니다.</p>
  <div class="vision-steps">
    <div><small>PHASE 01 (NOW)</small><strong>Observe → Recommend (L1)</strong></div>
    <div><small>PHASE 02 (NEXT)</small><strong>Approve → Execute Integration (L2)</strong></div>
    <div><small>PHASE 03 (LONG-TERM)</small><strong>Governed Industrial Autonomy (L3~L4)</strong></div>
  </div>
  <div class="actions" style="margin-top:28px;"><a class="button primary" href="/capacity-lab/">Capacity Lab 프로그램 보기</a></div>
</section>`, [["mission","미션 & 카테고리"],["origin","기술 진화 기원"],["principles","4대 개발 원칙"],["vision","로드맵 비전"]]);

const contact = pageHero("CONTACT // INQUIRY", "한 가지 문제부터<br>함께 검토합니다.", "제조 디자인 파트너, 기술·데이터 연동, 산업 파트너십, 투자와 미디어 문의를 남겨 주세요.") + pageLayout(`<section id="contact-form">${fitForm(true)}</section><section id="email"><h2>이메일로 직접 문의</h2><p>일반 문의 · <a href="mailto:contact@iruvy.com" data-event="email_link_click">contact@iruvy.com</a><br>파트너십 · <a href="mailto:partners@iruvy.com" data-event="email_link_click">partners@iruvy.com</a><br>보안 · <a href="mailto:security@iruvy.com" data-event="email_link_click">security@iruvy.com</a></p><p class="notice">민감한 도면, 상세 생산수치와 원본 데이터는 첫 문의에 첨부하지 마세요.</p></section>`, [["contact-form","문의 접수"],["email","이메일"]]);

const legalPage = (eyebrow, title, lede, sections) => pageHero(eyebrow, title, lede) + pageLayout(sections);
const privacy = legalPage("LEGAL // PRIVACY", "개인정보 처리방침", "문의 처리에 필요한 정보만 수집하고 목적과 기간을 분명히 합니다.", `<section><h2>1. 수집 항목과 목적</h2><p>이름, 회사·기관, 직책·역할, 회사 이메일, 연락처, 문의 분야, 현장 범위, 문의 내용과 검토 희망 시점을 수집합니다. 문의 확인, 적합성 검토, 후속 연락과 접수 기록을 위해 사용합니다.</p></section><section><h2>2. 보관과 삭제</h2><p>관계 법령 또는 분쟁 대응에 필요한 기간을 제외하고 문의 목적이 끝난 정보는 내부 정책에 따라 삭제합니다. 세부 보관기간은 실제 운영체계 확정 후 이 방침에 반영합니다.</p></section><section><h2>3. 분석 정보</h2><p>사이트 개선을 위해 페이지와 CTA 이벤트를 기록할 수 있으나 분석 이벤트에 이름, 이메일, 전화번호, 회사명과 문의본문을 넣지 않습니다.</p></section><section><h2>4. 권리와 문의</h2><p>개인정보 열람, 정정과 삭제 요청은 <a href="mailto:contact@iruvy.com">contact@iruvy.com</a>으로 보내 주세요.</p><p>시행일 · 2026년 7월 24일</p></section>`);
const terms = legalPage("LEGAL // TERMS", "이용약관", "웹사이트의 정보 범위와 책임 한계를 안내합니다.", `<section><h2>1. 정보 제공 목적</h2><p>이 사이트는 Iruvy와 Iruvy Flow의 현재 제품 방향, 파일럿 범위와 협력 절차를 설명합니다.</p></section><section><h2>2. 제품 범위</h2><p>합성 데이터 데모와 파일럿 설명은 특정 고객의 성과를 보증하지 않습니다. 실제 기능, 연동, 보안, 일정과 비용은 별도 계약에서 합의합니다.</p></section><section><h2>3. 지식재산권</h2><p>사이트의 브랜드, 문구, 디자인과 소프트웨어 자료는 관련 법령의 보호를 받습니다. 사전 동의 없는 상업적 복제와 재배포를 금합니다.</p></section><section><h2>4. 문의</h2><p>이용 관련 문의는 <a href="mailto:contact@iruvy.com">contact@iruvy.com</a>으로 보내 주세요.</p><p>시행일 · 2026년 7월 24일</p></section>`);
const accessibility = legalPage("LEGAL // ACCESSIBILITY", "웹 접근성", "Iruvy는 제품뿐 아니라 정보를 전달하는 방식에서도 사람의 통제와 접근성을 중요하게 봅니다.", `<section><h2>접근성 목표</h2><p>WCAG 2.2 AA를 목표로 의미 있는 제목 구조, 키보드 접근, 명확한 초점 표시, 충분한 색상 대비, 모션 감소 설정과 폼 오류 연결을 구현합니다.</p></section><section><h2>지원하는 방식</h2><ul><li>본문 바로가기 링크와 의미 있는 랜드마크</li><li>키보드로 조작 가능한 메뉴, 탭과 폼</li><li>색상 외 텍스트로 제공하는 위험·상태 정보</li><li>합성 데이터 차트의 표와 텍스트 대안</li><li>작은 화면에서 가로 스크롤을 줄이는 카드형 레이아웃</li></ul></section><section><h2>피드백</h2><p>접근이 어려운 콘텐츠나 기능을 발견하면 사용한 기기, 브라우저와 페이지 주소를 <a href="mailto:contact@iruvy.com">contact@iruvy.com</a>으로 알려 주세요.</p></section>`);

const pages = new Map([
  ["", home], ["flow", flow], ["how-it-works", technology], ["capacity-lab", partners],
  ["evidence", evidence], ["company", company],
  ["privacy", privacy], ["terms", terms], ["accessibility", accessibility]
]);

// 1. Build to dist
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "assets", "fonts"), { recursive: true });
writeFileSync(join(out, "assets", "site.css"), readFileSync(join(root, "site-src", "styles.css")));
writeFileSync(join(out, "assets", "site.js"), readFileSync(join(root, "site-src", "site.js")));
for (const file of ["Pretendard-Regular.woff2", "Pretendard-SemiBold.woff2", "Pretendard-ExtraBold.woff2"]) {
  cpSync(join(root, "assets", "fonts-web", file), join(out, "assets", "fonts", file));
}
for (const file of ["iruvy-logo.svg"]) cpSync(join(root, "assets", file), join(out, "assets", file));
for (const file of ["favicon.ico"]) cpSync(join(root, file), join(out, file));
if (existsSync(join(root, "assets", "og-flow-20260726.png"))) cpSync(join(root, "assets", "og-flow-20260726.png"), join(out, "assets", "og.png"));
else if (existsSync(join(root, "assets", "og-flow-brand.png"))) cpSync(join(root, "assets", "og-flow-brand.png"), join(out, "assets", "og.png"));

for (const [route, title, description] of routes) {
  const path = route ? join(out, route, "index.html") : join(out, "index.html");
  mkdirSync(dirname(path), { recursive: true });
  const schema = route === "flow" ? `<script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Iruvy Flow","applicationCategory":"BusinessApplication","description":"제조 제약공정 캐파 증폭을 위한 산업 자율운영 AI 제품","operatingSystem":"Web"}</script>` : "";
  writeFileSync(path, document({ route, title, description, content: pages.get(route), schema }));
}

const notFound = document({
  route: "404", title: "페이지를 찾을 수 없습니다 | Iruvy",
  description: "요청한 페이지를 찾을 수 없습니다. Iruvy Flow 제품과 제조 디자인 파트너 정보를 확인하세요.",
  content: `${pageHero("404 // NOT_FOUND", "요청한 페이지를<br>찾을 수 없습니다.", "주소가 바뀌었거나 더 이상 제공하지 않는 페이지입니다.", `<a class="button primary" href="/">홈으로 이동</a><a class="button dark" href="/flow/">Iruvy Flow 보기</a>`)}`
});
writeFileSync(join(out, "404.html"), notFound);

writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: https://iruvy.com/sitemap.xml\n`);
writeFileSync(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(([route]) => `  <url><loc>https://iruvy.com/${route ? `${route}/` : ""}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);

const worker = `export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n`;
mkdirSync(join(out, "server"), { recursive: true });
writeFileSync(join(out, "server", "index.js"), worker);
mkdirSync(join(out, ".openai"), { recursive: true });
cpSync(join(root, ".openai", "hosting.json"), join(out, ".openai", "hosting.json"));

// 2. Also sync root files so direct root viewing/serving gets updated content
mkdirSync(join(root, "styles"), { recursive: true });
writeFileSync(join(root, "index.html"), readFileSync(join(out, "index.html")));
writeFileSync(join(root, "styles", "sales.css"), readFileSync(join(root, "site-src", "styles.css")));
writeFileSync(join(root, "scripts", "site.js"), readFileSync(join(root, "site-src", "site.js")));

console.log(`Built Iruvy Flow site: ${routes.length + 1} pages and synced root files`);
