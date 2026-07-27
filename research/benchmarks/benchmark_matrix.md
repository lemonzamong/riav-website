# Benchmark Matrix

Web-strategy benchmark for **Iruvy** — a Korean accessibility-focused indoor-navigation startup selling B2B/B2G to hospitals, public/welfare facilities, universities, and transit. Iruvy helps visually-impaired / mobility-disadvantaged people and first-time visitors reach real indoor destinations via a smartphone app (voice/vibration/screen guidance), plus an operator scan-to-map admin app and low-cost edge devices for large spaces.

This document benchmarks **10 real websites** (all fetched and verified July 2026) across four categories, extracts patterns, and gives concrete recommendations for Iruvy's site.

## Scope, method, and honest limitations

- **Sites:** 10 real companies, chosen because each maps to at least one of Iruvy's strategic problems (indoor positioning, accessibility, institutional/public-sector selling, or evidence-led trust design). No site here is fabricated; each was retrieved and read.
- **Method:** Live homepage (and in a few cases a sector page) fetched and parsed for positioning, hero copy, information architecture, proof/evidence, trust signals, CTAs, downloadable materials, accessibility, and design language.
- **Limitations to be honest about:**
  - Findings are drawn primarily from **homepages**, not full-site crawls. Case-study depth, pricing, and docs were inferred from nav labels and homepage modules, so counts like "5,000+ venues" are the vendors' own marketing claims, not independently verified facts.
  - **Accessibility "practice what they preach" could not be independently audited.** I did not run WCAG/screen-reader tests. Where a company is accessibility-first (GoodMaps, Waymap, Evelity, Lazarillo) I note their *stated* posture; treat any "good/unknown" accessibility rating below as a design-signal read, not a conformance audit.
  - One hero headline (Navigine) came back with Korean-localized, space-stripped text from the fetch; I flag it as approximate.
  - Metrics move. Customer counts and square-footage claims are as-of the July 2026 fetch.

---

## Comparison table

