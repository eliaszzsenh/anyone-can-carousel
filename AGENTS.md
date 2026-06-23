# AGENTS.md — the full manual

Instructions for an AI coding agent (Claude Code, Cursor, etc.) working in this repo,
and for the human reading over its shoulder. This repo builds **animated 1080×1080
Instagram carousels** in React. You edit slide components; the user screen-records the
result. There is no backend and no export server, the **Record** tab is the export.

If you just opened this repo, read **[CLAUDE.md](./CLAUDE.md)** first: you greet the user
in "carousel mode" and run the intake before coding.

---

## The intake (always run this first)

Before any code, get five things (one line each is fine, "you decide" is fine):

1. **Topic / idea** — the subject, or a rough hook, or a full script.
2. **Slides** — how many (default 8; 5–10 is the range).
3. **CTA** — what slide N asks for (comment a keyword, follow, a link).
4. **Look** — default monochrome premium, or change colors / font / vibe.
5. **Effects / brands** — logos to feature, or a specific effect they want.

Then **write the script in plain text and get a yes** before touching components.

---

## Commands

```bash
npm install        # once
npm run dev        # Vite at http://localhost:5173 (opens it)
npm run build      # production build (optional; not needed to record)
```

"Done" = the slide looks right at localhost:5173 and the **Record** tab plays it cleanly.
There is no test suite.

---

## Project structure

```
src/
  App.tsx                  the gallery + the Record room. The `slides` array at the
                           top defines which slides show and in what order.
  main.tsx                 entry (don't touch)
  carousel/
    kit.tsx                the design system + animation engine. Read it. Rarely edit.
    icons.tsx              real brand logos as inline SVG (+ how to add any). USE THIS.
    Slide1.tsx … Slide8.tsx   the slides — THIS is what you edit / create.
public/
  profile.jpg              the photo on the final slide (user replaces with theirs)
```

Each `SlideN.tsx` is a self-contained component. The carousel is the array in
`src/App.tsx`.

---

## The build loop

1. **Script first.** One idea per slide, plain text, confirmed by the user. Default
   8-beat arc: hook · tension · truth · reframe · the one thing · proof/who · takeaway ·
   CTA. For fewer slides, drop the weakest beats (keep hook + one-thing + CTA). For more,
   split a beat, never add filler.
2. **Build the slide components** to match. Reuse kit helpers (`head`, `sub`, `Eyebrow`,
   `U`, `Letters`, `PencilCircle`, `PlayCard`, `Slide`, `Center`, `Foot`) and the
   `icons.tsx` logos. Match the existing slides' code shape.
3. **Keep the frozen-state rule** (below) or stills/exports break.
4. Tell the user to open the **Record** tab and screen-record.

---

## Add / remove / reorder slides

Everything keys off the array in `src/App.tsx`:

```tsx
import Slide9 from "./carousel/Slide9";   // 1) import the new file
const slides = [
  <Slide1 key={1} />, …, <Slide8 key={8} />,
  <Slide9 key={9} />,                       // 2) add it where you want it
];
```

- **Add a slide:** copy an existing `SlideN.tsx` to the next number, edit its content,
  import it, add it to the array. Give `<Slide n={9}>` the right number (it shows in the
  footer).
- **Remove a slide:** delete its line from the array (you can leave the file).
- **Reorder:** reorder the array. The footer count is `TOTAL` in `kit.tsx` (defaults to 8)
  and each slide's `n` prop, update both if you want the "03 / 06" footer to read right.
- **Change the total in the footer:** edit `const TOTAL = 8;` in `kit.tsx`.

A slide is just `<Slide n={N} tone="light|gray|dark">…your content…</Slide>`. Use `Center`
to vertically center, or absolute-position pieces for editorial layouts (see Slide1).

---

## The design system (and how to restyle)

All tokens live at the top of `src/carousel/kit.tsx`:

```ts
WHITE "#FFFFFF"  GRAY "#F5F5F7"  INK "#1D1D1F"  MUTED "#6E6E73"  LINE …
DARK  "#202224"  INK_D "#F5F5F7" MUTED_D …                      (dark-slide variants)
ui    = the font stack (SF Pro → Inter Tight → Inter fallback)
EASE  = { out, pop, io }   shared easing language
head(size)  sub(size)      headline + body style helpers
```

