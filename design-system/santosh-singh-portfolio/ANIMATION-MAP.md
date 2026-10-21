# Santosh Singh Portfolio — Animation Map (Draft)

Status: map approved; implementation is complete. The user steered the visual palette to a dark futuristic system with luminous cyan and violet accents on 2026-10-20.

## Current visual direction

Use `MASTER.md` as the current palette source: near-black `#080B14`, raised navy `#101725`, cool white `#EAF3FF`, electric violet `#B69CFF`, and luminous cyan `#54F1E5`. The earlier orange and bright-field concepts below are historical inputs to the approved motion map, not current color guidance.

## Project brief

- **Brand:** Santosh Singh, AI/ML student and software builder.
- **Audience:** students, recruiters, and companies.
- **Source material:** the résumé and existing portfolio content in `src/data/mockData.js`.
- **Page templates:** Home, Projects, Project Case Study (shared template for four projects), Lab, About, and Contact.
- **Existing interactions:** project-pathway explorer, project filters and gallery/index switch, classifier playground, skill accordions, email conversation starters, and copy-email action.
- **Existing visual identity:** Night Signal system in `MASTER.md` — charcoal `#101010`, surface `#191919`, warm white `#F2EEE6`, muted warm gray `#B0ACA4`, rule `#68635A`, signal orange `#FF6B35`, and hover orange `#FF895D`; Anton, IBM Plex Serif Italic, DM Sans, and Space Mono; Lucide icons.

## Invention Gate

### Metaphor 1 — Physical sensation: a low-lit instrument bench with one warm signal

The portfolio feels like a dark workbench: square, tactile surfaces, ruled marks, and one orange indicator that makes the next useful action easy to find.

- **Source phrases:** “dark brutalist graphics: direct, tactile” and “a single safety-orange signal” in the existing design system.
- **Grounding:** pass — a workbench and illuminated indicator are touchable and visible.
- **Continuity:** pass — the same material can carry navigation, project plates, and interactive controls.
- **Distinctiveness:** pass — the metaphor connects the established Night Signal visual system to Santosh’s working experiments, rather than using a generic AI dashboard motif.

### Metaphor 2 — Materiality: a working notebook layered with evidence

The work feels like marked-up study pages: source documents, code notes, model plots, and small annotations gathered into a usable record.

- **Source phrases:** “document-first learning tool” in the project data and “Change an input. Follow the result.” in the Lab page.
- **Grounding:** pass — documents, notes, code, and plots are concrete materials already present in the projects.
- **Continuity:** pass — evidence layers can recur in case studies, the project index, and the Lab.
- **Distinctiveness:** pass — the metaphor reflects this portfolio’s combination of personal-document retrieval, local code review, reproducible pipelines, and model inspection.

### Metaphor 3 — Emotional trigger: the moment an opaque result becomes inspectable

The satisfying moment is when a result stops being a label and starts showing the evidence or steps behind it.

- **Source phrases:** “A label alone does not show where evidence for generated or manipulated media comes from” in the project data, and “Follow the result” in the Lab page.
- **Grounding:** pass — the classifier experiment and the TruthLens project make this moment visible.
- **Continuity:** pass — retrieval grounding, private code review, repeatable experiments, and explainability all make the process easier to inspect.
- **Distinctiveness:** pass — the portfolio centers on learning how systems behave and making those systems easier to examine.

## Motion language

- **Speed:** quick response for controls; measured reveals for project content.
- **Weight:** tactile and planted; panels settle into place without bounce.
- **Texture:** crisp linework and short, ordered staggers; no floating or liquid motion.
- **Response:** immediate for user input, with a short deliberate settle for content reveals.
- **`ease-primary`:** `power2.out` — controls respond promptly and settle cleanly.
- **`ease-reveal`:** `power3.out` — project material arrives in a clear, weighted sequence.
- **`ease-transition`:** `power2.inOut` — route changes move through a measured midpoint.
- **Scroll model:** Lenis for desktop only where it improves continuity; `syncTouch: false`, preserving native touch momentum.
- **Reduced motion:** remove path drawing, parallax, stagger, and 3D motion; retain all content and direct controls.

## Signature interaction

- **Territory:** Layout.
- **Statement:** “When a visitor chooses a topic in the Home project explorer, the signal-bench metaphor manifests as an SVG route that traces from the selected input to a project node and reveals that project’s visual; the twist is that each choice draws a different geometric path through the same network.”
- **Implementation intent:** keep the existing project explorer’s buttons and direct links; highlight the selected network path immediately, then settle the project inspector with opacity/transform. Every project remains reachable without completing the motion. The route is usable by keyboard and touch, and switches to an immediate state change with reduced motion.
- **Other territories considered:**
  - **Cursor:** rejected because the content must remain easy to explore with a native pointer, touch, or keyboard; a custom pointer adds no evidence about the work.
  - **Loading/reveal:** rejected as the signature because a one-time entrance cannot express the ongoing act of following a model or project path.
  - **Typography:** rejected because language frames the work, while the key experience is inspecting project artifacts and model behavior.
  - **Scroll:** rejected as the signature because the visitor should choose a project path directly instead of having the central interaction controlled by scroll position.

## Animation map

