# Night Signal Conformance — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the portfolio fully into line with `MASTER.md` — complete the homepage composition, add the missing graphic details, wire up the interactive orbital instrument, correct off-palette values, and delete dead code.

**Architecture:** Pure React 18 + Vite with per-page/per-component plain CSS files (no CSS framework, no router, no test runner). Changes are localized to `Home.*`, `ProjectVisual.*`, the two canvas components, `index.css`, `index.html`, plus file deletions. All new markup follows the existing `home-*` / `pv-*` class conventions.

**Tech Stack:** React 18, Vite 8, oxlint, plain CSS, lucide-react icons.

**Spec:** `docs/superpowers/specs/2026-10-15-night-signal-conformance-design.md`

## Global Constraints

- Working directory for all commands: `portfolio/` (the git repo).
- Palette tokens (exact): midnight `#0C0E13`, warm light `#EEECE5`, signal blue `#7886FF`, signal orange `#F17A5A`, field citron `#D1ED79`, new deep blue `#232B63`.
- Off-palette orange `rgba(255,107,53,·)`, `rgba(255,137,93,·)`, `rgba(255,164,93,·)` is forbidden anywhere in `src/`.
- Typefaces: Anton (display), IBM Plex Serif italic (accent), DM Sans (body), Space Mono (metadata only).
- Square edges, hairline dividers, generous space. No repeated rounded cards, no glow orbs, no laptop mockups, no robot heads, no circuit boards, no fake metrics.
- Display headlines stay in sentence case.
- Every navigation/index/timeline item is a real `<a>`/`<button>`, keyboard reachable, with the global `:focus-visible` outline.
- Decorative visuals are `aria-hidden="true"`.
- New animation/canvas motion is disabled under `(prefers-reduced-motion: reduce)`; pointer tilt is also disabled under `(pointer: coarse)`.
- Verify with `npm run build` (must pass) and `npm run lint` (no new errors) after every task.

## Review Focus

- **Pointer tilt under reduced-motion / touch:** a user with `prefers-reduced-motion: reduce` or a touch device must see a static instrument, not a tilting one.
- **Keyboard reachability of new homepage rows:** project index / timeline / contact items must be focusable links with a visible ring, never clickable `<div>`s.
- **Deep-blue contrast:** warm light (`#EEECE5`) and citron (`#D1ED79`) text on `#232B63` must meet WCAG AA (≥4.5:1 body, ≥3:1 large).
- **Deleted-but-still-imported files:** removing a component that something still imports breaks the build; confirm zero remaining imports before commit.
- **Grain overlay intercepting input:** the grain layer must have `pointer-events: none` and must not cover or hide focus outlines.

---

### Task 1: Global grain + document metadata

**Files:**
- Modify: `src/index.css`
- Modify: `index.html:7`, `index.html:15`, `index.html:21`

**Interfaces:**
- Produces: a page-wide non-interactive grain layer; nothing else consumes it.

- [ ] **Step 1: Add the grain overlay to `index.css`**

Append a self-contained layer after the base rules. Use an inline SVG `feTurbulence` data URI, `position: fixed`, `inset: 0`, `pointer-events: none`, `z-index: 60`, `opacity: .05`, `mix-blend-mode: overlay`, `background-repeat: repeat`.

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 60;
  pointer-events: none;
  opacity: .05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

- [ ] **Step 2: Fix document metadata in `index.html`**

Change line 7 `theme-color` to `#0C0E13`. Change `og:image` (line 15) and `twitter:image` (line 21) to `/folio-og.svg`.

- [ ] **Step 3: Verify**

Run: `npm run build` → succeeds. Run: `npm run lint` → no new errors. Confirm the grain layer does not accept pointer events (it is `pointer-events: none`) and sits below the skip-link (`z-index: 100`).

- [ ] **Step 4: Commit**

```bash
git add src/index.css index.html
git commit -m "feat: add restrained grain layer and fix document metadata"
```

