# Santosh Singh - Portfolio

Source for [santosh.runs-on.dev](https://santosh.runs-on.dev), my personal portfolio. I am a computer science undergraduate at DIT University in Dehradun, class of 2027. This site holds four project case studies, a lab of interactive experiments, and the timeline behind them.

It is React 18 on Vite 8, written in plain JSX with one CSS file per page. There is no router, no CSS framework, and no test runner.

## Run it locally

```bash
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts Vite with hot reload |
| `npm run build` | Bundles the site into `dist/` |
| `npm run lint` | Runs oxlint |
| `npm run preview` | Serves the production build locally |

## Routing

There is no react-router. `src/App.jsx` reads `window.location.pathname`, matches it against a small map of pages, and lazy-loads the match behind a Suspense fallback. Anything unmatched renders a 404 page. Anchor links left over from an earlier version of the site (`#work`, `#about`, `#notes`, `#toolkit`, `#contact`) redirect to their new paths on load, and each page sets its own document title.

| Path | Page |
| --- | --- |
| `/` | Home |
| `/projects` | Project index |
| `/projects/:slug` | Project case study |
| `/lab` | Interactive experiments |
| `/about` | About and timeline |
| `/contact` | Contact |

## Project layout

```
src/
  App.jsx            route matching, lazy loading, 404
  main.jsx           React entry point
  index.css          design tokens, base styles, grain overlay
  data/mockData.js   projects, milestones, skills, contact details
  pages/             Home, Projects, ProjectDetail, Lab, About, Contact
  components/
    SiteHeader, SiteFooter    navigation and footer
    ProjectVisual             artwork on every project plate
    NeuralWorkbench           explorable project map on the home page
    OrbitalInstrument         gyroscope in the portrait plate
    ModelPlayground           lab visuals
    BrandIcons                GitHub and LinkedIn marks
```

Every component ships its own CSS file alongside its JSX.

## Design

The brief is `design-system/santosh-singh-portfolio/MASTER.md` and it is the source of truth for palette, type, layout, and copy voice. Work against it is written up in `docs/superpowers/specs/` and `docs/superpowers/plans/`.

Palette tokens, all defined in `src/index.css`:

| Token | Value | Role |
| --- | --- | --- |
| `--page` | `#101010` | Charcoal page field |
| `--surface` | `#191919` | Raised panels |
| `--ink` | `#F2EEE6` | Warm white text |
| `--muted` | `#B0ACA4` | Secondary text |
| `--line` | `#68635A` | Visible rules and borders |
| `--accent` | `#FF6B35` | Safety orange emphasis |
| `--accent-dark` | `#FF895D` | Lighter orange hover state |

The visual treatment uses oversized type, squared edges, 2px borders, and offset hard shadows. Orange surfaces use charcoal text for contrast. The AI Study Tool case study includes a playable Studybench walkthrough and a framed still taken from its video.

Typefaces, loaded from Google Fonts at the top of `index.css`:

| Family | Role |
| --- | --- |
| Anton | Display headlines |
| IBM Plex Serif, italic | Accent phrases inside headlines |
| DM Sans | Body copy and interface text |
| Space Mono | Metadata and labels only |

House rules are enforced by hand: square corners, 2px borders, sentence-case headlines, decorative SVG and canvas work marked `aria-hidden`, visible keyboard focus, and motion switched off under `prefers-reduced-motion`.

## Accessibility

A skip link points at `#main`, which takes focus when navigation lands. Focus is always visible. Canvas and decorative artwork are hidden from screen readers, the portrait has descriptive alt text, and the project walkthrough has native video controls. The pointer-tilt instrument stays still whenever the operating system reports reduced motion or a touch screen.

## Deployment

`vercel.json` carries a SPA fallback rewrite so any path returns `index.html`, plus a proxy from `/leetcode` to leetcode.com/graphql. That proxy is a leftover from a stats component that has since been removed.

Push to `main` on GitHub and Vercel builds a production deployment through its GitHub integration. The custom domain `santosh.runs-on.dev` is public, while the `*.vercel.app` URLs return Vercel Authentication's login page because the project sets `ssoProtection` to `all_except_custom_domains`.

## Checks

There is no test framework in this repo. Changes are verified with `npm run build` and `npm run lint`, both of which are expected to pass before anything is pushed.
