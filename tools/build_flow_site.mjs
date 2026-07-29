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
cpSync(join(root, "assets", "og.png"), join(out, "assets", "og.png"));
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
    <a class="brand" href="/" aria-label="Iruvy 홈"><img src="/assets/iruvy-logo.svg" alt="Iruvy" width="113" height="34"></a>
    ${nav}
  </div>
</header>`;

const footer = `
<footer class="site-footer">
  <div class="shell footer-grid">
    <div class="footer-lead">
      <a class="brand invert" href="/"><img src="/assets/iruvy-logo.svg" alt="Iruvy" width="113" height="34"></a>
      <p>공간과 상황을 이해해 다음 최적 행동을 결정하는 Spatial Decision AI를 개발합니다.</p>
    </div>
    <div><strong>솔루션</strong><a href="/guide/">Iruvy Guide</a><a href="/flow/">Iruvy Flow</a></div>
    <div><strong>검증</strong><a href="/evidence/">Evidence</a><a href="/technology/">기술·신뢰</a><a href="/accessibility/">웹 접근성</a></div>
    <div><strong>회사</strong><a href="/company/">회사 소개</a><a href="/resources/">인사이트</a><a href="/contact/">도입 상담</a></div>
  </div>
  <div class="shell footer-bottom">
    <span>© 2026 IRUVY INC.</span>
    <span><a href="mailto:contact@iruvy.com">contact@iruvy.com</a> · <a href="/privacy/">개인정보 처리방침</a> · <a href="/terms/">이용약관</a></span>
  </div>
</footer>`;

const page = ({ route = "", title, description, body, robots = "index,follow" }) => `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="https://iruvy.com/${route ? `${route}/` : ""}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://iruvy.com/${route ? `${route}/` : ""}">
  <meta property="og:image" content="https://iruvy.com/assets/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#0a1020">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/assets/site.css?v=${version}">
  <script src="/assets/site.js?v=${version}" defer></script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Iruvy","url":"https://iruvy.com/","description":"Spatial Decision AI 기업","email":"contact@iruvy.com"}</script>
</head>
<body>${header}<main id="main">${body}</main>${footer}</body>
</html>`;

const decisionVisual = `
<div class="decision-visual" aria-label="현재 상태와 목표, 제약조건을 계산해 다음 최적 행동을 선택하는 과정">
  <div class="visual-head"><span>DECISION FIELD</span><span class="live-dot">LIVE CONTEXT</span></div>
  <div class="decision-stage">
    <div class="source-node"><i></i><span>현재 상태</span></div>
    <div class="branch branch-a"><i></i><span>행동 A</span></div>
    <div class="branch branch-b"><i></i><span>행동 B</span></div>
    <div class="branch branch-c"><i></i><span>행동 C</span></div>
    <div class="constraint-card"><small>GOAL + CONSTRAINTS</small><b>목표·제약조건 계산</b><span>시간 · 공간 · 운영 · 안전</span></div>
    <div class="selected-node"><i></i><small>NEXT BEST ACTION</small><b>행동 B</b></div>
    <div class="path p1"></div><div class="path p2"></div><div class="path p3"></div><div class="path p4"></div>
  </div>
</div>`;

const statusPill = (label, tone = "") => `<span class="status ${tone}">${label}</span>`;

const home = `
<section class="hero">
  <div class="shell hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">SPATIAL DECISION AI</p>
      <h1>현장의 다음<br><span>최적 행동</span>을 계산합니다</h1>
      <p class="lede">Iruvy는 공간과 운영 데이터를 목표·제약조건과 연결해 방문자의 다음 경험과 산업 현장의 다음 운영 결정을 제안합니다.</p>
      <div class="actions"><a class="button" href="/guide/">전시·공간 솔루션</a><a class="button ghost" href="/flow/">제조 현장 솔루션</a></div>
    </div>
    ${decisionVisual}
  </div>
  <div class="shell proof-rail" aria-label="현재 검증 상태">
    <div><small>GUIDE</small><b>산업 전시회</b><span>첫 상용화 시장</span></div>
    <div><small>FLOW</small><b>L0 → L1</b><span>관찰·추천 단계</span></div>
    <div><small>CORE</small><b>State → Action</b><span>공통 의사결정 구조</span></div>
    <div><small>GOVERNANCE</small><b>Human approved</b><span>사람이 최종 결정</span></div>
  </div>
</section>

