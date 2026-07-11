# Standards, Regulation & Procurement Context

Research brief for **Iruvy** — an indoor-navigation accessibility startup selling to hospitals, public
institutions, welfare facilities, universities, and transit operators, serving visually-impaired and
mobility-disadvantaged users.

- **Purpose:** ground Iruvy's website messaging and buyer-facing claims in the actual standards,
  regulations, and procurement realities that institutional buyers and reviewers care about.
- **All sources accessed:** 2026-07-11.
- **Confidence convention used throughout:** *Well-established* = stable, primary-source-verifiable
  fact; *Approximate / secondary* = drawn from vendor/explainer sources and directionally reliable but
  worth primary confirmation before quoting in a legal or contractual context; *Uncertain* = flagged
  explicitly, general principle stated rather than a specific provision.

---

## 1. WCAG 2.2 Level AA — what a reviewer checks on a marketing/informational site

Iruvy's own website must be accessible; a site selling *accessibility* that fails accessibility is a
credibility risk. The globally referenced target is **WCAG 2.2 Level AA** (W3C Recommendation,
published 2023-10-05). WCAG 2.2 kept everything in 2.0/2.1, **added 9 new success criteria**, and
**removed 4.1.1 Parsing** as obsolete. *(Well-established — W3C.)*

### 1.1 The core Level-A/AA criteria a reviewer will test on an informational site

These are the long-standing 2.0/2.1 requirements that matter most for a mostly-static marketing site
(no login, no complex forms). *(Well-established — W3C WCAG; exact numeric thresholds are stable.)*

| Area | Criterion | Concrete requirement a reviewer checks |
|---|---|---|
| **Text alternatives** | 1.1.1 Non-text Content (A) | Every meaningful image/icon has a descriptive `alt`; decorative images have empty `alt=""`. |
| **Info & relationships** | 1.3.1 (A) | Headings, lists, and landmarks are real semantic markup, not just visually styled text. |
| **Heading order** | 1.3.1 / 2.4.6 (AA) | One `<h1>`, logical descending heading structure, descriptive headings and labels. |
| **Color not sole cue** | 1.4.1 (A) | Meaning (e.g. "required", a status) is never conveyed by color alone. |
| **Text contrast** | 1.4.3 (AA) | Normal text ≥ **4.5:1**; large text (≥18pt / 14pt bold) ≥ **3:1** against its background. |
| **Resize / reflow** | 1.4.4 (AA), 1.4.10 (AA) | Content usable at 200% zoom; reflows to a 320 CSS-px width with no loss of content or horizontal scrolling. |
| **Non-text contrast** | 1.4.11 (AA) | UI components, icons, and focus/state indicators ≥ **3:1** against adjacent colors. |
| **Text spacing** | 1.4.12 (AA) | No content loss when users override line/letter/word spacing. |
| **Keyboard** | 2.1.1 (A), 2.1.2 (A) | Every interactive element is reachable and operable by keyboard alone; no keyboard traps. |
| **Pause/stop motion** | 2.2.2 (A) | Auto-playing/animated content lasting >5s can be paused, stopped, or hidden. |
| **Motion from animation** | 2.3.1 (A), 2.3.3 (AAA) | No content flashes >3×/sec; reduce motion honored (2.3.3 is AAA but often expected). |
| **Skip / navigation** | 2.4.1 (A) | "Skip to content" link or equivalent bypass mechanism. |
| **Page titles / link purpose** | 2.4.2, 2.4.4 (A) | Unique descriptive `<title>`; link text makes purpose clear out of context (no bare "click here"). |
| **Focus visible** | 2.4.7 (AA) | A clearly visible keyboard focus indicator on every focusable element. |
| **Language** | 3.1.1 (A) | `<html lang="ko">` (and `lang` on any inline language switches). |
| **Labels / errors** | 3.3.1, 3.3.2 (A) | Any form (e.g. a contact/demo-request form) has visible labels and clear error identification. |
| **Name, role, value** | 4.1.2 (A) | Custom widgets expose correct roles/states to assistive tech. |

