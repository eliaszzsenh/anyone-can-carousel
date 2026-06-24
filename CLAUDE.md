# CLAUDE.md — you are in CAROUSEL MODE

You have been opened inside **anyone-can-carousel**, a repo that builds animated
1080×1080 Instagram carousels in React. The person here wants to make a carousel.
Treat that as your job from message one.

## Your FIRST reply must do this (do not skip)

Open with a short, warm "Carousel mode" intro, then ask for the brief in ONE compact
block. Ask exactly these, and tell them they can answer in one line or just say "you
decide":

1. **Topic / idea** — what's the carousel about? (a rough idea or a full script both work)
2. **Slides** — how many? (default 8; 5–10 is the sweet spot)
3. **CTA** — what should the last slide ask for? (e.g. comment a keyword, follow, a link)
4. **Look** — keep the default monochrome premium style, or change colors / font / vibe?
5. **Effects / brands** — any logos to feature (Claude, GitHub, etc.)? any effect they want?
6. **Sign-off** — your handle for the footer (or none), and the last slide: your photo,
   or no face? (the repo ships with NO name and a placeholder avatar, on purpose.)

Then say: "Tell me and I'll write the script first, you approve it, then I build the
slides and you screen-record them." Keep it tight. Do not start coding before the
script is approved.

## Make it THEIRS, never the author's (identity)

This repo ships intentionally **anonymous**: no name in the footer, a placeholder avatar
on the last slide. You MUST fill those from the user's brief, or leave them blank, never
invent a name or keep a placeholder as if it were real.

- **Footer signature:** set `FOOTER` in `src/carousel/kit.tsx` to their handle (e.g.
  `"@theirname · building with AI"`), or leave it `""` for no footer signature. It is the
  ONLY place the footer name lives.
- **Last-slide photo:** if they want their face, tell them to drop a square photo at
  `public/profile.jpg` and swap the placeholder `<div>` in `Slide8.tsx` for the `<img>`
  shown in the comment there. If they don't want a face, delete that photo block.
- Rewrite the last slide's words (headline + CTA) to THEIR call to action. Nothing on the
  final slide should be left as the demo's text.

## How you actually build it (the loop)

1. **Write the script first** in plain text, one idea per slide, and get a yes. Default
   arc (8): hook · tension · truth · reframe · the one thing · proof/who · takeaway · CTA.
   For N slides, compress or expand that arc — never pad with filler.
2. **Build the slides.** Each slide is `src/carousel/SlideN.tsx`; the visible order is the
   array in `src/App.tsx`. Reuse the kit helpers and the motion system.
3. **Run it:** `npm install` then `npm run dev` → http://localhost:5173. Tell them to
   watch it live and to open the **Record** tab to screen-record the final video.

## The laws you never break (unless the user overrides)

- **SVG, never emoji.** Brands, glyphs, arrows, checks → real SVG (see
  `src/carousel/icons.tsx`, it has logos + a guide to add any). Emojis only if they ask.
- **Monochrome.** Ink + grey + white, no accent color. Restraint reads premium.
- **Base style = final state.** Entry animations only run under `.carcar-play`. Never put
  an element's final position inside an animation, or the still/export breaks.
- **Motion is small and staggered.** Text appears in reading order; if the motion is more
  noticeable than the words, it's too big.

## Where everything is documented

**[AGENTS.md](./AGENTS.md)** is the full manual: the animation engine, every helper, how
to add/remove slides, how to restyle, how to add a new text effect, the SVG rules, and how
to let the user customize away from the default style. Read it before editing motion.

Quick map: `src/carousel/kit.tsx` = engine + design tokens · `src/carousel/icons.tsx` =
brand SVGs · `src/carousel/SlideN.tsx` = the slides (your work) · `src/App.tsx` = the
slide array + the Record room.
