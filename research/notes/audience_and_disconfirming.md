# Audience Model

## 0. Framing: who actually pays vs. who actually walks

The single most dangerous confusion for Iruvy is treating "the people we help" as "the people who buy." They are almost entirely disjoint sets. Visually-impaired users, older adults, and first-time visitors *experience* the product; they have near-zero authority over whether a hospital, subway operator, or welfare center signs a contract. In Korean B2G/B2B accessibility procurement, the person who feels the emotional weight of the mission ("이동권", "누구나 어디든") is rarely the person who signs the purchase order, and the person who signs the PO is usually indifferent to the emotion and acutely sensitive to budget code, audit risk, and precedent.

So the public homepage is not a place to move a blind user. It is a place to arm a mid-level manager who has to walk into a budget meeting and defend spending money on something no one has heard of.

### End users (experience, do not buy)

| Segment | What they want | Influence on purchase |
|---|---|---|
| Visually impaired | Independent arrival without asking strangers; trustworthy voice/vibration cues; no dead ends | Low direct; **high symbolic** — their advocacy orgs (한국시각장애인연합회 등) legitimize the buyer's decision |
| Older adults | Simple, forgiving, large-text/voice guidance; not feeling stupid | Low; matters for "고령친화"/"어르신" political framing |
| Mobility-disadvantaged (wheelchair, 교통약자) | Step/obstacle-avoiding routes, accurate accessible-path info | Low direct; strong in 교통약자 편의증진 mandates |
| First-time visitors / foreign | Fast wayfinding, multilingual | Low; useful for "방문객 만족도 / 민원 감소" ROI framing to the buyer |

Key inversion: **end-user testimony is not the sale — it is the evidence the buyer uses to survive internal review.** Users are witnesses, not customers.

---

## 1. Primary buyer personas

Five personas do the real deciding. For each: role context, goals, responsibilities, constraints, fears, approval path, objections, information needs, language, risk tolerance, evidence threshold, and personal definitions of success/failure.

### Persona A — "접근성/편의증진 담당" (Accessibility / Facilities-accessibility manager) — **the champion**
*Typical org: general hospital administration, public institution 총무/시설팀, 교통공사 고객서비스/안전팀, 대학 장애학생지원센터, 복지관 사무국.*

- **Role & context:** Mid-level staff (대리~과장) tasked with meeting accessibility obligations, handling complaints, and producing evidence that "we are doing something." Often owns 무장애/BF (barrier-free) certification upkeep, disability-access audits, and the annual accessibility report. Has responsibility without budget authority.
- **Goals:** Close a known, documented gap (indoor last-100m) cheaply; generate a defensible success story; reduce repeated wayfinding complaints and staff escort burden; get through the next audit/certification cleanly.
- **Responsibilities:** Complaint reduction, audit/certification compliance, coordinating with disability orgs, writing the internal proposal that someone above them approves.
- **Constraints:** No discretionary budget; must route through 예산/구매; limited technical literacy; already overloaded; personally blamed if a pilot flops publicly.
- **Fears:** Championing a startup that disappears in a year; a blind user getting hurt or misrouted and it becoming a complaint/news item; being told "왜 검증도 안 된 걸 들여왔냐" in an audit; wasting political capital.
- **Internal approval process:** Champion writes a 1–2 page 내부 검토/기안 → section head (팀장) → 예산 확인 → 상위 결재(처장/원장/부서장) → 구매/계약 부서(수의계약 or 입찰). For anything non-trivial, needs a budget line that already exists or a grant/외부예산 to avoid touching general budget.
- **Likely objections:** "예산 코드가 없다." "레퍼런스(다른 기관 도입 사례)가 있나?" "개인정보/위치정보는 어떻게 되나?" "설치·유지관리는 누가?" "우리 인력이 관리 못 한다."
- **Information needs:** A ready-made internal-justification kit — one-pager they can paste into a 기안문, a reference list of comparable institutions, a privacy/보안 one-pager, an evidence sheet, and a clear "무료로 시작 가능" on-ramp.
- **Language:** 이동권, 접근성, 무장애(BF) 인증, 편의증진, 민원 감소, 실증, 사회적 가치, ESG, 고객 만족도. Avoids startup jargon; distrusts "AI 혁신" hype.
- **Risk tolerance:** Low-to-moderate — *but* the free SW-only on-ramp is exactly what lets a risk-averse champion say yes, because a free pilot needs no budget approval and carries little downside.
- **Evidence threshold:** Wants at least one comparable public institution already live, or a credible third-party endorsement (disability org, ministry award). A single vendor-run PoC is "interesting" but not yet "safe."
- **Success = personally:** Gets praised for a low-cost, high-visibility accessibility win; cited in the annual report; safe at audit. **Failure = personally:** Named as the person who brought in a flaky vendor; a public incident; wasted budget.