<section class="section intro">
  <div class="shell two-col">
    <div><p class="eyebrow dark">THE DECISION GAP</p><h2>데이터는 쌓이지만,<br>다음 결정은 여전히<br>처음부터 다시 합니다</h2></div>
    <div class="comparison">
      <article><small>기존 시스템</small><p>무엇이 기록됐는가</p><p>현재 상태 조회</p><p>이상 알림</p><p>결과 집계</p></article>
      <article class="active"><small>IRUVY DECISION LAYER</small><p>지금 무엇을 해야 하는가</p><p>가능한 행동 비교</p><p>실행 대안 제안</p><p>결과와 근거 기록</p></article>
    </div>
  </div>
</section>

<section class="section products">
  <div class="shell">
    <div class="section-head"><p class="eyebrow dark">TWO PRODUCTS, ONE CORE</p><h2>같은 질문을, 서로 다른 현장에서 풉니다</h2><p>공간과 산업이라는 서로 다른 시장에 하나의 Spatial Decision 구조를 적용합니다. 고객과 원본 데이터, 핵심 도메인 모델은 제품별로 분리합니다.</p></div>
    <div class="product-grid">
      <article class="product-card guide-card">
        <div class="product-index">01 / VISITOR</div>
        <h3>Iruvy Guide</h3>
        <p class="product-claim">관람객마다 다른 최적 동선과 콘텐츠를 제안합니다.</p>
        <ul><li>전시 주최사·전시장·행사대행사</li><li>앱 설치 없는 QR 웹</li><li>추천 → 방문 → 상담 연결</li></ul>
        <a href="/guide/">Guide 살펴보기 <span>↗</span></a>
      </article>
      <article class="product-card flow-card">
        <div class="product-index">02 / INDUSTRY</div>
        <h3>Iruvy Flow</h3>
        <p class="product-claim">예외가 발생한 순간, 손실이 가장 적은 복구안을 계산합니다.</p>
        <ul><li>공장장·생산관리·제조 DX</li><li>ERP·MES·Excel 읽기 중심 연결</li><li>처리량·납기·비용 대안 비교</li></ul>
        <a href="/flow/">Flow 살펴보기 <span>↗</span></a>
      </article>
    </div>
  </div>
</section>

<section class="section process">
  <div class="shell">
    <div class="section-head light"><p class="eyebrow">HOW IRUVY WORKS</p><h2>복잡한 현장을 네 단계로 명확하게</h2></div>
    <ol class="process-grid">
      <li><span>01</span><h3>현장 상태 연결</h3><p>공간·콘텐츠·운영 데이터를 현재 시점의 상태로 연결합니다.</p></li>
      <li><span>02</span><h3>목표와 제약 모델링</h3><p>시간, 위치, 안전, 운영 규칙과 우선순위를 함께 계산합니다.</p></li>
      <li><span>03</span><h3>가능한 행동 비교</h3><p>여러 대안의 결과를 비교해 실행 가능한 다음 행동을 제안합니다.</p></li>
      <li><span>04</span><h3>승인과 결과 기록</h3><p>사람이 검토·수정·승인하고 실제 결과와 근거를 남깁니다.</p></li>
    </ol>
    <a class="text-link light" href="/technology/">Iruvy Core와 신뢰 원칙 보기 →</a>
  </div>
</section>

<section class="section trust-section">
  <div class="shell two-col">
    <div><p class="eyebrow dark">TRUST BY DESIGN</p><h2>강한 문장보다<br>정확한 범위를 말합니다</h2><p>검증 전 가설과 측정된 성과를 구분하고, 사람이 최종 결정하며, 제품별 원본 데이터와 학습권을 분리합니다.</p><a class="text-link" href="/evidence/">Evidence 체계 보기 →</a></div>
    <div class="trust-list"><span>기존 시스템 교체 없음</span><span>읽기 전용 연동 우선</span><span>관리자 최종 승인</span><span>고객별 데이터 격리</span><span>Guide·Flow 원본 데이터 분리</span><span>작업자 감시 목적 제외</span></div>
  </div>
</section>

<section class="final-cta">
  <div class="shell"><p class="eyebrow">START WITH ONE DECISION</p><h2>어떤 현장의 다음 결정을<br>개선하시나요?</h2><div class="actions center"><a class="button pale" href="/contact/?product=guide">전시·공간 도입 상담</a><a class="button outline-light" href="/contact/?product=flow">제조 현장 적합성 진단</a></div></div>