---

### Task 2: Palette + AVOID-list fixes in canvas components

**Files:**
- Modify: `src/components/NeuralWorkbench.jsx` (lines ~150-190)
- Modify: `src/components/ModelPlayground.jsx` (line 82)

**Interfaces:**
- Produces: no API change; visual values only.

- [ ] **Step 1: Replace off-palette orange in `ModelPlayground.jsx:82`**

`rgba(255,107,53,${...})` → `rgba(241,122,90,${...})`.

- [ ] **Step 2: Replace off-palette orange in `NeuralWorkbench.jsx`**

Line 152 `rgba(255, 107, 53, 0.9)` → `rgba(241, 122, 90, 0.9)`; line 153 `rgba(255, 164, 93, 0.8)` → `rgba(241, 122, 90, 0.8)`; line 166 `rgba(255, 137, 93, 0.8)` → `rgba(241, 122, 90, 0.8)`; lines 167, 184, 185 → `rgba(241, 122, 90, 0)`; line 183 `rgba(255, 137, 93, 0.3)` → `rgba(241, 122, 90, 0.3)`.

- [ ] **Step 3: Remove the glow "orbs"**

Delete the radial-gradient glow fills at `NeuralWorkbench.jsx:164-185` and replace each with a flat signal marker: a `1px` stroke ring (signal orange or citron) drawn around the active node/edge, no blur, no radial fill. Keep the existing geometry and animation timing.

- [ ] **Step 4: Verify**

Run: `npm run build` → succeeds. Run: `npm run lint` → no new errors. Grep `src/` for `255, 107, 53`, `255, 137, 93`, `255, 164, 93` and `createRadialGradient` → no matches remain in the two components.

- [ ] **Step 5: Commit**

```bash
git add src/components/NeuralWorkbench.jsx src/components/ModelPlayground.jsx
git commit -m "fix: align canvas components with palette and remove glow orbs"
```

---

### Task 3: ProjectVisual graphic details

**Files:**
- Modify: `src/components/ProjectVisual.jsx` (root `ProjectVisual` ~line 140; `VisionPreview` ~line 114)
- Modify: `src/components/ProjectVisual.css`

**Interfaces:**
- Consumes: nothing new.
- Produces: every `.pv-scene` gains four registration marks; the vision scene gains crop marks + signal tiles. The `ProjectVisual` signature (`{ tone }`, default export) is unchanged.

- [ ] **Step 1: Add registration marks to the scene root**

In `ProjectVisual`, inside the root `<div className={`pv-scene pv-scene-${tone}`}>`, add a decorative `<span className="pv-regmarks" />` before `</div>` (the whole scene is already `aria-hidden`). Style it in `ProjectVisual.css` with four thin corner marks using pseudo-elements (each corner an L of two `1px` borders), color warm light at ~30% opacity, inset ~12px.

- [ ] **Step 2: Add crop marks + signal tiles to the vision plate**

In `VisionPreview`, inside `.pv-image-pair`, add crop marks around each `.pv-image-tile` (thin corner marks, signal blue) and a row `<div className="pv-signal-tiles"><i/><i/><i/><i/></div>` of four small squares colored signal blue / citron / orange / warm light. Style both in `ProjectVisual.css`. Use square edges only.

- [ ] **Step 3: Verify**