> **This persona is the homepage's true target** (see §2).

### Persona B — 공공기관 사업/정책 담당 & 예산 owner (Public-sector program official / budget holder)
*지자체 복지·교통·스마트도시과, 교통공사 기획, 공단.*

- **Role & context:** Owns a program budget or a smart-city/BF/교통약자 line item. Decides whether Iruvy fits an existing 사업 or a new one.
- **Goals:** Spend budget defensibly against a policy objective (교통약자 이동편의, 스마트도시 실증, 디지털 접근성); show measurable outcomes to auditors and to elected superiors.
- **Responsibilities:** Program outcomes, 예산 집행률, 감사 대응, 사업 실적 보고.
- **Constraints:** Procurement law (수의계약 한도, 나라장터/입찰), fiscal-year timing, must map spend to a code, extreme audit sensitivity.
- **Fears:** 감사 지적(부적정 집행), 특정 업체 특혜 의혹, a project with no measurable outcome, vendor insolvency mid-contract.
- **Approval process:** Program plan → 예산 편성 → 입찰/수의계약 → 계약/검수. Multi-month; fiscal-year-bound.
- **Objections:** "조달 등록/실적이 있나?" "왜 이 업체여야 하나(경쟁성)?" "성과지표를 뭘로 보고하나?" "개인정보 영향평가 대상인가?"
- **Info needs:** Policy-fit language, measurable KPI definitions, procurement path (조달청 등록 여부, 수의계약 근거), a story that survives 감사.
- **Language:** 정책 부합성, 성과지표, 집행 근거, 실증, 공모/사업, 조달.
- **Risk tolerance:** Low. Process-bound.
- **Evidence threshold:** Prior public-sector reference + measurable outcome design. Awards/선정 (e.g. 장관상, 강소특구) meaningfully de-risk.
- **Success/failure personally:** Clean 실적 + 감사 무지적 = success; 감사 지적 or 특혜 의혹 = career damage.

### Persona C — 병원 행정/시설 관리자 (Hospital administrator / facilities)
- **Role:** 원무·총무·시설. Cares about patient flow, 민원, 안내데스크 부하, 고령 환자/보호자 experience, and 의료기관 인증(평가) accessibility items.
- **Goals:** Reduce "진료실 어디예요" load, cut escort/안내 staff burden, improve satisfaction scores, support 인증 evidence.
- **Constraints:** Infection control / physical install limits, IT security review, patient-data sensitivity (extreme), tight capital budget.
- **Fears:** A patient misrouted to the wrong department; location data of patients leaking; anything that adds staff workload; install disrupting operations.
- **Approval:** 팀장 → 행정부원장/기획 → 구매 → often IT 보안팀 gate.
- **Objections:** "환자 위치정보를 수집하나? 어디에 저장되나?" "설치가 진료에 지장을 주나?" "누가 유지보수?" "다른 병원 사례?"
- **Info needs:** On-device / no-server privacy proof, install footprint, maintenance model, hospital references, satisfaction/민원 ROI.
- **Language:** 환자 경험, 안내 부하, 동선, 인증, 보안.
- **Risk tolerance:** Low; privacy/security is a hard gate.
- **Evidence threshold:** Another hospital live + a security/privacy answer that passes IT review.
- **Success/failure:** Fewer complaints & smooth audit = win; a privacy incident = firing-level.

### Persona D — 시설/운영 관리자 (Facility & operations manager — subway station, mall, complex, exhibition)
- **Role:** Day-to-day operations of the physical space. The person who would actually do the "scan to register" and maintain it.
- **Goals:** Fewer lost-visitor incidents, lower안내 burden, works without adding a full-time job.
- **Constraints:** Space changes constantly (renovation, tenant turnover) → **map staleness is their nightmare**; thin staffing; no appetite for a system they must babysit.
- **Fears:** Being told they now "own" a tech system; outdated maps sending someone wrong; install/wiring/power burden; who fixes a broken edge device at 11pm.
- **Approval:** 운영팀장 → 시설/본사 → 구매.
- **Objections:** "공간이 바뀌면 누가 업데이트?" "장비 설치/전원/통신은?" "고장 나면?" "우리가 관리해야 하나?"
- **Info needs:** Auto-update story (HW track), install spec, SLA/유지보수, self-service simplicity proof.
- **Language:** 운영 부담, 유지보수, 설치, 업데이트.
- **Risk tolerance:** Low on operational burden.
- **Evidence threshold:** A live site with proof that upkeep is near-zero.
- **Success/failure:** "It just runs" = win; "now I have a second job / it broke publicly" = fail.

