# Santosh Singh — Portfolio

Personal portfolio for Santosh Singh, a Computer Science and Engineering student at DIT University in Dehradun. It presents four project case studies, an interactive learning lab, his experience and toolkit, and verified contact links.

## Run locally

```bash
bun install
bun --bun run dev
```

| Command | What it does |
| --- | --- |
| `bun --bun run dev` | Starts the TanStack Start development server on port 3000 |
| `bun --bun run build` | Builds the application and Nitro server output |
| `bun --bun run preview` | Previews the production build |
| `bun --bun run generate-routes` | Regenerates the file-based route tree |

## Routes

| Path | Page |
| --- | --- |
| `/` | Home and interactive project pathways |
| `/projects` | Filterable project collection |
| `/projects/:slug` | Project case study |
| `/lab` | Logistic-regression learning experiment |
| `/about` | Education, experience, and toolkit |
| `/contact` | Verified email, social links, and editable conversation starters |

Routes live in `src/routes/`; the page content and verified portfolio details are in `src/pages/` and `src/data/mockData.js`. TanStack Start handles server rendering and navigation. The Lab keeps its SVG plot as the default and loads a focused WebGL probability surface only when selected on a WebGL-capable desktop.

## Design and motion

The Night Signal system is documented in `design-system/santosh-singh-portfolio/MASTER.md`. It uses a charcoal field, warm white text, visible rules, and signal orange, with Anton, IBM Plex Serif, DM Sans, and Space Mono. The approved animation map, Stitch brief, and screen registry are in the same folder.

GSAP and ScrollTrigger handle page transitions and section reveals. Lenis runs on desktop with touch synchronization disabled. Motion respects `prefers-reduced-motion`; interactive content stays available without animation. The 3D Lab surface is data-driven and has a 2D SVG fallback.

## Project structure

```text
src/
  routes/          TanStack Start route files
  pages/           Page compositions
  components/      Navigation, artwork, project explorer, and Lab visualizations
  data/mockData.js Portfolio content and verified contact details
  index.css        Night Signal tokens and shared styles
design-system/     Portfolio brief, animation map, Stitch prompt, and registry
```