</section>`;

const guide = `
<section class="page-hero guide-hero"><div class="shell page-hero-grid"><div><p class="eyebrow">IRUVY GUIDE</p><h1>관람객마다 다른 최적 동선,<br><span>주최자에게는 실행 가능한 운영 데이터</span></h1><p class="lede">관심사와 남은 시간을 바탕으로 방문 동선을 만들고, 기업·제품 설명과 행사 데이터를 하나의 웹 경험으로 연결합니다.</p><div class="actions"><a class="button" href="/contact/?product=guide">행사 적합성 진단</a><a class="button ghost-light" href="#journey">사용 흐름 보기</a></div></div><div class="phone-scene" aria-label="Iruvy Guide 모바일 서비스 개념 화면"><div class="phone"><div class="phone-bar"></div><small>FOR YOU · 75 MIN</small><h3>지금 볼 만한<br>3개의 부스</h3><div class="mini-route"><i></i><i></i><i></i></div><div class="phone-card"><b>정밀 제조 자동화</b><span>도보 4분 · 관심도 높음</span></div><div class="phone-card"><b>산업용 비전 AI</b><span>도보 7분 · 세션 14:20</span></div></div><div class="orbit-label a">관심사</div><div class="orbit-label b">남은 시간</div><div class="orbit-label c">현재 위치</div></div></div></section>
<section class="section" id="journey"><div class="shell"><div class="section-head"><p class="eyebrow dark">VISITOR JOURNEY</p><h2>설치 없이 시작해, 다음 방문까지 이어집니다</h2></div><ol class="journey"><li><span>01</span><b>관심사 입력</b></li><li><span>02</span><b>추천 부스·동선</b></li><li><span>03</span><b>근거 있는 설명</b></li><li><span>04</span><b>저장·상담 연결</b></li><li><span>05</span><b>다음 방문지 추천</b></li><li><span>06</span><b>운영 결과 분석</b></li></ol></div></section>
<section class="section tinted"><div class="shell"><div class="section-head"><p class="eyebrow dark">VALUE BY STAKEHOLDER</p><h2>한 번의 방문 경험이 세 이해관계자의 가치가 됩니다</h2></div><div class="tab-shell" data-tabs><div class="tabs" role="tablist"><button role="tab" aria-selected="true" aria-controls="visitor" id="tab-visitor">방문자</button><button role="tab" aria-selected="false" aria-controls="organizer" id="tab-organizer">주최자</button><button role="tab" aria-selected="false" aria-controls="exhibitor" id="tab-exhibitor">참가기업</button></div><div class="tab-panel" role="tabpanel" id="visitor" aria-labelledby="tab-visitor"><h3>짧은 시간에, 나에게 맞는 경험을</h3><p>관심사·시간·위치에 맞는 부스와 콘텐츠를 발견하고 낯선 공간에서 다음 행동을 쉽게 결정합니다.</p><div class="feature-chips"><span>개인화 동선</span><span>기업·제품 설명</span><span>앱 설치 없는 웹</span><span>접근 가능한 안내</span></div></div><div class="tab-panel" role="tabpanel" id="organizer" aria-labelledby="tab-organizer" hidden><h3>감이 아닌 방문 흐름으로 행사를 개선</h3><p>지도·부스·세션 데이터를 구조화하고 관심·동선·검색 실패를 운영 개선에 연결합니다.</p><div class="feature-chips"><span>콘텐츠 승인</span><span>방문 흐름</span><span>혼잡 신호</span><span>결과 리포트</span></div></div><div class="tab-panel" role="tabpanel" id="exhibitor" aria-labelledby="tab-exhibitor" hidden><h3>관심에서 상담까지 연결되는 기업 경험</h3><p>승인된 기업·제품 자료를 바탕으로 반복 질문을 설명하고 동의 기반 상담과 자료 요청을 연결합니다.</p><div class="feature-chips"><span>AI 부스 안내</span><span>반복 설명 감소</span><span>동의 기반 리드</span><span>관심 콘텐츠 분석</span></div></div></div></div></section>
<section class="section"><div class="shell two-col"><div><p class="eyebrow dark">PRODUCT SCOPE</p><h2>가치가 검증된 순서로 만듭니다</h2><p>첫 MVP는 QR 웹·지도·검색·근거 기반 콘텐츠·개인화 추천과 운영자 대시보드에 집중합니다.</p></div><div class="scope-list"><div>${statusPill("FIRST WEDGE","current")}<b>QR 웹 · 지도 · 검색</b><p>설치 없이 시작하는 기본 방문 경험</p></div><div>${statusPill("VALIDATING","validating")}<b>추천 · 동선 · 저장 · 상담</b><p>추천이 실제 행동과 전환으로 이어지는지 검증</p></div><div>${statusPill("ROADMAP")}<b>정밀 실시간 위치 · WebAR</b><p>가치가 확인된 구역에 선택적으로 적용</p></div></div></div></section>
<section class="section process"><div class="shell"><div class="section-head light"><p class="eyebrow">GROUNDED BY DEFAULT</p><h2>설명은 승인된 원문에 고정합니다</h2><p>출처 없는 기업·제품 설명을 공개하지 않습니다. AI 생성 콘텐츠는 담당자 승인 이후 배포하고, 방문자 데이터는 Flow 학습에 사용하지 않습니다.</p></div><div class="boundary-grid"><span>승인 원문·출처 연결</span><span>담당자 공개 승인</span><span>동의 기반 데이터</span><span>제품 간 원본 분리</span></div></div></section>
<section class="final-cta"><div class="shell"><p class="eyebrow">GUIDE EXHIBITION MVP</p><h2>다음 행사에서 무엇을<br>먼저 검증할까요?</h2><a class="button pale" href="/contact/?product=guide">행사 적합성 진단</a></div></section>`;

const flow = `
<section class="page-hero flow-hero"><div class="shell page-hero-grid"><div><p class="eyebrow">IRUVY FLOW</p><h1>설비가 멈춘 순간,<br><span>납기를 지키는 복구안을 계산합니다</span></h1><p class="lede">ERP·MES·Excel의 생산 데이터를 읽기 중심으로 연결해 병목과 납기 위험을 찾고, 생산관리자가 검토할 작업순서와 자원배치 대안을 제시합니다.</p><div class="actions"><a class="button" href="/capacity-lab/">Capacity Audit</a><a class="button ghost-light" href="#console">관제 데모 보기</a></div></div><div class="flow-console" id="console"><div class="console-top"><span>PRODUCT DEMO · VIRTUAL SCENARIO</span><i>SHADOW</i></div><div class="alert-row"><small>DISTURBANCE</small><b>밀링 4호기 정지</b><span>납기 위험 주문 3건</span></div><div class="option selected"><span>A · 대체 설비 + 작업순서 조정</span><b>균형안</b></div><div class="option"><span>B · 잔업 2시간 추가</span><b>보수안</b></div><div class="option"><span>C · 외주 공정 전환</span><b>공격안</b></div><div class="console-foot"><span>관리자 승인 전 실행 없음</span><button type="button">검토하기</button></div></div></div></section>
<section class="section"><div class="shell"><div class="section-head"><p class="eyebrow dark">WHEN PLANS BREAK</p><h2>계획이 깨지는 다섯 순간을 먼저 봅니다</h2></div><div class="incident-grid"><article><span>01</span><h3>설비 고장</h3><p>병목 이동과 대체설비 영향을 비교합니다.</p></article><article><span>02</span><h3>긴급 주문</h3><p>기존 약속 납기와 새 우선순위 충돌을 계산합니다.</p></article><article><span>03</span><h3>자재 지연</h3><p>가능 작업과 대기 손실을 다시 배열합니다.</p></article><article><span>04</span><h3>외주 지연</h3><p>회수일 변경이 후속 공정에 미치는 영향을 봅니다.</p></article><article><span>05</span><h3>인력 부족</h3><p>역할·기술등급 제약 안에서 실행안을 찾습니다.</p></article></div></div></section>
<section class="section tinted"><div class="shell io-grid"><div><p class="eyebrow dark">INPUT</p><h2>흩어진 운영 상태를 연결</h2><ul class="check-list"><li>작업지시와 생산 실적</li><li>공정·설비·작업 가능 관계</li><li>품질·정비·가용시간</li><li>자재·도구·외주 일정</li></ul></div><div class="arrow-column">→</div><div><p class="eyebrow dark">DECISION OUTPUT</p><h2>실행 가능한 대안을 비교</h2><ul class="check-list"><li>위험 주문과 예상 병목</li><li>보수·균형·공격 대안</li><li>납기·잔업·외주 영향</li><li>승인 기록과 실제 결과</li></ul></div></div></section>
<section class="section process"><div class="shell"><div class="section-head light"><p class="eyebrow">CURRENT PRODUCT BOUNDARY</p><h2>작게 연결하고, 섀도 모드에서 증명합니다</h2></div><div class="boundary-grid"><span>CSV·Excel·읽기 중심 연동</span><span>관리자 승인 필수</span><span>PLC 직접 제어 없음</span><span>한 사업장·한 제약공정</span><span>의사결정 1~2개</span><span>8~12주 검증 가설</span></div><p class="boundary-note">현재 외부 단계는 L0 Observe → L1 Recommend입니다. 사람 승인 없는 자동제어와 폐루프 자율실행은 현재 제공 범위가 아닙니다.</p></div></section>
<section class="section"><div class="shell two-col"><div><p class="eyebrow dark">FIT / NO-FIT</p><h2>모든 공장을 위한<br>첫 제품은 아닙니다</h2><p>주문생산·다품종 소량 환경에서 반복되는 예외와 한 제약공정의 경제 KPI부터 검증합니다.</p></div><div class="fit-grid"><article><h3>적합한 현장</h3><ul><li>예외 상황과 재계획이 잦음</li><li>ERP·MES·Excel 데이터 존재</li><li>생산관리자 참여 가능</li><li>기준 KPI 합의 가능</li></ul></article><article class="no-fit"><h3>현재 부적합</h3><ul><li>ERP·MES 전체 교체 목적</li><li>즉시 무인 자동제어 요구</li><li>개인 작업자 감시 목적</li><li>담당자 없는 무료 개발 요청</li></ul></article></div></div></section>
<section class="final-cta"><div class="shell"><p class="eyebrow">FROM CONSTRAINT TO CAPACITY</p><h2>최근 납기 지연 사건 1건에서<br>진단을 시작합니다</h2><a class="button pale" href="/capacity-lab/">Capacity Audit 신청</a></div></section>`;

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
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">PRIVACY</p><h1>개인정보 처리방침</h1><p>웹 문의 과정에서 제공한 정보를 문의 대응 목적으로 최소한으로 처리합니다.</p></div></section><section class="section"><div class="shell prose"><h2>수집 항목과 목적</h2><p>회사·기관, 이름, 이메일, 문의 내용을 상담 요청 확인과 회신에 사용합니다. 민감한 생산 원본 데이터는 첫 문의에서 수집하지 않습니다.</p><h2>보관과 삭제</h2><p>관계 법령과 합의된 목적에 필요한 기간 동안 보관한 뒤 삭제합니다. 삭제 또는 열람 요청은 contact@iruvy.com으로 접수할 수 있습니다.</p><h2>제품 데이터</h2><p>Guide와 Flow의 고객 원본 데이터와 학습권은 분리하며, 별도 동의 없이 다른 제품 학습에 사용하지 않습니다.</p></div></section>` : kind === "terms" ? `
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">TERMS</p><h1>이용약관</h1><p>본 웹사이트의 정보 이용 범위와 책임 한계를 안내합니다.</p></div></section><section class="section"><div class="shell prose"><h2>정보의 성격</h2><p>웹사이트는 회사와 제품의 현재 방향을 소개하며, 별도 계약 없이 가격·성과·SLA를 보장하지 않습니다.</p><h2>지식재산권</h2><p>별도 표기가 없는 Iruvy 브랜드와 콘텐츠의 권리는 주식회사 이루비에 있습니다.</p><h2>문의</h2><p>서비스 조건과 계약 범위는 개별 제안과 계약에서 확정합니다.</p></div></section>` : `
<section class="simple-hero compact"><div class="shell"><p class="eyebrow">ACCESSIBILITY</p><h1>웹 접근성 원칙</h1><p>다양한 사용자가 키보드·화면낭독기·고대비 환경에서 정보를 이용할 수 있도록 개선합니다.</p></div></section><section class="section"><div class="shell prose"><h2>목표</h2><p>WCAG 2.2 AA를 실무 기준으로 삼아 명확한 제목 구조, 키보드 탐색, 포커스 표시, 충분한 대비와 큰 터치 영역을 유지합니다.</p><h2>모션</h2><p>운영 흐름의 모션은 장식이 아니라 관계 이해를 돕는 범위로 제한하며, 동작 줄이기 환경설정을 존중합니다.</p><h2>피드백</h2><p>이용이 어려운 부분은 contact@iruvy.com으로 알려주세요.</p></div></section>`;