### Persona E — 임원/의사결정권자 (Executive sponsor — 원장/처장/본부장/대표)
- **Role:** Final signature, political cover, budget release.
- **Goals:** Visible institutional win (ESG, 접근성 선도, 언론), no scandal, no wasted money.
- **Constraints:** Reputation, board/의회/상급기관 optics, competing priorities.
- **Fears:** Association with a failed or embarrassing project; being the first/only adopter with no cover.
- **Approval:** They *are* the gate; they approve what the champion + program owner de-risked.
- **Objections:** "이거 우리가 제일 처음인가?" "리스크는?" "언론/평판에 도움이 되나?"
- **Info needs:** Peer adoption, credibility signals (awards, 특구, 대학·기관 실증), a clean one-line story.
- **Language:** 선도, 사회적 가치, 평판, 리스크.
- **Risk tolerance:** Low on reputation, higher on small budget if optics are good.
- **Evidence threshold:** Peer/precedent + credibility badges.
- **Success/failure:** A photogenic launch and an award = win; a public failure = personal embarrassment.

### Adjacent influencers / gatekeepers (can veto, rarely champion)
- **개인정보/보안 담당 (privacy & security):** Hard veto power. Cares only about: what location data is collected, where it lives, retention, 위치정보법 준수, 개인정보 영향평가(PIA) applicability, consent. Can kill a deal the champion loves.
- **구매/조달 (procurement):** Cares about 조달 등록, 계약 형태, 실적, 재무 안정성. Not a champion; a filter.
- **법무 (legal):** Contract, liability if a user is harmed, IP.
- **복지·장애인 단체 파트너 (welfare/disability org partners):** Not buyers, but **legitimizers** — their endorsement is the champion's strongest internal ammunition and often the reason an executive feels safe.

---

## 2. The single most important primary audience for the public homepage

**Persona A — the mid-level 접근성/편의증진/시설 담당 champion inside a target institution.**

Why this one, decisively:
1. **They start the process.** Nothing happens in Korean B2G/B2B unless an internal champion drafts the first 기안. Executives approve; procurement filters; privacy vetoes — none of them *initiate*. The homepage's job is to manufacture and equip champions.
2. **They are reachable by a website.** Executives and budget owners are reached through the champion's memo, references, and warm intros — not by browsing a startup's site. The champion is the one who actually lands on the homepage looking for "is this real, and can I defend it?"
3. **The free SW-only on-ramp is built for exactly their constraint** (no budget authority). The site can convert a champion into a zero-budget pilot in one visit — the highest-leverage action available.
4. **They carry the emotion internally so the site doesn't have to broadcast it.** The champion already believes in 이동권; what they lack is *ammunition* (evidence, references, privacy answers, a paste-ready justification). The homepage should hand them a loaded gun, not repeat the mission they already feel.

Everything else on the site should be secondary structure serving this one job: **turn an accessibility manager into an internal champion who can survive budget review and start a free pilot today.**

---

# Disconfirming Review (Adversarial)

Ground rule for this section: assume the reader is a skeptical 과장 who has been burned by a vendor before, has 20 minutes, and has to defend any decision to an auditor. Every "nice" thing on the current site is evaluated as: *does it help this person say yes and survive?* Uncomfortable truths first.

## Attack 1 — The site is talking to users and investors, not buyers
**Risk (high).** A slogan-first, mockup-heavy, "누구나 어디든" layout is the visual grammar of a consumer app and an investor pitch deck — not a B2G procurement decision aid. The champion scanning for "can I defend this internally" finds mission and product, not budget code, references, privacy, or procurement path. The site optimizes for feeling, not for the champion's *job*. Result: warm feelings, no 기안.

The tell: if you deleted the buyer's name from the page and showed it to a stranger, they'd guess "a nonprofit or a B2C accessibility app," not "infrastructure I procure." That's an audience-identity failure.

**Recommendation:** Re-architect the homepage around the champion's internal-justification journey, not the user's emotional journey. Hero should name the buyer's problem and outcome ("복잡한 실내공간, 안내 민원과 에스코트 부담을 줄이는 실내 내비게이션 — 무료로 시작"). Keep exactly one emotional line as a values anchor, not the headline. Add a persistent "기관 도입 안내 / 자료 받기" path above the fold. Add a dedicated **"도입 검토 자료실"** (one-pager, privacy sheet, reference list, KPI sheet) — literally the ammunition the champion needs.