Run: `npm run build` → succeeds. Run: `npm run lint` → no new errors. Visually confirm marks render on all four tones and the vision tiles are square with palette colors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectVisual.jsx src/components/ProjectVisual.css
git commit -m "feat: add registration marks and vision crop marks/signal tiles"
```

---

### Task 4: Interactive orbital instrument

**Files:**
- Create: `src/components/OrbitalInstrument.jsx`
- Create: `src/components/OrbitalInstrument.css`
- Modify: `src/pages/Home.jsx` (the portrait figure, line 33)
- Modify: `src/pages/Home.css` (remove lines 22-27 and the reduced-motion block at 57-59)

**Interfaces:**
- Produces: `export default function OrbitalInstrument()` — a self-contained, `aria-hidden`, pointer-tilt orbital gyroscope. Renders its own `.oi-instrument` root.

- [ ] **Step 1: Move the instrument markup and CSS into the new component**

`OrbitalInstrument.jsx` renders `<span className="oi-instrument" aria-hidden="true"><i /><i /><i /><b /></span>`. Move the perspective/ring/keyframe CSS from `Home.css:22-27` into `OrbitalInstrument.css`, renaming `.home-portrait-instrument` → `.oi-instrument` and `portrait-orbit` → `oi-orbit`. Keep ring durations 18s/24s/31s and colors blue/citron/orange.

- [ ] **Step 2: Add pointer tilt**

The root sets `pointer-events: none`. Add a `useRef` to a wrapper and, in `useEffect`, read `window.matchMedia('(prefers-reduced-motion: reduce)')` and `window.matchMedia('(pointer: coarse)')`. If either matches, do nothing. Otherwise attach `pointermove`/`pointerleave` to `window`; on move compute the pointer offset from the instrument's `getBoundingClientRect()` center, clamp to ±1, and write `--oi-tilt-x` / `--oi-tilt-y` (e.g. `Math.round(x * 8) + 'deg'`) onto the ref via `style.setProperty`, throttled with `requestAnimationFrame`. On leave reset both to `0deg`. Remove listeners on cleanup. The wrapper applies `transform: rotateX(var(--oi-tilt-y)) rotateY(var(--oi-tilt-x))`.

- [ ] **Step 3: Wire it into Home and remove the old markup**

In `Home.jsx`, import `OrbitalInstrument` and replace the `<span className="home-portrait-instrument" aria-hidden="true">…</span>` with `<OrbitalInstrument />`. Delete the now-unused instrument CSS from `Home.css` and keep the portrait frame rules.

- [ ] **Step 4: Verify**

Run: `npm run build` → succeeds. Run: `npm run lint` → no new errors. In `npm run dev`, confirm the gyroscope tilts toward the pointer on desktop; with reduced-motion emulated (DevTools → Rendering) it stays static; the element is not focusable and does not shift layout.

- [ ] **Step 5: Commit**

```bash
git add src/components/OrbitalInstrument.jsx src/components/OrbitalInstrument.css src/pages/Home.jsx src/pages/Home.css
git commit -m "feat: interactive pointer-tilt orbital instrument in the portrait plate"
```

---

### Task 5: Homepage composition sections

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Home.css`

**Interfaces:**
- Consumes: `ProjectVisual` (`{ tone }`), `portfolio.projects`, `portfolio.milestones`, `portfolio.email`, `portfolio.resume`.
- Produces: no export change; `Home` keeps its default export.

- [ ] **Step 1: Add the dark subject strip**

After the introduction section, add `<section className="home-subjects" aria-label="Subject areas">` listing, in order: AI, Machine learning, Computer vision, Data science, Systems — each with a small orange marker, in Space Mono metadata type on a dark field. Update `Home.css` accordingly.

- [ ] **Step 2: Replace the destination cards with the project index**

Delete the `destinations` array and the `home-destinations` section, and the now-unused lucide imports (`FlaskConical`, `UserRound`, `MessageSquare`). Add `<section className="home-index" aria-labelledby="home-index-title">` rendering a row per `portfolio.projects` item: number, a `ProjectVisual` thumbnail link, category, title link to `/projects/${slug}`, and a "Read the case study" link. Each row is a real link with visible focus. Follow the condensed single-column pattern (number · thumbnail · copy · link).

- [ ] **Step 3: Add the deep-blue notes section**