| # | Company / URL | Category | One-line positioning | Hero-message approach | Main nav (IA) | Proof / evidence | Trust signals | Primary CTA | Eval downloads? | Accessibility quality (stated) | Design language |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Pointr** · pointr.tech | Indoor nav vendor (enterprise) | Enterprise AI indoor mapping & wayfinding platform | Benefit + scale: "AI Mapping & Wayfinding — Deliver a great visitor experience, maximize return on your buildings" | Products · Sectors · Partners · Resources · Company | Fortune-100 logos (Siemens, Microsoft, Nike, KPMG); "7B sq ft / 5,000+ venues / 35+ countries"; 3 named case studies (Home Depot, UCHealth, Siemens) | Patents, enterprise SDK, integrations (Epic MyChart, IMDF) | "See a Demo" / "Speak to an Expert" | Yes — guides incl. an **RFP-creation guide**, dev docs | Not stated on homepage (weak for an accessibility buyer) | Minimalist tech, blue, card-based, metric-forward |
| 2 | **Navigine** · navigine.com | Indoor nav vendor (positioning engine) | Precise indoor positioning engine for many industries | Capability-led: "Powerful and precise indoor positioning engine for various industries" *(hero text approximate — localized fetch)* | Platform · Industries · Developers · Company · Blog | 7 use cases; ~9 client/partner logos (Microsoft, HP, Quuppa); "10 years / 3,000+ buildings"; 3 named-expert testimonials | Named industry experts w/ photos; long tenure; partnerships | Multi-intent contact form (demo / pricing / partnership) | SDK docs under Developers; no eval PDFs surfaced | Not mentioned | Clean, blue accent, card case studies |
| 3 | **Mappedin** · mappedin.com | Indoor nav vendor (mapping SaaS) | Indoor mapping software for enterprise venues | Product-poetic: "Your new way to map" | Platform · Solutions · Use Cases · Developers · Resources · Pricing | Logos (LAX, Schiphol, Simon Property); LAX parking-revenue case study; VP testimonial | **SOC 2, GDPR, WCAG commitment**; GitHub; dev portal | "Start here" (free tier) / "Book a demo" | Yes — lead-magnet guides, dev docs, **public pricing** | WCAG commitment + accessible-route/emergency-zone mapping (stated) | Vector illustration, blue, enterprise hierarchy |
| 4 | **Cartogram** · cartogram.com | Hospital wayfinding vendor | Hospital indoor/outdoor wayfinding, Epic MyChart-native | Segment-precise: "Wayfinding Solutions for Hospitals" | Platform · Solutions · Implementation · Blog · About · Contact | 20+ health-system logos (St. Jude, Loyola, Akron Children's); "250MM+ sq ft / 500k patient experiences / 100+ systems / 5.0 rating"; St. Jude CIO quote | Epic partnership & showroom listing; all-50-states; HCAHPS-improvement claim | "Get Started" → demo | Not surfaced | Multi-modal access (app, SMS, voice hotline, QR, kiosk) — de-facto inclusive | Clean, patient-centered, healthcare iconography |
| 5 | **GoodMaps** · goodmaps.com | Accessibility indoor nav | Infrastructure-free (LiDAR/camera) inclusive indoor navigation | Vision-led: "Mapping the Future with Indoor Navigation" | For Every Venue · Web Maps · Mobile App · Scan & Go · Contact | Named transit partners (Network Rail, Sound Transit, Port of Portland, Eugene Airport); blind-user + Walmart-ops testimonials; peer-reviewed research heritage (APH origin) | Accessibility statement page; advocacy section; school curriculum; knowledge base | "Contact Us" + "Download the App" (dual store links) | Knowledge base referenced; no eval PDF on homepage | **Accessibility-first by design & origin** (born from American Printing House for the Blind) | Minimalist, human-centered imagery, blue |
| 6 | **Waymap** · waymapnav.com | Accessibility indoor nav | Zero-infrastructure (IMU/PDR) smartphone navigation | Simplicity claim: "AI-Enabled Navigation. One app. Every step of the journey." | Use Cases · Products · Our Tech · About Us · Book a Call | 16 logos (NHS, LA Metro, WMATA, Nat'l Library Board Singapore, Lord's); "140+ venues / 1B+ sq ft"; NHS + MCC testimonials | Compliance name-drops (Equality Act, ADA, EN 17210); "4–6 week deploy" | "Book a Call" (x3) + app stores | Quick-start guide & FAQ in footer | Accessibility-first positioning; standards alignment stated | Minimalist corporate, monochrome + accent |
| 7 | **Evelity** (Okeenea) · evelity.com | Accessibility indoor nav | Inclusive wayfinding app for all disabilities | Inclusion-led: "Evelity: inclusive orientation and wayfinding app!" | Solution · For Whom · Resources · App | 40+ clients, 800+ testers, 5 countries (Boston Children's, Univ. Cologne); pain metrics ($220k/yr lost; 74% of desk queries; 77% UX gain); major FR media | Parent **Okeenea** (accessibility since 1993); GDPR/Privacy-by-Design; partner Pointr | "Discuss about Evelity" (meeting) / "I'm interested!" | Yes — **pitch deck for internal distribution** | 5-star accessibility rating, 10 languages, offline mode, adapted routes (stated) | Modern clean SaaS, Okeenea orange/black |
| 8 | **Lazarillo** · lazarillo.app | Accessibility indoor nav (closest analog) | Inclusive nav & digital maps for individuals + businesses | Dual-audience: "Inclusive navigation and digital maps developed for individuals and businesses" | Map Your Business · The App · Business Demos · Support · Contact | Public + private clients (Detroit DOT, Qatar Rail, Georgia Tech, Metro Santiago, Microsoft); "250,000+ users"; NFL Draft field-guide case | Mayoral endorsement (Tampa); press (Tampa Bay Times, Detroit Free Press); award badges | App download + "Map Your Business" + qualifying contact form | Not surfaced | Real-time audio alerts, turn-by-turn, accessible directory (stated) | Minimalist, inclusive imagery, white/blue |
| 9 | **Vanta** · vanta.com | Evidence-led B2B SaaS (trust benchmark) | Automated trust / security-compliance platform | Thesis headline: "Trust is everything" | Products · Solutions · Frameworks · Resources | "16,000+ customers"; outcome tiles (2,000 hrs saved, 20% faster deals, 93% automated); one-line customer-impact quotes (GitHub, Snowflake) | SOC 2 II, ISO 27001/42001; **Forrester Wave Leader**; Trust Center | "Get a demo" (persistent) | Yes — checklists, templates, Forrester report, "State of Trust" report | Not a focus (SaaS UI) | Minimal, dashboard mockups, monochrome logos |
| 10 | **OpenGov** · opengov.com | B2G government software | Purpose-built software for government / public servants | Mission headline: "Public service affects everyone…That's why we build software to power more effective and accountable government" | Platform · Products · Departments · Resources · Customers · Company | "2,000 governments / 4,500+ implementations"; 3 named-city case studies; testimonials w/ title + agency | Trust portal, security page, DPA/SLA, accessibility statement; "former public servants" on staff | "Request a Demo" (tiered gov/vendor/public logins) | Yes — eBooks, on-demand + live webinars | Accessibility statement present | Clean muted palette, mega-menus, gov photography |

---

## Per-site strengths & weaknesses (1–2 each)

1. **Pointr** — *Strength:* scale + Fortune-100 logos instantly signal enterprise safety; the buyer-facing **RFP-creation guide** is a smart procurement accelerant. *Weakness:* zero visible accessibility posture — a liability if selling to disability/public buyers; feels like "buildings ROI," not "people."
2. **Navigine** — *Strength:* named-expert testimonials with faces and long-tenure credibility. *Weakness:* engine/developer framing is abstract; thin outcome metrics; no accessibility angle.
3. **Mappedin** — *Strength:* rare combo of **SOC 2 + GDPR + WCAG + public pricing + free tier** — the most self-serve-credible of the mapping vendors. *Weakness:* "Your new way to map" is pretty but says nothing about who benefits; accessibility is a checkbox, not a story.
4. **Cartogram** — *Strength:* laser vertical focus (hospitals) + **Epic-native integration** is a decisive institutional trust wedge; dense, credible metrics. *Weakness:* single-vertical brand doesn't travel; accessibility is implicit (multi-modal access) rather than owned.
5. **GoodMaps** — *Strength:* deepest authentic accessibility credibility (born from American Printing House for the Blind; user testing across disability groups; dedicated accessibility + advocacy pages). *Weakness:* vision-y hero ("Mapping the Future") is soft on concrete outcome numbers; evaluator downloads not front-and-center.
6. **Waymap** — *Strength:* crisp differentiator ("zero infrastructure," IMU-only) + marquee transit logos (WMATA/LA Metro/NHS) + explicit standards (ADA, EN 17210) + fast-deploy claim. *Weakness:* proof leans on logos and two quotes; light on published quantified pilot results.
7. **Evelity** — *Strength:* strongest at **quantified pain metrics** ($220k/yr, 74%, 77%) and a **ready-to-share pitch deck** for internal champions; 1993 parent heritage. *Weakness:* homepage tone is marketing-forward; specific per-site outcome data is thinner than the pain framing.
8. **Lazarillo** — *Strength:* the closest analog to Iruvy (blind-first, B2B/B2G, self-service "Map Your Business"); public-sector logos + mayoral endorsement + press. *Weakness:* mixes consumer-app and enterprise messaging on one page, diluting the institutional pitch; evaluator materials not surfaced.
9. **Vanta** — *Strength:* textbook evidence-led design — thesis hero, outcome tiles beside CTAs, named logos, third-party analyst validation, rich downloadable library. *Weakness:* not an accessibility model; density can overwhelm; pattern is calibrated to high-velocity SaaS, not slow institutional cycles.
10. **OpenGov** — *Strength:* best B2G template — mission-first hero, "2,000 governments," department-segmented IA, tiered logins, trust portal, "former public servants." *Weakness:* metrics skew to counts over outcomes; some testimonials are generic.

---

## Synthesis

### 1. Common information-architecture patterns for this category

Across indoor-nav, accessibility, and institutional vendors, the IA converges on a repeatable skeleton:

- **Solution / Platform** — what the product is.
- **Sectors / Use Cases / "For Whom" / Departments** — the single most consistent pattern: buyers navigate by *their* environment (hospital, transit, university, museum, retail, public building), not by feature. 8 of 10 sites lead with vertical/audience segmentation.
- **Proof layer** — Case Studies / Customers / References, usually its own nav item.
- **Developers / Docs** — present on every technical vendor (Pointr, Navigine, Mappedin, GoodMaps); signals real integrability.
- **Resources** — blog + guides + webinars as the content/SEO and lead-magnet engine.
- **Company / About + Contact** — with the conversion CTA persistent in the header.

Accessibility-first players add two distinctive nav items: an **Accessibility statement page** and an **Advocacy / mission** section (GoodMaps most fully; OpenGov and Evelity partially).

### 2. How the best sites present evidence to institutional buyers

- **A quantified metric band near the top.** Cartogram ("250MM+ sq ft / 500k patient experiences / 100+ systems"), Waymap ("140+ venues / 1B+ sq ft"), Pointr ("7B sq ft / 5,000+ venues"), OpenGov ("2,000 governments / 4,500+ implementations"). Scale numbers do the first-pass credibility work.
- **Named logos over anonymous ones.** The strongest sites name the buyer's peers — St. Jude and Loyola (Cartogram), WMATA and NHS (Waymap), Network Rail and Sound Transit (GoodMaps), Metro Santiago and Qatar Rail (Lazarillo). A public-sector buyer wants to see *another public agency* already trusted the vendor.
- **Attributed, role-stamped testimonials.** The best quotes carry name + title + institution (St. Jude CIO; NHS Dr. Olivia Swann; OpenGov "Finance Director, Town of Brattleboro, VT"). Anonymous praise is discounted.
- **Challenge → Solution → Impact case studies**, and evidence placed *beside conversion points*, not buried in a resources tab (Vanta's discipline; validated as a B2B best practice by the marketing-research sources).
- **Procurement enablers.** Pointr's **RFP-creation guide** and Evelity's **shareable pitch deck** arm the internal champion to sell upward — the single most transferable evidence tactic for slow institutional cycles.
- **Third-party validation.** Vanta cites a Forrester Wave leadership position; accessibility players cite peer-reviewed research (GoodMaps) and named media (Evelity, Lazarillo). Independent endorsement outranks self-claims.

### 3. Trust-building patterns that matter for public-sector / accessibility buyers

- **Compliance and standards, named explicitly.** Waymap names ADA / Equality Act / EN 17210; Mappedin shows SOC 2 + GDPR + WCAG; OpenGov runs a trust portal with DPA/SLA/security/accessibility pages. For Korean context the analog is 편의증진법 / KWCAG / 개인정보보호법 — name them.
- **A dedicated, real Accessibility Statement** — and actually conforming. For an accessibility company this is table stakes; a site that preaches accessibility but fails a screen reader is an immediate disqualifier (GoodMaps sets the bar).
- **Origin / mission credibility.** GoodMaps (American Printing House for the Blind), Okeenea (accessibility since 1993), OpenGov ("former public servants") all convert *founding legitimacy* into trust. Iruvy has strong equivalents: robotics-lab research heritage, disability-org network, ministry award, KIST/강소특구 selection.
- **Evidence from the actual user group.** Testimonials and testing that visibly involve blind / mobility-disadvantaged users (GoodMaps' multi-disability-group testing) matter more than generic enterprise praise for this buyer.
- **"Someone like us already bought it."** Named peer institutions + government references + press de-risk the internal-approval conversation.

### 4. What weak sites do wrong

- **Poetic hero, zero substance** — "Your new way to map" / "Mapping the Future" look good but make the visitor work to learn who benefits and what outcome to expect.
- **Feature/engine framing instead of outcome framing** — Navigine's "positioning engine" is developer-abstract; institutional buyers want arrival-success and reduced-inquiry outcomes, not IMU jargon.
- **Preaching accessibility without practicing it** — the fatal contradiction for this category; also true of general vendors (Pointr) that ignore accessibility entirely while selling into hospitals and transit.
- **Proof by logo wall alone** — logos without a quantified before/after or an attributed quote read as decorative.
- **Mixing consumer-app and enterprise messaging on one page** (Lazarillo) — dilutes the institutional pitch and confuses the buyer about who the page is for.
- **Evidence buried in a Resources tab** instead of beside the CTA; and **no evaluator-ready downloadables** (RFP kit, one-pager, pilot report), forcing every serious buyer into a sales call before they can champion internally.
- **Counts without outcomes** — "2,000 customers" is necessary but not sufficient; the best pages pair scale with a per-deployment result.

### 5. Recommendations for Iruvy's site

Ordered, evidence-based, each tagged **Adopt** / **Adapt** / **Avoid**, with the source pattern it draws on.

1. **Lead with an outcome-and-audience hero, not a slogan.** *(Adopt — Waymap/Cartogram; Avoid Mappedin/GoodMaps softness.)* State who + what outcome in the first screen, e.g. "시각장애인·이동약자가 스마트폰만으로 실내 목적지까지 — 병원·공공기관·교통시설을 위한 온디바이스 AI 실내 내비게이션." Pair with a metric band using Iruvy's real PoC data (도착 성공률 26.6% → 96.7%, 이동시간 약 60% 단축, 실증 10곳). This is Iruvy's single biggest asset and no benchmark has numbers this strong on their homepage.

2. **Segment the IA by buyer environment.** *(Adopt — 8/10 sites.)* Top-level "도입 분야 / For Whom": 병원 · 공공·복지시설 · 대학 · 교통시설. Each landing page reframes the same product to that buyer's purchase logic (hospitals: repeated-inquiry reduction + ESG; public/welfare: 이동권·접근성 성과; transit: 교통약자 안내). This mirrors Iruvy's own program-adaptation rules.

3. **Own accessibility for real — statement page + actual conformance.** *(Adopt — GoodMaps/Waymap; the category's disqualifier if faked.)* Publish a KWCAG/편의증진법-aligned Accessibility Statement, and make the site itself pass a screen reader (semantic headings, alt text, keyboard nav, contrast — consistent with Iruvy's own design tokens' high-contrast intent). For an accessibility company this is credibility, not compliance overhead.

4. **Build a procurement-enablement kit as downloadable evidence.** *(Adopt — Pointr's RFP guide + Evelity's shareable deck.)* Offer an institution one-pager, a 5–7p PoC proposal, and a pilot/accessibility report (Iruvy already plans these as sales materials). Place them beside the CTA so a 담당자 can forward them upward — decisive for slow B2G approval cycles.

5. **Show attributed proof from the actual user group and named institutions.** *(Adopt — GoodMaps/Cartogram/Waymap.)* Use quotes with name + role + institution, and name the 실증 partners you can actually disclose (한국시각장애인연합회, 서울AI재단, 대학, 지하철 노선 등) — verify disclosure permission per Iruvy's evidence-discipline rules before publishing. Include testing that visibly involves visually-impaired users.

6. **Name Korean standards and data trust explicitly.** *(Adapt — Waymap ADA/EN 17210 → 편의증진법/KWCAG; Vanta/Mappedin/OpenGov trust posture → 개인정보보호법.)* A short trust strip: standards alignment + on-device/anonymized data handling (Iruvy's "동의 기반 익명화, 스마트폰 내 처리 우선" is a real differentiator public buyers care about). This is a genuine strength — surface it.

7. **Frame the operator scan-to-map + edge-device model as a two-track adoption path, not just features.** *(Adapt — Lazarillo "Map Your Business" self-service + Cartogram implementation clarity.)* Show "무료 셀프 등록 → 대형 공간 유료 정밀 보정" as a low-risk on-ramp with a clear deployment timeline (Waymap's "4–6주" is effective). Keep an operator/admin and (later) developer/docs entry to signal integrability.

8. **Keep the design premium and human-centered, per Iruvy's own system — and deliberately avoid two failure modes.** *(Adapt — Apple-calm + Linear/Stripe density; Avoid.)* Use Iruvy Violet as the single accent, KPI big-numbers, card-based case studies. **Avoid** the "charity/welfare brochure" tone (hearts, pastel rainbows) *and* the cold "buildings-ROI" tone of pure enterprise vendors — Iruvy is human-centered + technical precision + infrastructure, matching its brand identity.

#### Patterns explicitly flagged as inappropriate to copy

- **Do NOT copy scale-metric bravado you can't back** — "7B sq ft / 16,000 customers" works for Pointr/Vanta because it's true. Iruvy is 2026-founded with 10 pilots; inflating scale invites VC/institution due-diligence failure. Lead with **depth** (dramatic PoC outcomes, real institutions) over **breadth**. This is consistent with Iruvy's overclaim guardrails.
- **Do NOT copy the "buildings ROI / maximize return on your buildings" framing (Pointr)** — it's the wrong value proposition for accessibility/public buyers whose mandate is 이동권 and service access, not asset yield.
- **Do NOT copy Lazarillo's consumer+enterprise blend on one page** — keep the institutional site focused; put any end-user app content on a clearly separate track.
- **Do NOT adopt Vanta's high-density, high-velocity SaaS conversion pattern wholesale** — it assumes fast self-serve deals; B2G/accessibility cycles are slow, relationship- and evidence-led, so weight the site toward champion-enablement and trust over instant "get a demo" velocity.
- **Do NOT claim compliance/standards you haven't verified** — name 편의증진법/KWCAG/개인정보보호법 only where Iruvy actually conforms; a false compliance badge is worse than none for a public buyer.

---

## Sources

Indoor navigation / wayfinding vendors:
- Pointr — https://www.pointr.tech/ (and https://www.pointr.tech/sectors/healthcare)
- Navigine — https://navigine.com/
- Mappedin — https://www.mappedin.com/
- Cartogram — https://www.cartogram.com/

Assistive / accessibility navigation companies:
- GoodMaps — https://goodmaps.com/
- Waymap — https://www.waymapnav.com/
- Evelity (Okeenea) — https://www.evelity.com/en/
- Lazarillo — https://lazarillo.app/

Evidence-led B2B SaaS trust benchmark:
- Vanta — https://www.vanta.com/

B2G / public-sector software vendor:
- OpenGov — https://opengov.com/

Supporting research on B2B/evidence-led web patterns (used only for synthesis §2/§4, not as a benchmarked site):
- Proofmap, "B2B SaaS Case Study Examples" — https://proofmap.com/insights/b2b-case-studies-examples-from-the-top-58-growing-saas-companies-in-2025
- Media House, "Building Trust in B2B SaaS" — https://www.mediahouse.ltd/b2b-saas-trust-evidence-strategy-2026
- Webstacks, "Best B2B SaaS Websites: Anatomy and Examples" — https://www.webstacks.com/blog/b2b-websites

*All primary sites fetched and verified July 2026. Vendor metrics are self-reported marketing claims; accessibility ratings reflect stated posture, not an independent WCAG audit.*