const pages = new Map([
  ["", ["Iruvy | Spatial Decision AI", "공간과 상황을 이해해 다음 최적 행동을 결정하는 Spatial Decision AI 기업. Iruvy Guide와 Iruvy Flow를 소개합니다.", home]],
  ["guide", ["Iruvy Guide | 전시회 AI 에이전트", "방문자의 관심과 위치를 이해해 다음 부스·콘텐츠·동선을 추천하는 전시회 AI 에이전트.", guide]],
  ["flow", ["Iruvy Flow | 산업현장 자율운영 및 유효 생산능력 증폭 AI", "산업현장의 사람·설비·자재·로봇을 최적화하는 고부가가치 제품 Iruvy Flow.", flow]],
  ["evidence", ["성과와 Evidence | Iruvy", "Iruvy의 실측, 현장 PoC, 고객 데이터 Replay, 유료 검증과 라이브 성과를 투명하게 구분합니다.", evidence]],
  ["technology", ["Iruvy Core | 기술과 신뢰", "현재 상태, 목표, 제약조건을 연결해 실행 가능한 대안을 계산하는 Spatial Decision AI 기술과 신뢰 원칙.", technology]],
  ["company", ["회사 소개 | Iruvy", "공간과 상황을 이해해 다음 최적 행동을 결정하는 Spatial Decision AI를 개발하는 기업 Iruvy.", company]],
  ["resources", ["인사이트와 자료실 | Iruvy", "전시 방문 경험, 제조 병목, 의사결정 AI의 경계와 검증 방법을 설명하는 Iruvy 자료실.", resources]],
  ["capacity-lab", ["Capacity Audit | Iruvy Flow", "최근 납기 지연 사건 한 건으로 제조 현장의 Iruvy Flow 적합성과 데이터 준비도를 진단합니다.", capacityLab]],
  ["contact", ["도입 상담 | Iruvy", "Iruvy Guide 행사 적합성 진단, Iruvy Flow Capacity Audit, 미디어와 파트너십 문의.", contact]],
  ["privacy", ["개인정보 처리방침 | Iruvy", "Iruvy 웹사이트 문의와 제품 데이터의 개인정보 처리 원칙을 안내합니다.", legal("privacy")]],
  ["terms", ["이용약관 | Iruvy", "Iruvy 웹사이트 정보의 이용 범위와 책임 한계를 안내합니다.", legal("terms")]],
  ["accessibility", ["웹 접근성 | Iruvy", "Iruvy 웹사이트의 WCAG 2.2 AA 접근성 원칙과 피드백 방법을 안내합니다.", legal("accessibility")]],
]);