Add `<section className="home-notes" aria-labelledby="home-notes-title">` on `background: var(--deep-blue)` (add `--deep-blue: #232B63` to `:root` in `index.css` if not present). Three short grounded notes derived from the project approaches (retrieval grounding, local-only inference, reproducible pipelines, vision explainability). Text warm light / citron; verify AA contrast.

- [ ] **Step 4: Add the compact learning timeline**

Add `<section className="home-timeline" aria-labelledby="home-timeline-title">` rendering `portfolio.milestones` as a compact 3-item timeline (period, label, title, place). Keep it visually lighter than the About timeline.

- [ ] **Step 5: Add the quiet contact panel**

Add `<section className="home-contact" aria-labelledby="home-contact-title">`: a short invitation, a `Let's talk` link to `/contact`, plus résumé and email links. No large display type (the footer owns that).

- [ ] **Step 6: Verify**

Run: `npm run build` → succeeds. Run: `npm run lint` → no new errors. In `npm run dev`, confirm the homepage order matches the spec §4, every new row is keyboard reachable with a visible ring, and the layout stacks cleanly at ≤750px and ≤450px.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.css src/index.css
git commit -m "feat: complete the Night Signal homepage composition"
```

---

### Task 6: Dead-code cleanup

**Files:**
- Delete: `src/components/ProjectIllustration.jsx`, `src/components/LearningLoop.jsx`, `src/components/LearningLoop.css`, `src/components/FactStrip.jsx`, `src/components/CursorEffect.jsx`, `src/components/SplineVisual.jsx`, `src/components/LeetCodeStats.jsx`, `src/components/LeetCodeStats.css`, `src/components/Navbar.jsx`, `src/components/Navbar.css`, `src/components/ProjectCard.jsx`, `src/App.css`, `src/pages/Projects.css`, `src/pages/About.css`, `src/pages/Contact.css`, `resources/style-guide.json`, `src/assets/hero.png`, `src/assets/me.original.png`, `src/assets/vite.svg`, `src/assets/react.svg`, `public/spline-core.svg`
- Modify: `package.json`

**Interfaces:**
- Produces: no API change.

- [ ] **Step 1: Confirm nothing imports the targets**

Grep `src/` for each component basename and the three dead page CSS files → zero import matches. (Already verified once; re-run before deleting.)

- [ ] **Step 2: Delete the files**

`git rm` the files listed above (and `resources/` becomes empty).

- [ ] **Step 3: Remove the unused dependency**

Delete `"react-leetcode": "^1.0.3"` from `package.json` dependencies, then run `npm install` to refresh the lockfile.

- [ ] **Step 4: Verify**

Run: `npm run build` → succeeds. Run: `npm run lint` → no new errors. Grep `src/` → no references to any deleted module.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove dead components, duplicate CSS, stale resources, unused assets"
```

---

## Self-Review

**Spec coverage:** §3 D1 → Task 5 Step 3; D2 → Task 5 Step 1; D3 → Task 5 Step 2; D4 → Task 5 Step 4; D5 → Task 5 Step 5; D6 → Task 5 Step 2; D7 → Task 2; D8 → Task 1; D9 → Task 3 Step 1; D10 → Task 3 Step 2; §5.1 → Task 4; §5.3 → Tasks 1 & 2; §5.4 → constraints + per-task verify; §6 → Task 6. All covered.

**Review Focus tests:** each line is exercised by a verification step — reduced-motion/coarse tilt (Task 4 Step 4), keyboard reachability (Task 5 Step 6), deep-blue contrast (Task 5 Step 3/6), deleted-import safety (Task 6 Steps 1 & 4), grain input interception (Task 1 Step 3).

**Type consistency:** `ProjectVisual` is always used as `{ tone }`; project fields `number/category/title/slug/tone/summary` and milestone fields `period/label/title/place` match `mockData.js`. Class prefixes are consistent (`home-*`, `pv-*`, `oi-*`).

**Proportion:** six focused tasks; bodies left to the implementer except the exact CSS token/markup values the spec pins.
