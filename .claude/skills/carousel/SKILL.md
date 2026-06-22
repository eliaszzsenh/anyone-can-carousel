---
name: carousel
description: >-
  Build an animated 1080x1080 Instagram carousel in this React repo. Use when the
  user asks to make a carousel, slides, an Instagram/IG post, a "swipe" post, or to
  turn an idea/script into animated square slides. The user screen-records the result.
---

# Carousel

This repo is the front end for animated 1080x1080 Instagram carousels (React + Vite).
Full reference is in `AGENTS.md` at the repo root, read it first.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

## What you edit

- `src/carousel/Slide1.tsx … Slide8.tsx` — the slides (the content). THIS is the work.
- `src/App.tsx` — the array that defines which slides show and in what order.
- `src/carousel/kit.tsx` — the design system + animation engine. Read it; rarely edit.

## Always, in order

1. Write the 8-beat script in plain text first (hook · tension · truth · reframe · the
   one thing · proof/who · takeaway · CTA). Confirm with the user before coding.
2. Edit the slide components to match, reusing kit helpers: `head`, `sub`, `Eyebrow`,
   `U`, `Letters`, `PlayCard`, `PencilCircle`.
3. Keep the "base style = final state" rule (animations only run under `.carcar-play`),
   or stills break.
4. Tell the user to open the **Record** tab and screen-record (F11 + a screen recorder).

## The signature move: `<Letters>`

Wrap a headline so each letter rises in with a blur bloom, staggered:

```tsx
<h1 style={{ ...head(92) }}>
  <Letters start={0.12} step={0.026}>Your headline <U>here.</U></Letters>
</h1>
```

`start` = delay before the first letter; `step` = per-letter stagger (smaller for long
lines). It keeps words intact and lets `<U>` underlines draw in. See AGENTS.md →
"The text effect" and "The three motion laws" for everything else.

## Style defaults

Monochrome (ink + grey + white), big headlines (80-100px), tight tracking (-0.03em).
The motion feel is the user's signature, design it with them, don't blindly clone.
