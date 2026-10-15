# Night Signal — conformance design spec

- **Date:** 2026-10-15
- **Status:** awaiting review
- **Source of intent:** `portfolio/design-system/santosh-singh-portfolio/MASTER.md` (the approved design brief)
- **Scope decision:** "Full conformance + cleanup" — bring the implementation into line with `MASTER.md`, close the missing compositions/details, and remove dead/inconsistent code.

## 1. Problem

The portfolio already implements most of `MASTER.md` — the five palette tokens, the four typefaces, the portrait plate, the four project graphic plates, and global accessibility all match. The remaining work is the back half of the homepage composition, several graphic-language details, and a body of dead code that contradicts the brief. This spec defines exactly what changes so the result can be reviewed before implementation.

## 2. Intended outcome

A single, coherent "Night Signal" portfolio where:

- The homepage reads as the exhibition catalogue `MASTER.md` describes, in order.
- Every graphic detail in the brief (grain, registration marks, crop marks + signal tiles, orbital interaction) is present.
- No live code contradicts the brief's AVOID list, and no dead code contradicts the brief at all.
- Keyboard access, reduced-motion, and contrast remain intact.

## 3. Decisions that resolve open points in `MASTER.md`

These are judgment calls the brief left underspecified. Each is flagged so it can be overridden in review.

| # | Question | Decision |
|---|---|---|
| D1 | The brief names a "deep blue notes section" but the palette has no deep blue. | Add one new token, `--deep-blue: #232B63`, used only by the notes section. Keep the five brief tokens unchanged. |
| D2 | "Dark subject strip" content is unspecified. | A slim full-bleed band of the disciplines, left-to-right: **AI · Machine learning · Computer vision · Data science · Systems**, each with a small orange marker. Grounded in the About toolkit, not invented metrics. |
| D3 | "Project index" content on the homepage. | A compact 4-row index of `portfolio.projects` (number, `ProjectVisual` thumbnail, title, category, "Read the case study" link), following the existing `/projects` index pattern but condensed to a single column. |
| D4 | "Compact learning timeline" content. | Reuse `portfolio.milestones` (industry experience, education, problem solving) as a compact 3-item timeline. |
| D5 | "Quiet contact panel" content. | A final low-key section: short invitation, `Let's talk` link to `/contact`, plus résumé and email links. No large display type (that role already belongs to the footer). |
| D6 | The current homepage ends with three "Take a different path" destination cards, which duplicate navigation and repeat rounded cards the brief excludes. | Replace them with the project index (D3) and the contact panel (D5). |
| D7 | Does the interactive `NeuralWorkbench` canvas stay, given it is not in the brief? | **Keep it** — it is a legitimate "project map you can explore" — but refine it to honor the AVOID list: remove the radial-gradient glow blobs and off-palette orange, and use flat signal markers with square geometry. Flagged for review. |
| D8 | Grain treatment. | A single restrained global overlay on the page shell: an inline SVG `feTurbulence` noise at ~4–5% opacity, `pointer-events: none`, `mix-blend-mode: overlay`. Static, so reduced-motion does not need to disable it. |
| D9 | Registration marks scope. | Thin marks added to each project graphic plate (four corners), echoing the pattern in the current dead `ProjectIllustration.jsx` but with real CSS. |
| D10 | Image-analysis plate detail. | Extend the live vision plate with literal crop marks and a row of signal tiles, matching the brief's wording ("crop marks with signal tiles"). |

## 4. Homepage composition (target order)

1. Header — slim metadata line + plain navigation (`SiteHeader`, unchanged).
2. Introduction — left headline + midnight portrait plate with Santosh's real photo, now with an **interactive** orbital instrument (§5.1).
3. Dark subject strip (D2).
4. Interactive project explorer (`NeuralWorkbench`, refined — D7), with its existing explorer note.
5. Asymmetrical featured project spread (existing).
6. Project index (D3).
7. Deep-blue notes section (D1).
8. Compact learning timeline (D4).
9. Quiet contact panel (D5).
10. Footer (unchanged).

## 5. Detailed changes

### 5.1 Interactive orbital instrument (brief: "react to pointer tilt")
- Extract the current static instrument (`Home.jsx:33`, `Home.css:22-27`) into a focused component `src/components/OrbitalInstrument.jsx` with its own stylesheet.
- Preserve the existing CSS-perspective rings and slow rotation (18s/24s/31s).
- Add pointer handling: a `pointermove` listener on the portrait frame writes `--tilt-x` / `--tilt-y` custom properties on a wrapper; a `pointerleave` resets them. The wrapper applies a small `rotateX/rotateY` offset (a few degrees, eased).
- Disable tilt when `(prefers-reduced-motion: reduce)` or `(pointer: coarse)` matches; the rings keep their slow rotation only when motion is allowed.
- Purely decorative: remains `aria-hidden`, never a focus target.