```yaml
global:
  tier: 2.5
  architecture: branching home hub; linear supporting pages and case studies
  easing_language: "precise, tactile, quickly legible"
  ease_primary: "power2.out"
  ease_reveal: "power3.out"
  ease_transition: "power2.inOut"
  scroll_behavior: "Lenis on desktop where useful; syncTouch false"
  page_transitions: "TanStack Router with a short GSAP opacity/clip-path transition"
  signature_interaction: "Home project explorer highlights a distinct neural-network route and updates its project inspector"
  scroll_pins: []

home:
  introduction:
    type: scroll_reveal
    trigger: page_load
    description: "Reveal headline by words, then portrait plate and its existing orbital instrument; keep the image readable immediately."
  subject_strip:
    type: static
    description: "Keep the subject labels steady as a clear orientation marker."
  project_workbench:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Reveal the explorer as one composition; selection drives the signature SVG route and selected project visual. The network can be dragged or rotated from the keyboard, and input/output nodes select a pathway."
  featured_project:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Bring the project statement and visual in with a short paired reveal."
  project_index:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Stagger project rows in reading order; keep all links visible and keyboard reachable."
  field_notes:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Reveal each note as a compact, numbered evidence card."
  learning_timeline:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Reveal timeline entries in order without pinning the section."
  contact_callout:
    type: static
    description: "Keep the final contact choice immediately available."

projects:
  hero:
    type: scroll_reveal
    trigger: page_load
    description: "Reveal title and supporting copy as words/lines."
  controls:
    type: static
    description: "Filter buttons stay immediate; gallery/index changes use a short FLIP transform."
  collection:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Reveal project plates in reading order; filtered results settle into their new positions."
  lab_callout:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Reveal as a single visual invitation to try the classifier."
  contact_callout:
    type: static
    description: "Keep the next action visible without a scroll-dependent effect."

project_case_study:
  case_hero:
    type: scroll_reveal
    trigger: page_load
    description: "Reveal project title, category, stack, and graphic plate in a deliberate sequence."
  walkthrough:
    type: static
    description: "Use the existing video with native controls; do not animate or delay playback."
  project_mockup:
    type: user_input
    description: "The project artifact is a keyboard-accessible, drag-to-rotate 3D preview with a direct reset control."
  study_tool_pipeline:
    type: user_input
    description: "On the AI Study Tool case study, rotate the three-stage source, retrieval, and grounded-review model; choosing a stage reveals its verified role."
  case_story:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Reveal problem, approach, and outcome as readable blocks."
  next_project:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Give the next project plate a short transform/opacity entrance."
  contact_callout:
    type: static
    description: "Keep the contact link directly available."

lab:
  introduction:
    type: scroll_reveal
    trigger: page_load
    description: "Reveal title and a direct path to the live classifier."
  classifier_playground:
    type: webgl_overlay
    trigger: user_input
    description: "On desktop, show a draggable 3D probability surface synchronized to the existing two-feature classifier, its sample points, and its 0.5 decision threshold. Drag or arrow keys change the view; hovering or selecting a sample inspects its class and probability. Model input updates the surface immediately."
  explanations:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Reveal the explanatory notes; native details/summary remains usable without animation."
  next_projects:
    type: static
    description: "Keep the route to related work direct."

about:
  hero:
    type: scroll_reveal
    trigger: page_load
    description: "Reveal headline and portrait plate; avoid moving the portrait enough to affect reading."
  story:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Reveal copy by paragraph in reading order."
  education_experience:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Reveal timeline entries in sequence."
  practice:
    type: static
    description: "Keep the 280+ practice figure stable; reveal supporting copy only."
  toolkit:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Reveal the skill groups and a draggable 3D constellation sourced from the same verified skill list; selecting a group or skill reveals the current node. Preserve native details/summary interaction."
  next_steps_and_contact:
    type: static
    description: "Keep project, lab, and contact links directly accessible."

contact:
  hero:
    type: scroll_reveal
    trigger: page_load
    description: "Reveal the invitation and contact details without delaying access."
  conversation_starters:
    type: static
    description: "Selecting a starter quickly updates the email preview with a short opacity/transform change."
  social_links:
    type: scroll_reveal
    trigger: scroll_enter
    description: "Reveal links in order; hover styling adds no exclusive information."

webgl_overlays:
  - page: lab
    section: classifier_playground
    canvas_position: "inside the existing plot frame, below controls and labels"
    scene_type: "shallow probability surface over the two-feature plane"
    interaction: "drag or use arrow keys to rotate; select a sample to inspect its class and probability; surface, points, and threshold update from the existing classifier state"
    mobile_fallback: "use the existing 2D classifier plot at narrow widths"
    reduced_motion_fallback: "render a static surface or the existing 2D plot"
  - page: about
    section: toolkit
    scene_type: "lightweight 3D constellation of verified skills and categories"
    interaction: "drag or use arrow keys to rotate; category and skill nodes update the inspector"
    mobile_fallback: "stack the skill clusters in a readable column; retain selection controls"
    reduced_motion_fallback: "show the same flat skill map and direct selection controls"

animated_text_targets:
  - selector: "main h1"
    split: words
    animation: "short line/word reveal on page load"
    safety: "overflow: visible; padding-bottom: 0.18em on display text over 48px"
  - selector: ".home-index-item h3, .aboutpage-timeline-item h3"
    split: none
    animation: "opacity/transform reveal with its containing row"

scroll_pins: []
```

## Motion and access constraints

- Animate only `transform`, `opacity`, `filter`, and `clip-path`.
- No `transition: all`; no animated layout dimensions.
- Display text over 48px keeps `overflow: visible` and at least `padding-bottom: 0.18em`.
- Full-screen sections use `100dvh`.
- Native touch scrolling remains intact.
- No information is available only on hover or after an animation.
- Existing project controls remain the source of truth; animations provide feedback rather than changing the underlying project data.