## Attack 2 — The emotional slogan can actively hurt the budget defense
**Risk (medium-high).** "누구나 어디든 갈 수 있는 세상" is a movement slogan. To a hospital/public evaluator who must write "why we spent money on this," an emotional slogan is *worse than neutral*: it reads as "charity/nice-to-have," which is the death category in budget triage. Auditors and budget owners are trained to cut "감성적/시혜적" spending first. The slogan primes the wrong mental bucket (복지 시혜) instead of the defensible ones (편의증진 의무 이행, 민원 감소, 인증 대응, 규제 대응).

Counter-argument I considered: emotion helps the executive (Persona E) and the disability-org legitimizer. True — but they don't reach the site cold, and the champion can deploy emotion selectively in person. The homepage's dominant frame should serve the champion's *budget* problem, not the executive's *optics* problem.

**Recommendation:** Demote the slogan to a supporting/closing line. Lead with an *obligation-and-outcome* frame the buyer can put in a 기안 verbatim: reduced complaints, reduced escort staff burden, accessibility/BF certification evidence, and — most powerfully — **regulatory/compliance drivers** (편의증진법·교통약자 이동편의 의무, and for global/enterprise framing EAA 2025.06.28 / ADA·WCAG). Reframe from "do good" to "meet an obligation cheaply, with evidence." That is the sentence that survives audit.

## Attack 3 — Leading with the app (product) is backwards
**Risk (medium-high).** App mockups answer "what is it," but the buyer's first question is "what problem of *mine* does this solve, and what does success look like for *my institution*." Leading with the product forces the buyer to do the translation work themselves — most won't; they'll bounce. Worse, prominent app screens reinforce the "this is a B2C app" misread from Attack 1, and invite the objection "why would we pay for an app users download themselves?"

**Recommendation:** Lead with buyer outcomes and a before/after of *the institution's* problem (안내데스크 반복 문의, 에스코트 인력, 민원, 접근성 미흡 지적) → then the outcome (도착 성공률↑, 이동시간↓, 문의↓) → *then* the product as the mechanism. Structure: Problem (theirs) → Outcome (measurable) → How (app + optional HW) → Proof → On-ramp. Move mockups below the outcome section.

## Attack 4 — The PoC numbers invite doubt instead of trust
**Risk (high — this is the credibility core).** "26.6% → 96.7%" is a spectacular number, and *spectacular vendor-provided numbers with no visible methodology are exactly what a skeptic distrusts.* A sharp evaluator immediately asks: n=? who ran it? was it self-selected? what's the task? was it single-session (novelty/coaching effect)? third-party verified? The current presentation (metric as a hero stat) triggers "too good, probably cherry-picked / marketing." A 91.3% (21/23) and 96.7% (87/90) with a 26.6% baseline is genuinely strong — but presented as a bare headline it reads as hype, and hype from a startup near a vulnerable population reads as *risk*.

Specific credibility holes as presented: (a) vendor-run, not third-party certified — and the current site (per brief) doesn't say so, which is worse than disclosing it; (b) no visible methodology (task, distance, environment, session count); (c) small n not contextualized; (d) no baseline-condition definition ("26.6% of what, measured how").

**Recommendation:**
- **Disclose, don't inflate.** State n explicitly (1차 21/23=91.3%, 2차 87/90=96.7%, baseline 26.6%), the task (~300m 독립 도착, 대학 학생회관), and label it clearly as **자체 실증(internal PoC), 제3자 인증 아님**. Honesty here *builds* trust with the exact skeptic who matters; concealment gets caught and destroys it.
- Add methodology in one line and a link to a fuller PoC report (the champion needs it for their 기안 anyway).
- Frame as "초기 실증 결과, 확대 검증 진행 중" — a startup claiming provisional evidence is credible; a startup claiming certainty is not.
- Pursue and then feature a **third-party or institutional co-sign** (disability org, university, ministry award) next to the number — a co-signed 96.7% is trusted; a self-reported one is doubted.

## Attack 5 — Critical objections the site fails to answer (each one a silent exit)
Every unanswered objection below is a place where the champion silently decides "not worth the internal fight" and closes the tab.