for (const [route, [title, description, body]] of pages) {
  const dir = route ? join(out, route) : out;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page({ route, title, description, body }));
}

const redirect = (from, to, label) => {
  const dir = join(out, from);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="https://iruvy.com${to}"><title>${label} | Iruvy</title><meta name="description" content="새로운 Iruvy 페이지로 이동합니다."></head><body><main><h1>${label}</h1><p><a href="${to}">새 페이지로 이동</a></p></main></body></html>`);
};
redirect("go", "/guide/", "Iruvy Guide로 이동");
redirect("pricing", "/contact/", "도입 범위 상담으로 이동");

const urls = [...pages.keys()].map((route) => `  <url><loc>https://iruvy.com/${route ? `${route}/` : ""}</loc></url>`).join("\n");
writeFileSync(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
writeFileSync(join(out, "robots.txt"), "User-agent: *\nAllow: /\nDisallow: /pricing/\nSitemap: https://iruvy.com/sitemap.xml\n");
writeFileSync(join(out, "404.html"), page({ route: "404", title: "페이지를 찾을 수 없습니다 | Iruvy", description: "요청한 페이지를 찾을 수 없습니다. Iruvy 홈에서 원하는 정보를 확인해 주세요.", robots: "noindex", body: `<section class="simple-hero compact"><div class="shell"><p class="eyebrow">404</p><h1>페이지를 찾을 수 없습니다</h1><p>주소가 바뀌었거나 더 이상 제공하지 않는 페이지입니다.</p><a class="button" href="/">Iruvy 홈으로</a></div></section>` }));

mkdirSync(join(out, "server"), { recursive: true });
writeFileSync(join(out, "server", "index.js"), "export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n");

console.log(`Built ${pages.size + 3} pages into ${out}`);
