# SMSWebsite.md — Spend Matters website project memory
> Paste this file into a new chat to give Claude full context of the project.
> Last updated: 11 Aug 2026 (v5.1).

## Company
- **Spend Matters Solutions** (also "SM Solutions") — India-based.
- Positioning (v5): **Textile & Apparel Sourcing, Quality, Compliance & AI Technology Partner.** NOT a trader, NOT a buying agent — a technology-enabled sourcing and operations partner "built around the way YOUR company actually works."
- Founder background: 20 years apparel sourcing, fiber to finished garment, supply chain + analytics + AI implementation.
- Primary qualified sourcing regions (v5): **India (head office), Bangladesh, China.** Region is selected per product, price, quality, compliance and delivery — no fixed country count is claimed, and other regions can be qualified when the product points there.
- Four pillars (v5): Global Sourcing · Quality & Inspection · Digital Compliance & Traceability · Custom AI & SaaS — plus Shipment Intelligence connected across all four.
- AI is positioned as **modular department-specific capabilities** (Sourcing / Merchandising / Quality / Compliance / Testing / Logistics AI), scoped per customer workflow. The former fixed-count "AI agents" framing is retired — do not reintroduce a numbered agent list.
- Categories: Kidswear, Womenswear, Menswear, Sportswear, Denim, Home textile, Accessories, Hardgoods.
- Certifications referenced: Sedex, BSCI, GOTS, GRS, WRAP, OEKO-TEX.
- Contact: INFO@SMSOLUTIONS.NET.IN · Domain: www.smsolutions.net.in