### 1.2 The WCAG 2.2 additions (9 new criteria; the AA ones matter most)

*(Well-established — W3C "What's New in WCAG 2.2".)*

- **2.4.11 Focus Not Obscured (Minimum) — AA:** a focused element must not be *entirely* hidden by
  sticky headers/footers or overlays.
- **2.5.7 Dragging Movements — AA:** anything operable by dragging must also work with a single-pointer
  tap/click alternative.
- **2.5.8 Target Size (Minimum) — AA:** pointer targets ≥ **24×24 CSS px** (or adequately spaced).
  *This was AAA in 2.1 and is now AA — a common new failure on tight nav bars and icon buttons.*
- **3.2.6 Consistent Help — A:** repeated help mechanisms (contact link, chat) appear in a consistent
  relative order across pages.
- **3.3.7 Redundant Entry — A:** don't force re-entry of info already provided in the same process.
- **3.3.8 Accessible Authentication (Minimum) — AA:** no cognitive-function test (e.g. puzzle CAPTCHA,
  memory task) as the only way to authenticate. *(Low relevance for a no-login marketing site, but
  relevant if a demo portal is added.)*
- **AAA additions** (not required for AA, often cited as good practice): 2.4.12 Focus Not Obscured
  (Enhanced), 2.4.13 Focus Appearance, 3.3.9 Accessible Authentication (Enhanced).

### 1.3 Practical takeaway for the Iruvy site

A reviewer of an informational site will most quickly catch: insufficient **text/non-text contrast**,
**missing/wrong alt text**, **broken heading hierarchy**, **invisible keyboard focus**, **missing
`lang`**, **too-small tap targets (new AA)**, and **content that breaks at 200% zoom / narrow reflow**.
These are the concrete, checkable items to get right first.

