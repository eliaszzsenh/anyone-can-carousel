# anyone-can-carousel

Make animated Instagram carousels like mine, with your agent. This is the exact front end
I use: animated 1080×1080 slides, a per-letter text reveal, hand-drawn pencil marks, real
brand logos (not emojis), and a built-in record mode you screen-record. You bring the
idea, Claude builds the slides, you record.

![demo](https://remplace.online/carcar1)

The only requirement is **Claude Code** (any paid Claude plan). Open this folder in it and
it drops straight into "carousel mode" and asks you what to make.

---

## Quick start

```bash
git clone <this repo>
cd anyone-can-carousel
npm install
npm run dev          # opens http://localhost:5173
```

You'll see the example slides. Use the **Slides** tab to browse, the **Record** tab to
capture your video.

## Make your own (with Claude Code)

Open this folder in **Claude Code** and just talk. It reads `CLAUDE.md` automatically, so
its first reply is already carousel mode:

> **Claude:** Carousel mode. Tell me: topic, how many slides, the CTA, keep the look or
> change it, any logos to feature. One line each is fine, or say "you decide."

Answer however you like ("a carousel about why anyone can build now, 6 slides, comment
BUILD, keep your style, feature the Claude + GitHub logos"). Claude writes the script,
you approve it, then it builds the slides and you watch them update live at
localhost:5173. The agent already knows the animation engine, the SVG rules, and the
freeze rule from `AGENTS.md` — so it edits the right things and it looks right.

Prefer to edit by hand? The slides are `src/carousel/Slide1.tsx … Slide8.tsx`. Plain
React, inline styles. `AGENTS.md` documents every helper and effect.

## Record the video

1. Open the **Record** tab → **Enter record mode**.
2. Press **F11** (fullscreen), start your screen recorder (Mac: Cmd+Shift+5 · Windows:
   Win+G or OBS).
3. Each slide holds **black**, then plays once, that black→slide cut is your clean
   in-point. `←` / `→` to switch, click to re-take, `Esc` to exit.
4. Crop the recording to the square and post.

## Make it yours

- **Your photo:** drop a square image at `public/profile.jpg` (used on the last slide).
- **Colors / font:** the design tokens are at the top of `src/carousel/kit.tsx`. Change
  `INK` / `GRAY` / `WHITE` (and `ui` for the font) to reskin every slide at once.
- **Logos, not emojis:** `src/carousel/icons.tsx` has ready brand logos (Claude, GitHub,
  OpenAI, Google, X, Vercel) and a short guide to add any other from simpleicons.org.
- **The motion:** the per-letter reveal, the pencil marks, the timing, all yours to tune.
  `AGENTS.md` → "The animation engine" and "Customizing away from the default style".

Just tell Claude what to change.

## What's in here

```
src/App.tsx               the gallery + record room
src/carousel/kit.tsx      design tokens + animation engine
src/carousel/icons.tsx    real brand logos as SVG (+ how to add more)
src/carousel/Slide*.tsx   the slides (edit these)
AGENTS.md                 the full guide for your agent (and you)
CLAUDE.md                 the carousel-mode entry Claude Code reads on open
.claude/skills/carousel/  the auto-loaded skill
```

Built from the live version at https://remplace.online/carcar1