## Current live design (v3 — approved direction)
Based on the user's "NovaAI" reference (dark cinematic scroll site) but adapted to a
**light misty look** matching the reference's yarn-sphere frame:
- **Background:** soft blue-grey mist (#c3cad4 range gradients), film grain, bokeh dust, vignette.
- **Typography:** Inter (300–700) + Geist Mono for labels. **Deep slate ink #1F2634 text**
  (changed from white — white failed contrast on the light mist). Faint light halo
  text-shadow instead of dark drop shadows.
- **Primary buttons:** solid ink #1F2634 with white text. Secondary: frosted white glass.
- **Glass system:** frosted white (rgba(255,255,255,.34)), white borders, left-accent badges.
- **Accent:** amber #E58A2E only in the WebGL core + logo dot; `#A85A12` (amber-deep) for
  text-level amber (contrast-safe).
- **WebGL scene (script.js, Three.js r128 via cdnjs, fully procedural — no video):**
  - Hero: pale hanging cables (bundled strands) with glowing amber tips.
  - On scroll the cables **wind into a sphere of radial yarn folds** with a molten
    amber core (matches user's reference image 2). Sphere then drifts/turns.
  - Scroll scrub: `smoothed += (target - smoothed) * 0.12` per rAF; mouse parallax.
  - Tuning constants at top of script.js: `STRANDS`, `PTS`, `CABLES`, `R` (sphere radius),
    `FOLDS` (wrinkle frequency), `MORPH_SPAN` (scroll fraction for the morph, 0.42).
  - Strand colors: cLight #f7f4ee · cDark #7d8595 · cAmber #E58A2E · cHot #ffc87f.
- **Reveals:** IntersectionObserver threshold 0.15, translateY(32px)→0, 700ms ease-out,
  per-element `data-delay` in ms. `prefers-reduced-motion` respected.

## Page structure (index.html)
1. Fixed scene (mist + canvas#gl + grain + vignette)
2. Fixed nav: logo · Network⁴ / Capability / AI Agents / Contact · "Get Free Consultation"
3. Hero: service list (/ AI Automation, / Global Apparel Sourcing, / Supply-Chain
   Intelligence) · right intro · badge "Your sourcing office across Asia" ·
   H1 **"Sourced. Woven. Automated."** · glass card "Talk with our sourcing desk"
4. 80vh spacer (scroll room for the morph)
5. Section 2 "Capability": badge "Insight on demand" · H2 **"See every thread, brilliantly."**
   · CTAs · frosted 3-row panel (01 Live order book / 02 Scored factory match /
   03 Risk before it slips)
6. 45vh spacer
7. Section 3 (v5): Global Sourcing 5-step accordion + "Qualified Sourcing. Wherever the
   Product Makes Sense." with 3 region cards (India/Bangladesh/China); agent chips removed
8. Contact: "Tell us what you need made." + mailto pill
9. Footer bar: © 2026 · "Not your buying agent — your strategic supply-chain partner"

## Logo (SVG, in nav + hero card + favicon.svg)
Single continuous line: **thread spool whose winding forms an "S"**, thread pulls off
the spool to a small **amber dot** (the AI node). Wordmark: lowercase `spendmatters`
(spend bold-ish 600, matters light 300) + mono sub-label "SOURCING INTELLIGENCE".
Nav/card versions use `currentColor` (ink); favicon.svg strokes #1c2334.

## Repo / deployment
- GitHub: **gd-commits/smsolutions-website**, branch `main`, GitHub Pages from root.
- `CNAME` file in repo = www.smsolutions.net.in — must never be deleted.
- Files: index.html, style.css, script.js, favicon.svg, README.md (+ CNAME already in repo).
- Deploy = "Add file → Upload files" at repo ROOT (files, not a folder), commit to main.
- After deploy: hard refresh (Ctrl+Shift+R) or incognito; CDN can take 5–10 min;
  `?v=2` cache-buster works; direct origin URL: gd-commits.github.io/smsolutions-website/.
- New-version check: index.html `<title>` = "Spend Matters — AI Woven Into Apparel
  Sourcing" (old site's title was "Spend Matters Solutions | AI For Textile Industry").

## Design history (why things are the way they are)
- v1: light editorial site with WebGL particle globe (Instrument Serif). Rejected —
  blue globe hid the hero text.
- v2: dark cinematic NovaAI-style with hanging gold-tip cables → woven-fabric morph.
  Rejected — user wanted the reference's *sphere* frame and light mist look.
- v3 (current): light mist + cables→yarn-sphere morph, split files for Git.
  Then text switched white → ink #1F2634 for visibility.
- Did NOT use the NovaAI CloudFront video or "Mitha" portrait (another company's assets);
  scene is procedural instead. Founder photo can replace the logo tile in the hero card later.

## Open items / cautions
- Country card claims (lead times, MOQs, factory descriptions) were written by Claude as
  plausible placeholders — **replace with real figures before heavy marketing.**
- Founder photo for the hero contact card.
- **Trademark caution:** "Spend Matters" is a large established US procurement-media brand
  (spendmatters.com, The Hackett Group). User advised to check trademark exposure or
  lean on "SM Solutions".
- Possible next builds: analytics dashboard section, Industries page, case studies,
  contact form (currently mailto only).

## v4 update (latest)
- **Theme:** warm champagne / undyed-cotton cream (#F3EDE2 base), warm charcoal ink #262019,
  amber #E58A2E accent (amber-deep #9C5510 for text). Chose cream over bright orange:
  textile-native, readable, lets the ember core be the only fire.
- **Scene fix:** v3 core blew out to a white nova. v4: CORE_SIZE 9 / CORE_ALPHA 0.10
  (were 26–86 / 0.28), tighter warm zone (aPole /0.75), 35% of strands are deep-shade
  crevice strands, rope lines more opaque, late-scroll scale growth 0.30→0.10. Result:
  small ember + sculpted rope folds (matches reference).
- **Logo:** signature wordmark "Spend Matters" in **Great Vibes** + amber dot + mono
  sub-label. Spool glyph kept for favicon, hero card tile and chat launcher.
- **New sections:** About/Who-we-are (plain-language intro + founder bio card: 20 yrs,
  fiber-to-garment, analytics/AI, team on the ground — name/photo still placeholder) ·
  "How to work with us" 3 steps (brief → shortlist+costs → we run the order).
- **Hero rewritten for clarity:** H1 "We find your factories. We run your production.
  AI keeps it on track." + plain subhead; amber primary CTA.
- **Fabric chat guide:** floating launcher (yarn-ball icon, bobbing) opens a scripted
  chat — Who/What/Countries/Pricing/How-to-start with typing animation and quick-reply
  chips, ends in mailto. Front-end only, no backend, no data collected. Edit TOPICS in
  script.js. Do not present it as a live AI.
- **Hover physics:** magnetic buttons, nav underline sweep, card lifts, chip pops.
- Fonts now: Inter + Geist Mono + Great Vibes.

## v5 update (11 Aug 2026 — positioning upgrade)
- **Repositioned** as Textile & Apparel Sourcing, Quality, Compliance & AI Technology Partner.
  Core differentiator on the page: "We don't ask every textile company to adopt one giant
  supply-chain platform. We build the tools and workflows around the way YOUR company works."
- **Former fourth sourcing country removed everywhere** (hero, metadata, network, chat, docs).
  Regions: IND/BGD/CHN as *primary qualified regions*, explicitly not a closed list.
- **New sections:** Global Sourcing 5-step accordion (#sourcing) · Independent Inspection with
  AQL 1.5/2.0/4.0 panels (#inspection) · AI & SaaS with deployment flow, Option A/B tabs and
  6 department accordions (#ai) · Textile Digital Operations sources→layer→outputs diagram +
  Testing & Report Intelligence (#operations) · Compliance & Traceability incl. licensed
  programmes (#compliance) · Shipment Intelligence with 8-stop rail (#shipment) · Connected
  Journey — 10 stages, each showing Human expertise + AI intelligence (#journey).
- **Rewritten:** hero, About, capability pillars (now the 4 pillars + shipment), How to work
  with us (5 steps), contact CTA ("Tell us what is slowing your team down"), footer, nav
  (About/Sourcing/Inspection/AI & SaaS/Compliance/Shipment/How It Works/Contact — Compliance,
  Shipment and How It Works hide below 1180px so the bar never crowds; mobile unchanged).
- **Chat guide rewritten** for new positioning (8 topics incl. inspection, AI, deployment).
- **WebGL preserved**; MORPH_SPAN now viewport-relative (1.45 viewport heights) so the
  cable→sphere morph still completes in the hero on the much longer page. New `uLate` uniform:
  late in the scroll a few strand points warm to amber "data nodes" and rope lines ease back —
  thread → network → data metaphor. CSS additions are an appended v5 block; only the dead
  `.agents-strip` rules were removed. All interactions are dependency-free vanilla JS placed
  *above* the WebGL block (which returns early without WebGL support).
- **Careful claims:** no security certifications implied; vessel tracking credited to
  third-party services; licensing wording states Spend Matters does not grant licences;
  integrations conditional on "where integrations or approved access are available";
  no banned hype vocabulary ("revolutionary", "seamless", "end-to-end", etc.).
- **Cautions carried forward:** region-card capability claims are plausible placeholders —
  confirm before heavy marketing; founder photo still placeholder; "Spend Matters" trademark
  caution unchanged.

## v5.1 update (11 Aug 2026 — photoreal yarn + chat rename)
- **Chat guide renamed** "Fabric" → **"SMS Team"** (launcher, panel header, aria labels,
  greeting, mailto subject). Internal element ids (fabLaunch/fabPanel/…) unchanged on purpose.
- **Yarn material upgrade in script.js — geometry, camera, morph, scroll and mouse code
  untouched.** What controls what: geometry = the STRANDS loop filling hang[]/sph[];
  material = pMat (yarn points), lMat (fold lines), cMat (ember), dMat (dust); lighting is
  entirely in-shader (no Three lights). Changes:
  · New per-point tangent attributes (aTanH/aTanS) morphed like positions → each sprite is
    a fiber-aligned lit cylinder segment.
  · Spun-yarn fragment shading: cylindrical diffuse wrap, two-octave helical twist
    striations + grain hash (single octave on mobile), matte sheen, ivory palette
    (cLight #fbf7ee, cDark #96866d), softened pulse.
  · Along-strand diameter drift so no strand is a perfect cylinder; tighter matte edge.
  · Distance-based detail (vDet): abstract far, recognizable yarn mid, twist detail near.
  · Desktop-only stray-fiber fuzz layer: every 2nd strand / every 4th point, tiny radial
    offsets, thin hair flecks that appear only at close range; one extra draw call; skipped
    when `small` (mobile) — mobile also compiles the reduced shader branch.
  · Amber tips, ember core and uLate data nodes keep the original soft radial glow (they
    are light features, not yarn) with slightly reduced size/alpha so the ivory yarn leads.
- Verified: shaders compile on desktop + mobile branches, zero console errors, all
  interactions re-tested green, no horizontal overflow at 1440/834/390.
