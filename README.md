# anyone-can-carousel

Make animated Instagram carousels like mine, with your agent. This is the exact
front end I use: 8 animated 1080×1080 slides, a per-letter text reveal, hand-drawn
pencil marks, and a built-in record mode you screen-record. You bring the idea,
Claude edits the slides, you record.

![demo](https://remplace.online/carcar1)

---

## Quick start

```bash
git clone <this repo>
cd anyone-can-carousel
npm install
npm run dev          # opens http://localhost:5173
```

You'll see the 8 example slides. Use the **Slides** tab to browse, the **Record**
tab to capture.

## Make it yours (with Claude Code)

Open this folder in **Claude Code** (any paid Claude plan) and just talk to it:

> read AGENTS.md. Make me a carousel about &lt;your topic&gt;, CTA "comment SETUP".

Claude writes the 8-slide script with you, edits the slide components, and you watch
it update live at localhost:5173. The skill in `.claude/skills/` and `AGENTS.md` tell
Claude exactly how the animation engine works (the text effect, the pencil marks, the
freeze rule), so it edits the right things.

Prefer to edit by hand? The slides are `src/carousel/Slide1.tsx … Slide8.tsx`. Plain
React, inline styles. `AGENTS.md` documents every animation helper.

## Record the video

1. Open the **Record** tab → **Enter record mode**.
2. Press **F11** (fullscreen), start your screen recorder (Mac: Cmd+Shift+5 ·
   Windows: Win+G or OBS).
3. Each slide holds **black**, then plays once, that black→slide cut is your clean
   in-point. `←` / `→` to switch, click to re-take, `Esc` to exit.
4. Crop the recording to the square and post.

## Customize

- **Your photo:** drop a square image at `public/profile.jpg` (used on slide 8).
- **Colors / font:** the design tokens live at the top of `src/carousel/kit.tsx`.
- **The motion:** the entrance feel (the `<Letters>` reveal, the pencil marks) is
  yours to tune. `AGENTS.md` → "The animation engine" shows every dial.

## What's in here

```
src/App.tsx               the gallery + record room
src/carousel/kit.tsx      design system + animation engine
src/carousel/Slide*.tsx   the 8 slides (edit these)
AGENTS.md                 full guide for your agent (and you)
CLAUDE.md                 pointer for Claude Code
.claude/skills/carousel/  auto-loaded skill
```

Built from the live version at https://remplace.online/carcar1