- **Recolor the whole carousel:** change `INK` / `GRAY` / `WHITE` (and the `DARK` set for
  dark slides). Every slide imports these, so one edit reskins all of them.
- **Change the font:** edit `ui`. To use a Google font, add its `<link>` in `index.html`
  and put the family first in `ui`.
- **The signature footer** ("Eliasz · building with AI" + "01 / 08") is the `Foot`
  component in `kit.tsx`, change the name there, or pass `foot={false}` to a `<Slide>` to
  hide it on that slide (the CTA slide usually hides it).
- **Headline feel:** `head(size)` is weight 600, tracking `-0.035em`, line-height 1.02.
  Big + tight is what makes type read "Apple" not "default". Keep headlines 80–100px.

---

## The animation engine (read before editing motion)

Model: **play-then-freeze**. The live page animates; a still (`?still=1`, used by exports
and respected for reduced-motion) shows the frozen FINAL state.

### The golden rule: base style = final state

Every element's normal CSS is its **resting/final** look. Entry animations only run inside
the `.carcar-play` root (added by `<Slide>` while playing). A frozen render is just the
base styles with zero animation. **Never** rely on an animation to put an element in its
final position.

### Entry classes (add a className + a `--d` delay)

Add one class and set its start delay with `style={{ "--d": "0.3s" }}`:

| class | motion |
|-------|--------|
| `cc-rise` / `cc-rise-sm` | rise up + blur-focus in |
| `cc-fade` | fade + blur in (no movement) |
| `cc-pop` | scale up with a soft overshoot |
| `cc-drop` | drop down in |
| `cc-grow` | grow from a thin line (dividers/bars) |
| `cc-float` / `cc-breath` | perpetual gentle float / breathe (loops) |

Caveat: don't put a `cc-*` class on an element that already has its own `transform`
(rotate/translate) — the keyframe ends at `transform:none` and wipes it. Wrap it in a
plain `<div>` and animate the wrapper.

### The signature text effect — `<Letters>`

Wrap a headline; each character rises in with a soft blur bloom, left to right:

```tsx
<h1 style={{ ...head(92) }}>
  <Letters start={0.12} step={0.026}>I built <U>real things</U> with AI.</Letters>
</h1>
```

- Words stay intact (never break mid-letter); whitespace preserved.
- Nested elements keep working: `<U>word</U>` keeps its pencil underline while its letters
  roll in.
- Two dials: **`start`** (delay before the first letter, s) and **`step`** (per-letter
  stagger, s). Smaller `step` (~0.018) for long headlines so they don't drag.
- Honors `still`: a frozen render returns plain text.

### Hand-drawn pencil marks (emphasis = a sketch, not a color)

Emphasis is an imperfect pencil stroke, never a color change (palette stays mono).

- `<U>word</U>` → wobbly pencil underline under a word.
- `<PencilCircle />` → scribbled circle around its parent (2 overlapping loops).
- Any `<path className="cc-pencil-stroke" pathLength={1}>` draws itself in. Control timing
  with `style={{ "--pencil-delay": "0.7s" }}` on an ancestor. Sequence a mark AFTER the
  text it annotates lands.

### The three motion laws (apply to any motion you design)

1. **Landing** — ease OUT (fast, then settle). Avoid linear. Soften bounces.
2. **Distance** — small movements. `cc-rise` only travels ~22px, `cc-letter` ~0.42em.
3. **Timing** — stagger entrances so text appears in reading order, never all at once.

### Play-then-freeze internals (only if you touch `<Slide>` or App)

- `<Slide>` adds `.carcar-play` while playing. On scroll-in (IntersectionObserver) it
  plays; re-plays on a `ccplay` window event.
- `?still=1` or `prefers-reduced-motion` → frozen final state, no animation.
- The Record room sets `?rec=N`, keeping the slide armed (no autoplay) and waiting for a
  single `ccplay`, so the entrance fires exactly once per take.

---

## Add a NEW text / motion effect

