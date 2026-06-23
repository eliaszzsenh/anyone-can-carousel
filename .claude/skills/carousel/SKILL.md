---
name: carousel
description: >-
  Build an animated 1080x1080 Instagram carousel in this React repo. Use whenever the
  user asks to make a carousel, slides, an Instagram/IG/"swipe" post, or to turn an
  idea/script into animated square slides. Also the default mode for this repo: greet in
  carousel mode and run the intake. The user screen-records the result; there is no server.
---

# Carousel mode

This repo is the front end for animated 1080x1080 Instagram carousels (React + Vite). The
full manual is **[AGENTS.md](../../../AGENTS.md)** at the repo root, read it before editing
motion. The proactive greeting is in **[CLAUDE.md](../../../CLAUDE.md)**.

## On the first message: run the intake

Greet in "carousel mode" and ask, in one compact block (one-line answers fine):
1. Topic / idea  2. How many slides (default 8)  3. The CTA  4. Keep default look or
change colors/font/vibe  5. Any logos to feature / effects wanted.
Then write the script in plain text and get a yes BEFORE coding.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

## What you edit

- `src/carousel/SlideN.tsx` — the slides (the content). THIS is the work. Add/remove/
  reorder via the `slides` array in `src/App.tsx`.
- `src/carousel/kit.tsx` — design tokens + animation engine. Read it; rarely edit.
- `src/carousel/icons.tsx` — real brand logos as SVG (+ how to add any).

## The laws (don't break unless the user overrides)

- **SVG, never emoji** — brands and glyphs come from `icons.tsx` (it documents how to add
  any logo from simpleicons.org / svgl.app / lucide.dev). Emojis only if asked.
- **Monochrome** (ink + grey + white), big tight headlines (80–100px, tracking -0.03em).
- **Base style = final state** — entry animations only run under `.carcar-play`, or the
  still/export breaks.
- **Small, staggered motion** — text appears in reading order, never all at once.

## The signature move: `<Letters>`

```tsx
<h1 style={{ ...head(92) }}>
  <Letters start={0.12} step={0.026}>Your headline <U>here.</U></Letters>
</h1>
```

`start` = delay before the first letter; `step` = per-letter stagger (smaller for long
lines). See AGENTS.md for the engine, adding effects, restyling, and the SVG rules.

## Export

Tell the user to open the **Record** tab → Enter record mode → F11 → screen-record the
square. The recording is the export; there is no server.