1. **위치정보/개인정보 (privacy) — the #1 silent killer.** For hospitals and public bodies, the privacy/보안 gatekeeper (adjacent influencer) has veto power. If the site doesn't *prominently* answer "무엇을 수집하나 / 온디바이스 처리 / 서버 전송 여부 / 위치정보법·개인정보 준수 / 영향평가 대상 여부," the champion can't even start, because they know 보안팀 will kill it. **Recommendation:** A first-class "데이터·보안" section stating on-device processing, minimal/anonymized data, no real-time server transmission of user location, 위치정보법 준수, and a downloadable 보안 검토 자료. Turn the biggest veto into a selling point (온디바이스 = privacy advantage).
2. **설치·운영 부담 (install & maintenance).** Persona D bounces without: install footprint, power/통신 needs, who maintains, what happens when the space changes, SLA. **Recommendation:** Clear "설치·운영" section: SW-only = zero hardware; HW track = spec + auto-update + 유지보수/SLA. Explicitly kill the "we'll have to babysit it" fear.
3. **레퍼런스 — "누가 이미 도입했나."** Every persona asks this; executives and budget owners *require* it (precedent = cover). A list of 실증 기관 exists (10곳) — if not shown as a credible reference wall, it's wasted. **Recommendation:** A reference/실증 기관 section with logos/names (permission-cleared), type of space, and if possible a quote. Distinguish 실증/협의 vs 유료 도입 honestly — but *show the wall*, because "10 institutions" is the single most persuasive de-risker Iruvy currently has.
4. **ROI / budget justification.** The champion must translate this into 예산 언어. Nothing on the site does that math for them. **Recommendation:** A "도입 효과" section with the buyer's own metrics: 안내 문의/에스코트 인력 절감, 민원 감소, 인증·규제 대응, 만족도. Provide the sentence they paste into the 기안.
5. **조달/구매 경로 (procurement path).** Public buyers need to know *how* they can legally buy (수의계약 근거, 조달청 등록 여부, 계약 형태, 무료 실증 → 유료 전환 경로). Silence here stalls even a willing buyer. **Recommendation:** A "도입 절차" section: 무료 실증 시작 → 성과 리포트 → 유료 전환/계약 방식, plus procurement status.
6. **회사 신뢰성/지속성 (will you exist next year).** Championing a startup that vanishes is a career risk. **Recommendation:** Credibility badges (강소특구 육성기업, 장관상, 대학·기관 실증, 예창패 선정), team, and traction — as *institutional-trust* signals, not startup-brag.

## Attack 6 — What makes a real accessibility manager bounce (failure modes to design against)
- **"This is a nice app, but where's the part I can defend to my boss?"** → no buyer content = bounce. (Fix: Attacks 1–3.)
- **"위치정보는 어떻게 되는데?"** with no answer → bounce (they won't start a fight they'll lose at 보안팀). (Fix: Attack 5.1.)
- **"96.7%? 업체가 자기가 잰 거잖아."** → skepticism = bounce or discount to zero. (Fix: Attack 4.)
- **"누가 쓰고 있는데?"** with no reference wall → bounce (no precedent = no cover). (Fix: Attack 5.3.)
- **"우리가 관리해야 되는 거 아냐?"** → operational fear = bounce. (Fix: Attack 5.2.)
- **"예산 코드가 없는데."** with no free on-ramp visible → bounce. (Fix: make the free SW-only pilot the primary CTA — it's the one path that needs no budget approval.)
- **Over-emotional / 시혜적 tone** → filed mentally under "복지 홍보물, 예산 우선순위 아님" → bounce. (Fix: Attack 2.)

## Synthesis — the one structural change
The site is currently a **mission-and-product** page (good for investors, disability-community goodwill, and end-user empathy). It needs to become a **champion-enablement** page: buyer-problem headline → institutional outcomes → honestly-framed evidence with disclosed methodology and third-party co-sign → reference wall → privacy/security answer → install/maintenance answer → procurement path → free-pilot CTA. Keep exactly enough emotion to signal values (one line, near the close), and let the champion carry the rest of the emotion into the room in person.

Blunt version: **the homepage's job is not to make anyone believe in the mission — it's to make one overworked, risk-averse manager confident they won't get burned for saying yes.** Right now it's built for the wrong reader.

---

### Note on sourcing
This is a strategy/audience analysis grounded in general knowledge of Korean B2G/B2B procurement behavior, accessibility/편의증진 obligations, and privacy/위치정보 governance, plus the company facts supplied in the brief and project context. Regulatory references (편의증진법·교통약자 이동편의, 위치정보법/개인정보, EAA effective 2025-06-28, ADA/WCAG) are cited from general knowledge and should be verified against current statute text before any are used in customer-facing copy. No external sources were fetched for this document; company-specific figures (실증 10곳, PoC 21/23·87/90·26.6%→96.7%, awards) are as provided and are explicitly flagged in the brief as not third-party certified.
