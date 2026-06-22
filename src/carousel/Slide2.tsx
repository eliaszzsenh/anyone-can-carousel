import {
  Slide,
  Eyebrow,
  head,
  ui,
  INK,
  MUTED,
  GRAY,
  WHITE,
  DARK,
  LINE,
  U,
  Letters,
} from "./kit";

/* ANIMATION (kit cc-* entry classes; plays under .carcar-play, freezes after):
   Order eyebrow → heading → pills → funnel draw → verdict. ≈2.4s then frozen.
   1. Eyebrow + the two heading lines RISE in (cc-rise: y+28→0, opacity 0→1,
      0.64s, ease out) with a small stagger (0s / 0.12s / 0.24s). The big line-2
      ("Make you feel behind.") lands ~0.36s; its pencil <U> underline DRAWS in
      after via --pencil-delay:1s on the heading wrapper (kit pulls the <U> paths).
   2. The 3 grey phrase pills DROP in top→bottom (cc-drop: from y-24, 0.56s)
      staggered --d 0.5s / 0.62s / 0.74s — they fall into the stack.
   3. THE BEAT — convergence: the 3 hand-drawn funnel strokes DRAW in
      (cc-pencil-stroke + ghost cc-pencil-stroke-2 in <Stroke>, stroke-dashoffset
      1→0, --pd 0.7s) starting --pencil-delay:1.15s on the funnel wrapper, i.e.
      just after the last pill lands, so the 3 rows visibly funnel to one mouth.
   4. The single dark ink bar (the verdict) GROWS in (cc-grow: scaleY .04→1 from
      top origin, 0.54s, --d 1.7s) — as if the 3 rows collapsed down into it.
      Its label, divider + word then cc-fade in a beat later (--d 2.12s / 2.24s).
   Elements: heading (eyebrow + 2 lines, rise+stagger) · <U> underline (draw) ·
   3 grey pills (drop, staggered) · 3 funnel strokes + ghosts (draw) ·
   ink bar (grow from top) · ink-bar label/word (fade). */

const PHRASES = [
  "Claude killed your job.",
  "A new repo changes everything.",
  "This agent is insane.",
];

export default function Slide2() {
  const pillW = 560;
  const funnelH = 116;
  const mouthX = pillW / 2;
  const mouthY = funnelH - 14;

  // hand-drawn (imperfect, wobbly) funnel stroke from a pill edge to the mouth.
  // mirrors the kit's PencilUnderline aesthetic: a primary wobbly path + a
  // faint thinner ghost path beside it for the sketched, drawn-twice feel.
  const Stroke = ({ startX, bow }: { startX: number; bow: number }) => {
    const c1x = startX + (mouthX - startX) * 0.3 + bow;
    const c1y = funnelH * 0.34;
    const c2x = startX + (mouthX - startX) * 0.72 - bow * 0.6;
    const c2y = funnelH * 0.7;
    const d = `M${startX} 4 C ${c1x} ${c1y}, ${c2x} ${c2y}, ${mouthX} ${mouthY}`;
    // ghost path: slightly offset, lighter, thinner (the second pencil pass)
    const dg = `M${startX + 3} 8 C ${c1x - 4} ${c1y + 3}, ${c2x + 3} ${c2y - 2}, ${mouthX + 2} ${mouthY - 2}`;
    return (
      <>
        <path
          className="cc-pencil-stroke"
          pathLength={1}
          d={d}
          stroke={INK}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          className="cc-pencil-stroke-2"
          pathLength={1}
          d={dg}
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.32"
        />
      </>
    );
  };

  return (
    <Slide n={2} tone="light">
      {/* heading — pencil <U> on line 2 draws ~0.1s after that word lands */}
      <div
        style={{
          position: "absolute",
          top: 116,
          left: 0,
          right: 0,
          textAlign: "center",
          ["--pencil-delay" as any]: "1s",
        }}
      >
        <div className="cc-rise" style={{ ["--d" as any]: "0s" }}>
          <Eyebrow text="The turn" />
        </div>
        <h1
          style={{
            ...head(58),
            color: MUTED,
            padding: "0 110px",
            fontWeight: 500,
          }}
        >
          <Letters start={0.12} step={0.018}>
            Every one is built to do one thing.
          </Letters>
        </h1>
        <h1
          style={{
            ...head(92),
            padding: "0 90px",
            marginTop: 16,
          }}
        >
          <Letters start={0.5} step={0.026}>
            Make you <U thickness={8}>feel behind.</U>
          </Letters>
        </h1>
      </div>

      {/* convergence composition */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 438,
          width: pillW,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 3 stacked grey phrase pills */}
        {PHRASES.map((p, i) => (
          <div
            key={p}
            className="cc-drop"
            style={{
              width: pillW,
              marginBottom: 16,
              padding: "20px 30px",
              borderRadius: 16,
              background: GRAY,
              border: `1px solid ${LINE}`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 1px 0 rgba(255,255,255,0.7) inset",
              ["--d" as any]: `${0.5 + i * 0.12}s`,
            }}
          >
            <span
              style={{
                fontFamily: ui,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: "rgba(29,29,31,0.32)",
                width: 26,
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                fontFamily: ui,
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              {p}
            </span>
          </div>
        ))}

        {/* funnel — 3 BIG hand-drawn converging pencil strokes; draw AFTER pills land */}
        <div
          style={{
            position: "relative",
            width: pillW,
            height: funnelH,
            marginTop: 2,
            ["--pencil-delay" as any]: "1.15s",
            ["--pd" as any]: "0.7s",
          }}
        >
          <svg
            width={pillW}
            height={funnelH}
            viewBox={`0 0 ${pillW} ${funnelH}`}
            fill="none"
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
            aria-hidden
          >
            {/* left bows right, center wavers, right bows left — sketched funnel */}
            <Stroke startX={pillW * 0.16} bow={26} />
            <Stroke startX={pillW * 0.5} bow={-9} />
            <Stroke startX={pillW * 0.84} bow={-26} />

            {/* no arrowhead — just the 3 hand-drawn funnel lines converging */}
          </svg>
        </div>

        {/* single ink bar — the verdict the 3 rows collapse into.
            GROWS from its top edge (scaleY, origin top) as if the rows
            funneled into it; label + word fade in a beat after it settles. */}
        <div
          className="cc-grow"
          style={{
            width: pillW,
            marginTop: 8,
            padding: "26px 32px",
            borderRadius: 16,
            background: DARK,
            color: WHITE,
            display: "flex",
            alignItems: "center",
            gap: 18,
            boxShadow: "0 30px 70px -34px rgba(0,0,0,0.55)",
            ["--d" as any]: "1.7s",
          }}
        >
          <span
            className="cc-fade"
            style={{
              fontFamily: ui,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              flexShrink: 0,
              ["--d" as any]: "2.12s",
            }}
          >
            The real job
          </span>
          <span
            className="cc-fade"
            style={{
              width: 1,
              height: 30,
              background: "rgba(255,255,255,0.18)",
              flexShrink: 0,
              ["--d" as any]: "2.12s",
            }}
          />
          <span
            className="cc-fade"
            style={{
              fontFamily: ui,
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: WHITE,
              ["--d" as any]: "2.24s",
            }}
          >
            Keep you anxious.
          </span>
        </div>
      </div>
    </Slide>
  );
}