### 5.2 Graphic language additions
- **Grain (D8):** global overlay in `index.css`.
- **Registration marks (D9):** corner marks in `ProjectVisual.jsx` scene wrapper, drawn in `ProjectVisual.css`.
- **Crop marks + signal tiles (D10):** added to `VisionPreview` in `ProjectVisual.jsx` (+ CSS).

### 5.3 Palette and metadata corrections
- `NeuralWorkbench.jsx:152-167,183-185` and `ModelPlayground.jsx:82`: replace off-palette `rgba(255,107,53/137,93/164,93,…)` with signal orange `#F17A5A` (241,122,90) equivalents.
- `NeuralWorkbench.jsx:164-185`: remove the radial-gradient glow "orbs"; replace with flat rings/edge highlights.
- `index.html:7`: `theme-color` → `#0C0E13`.
- `index.html:15,21`: `og:image` / `twitter:image` → `/folio-og.svg` (the PNG does not exist).

### 5.4 Accessibility (must remain true after changes)
- Every new navigation/index/timeline item is a real link or button, keyboard reachable, with the existing visible `:focus-visible` outline.
- New decorative visuals are `aria-hidden`.
- Reduced-motion disables all new animation.
- Text kept to warm light on midnight / on deep blue at AA contrast; verify the deep-blue field against `#EEECE5` and citron.

## 6. Cleanup (dead and inconsistent code)

Delete, after confirming nothing imports them (verified: no imports found):

- **Components:** `ProjectIllustration.jsx`, `LearningLoop.jsx` + `LearningLoop.css`, `FactStrip.jsx`, `CursorEffect.jsx`, `SplineVisual.jsx`, `LeetCodeStats.jsx` + `LeetCodeStats.css`, `Navbar.jsx` + `Navbar.css`, `ProjectCard.jsx`, `App.css`.
- **Duplicate dead page CSS:** `Projects.css`, `About.css`, `Contact.css` (the live files are `ProjectsPage.css`, `AboutPage.css`, `ContactPage.css`; the dead duplicates use old rounded/glow styling and undefined CSS variables).
- **Stale design system:** `resources/style-guide.json` ("Syntactic Scaffolding", a light theme that contradicts `MASTER.md`) and the now-empty `resources/` directory.
- **Unused assets:** `src/assets/hero.png`, `src/assets/me.original.png`, `src/assets/vite.svg`, `src/assets/react.svg`, `public/spline-core.svg`.
- **Dependency:** remove `react-leetcode` from `package.json` (its only consumer, `LeetCodeStats.jsx`, is deleted). Requires one `npm install` to refresh the lockfile.

Note: `me.png` (used) is kept; only `me.original.png` (unused) is removed.

## 7. Files touched (estimate)

- **Added:** `src/components/OrbitalInstrument.jsx`, `src/components/OrbitalInstrument.css`, this spec.
- **Edited:** `src/pages/Home.jsx`, `src/pages/Home.css`, `src/components/ProjectVisual.jsx`, `src/components/ProjectVisual.css`, `src/components/NeuralWorkbench.jsx`, `src/components/ModelPlayground.jsx`, `src/index.css`, `index.html`, `package.json`.
- **Deleted:** the list in §6.

## 8. Verification

No test framework is configured. Verification is:

1. `npm run build` succeeds with no errors.
2. `npm run lint` (oxlint) reports no new issues.
3. `npm run dev` + manual pass: homepage section order matches §4; orbital instrument responds to pointer and stops under reduced-motion; new sections respond at ≤750px and ≤450px breakpoints; tab order reaches every new control with a visible focus ring; deep-blue notes section meets AA contrast.
4. Confirm no import errors after deletions (build covers this).

## 9. Out of scope

- Redesigning `About`, `Projects`, `ProjectDetail`, `Lab`, or `Contact` beyond the palette/plate corrections that `ProjectVisual` propagates to them.
- Changing real content/data in `mockData.js` (names, facts, stacks stay grounded in source).
- Adding a test framework or CI.

## 10. Decisions open for review

- D7 (keep + refine the `NeuralWorkbench` rather than remove it).
- D1 (the introduced `#232B63` deep-blue token).
- D8/D9 (grain and registration-mark intensity).