Two ways, pick by complexity:

**A. A new CSS entry class** (for simple, declarative motion). In `kit.tsx`, inside
`CARCAR_ANIM_CSS`, add a class scoped under `.carcar-play` and its keyframe:

```css
.carcar-play .cc-skew{animation:ccSkew .7s var(--eo) var(--d,0s) both;}
@keyframes ccSkew{from{opacity:0;transform:translateY(14px) skewX(6deg);filter:blur(6px);}
                  to{opacity:1;transform:none;filter:blur(0);}}
```

Then use `className="cc-skew"` with a `--d` delay. Because it lives under `.carcar-play`,
the frozen render shows the base (final) style automatically, the freeze rule is free.

**B. A small JS child component** (for choreography: counters, grids, a flip). Render it
inside `<Slide>`, gate it on the engine:

```tsx
function MyMotion() {
  const still = useStill();
  const play = useCarcarPlay();           // true once the slide is on-screen
  useEffect(() => { if (still || !play) return; /* start your animation */ }, [still, play]);
  // base JSX must already be the FINAL state (so the still is correct)
}
```

`<Slide>` remounts its children on each entry, so the effect auto-replays on scroll and in
the recorder. See `Slide1.tsx`'s `FlipHand` for a full example (framer-motion springs).

---

## STRICT RULE: SVG, never emoji

Emojis render differently on every phone, look cheap, and break the monochrome palette.
**Use a real SVG instead** — for brands AND for plain glyphs (arrows, checks, phones).
The only exception is when the **user explicitly asks for emojis**.

- **Brand logos** (Claude, GitHub, OpenAI, Google, X, Vercel…) are ready in
  `src/carousel/icons.tsx`: `import { Github } from "./icons"` → `<Github size={48} />`.
  They're filled with the ink color so they sit in the palette.
- **Need a logo that isn't there?** `icons.tsx` has a step-by-step header. In short: copy
  the single-path SVG from **https://simpleicons.org** (3000+ brand logos) or
  **https://svgl.app**, or the brand's own brand kit, paste the `d="…"` into a new
  component, keep `fill={color}`. Done.
- **Need a non-brand glyph** (arrow, check, star, phone)? Grab it from
  **https://lucide.dev** (Copy SVG), paste the path, stroke/fill it with ink.
- **Recoloring:** a logo copied from simpleicons is one path — set `fill={INK}` (or pass
  `color`) and it's on-palette. To keep one logo in its real brand color, paste the full
  multi-path `<svg>` and don't force the fill, but use at most one colored mark or the
  premium monochrome look is gone.

This is how the slides reach a polished level: a crisp Claude logo, not a 🤖.

---

## Customizing away from the default style

The default look is deliberate (monochrome, SF Pro, pencil marks, per-letter reveal). It's
good, but it's not a cage. If the user wants their own style, change it cleanly:

- **Different palette / brand color:** edit the tokens in `kit.tsx`. If they insist on an
  accent color, add ONE and use it sparingly (a single underline or key word), never
  everywhere.
- **Different font:** edit `ui` (+ an `index.html` `<link>` for a web font).
- **No pencil marks:** swap `<U>word</U>` for a plain `<span>` (or a solid underline), and
  drop `<PencilCircle>`. The carousel still works.
- **Different motion personality:** tune `Letters` `step`, or design new effects (section
  above). Slower/larger = playful; faster/smaller = refined.
- **Their face on the last slide:** drop a square image at `public/profile.jpg`.

Tell the user what you changed and why, then keep the whole set consistent — one palette,
one font, one motion feel across all slides.

---

## Recording / export

The user opens the **Record** tab → **Enter record mode**. Each slide holds black, plays
once, then black again (clean cut points). `←`/`→` switch, click to re-take, `Esc` exits.
They press F11 (fullscreen), screen-record the square (Mac: Cmd+Shift+5 · Windows: Win+G
or OBS), then crop to 1:1 and post. There is no server export, the recording IS the export.

## The final slide photo

The last slide can show a circular photo from `public/profile.jpg` framed by a
`PencilCircle`. Tell the user to drop their own square photo there.
