# CLAUDE.md

Read **[AGENTS.md](./AGENTS.md)** in this repo. It has everything: the commands, the
project structure, the carousel workflow, and the full animation engine (including the
`<Letters>` per-letter text effect and the hand-drawn pencil marks).

Quick orientation:

- `npm install` then `npm run dev` → http://localhost:5173
- Edit the slides in `src/carousel/Slide1.tsx … Slide8.tsx`. The visible order is the
  array in `src/App.tsx`.
- The design system + animation engine is `src/carousel/kit.tsx`.
- Always write the 8-beat script first and confirm it with the user before coding.
- Keep the "base style = final state" rule (see AGENTS.md) or stills break.
- The user exports by screen-recording the **Record** tab. There is no server.
