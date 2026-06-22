# AGENTS.md

Instructions for an AI coding agent (Claude Code, Cursor, etc.) working in this repo.
This repo builds **animated 1080×1080 Instagram carousels** in React. You edit slide
components, the user screen-records the result.

## Commands

```bash
npm install        # once
npm run dev        # starts Vite at http://localhost:5173 and opens it
npm run build      # production build (optional; not needed to record)
```

There is no test suite. "Done" = the slide looks right at http://localhost:5173 and
the record view plays cleanly.

## Project structure

```
src/
  App.tsx                 the gallery + the Record room (don't usually touch)
  carousel/
    kit.tsx               the design system + animation engine (read this)
    Slide1.tsx … Slide8.tsx   the 8 slides — THIS is what you edit
public/
  profile.jpg             the photo used on Slide 8 (user replaces with theirs)
```

Each `SlideN.tsx` is a self-contained component. The visible carousel is the array
in `src/App.tsx`. To add/remove/reorder slides, edit that array.

## How to build a carousel (the workflow)

1. **Write the script first**, in plain text, one idea per slide. Confirm with the
   user before coding. Default 8-beat arc: hook · tension · truth · reframe · the
   one thing · proof/who · takeaway · CTA.
2. **Edit the slide components** to match the script. Reuse the kit helpers
   (`head`, `sub`, `Eyebrow`, `U`, `Letters`, `PlayCard`, `PencilCircle`).
3. **Keep the frozen-state rule** (below) or stills/exports break.
4. Tell the user to open the **Record** tab and screen-record.

## Code style

- TypeScript + React function components. Inline `style={{}}` objects, not CSS files
  (the kit is one shared stylesheet injected per slide). Match the existing slides.
- Monochrome by default: ink + greys + white, no accent color. One restrained palette
  reads more premium than many colors. The user can change `--bg/--ink` tokens.
- Headlines big (80–100px) with tight letter-spacing (`-0.03em`…`-0.04em`). That one
  thing is what makes type read "Apple", not "default".

---

# The animation engine (read before editing motion)

Everything lives in `src/carousel/kit.tsx`. The model is **play-then-freeze**: the
live page animates; a still (`?still=1`) shows the frozen FINAL state.

### The golden rule: base style = final state

Every element's normal CSS is its **resting/final** look. Entry animations only run
inside the `.carcar-play` root (added by `<Slide>` while playing). So a frozen render
is just the base styles with zero animation. **Never** rely on an animation to put an
element in its final position.

### Entry classes (add a className + a `--d` delay)

On any element, add one of these and set its start delay with `style={{ "--d": "0.3s" }}`:

| class | motion |
|-------|--------|
| `cc-rise` / `cc-rise-sm` | rise up + blur-focus in |
| `cc-fade` | fade + blur in (no movement) |
| `cc-pop` | scale up with a soft overshoot |
| `cc-drop` | drop down in |
| `cc-grow` | grow from a thin line (dividers/bars) |

Caveat: don't put a `cc-*` class on an element that already has its own `transform`
(rotate/translate). The keyframe ends at `transform:none` and would wipe it. Wrap it
in a plain `<div>` and animate the wrapper instead.

### The text effect — `<Letters>` (the per-letter reveal)

This is the signature headline move. Wrap a headline in `<Letters>` and each character
**rises into place one after another with a soft blur bloom**, left to right.

```tsx
<h1 style={{ ...head(92) }}>
  <Letters start={0.12} step={0.026}>
    I built <U>real things</U> with AI.
  </Letters>
</h1>
```

How it works (in `kit.tsx`):

- `<Letters>` splits its children into words, and each word into per-letter `<span>`s.
  Words are kept intact (`white-space:nowrap`) so they never break mid-letter across
  lines. Whitespace is preserved.
- Each letter span gets class `cc-letter` and a staggered delay `--d = start + i*step`.
- It recurses into nested elements, so an emphasis wrapper like `<U>word</U>` keeps its
  hand-drawn underline while its letters roll in (the counter flows across it).
- The keyframe `ccLetter` animates `from { opacity:0; transform: translateY(0.42em);
  filter: blur(7px); } to { opacity:1; transform:none; filter:blur(0); }` with the
  kit's ease-out. The rise is in `em`, so it scales with font size.
- It honors `still`: in a frozen render it returns the plain text (no spans).

Two dials: **`start`** (delay before the first letter, seconds) and **`step`**
(per-letter stagger, seconds). Bigger `step` = a more pronounced typewriter cascade;
use a smaller `step` (~0.018) for long headlines so they don't drag.

### Hand-drawn pencil marks (emphasis = a sketch, not a color)

Emphasis is an imperfect pencil stroke, never a color change (palette stays mono).

- `<U>word</U>` puts a wobbly pencil **underline** under a word.
- `<PencilCircle />` scribbles a **circle** around its parent (2 overlapping loops).
- Any `<path className="cc-pencil-stroke">` (with `pathLength={1}`) **draws itself in**
  via `stroke-dashoffset`. Control timing with `style={{ "--pencil-delay": "0.7s" }}`
  on an ancestor.

Sequence marks AFTER the text they annotate lands (e.g. headline rolls in over ~0.7s,
set the underline's `--pencil-delay` to ~0.85s).

### The three motion laws (apply to any motion you design)

1. **Landing** — ease OUT (fast, then settle). Avoid linear. Soften bounces.
2. **Distance** — small movements. If the motion is more noticeable than the words,
   it's too big. (That's why `cc-rise` only travels ~22px and `cc-letter` ~0.42em.)
3. **Timing** — stagger entrances so text appears in reading order, never all at once.
   That's what `--d` and `Letters`' `step` are for.

### Play-then-freeze internals (only if you touch `<Slide>` or App)

- `<Slide>` adds `.carcar-play` while playing. On scroll-in (IntersectionObserver) it
  plays; it re-plays on a `ccplay` window event.
- `?still=1` or `prefers-reduced-motion` → frozen final state, no animation.
- The Record room sets `?rec=N`, which keeps the slide **armed** (no scroll-autoplay)
  and waits for a single `ccplay`, so the entrance fires exactly once per take.

## Slide 8 photo

`Slide8.tsx` shows a circular photo from `public/profile.jpg` framed by a `PencilCircle`.
Tell the user to drop their own square photo at `public/profile.jpg`.