**Sources:**
- [What's New in WCAG 2.2 — W3C Web Accessibility Initiative](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) (W3C, accessed 2026-07-11)
- [WCAG 2.2 New Success Criteria — TestParty](https://testparty.ai/blog/wcag-22-new-success-criteria) (accessed 2026-07-11)
- [WCAG 2.2 AA Summary and Checklist — Level Access](https://www.levelaccess.com/blog/wcag-2-2-aa-summary-and-checklist-for-website-owners/) (accessed 2026-07-11)

---

## 2. Korean accessibility law & policy — obligations on public facilities and digital services

Korea has **two parallel obligation streams** that matter to Iruvy: (a) **physical/facility
accessibility** and (b) **digital/web accessibility**. Together they create the buyer's motivation.

### 2.1 편의증진법 — physical convenience facilities (buyer's facility obligation)

**장애인·노인·임산부 등의 편의증진 보장에 관한 법률** (Act on Guarantee of Convenience Promotion for
Persons with Disabilities, the Elderly, Pregnant Women, etc.). *(Well-established that the law exists
and imposes facility duties; specific article numbers below stated at general-principle level.)*

- **Core duty:** operators/managers of covered facilities (대상시설) must **install and maintain
  "편의시설" (convenience facilities)** meeting statutory standards when building or making major changes
  to a facility. The State and local governments carry a policy duty to enable safe, convenient use and
  information access by persons with disabilities and others.
- **Direction of recent amendments:** enforcement-decree changes have been **lowering/removing the
  minimum floor-area thresholds** so that smaller public and neighborhood commercial facilities also
  fall under mandatory convenience-facility installation — i.e. the obligation is **expanding**, not
  contracting.
- **Buyer relevance:** hospitals, public institutions, welfare facilities, and transit terminals are
  squarely "대상시설." Wayfinding/guidance for disabled and elderly visitors sits in the same policy
  frame as tactile paving, ramps, and signage — Iruvy can position itself as helping operators meet the
  *spirit and evidence expectations* of this regime. **Caveat:** 편의증진법's detailed installation
  standards are about physical fixtures; a digital navigation app is **not, by itself, a statutorily
  mandated "편의시설"** under the current standards. Claim it as *aligned with / supportive of* the
  accessibility mandate, **not** as "required by 편의증진법." *(This distinction is important —
  overclaiming a legal mandate is a credibility risk.)*

### 2.2 Web/digital accessibility — the real legal hook: 장애인차별금지법 + 지능정보화기본법 + KWCAG

This is where a **hard legal obligation** on institutions genuinely exists for digital services.

- **장애인차별금지 및 권리구제 등에 관한 법률 (장차법 / KDDA):** establishes a duty of **"정당한 편의제공"
  (provision of reasonable accommodation)**, including that actors producing/distributing electronic and
  non-electronic information must let persons with disabilities access and use it **on an equal basis**.
  Web accessibility was legally anchored via 장차법 (obligations phased in from ~2008) together with the
  national informatization law. *(Well-established.)*
  - **Enforcement teeth:** a person discriminated against by non-compliance can pursue **injunctions and
    civil damages**; a **malicious** discriminatory act can carry criminal penalties (secondary sources
    cite up to **3 years imprisonment or a 30 million KRW fine**). Burden-shifting applies: the claimant
    shows discrimination occurred, and the respondent must show it was not disability-based or was
    justified. *(Penalty figure: approximate / secondary — confirm against current statute text before
    quoting in a contract or legal doc.)*
- **지능정보화기본법 (Framework Act on Intelligent Informatization, successor to 국가정보화기본법):**
  contains the web-accessibility obligation (historically Art. 32 of the predecessor law) requiring that
  websites be built so anyone can use them **regardless of physical/technical conditions**.
  *(Well-established that the obligation exists in this framework law; exact current article number —
  Uncertain, cite the law generally rather than pin a number.)*
- **KWCAG 2.2 (한국형 웹 콘텐츠 접근성 지침 2.2):** the **Korean national web-accessibility standard**,
  structurally aligned with WCAG. It sets **4 principles, 14 guidelines, and 33 checkpoints**, and is the
  standard used to satisfy the web-accessibility obligations under 지능정보화기본법 and 장차법.
  *(Well-established — a11ykr / KWACC.)*
- **Certification signal:** the **웹 접근성 품질인증 (Web Accessibility Quality Certification)** operated
  under the digital-accessibility promotion body (한국디지털접근성진흥원 / KWACC) is the recognized mark
  institutions look for. A private company can pursue it as a third-party trust signal. *(Well-established
  that the certification scheme exists.)*

**Obligated parties** for web accessibility explicitly include **public institutions, education
institutions, medical institutions/practitioners, welfare facilities, transport/mobility-related actors,
and cultural/arts operators** — i.e. essentially Iruvy's entire target buyer list.

### 2.3 교통약자의 이동편의 증진법 — transit accessibility (transit-buyer motivation)

**교통약자의 이동편의 증진법** (Act on Promotion of Transportation Convenience for the Mobility
Impaired). *(Well-established that the law imposes these duties.)*

- **Purpose:** ensure the mobility-impaired can move **safely and conveniently** by expanding "이동편의
  시설" across transport means, **passenger facilities (여객시설)**, and roads, and improving the walking
  environment — building a "person-centered" transport system.
- **Duties:** transport operators / facility managers must **install and maintain 이동편의시설 to
  statutory standards** when building or materially changing passenger facilities; transport
  administrative agencies must **review conformance (기준적합성 심사)** at licensing/approval.
- **Buyer relevance:** subway/rail operators and terminal managers (one of Iruvy's named PoC segments,
  e.g. Seoul Metro Line 9) operate under an explicit statutory obligation to improve mobility-impaired
  wayfinding — a strong motivation driver. **Same caveat as 2.1:** the statute mandates physical
  facilities; frame Iruvy as *supporting compliance and improving measured outcomes*, not as a mandated
  item.

### 2.4 What this means for buyer motivation

- Public hospitals, government offices, welfare facilities, universities (public), and transit operators
  face **real, enforceable digital-accessibility obligations (장차법 + 지능정보화기본법 + KWCAG)** and
  **expanding physical convenience-facility obligations (편의증진법 / 교통약자법)**.
- The strongest honest positioning: Iruvy helps institutions **generate accessibility evidence, improve
  measured accessibility outcomes, and demonstrate ESG/social-value performance** in a policy environment
  where the mandate scope is widening — rather than claiming Iruvy is a legally required product.

**Sources:**
- [장애인·노인·임산부 등의 편의증진 보장에 관한 법률 — 국가법령정보센터(law.go.kr)](https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%9E%A5%EC%95%A0%EC%9D%B8%E3%86%8D%EB%85%B8%EC%9D%B8%E3%86%8D%EC%9E%84%EC%82%B0%EB%B6%80%EB%93%B1%EC%9D%98%ED%8E%B8%EC%9D%98%EC%A6%9D%EC%A7%84%EB%B3%B4%EC%9E%A5%EC%97%90%EA%B4%80%ED%95%9C%EB%B2%95%EB%A5%A0) (accessed 2026-07-11)
- [장애인차별금지법과 웹접근성 준수 의무 — Nepla](https://www.nepla.net/post/%EC%9E%A5%EC%95%A0%EC%9D%B8%EC%B0%A8%EB%B3%84%EA%B8%88%EC%A7%80%EB%B2%95%EA%B3%BC-%EC%9B%B9%EC%A0%91%EA%B7%BC%EC%84%B1-%EC%A4%80%EC%88%98-%EC%9D%98%EB%AC%B4) (accessed 2026-07-11)
- [정보접근성 관련법률 — 한국디지털접근성진흥원(KWACC)](http://www.kwacc.or.kr/Accessibility/Law) (accessed 2026-07-11)
- [한국형 웹 콘텐츠 접근성 지침(KWCAG) 2.2 — a11ykr](https://a11ykr.github.io/kwcag22/) (accessed 2026-07-11)
- [교통약자의 이동편의 증진법 — 국가법령정보센터(law.go.kr)](https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B5%90%ED%86%B5%EC%95%BD%EC%9E%90%EC%9D%98%EC%9D%B4%EB%8F%99%ED%8E%B8%EC%9D%98%EC%A6%9D%EC%A7%84%EB%B2%95) (accessed 2026-07-11)

---

## 3. International regulatory demand signals

These matter for Iruvy in two ways: (a) as **global-expansion context** and (b) as **credibility
framing** ("the whole developed world is legislating accessibility"). They do **not** directly bind
Korean domestic buyers, so use them as macro-context, not as a mandate on a Korean hospital.

### 3.1 European Accessibility Act (EAA) — Directive (EU) 2019/882

- **Enforcement date: 28 June 2025.** New products/services placed on the EU market from that date must
  comply. *(Well-established.)*
- **Scope:** private-sector products & services to EU consumers — e-commerce, banking, e-books,
  telecoms, transport services, ticketing, computing hardware/OS, and more; applies to any
  manufacturer/importer/distributor/service-provider serving EU consumers **regardless of where the
  company is based**.
- **Technical basis:** conformance runs through **EN 301 549**, which incorporates **WCAG (2.1 Level AA
  today; 2.2 widely expected as the standard updates)**. *(Well-established that EN 301 549 is the
  harmonized standard and references WCAG.)*
- **Exemption:** micro-enterprises (<10 employees **and** ≤ €2M turnover/balance sheet) are largely
  exempt for services.
- **Penalties:** set by member states; secondary sources cite figures **up to ~€100,000 or a percentage
  of annual revenue** in some jurisdictions. *(Approximate / secondary — penalties are national, so any
  specific number is jurisdiction-dependent.)*
- **Buying pressure:** **strong** across the EU private sector; creates a large accessibility-tech market
  and normalizes accessibility procurement.

### 3.2 Germany — Barrierefreiheitsstärkungsgesetz (BFSG)

- **Germany's national transposition of the EAA; in force 28 June 2025.** *(Well-established.)*
- **Technical basis:** **EN 301 549 → WCAG (2.1 A/AA; some sources cite 2.2 AA as the practical target)**;
  detail in the ordinance **BFSGV**. *(WCAG version: sources differ between 2.1 and 2.2 — treat exact
  version as approximate / secondary.)*
- **Same micro-enterprise exemption** (<10 staff, ≤ €2M) and **transition periods to 27 June 2030** for
  certain pre-existing products/contracts.
- **Buying pressure:** strong in Germany; representative of how each EU member state now has a hard
  national accessibility statute.

### 3.3 United States — ADA, Section 508, WCAG in procurement

- **Section 508 (federal ICT procurement):** federal agencies must **buy ICT that is accessible** unless
  undue burden/fundamental alteration applies; the technical baseline is **WCAG 2.0 Level AA** (via the
  508 Refresh / EN 301 549 harmonization). *This is the clearest "accessibility-as-a-procurement-
  requirement" precedent globally.* *(Well-established.)*
- **ADA Title II — DOJ final rule (issued 24 April 2024):** state & local governments must make websites
  and mobile apps accessible to **WCAG 2.1 Level AA**; primary compliance deadline **24 April 2026** (with
  later deadlines for smaller jurisdictions). *(Well-established.)*
- **Buying pressure:** **strong and procurement-embedded** — Section 508 is the canonical example that
  public buyers can be *legally required* to prefer accessible ICT. Useful as an analogy when explaining
  to a Korean public buyer why accessibility is becoming a procurement criterion, not a nice-to-have.

### 3.4 Net signal

Globally, accessibility is shifting from "voluntary good practice" to **enforceable obligation embedded
in law and procurement** (EU EAA + national acts, US ADA/508). For Iruvy this is a legitimate
**tailwind / market-timing** narrative. Keep it as *context*: none of these directly compels a Korean
domestic institution — the Korean mandate (Section 2) is the one that binds Iruvy's actual buyers.

**Sources:**
- [European Accessibility Act (EAA) enforced 28 June 2025 — Sapna Security FAQ](https://www.sapnasecurity.com/2025/06/27/faq-for-european-accessibility-act-eaa-enforced-on-28th-june-2025-and-wcag-2-1-level-aa/) (accessed 2026-07-11)
- [European Accessibility Act — Level Access](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/) (accessed 2026-07-11)
- [Germany Ready for the EAA — Bird & Bird](https://www.twobirds.com/en/insights/2025/germany/germany-ready-for-the-eaa-european-accessibility-act-implementation-entering-into-force-on-28-june-2) (accessed 2026-07-11)
- [Barrierefreiheitsstärkungsgesetz (BFSG) 2025 — Eye-Able](https://eye-able.com/compliance/barrierefreiheitsstaerkungsgesetz-bfsg) (accessed 2026-07-11)
- [DOJ finalizes ADA Title II web accessibility rule — SBA Office of Advocacy](https://advocacy.sba.gov/2024/04/25/justice-department-finalizes-rule-requiring-state-and-local-governments-to-make-their-websites-accessible/) (accessed 2026-07-11)
- [U.S. Digital Accessibility Laws: ADA, Title II, Section 508 — Vispero](https://vispero.com/resources/us-accessibility-laws-standards/) (accessed 2026-07-11)

---

## 4. Korean public-sector / institutional procurement behavior for innovative tech

Iruvy's real go-to-market is B2G/B2B PoC-first adoption. The Korean state has a **purpose-built channel
for pre-commercial innovative products**, which is directly relevant.

### 4.1 The procurement backbone: 나라장터 (KONEPS) and 조달청 (PPS)

- **나라장터 (KONEPS / G2B)** is the national e-procurement marketplace operated by **조달청 (Public
  Procurement Service, PPS)**; most public purchases route through it. *(Well-established.)*

### 4.2 혁신조달 / 혁신제품 — the innovation-procurement track (best fit for Iruvy)

*(Well-established — PPS / KIPCC / 혁신장터.)*

- **Concept:** the government **buys pre-commercialization innovative products** and has public
  institutions **test them to create adoption cases**, improving public services and promoting tech
  innovation. This is explicitly designed for a company like Iruvy that has a product but limited paid
  references.
- **혁신제품 지정 (Innovation Product Designation):** products at roughly **technology-readiness stage 7+**
  undergo innovation evaluation and are designated via the Public Procurement Policy Review Committee.
- **Procurement privileges once designated:** **수의계약 (non-competitive / discretionary contract)**
  eligibility, **purchase-liability exemption** (buyers are shielded when purchasing designated innovation
  products — a big de-risking factor for public buyers), **시범구매 (pilot/trial purchase)**, and an
  **innovation-purchase target system** pushing institutions to buy innovation products.
- **시범구매 (trial purchase) flow:** apply during an announcement window on the **혁신장터 (Innovation
  Marketplace, ppi.g2b.go.kr)** → PPS runs a **matching** between test institutions and products →
  selected companies sign purchase contracts → the **test institution runs the pilot and submits a
  completion report** → PPS conducts innovation evaluation → a **"success" verdict grants eligibility to
  apply for 우수조달물품 (Excellent Procurement Product) designation**, which unlocks broader public sales.
- **Why it fits Iruvy:** it turns "no paid references yet" into a *structured path* — a public buyer can
  adopt via pilot with the purchase-liability exemption removing the "what if it fails" career risk that
  normally blocks public officials from buying from an early startup.

### 4.3 What institutional evaluators typically need before a pilot

Synthesized from the procurement structure above and standard Korean public-buyer practice
*(Approximate / practitioner-level synthesis, not a single citable checklist):*

- **References / 실증 track record:** prior pilots, named institutions, and outcome data — the single
  most persuasive item. Iruvy's ~10 실증 sites are the core asset here.
- **Certifications / formal signals:** relevant to the domain — e.g. **웹 접근성 품질인증** for the digital
  layer; **KC certification** for any installed hardware/edge device; innovation-product or 우수조달 status
  if pursued; R&D/innovation-cluster selections (e.g. KIST 강소특구 육성기업) as public-credibility proxies.
- **Security & privacy assurances:** for anything touching location/personal data, buyers increasingly
  expect **개인정보보호법 (PIPA)** alignment, data-minimization/anonymization statements, and — for larger
  public systems — awareness of security-review expectations (e.g. 보안성 검토, and where applicable
  location-data handling under 위치정보의 보호 및 이용 등에 관한 법률). *(General principle — specific
  applicability depends on the buyer and data flows; verify per deal.)*
- **Case studies / performance reports:** a clean pilot completion report with quantified outcomes
  (arrival-success rate, time reduction, satisfaction) is exactly what the 시범구매 completion-report step
  formalizes.
- **Standards conformance evidence:** WCAG/KWCAG conformance for the app UI; alignment with the
  accessibility-law frame in Section 2.

**Sources:**
- [혁신제품 지정 — 조달청(PPS)](https://pps.go.kr/kor/content.do?key=00648) (accessed 2026-07-11)
- [혁신조달 종합포털(혁신장터) — 나라장터](https://ppi.g2b.go.kr/) (accessed 2026-07-11)
- [혁신제품 지정제도 — 혁신제품지원센터(KIPCC)](https://www.kipcc.re.kr/innovate/appointment_system.php) (accessed 2026-07-11)
- [시범구매 제도소개 — smpp.go.kr](https://www.smpp.go.kr/cst/exmplPurchs/info/SelectDemoPurchaseInfo.do) (accessed 2026-07-11)
- [나라장터 — 조달청(PPS)](https://www.pps.go.kr/kor/content.do?key=00167) (accessed 2026-07-11)

---

## 5. Evidence threshold — what makes an accessibility/mobility claim credible to a skeptical buyer

Iruvy's headline claims (e.g. arrival-success improvement from 26.6% to ~93–97%, ~60% travel-time
reduction) are strong — which is exactly why a skeptical institutional evaluator will probe them. The
academic literature on indoor navigation for blind/visually-impaired users repeatedly stresses that
**results are context-dependent and under-generalized**, so honest framing is a competitive advantage.

### 5.1 What raises credibility

- **Sample transparency:** state **n**, participant profile (e.g. "23 visually-impaired participants"),
  task ("300m independent arrival"), and site ("Hanyang University student center"). Vague percentages
  without denominators read as marketing.
- **Before/after with a defined baseline:** a control/baseline condition (unaided vs. aided) is far more
  credible than a single aided number. Iruvy's 26.6% → ~96.7% framing works **only** if the 26.6%
  baseline condition is clearly defined.
- **Multiple pilots / replication:** the literature explicitly warns that systems that work on simple
  routes degrade on complex ones and that "extensive evaluation across different floorplans and
  participants is still needed." Reporting **two pilots** (e.g. 91.3% then 96.7%) is stronger than one.
- **Neutral outcome metrics:** arrival-success rate, travel time, route-deviation, repeated-inquiry
  count, satisfaction — objective, buyer-legible measures.
- **Third-party involvement:** any partner institution, IRB/ethics context, academic co-authorship, or
  independent observer materially raises trust versus purely internal vendor data.

### 5.2 Expected caveats when data is vendor-provided (not third-party certified)

A careful buyer expects — and trusts a vendor *more* for volunteering — these caveats:

- **"Self-reported / internal pilot data"** labeling. Do not imply third-party certification that
  doesn't exist.
- **Scope limits:** results are from specific sites and populations and **may not generalize** to a new
  building, layout, or user group without a fresh pilot.
- **Condition definition:** exactly what the baseline was, and whether users were trained/assisted.
- **No overclaiming of hazard avoidance / precision:** consistent with Iruvy's own honesty guardrails —
  claim "detection of dynamic obstacles / hazardous edges then reroute/stop guidance," **not** "avoids
  all nearby obstacles"; avoid unverified "cm-level positioning" claims.

### 5.3 The credibility-maximizing move

Offer a **structured pilot with pre-agreed success metrics** (which the 조달청 시범구매 completion-report
mechanism in Section 4 institutionalizes). This converts "trust our numbers" into "run the measurement
yourself" — the single most powerful answer to a skeptical buyer, and it aligns perfectly with Korea's
PoC-first innovation-procurement channel.

**Sources:**
- [Use of an Indoor Navigation System by Sighted and Blind Travelers — VEMI Lab, University of Maine](https://umaine.edu/vemi/wp-content/uploads/sites/220/2020/08/Use-of-an-Indoor-Navigation-System-by-Sighted-and-Blind-Travelers-Performance-Similarities-across-Visual-Status-and-Age.pdf) (accessed 2026-07-11)
- [Quantifying Navigational Difficulty for Visually Impaired Users (AccessQuotient) — ACM SIGACCESS/ASSETS](https://dl.acm.org/doi/10.1145/3663547.3759696) (accessed 2026-07-11)
- [Indoor Navigation Systems for Visually Impaired Persons: Mapping Features to User Needs — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7038337/) (accessed 2026-07-11)
- [A comprehensive review of navigation systems for visually impaired individuals — ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2405844024078563) (accessed 2026-07-11)

---

## Implications for Iruvy's website

1. **Ship the site at WCAG 2.2 / KWCAG 2.2 AA and say so.** A company selling accessibility must model it.
   Prioritize the fast-fail items: text contrast ≥4.5:1, correct alt text, clean heading order, visible
   keyboard focus, `lang="ko"`, **24×24px tap targets (new AA)**, and 200%-zoom / narrow-reflow integrity.
   Consider pursuing **웹 접근성 품질인증 (KWACC)** and displaying the mark as a trust signal.

2. **Lead with the Korean mandate, use the global wave as context.** The binding motivation for Korean
   buyers is **장차법 + 지능정보화기본법 + KWCAG** (digital) and **편의증진법 + 교통약자법** (physical).
   Present EAA/BFSG/ADA-508 as "the world is legislating accessibility" tailwind — not as obligations on a
   Korean hospital.

3. **Frame Iruvy as "supports compliance & generates accessibility evidence," never "legally required."**
   The physical-facility statutes mandate fixtures, not apps; overclaiming a legal mandate is the fastest
   way to lose evaluator trust. Position around **measured outcomes + ESG/social-value evidence + policy
   alignment**.

4. **Make the 실증/PoC story the centerpiece.** ~10 pilot sites and structured before/after metrics are
   Iruvy's strongest procurement asset — this is exactly what Korean **혁신조달/시범구매** evaluators want
   to see, and it de-risks adoption for public officials.

5. **Publish performance claims with denominators and caveats.** Always show **n, population, task, and
   site**; label data as **internal pilot / self-reported**; note that results may not generalize without a
   fresh pilot. Volunteered caveats *increase* credibility with skeptical buyers.

6. **Surface a "run the pilot yourself" offer.** A structured pilot with pre-agreed success metrics
   converts "trust our numbers" into measurable proof and maps directly onto the 조달청 시범구매
   completion-report mechanism.

7. **Show trust/credibility signals prominently:** public-credibility selections (KIST 강소특구 육성기업,
   예비창업패키지, 보건복지부 장관상), any certifications (KWACC web-accessibility mark; **KC** for edge
   hardware), and named pilot institutions — the exact evidence bundle a public evaluator assembles.

8. **Address data privacy up front for public/medical buyers.** State **PIPA (개인정보보호법)** alignment,
   **on-device / data-minimization / anonymization** posture, and location-data handling — a recurring
   gate for hospital and public-institution procurement. (Verify per-deal which security-review and
   location-data-law obligations actually apply.)

9. **Keep technical claims inside the honesty guardrails.** "Detect dynamic obstacles / hazardous edges
   and reroute or stop," not "avoids all obstacles"; avoid unverified precision claims (cm-level, specific
   TAM). Reviewers punish overclaiming harder than modest, well-evidenced numbers.

10. **Distinguish certainty levels on the site itself.** Present regulatory tailwinds and pilot results as
    what they are — established law vs. early self-reported evidence. This intellectual honesty is itself a
    differentiating trust signal to sophisticated institutional buyers.

### Fact-certainty summary

- **Well-established:** WCAG 2.2 AA criteria and thresholds; existence and general duties of 편의증진법,
  장차법, 지능정보화기본법, 교통약자법, KWCAG 2.2 (4 principles/14 guidelines/33 checks); EAA in force
  2025-06-28; BFSG in force 2025-06-28; ADA Title II DOJ rule (WCAG 2.1 AA, deadline 2026-04-24); Section
  508 procurement requirement; Korea's 혁신제품/시범구매 structure and its purchase-liability exemption.
- **Approximate / secondary (confirm before legal/contractual use):** exact 장차법 penalty figures; exact
  current article numbers in 지능정보화기본법; precise WCAG version bound by BFSG (2.1 vs 2.2); EAA/national
  penalty amounts.
- **Uncertain / stated as general principle only:** the precise applicability of specific PIPA / location-
  information-law / security-review obligations to Iruvy's data flows (depends on deployment and buyer);
  whether any given facility statute would ever classify a navigation app as a mandated "편의시설" (current
  reading: no — it supports, but is not mandated as, a convenience facility).
