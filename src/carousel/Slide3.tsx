import { useEffect, useRef } from "react";
import {
  Slide,
  Center,
  Eyebrow,
  head,
  sub,
  ui,
  INK,
  MUTED,
  LINE,
  U,
  Letters,
  PencilCircle,
  useStill,
  useCarcarPlay,
} from "./kit";

/* ANIMATION (play-then-freeze). Total entry ≈ 2.6s, then freezes on the
   current design exactly. The 100 squares are owned by the <GridField> child
   below, driven by the Web Animations API (gated on useStill()).

   1. Heading group rises (cc-rise); the "noise" pencil <U> underline draws
      itself in right after it lands (--pencil-delay 0.5s); body line cc-fade.
   2. WAVE-IN (~0.9s): the 100 squares ripple in from the top-left diagonal,
      staggered by (row+col) distance — scale 0.4→1 + opacity 0→1. Every square
      starts as faint noise; the 10 KEEP squares come in solid ink.
   3. SHIMMER (~0.5s): one soft pass sweeps the field — a tiny per-square
      scale 1→1.06→1 + opacity flicker, staggered by (row+col), so the pixels
      feel alive for a beat. Subtle, single pass, not chaotic.
   4. NOISE SETTLE (~0.7s, ends ~1.9s): the 90 non-cluster squares ease down to
      faint (opacity → 0.16); the 10 KEEP squares hold solid ink and do a
      confident tiny scale-up (1→1.12→1). The 10% emerges from the noise.
   5. PencilCircle (data-circle) hand-draws around the cluster right after the
      settle (--pencil-delay 1.9s).
   6. Callout "the 10% that matters": its raw arrow <path>s scrawl in
      (cc-pencil-stroke, --pencil-delay 2.2s) and the text cc-fades — last.

   Animated: heading group + noise underline, the GridField (wave / shimmer /
   settle, via WAAPI), pencil circle (draw), callout arrow (draw) + text. */

const COLS = 10;
const ROWS = 10;
const TOTAL = COLS * ROWS;
const CELL = 36;
const GAP = 10;
const PITCH = CELL + GAP;

// the 10 squares that "matter" — a tight, deliberate cluster (not random)
const KEEP = new Set([23, 24, 33, 34, 35, 43, 44, 45, 54, 55]);

const GRID_W = COLS * CELL + (COLS - 1) * GAP;

// geometric center of the KEEP cluster (cols ~3-5, rows ~2-5), in grid px.
// avg col ≈ 3.7, avg row ≈ 3.5 → center of those cells.
const CLUSTER_CX = 3.7 * PITCH + CELL / 2; // ~188px from grid left
const CLUSTER_CY = 3.5 * PITCH + CELL / 2; // ~179px from grid top

export default function Slide3() {
  return (
    <Slide n={3} tone="light">
      <div
        style={{
          position: "absolute",
          top: 116,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div className="cc-fade" style={{ "--d": "0s" } as React.CSSProperties}>
          <Eyebrow text="The truth" />
        </div>
        {/* heading rolls in per-letter, then "noise." underline draws after it lands */}
        <div
          style={
            { ["--pencil-delay" as string]: "0.85s" } as React.CSSProperties
          }
        >
          <h1 style={{ ...head(88), padding: "0 90px" }}>
            <Letters start={0.12} step={0.024}>
              Most of it is <U>noise.</U>
            </Letters>
          </h1>
        </div>
        <div
          className="cc-fade"
          style={{ "--d": "0.4s" } as React.CSSProperties}
        >
          <p style={{ ...sub(30), margin: "26px auto 0", maxWidth: 720 }}>
            You don't need 90% of what scrolls past you.
          </p>
        </div>
      </div>

      <Center pad={0}>
        <div style={{ position: "relative", marginTop: 188 }}>
          <GridField />

          {/* hand-drawn pencil circle around the ink cluster — someone circling
              the 10% that actually matters. Box is centered on the cluster so
              PencilCircle (centers on its parent) lands exactly on it. The
              circle draws in right after the noise settles. */}
          <div
            data-circle
            style={
              {
                position: "absolute",
                top: CLUSTER_CY,
                left: CLUSTER_CX,
                width: 0,
                height: 0,
                "--pencil-delay": "1.9s",
              } as React.CSSProperties
            }
          >
            <PencilCircle color={INK} size={340} />
          </div>

          {/* hand-annotated callout: a sketchy pencil arrow scrawled from the
              circle out to the margin label. */}
          <div
            data-callout
            style={
              {
                position: "absolute",
                top: CLUSTER_CY - 168,
                left: CLUSTER_CX + 150,
                display: "flex",
                alignItems: "flex-start",
                gap: 4,
                whiteSpace: "nowrap",
                "--pencil-delay": "2.2s",
              } as React.CSSProperties
            }
          >
            <svg
              width="132"
              height="104"
              viewBox="0 0 132 104"
              aria-hidden
              style={{ overflow: "visible", flexShrink: 0 }}
            >
              {/* wobbly pencil shaft (down-left toward the circle) + faint 2nd pass.
                  Each scrawls itself in via stroke-dashoffset (cc-pencil-stroke). */}
              <path
                className="cc-pencil-stroke"
                pathLength={1}
                d="M124 9 C 100 8, 76 19, 58 35 C 42 49, 28 64, 18 84"
                fill="none"
                stroke={INK}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="cc-pencil-stroke-2"
                pathLength={1}
                d="M120 14 C 98 14, 78 24, 60 40 C 46 53, 33 67, 23 85"
                fill="none"
                stroke={INK}
                strokeWidth={2.4}
                strokeLinecap="round"
                opacity={0.34}
              />
              {/* hand-drawn arrowhead — two prongs that splay symmetrically AROUND
                  the incoming shaft so the shaft passes BETWEEN them (neither prong
                  lies on top of the shaft line). Lower-right prong + upper-left prong. */}
              <path
                className="cc-pencil-stroke"
                pathLength={1}
                style={{ "--pencil-delay": "2.5s" } as React.CSSProperties}
                d="M18 84 C 29 80, 38 78, 46 74"
                fill="none"
                stroke={INK}
                strokeWidth={5}
                strokeLinecap="round"
              />
              <path
                className="cc-pencil-stroke"
                pathLength={1}
                style={{ "--pencil-delay": "2.5s" } as React.CSSProperties}
                d="M18 84 C 16 74, 17 64, 22 55"
                fill="none"
                stroke={INK}
                strokeWidth={5}
                strokeLinecap="round"
              />
            </svg>
            {/* text fades in with the arrow (wrapper carries cc-fade so the
                inner span keeps its own rotate transform). */}
            <div
              className="cc-fade"
              style={{ "--d": "2.3s" } as React.CSSProperties}
            >
              <span
                style={{
                  fontFamily: ui,
                  fontSize: 33,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.12,
                  color: INK,
                  display: "inline-block",
                  transform: "rotate(-3deg)",
                  transformOrigin: "left center",
                  marginTop: -6,
                }}
              >
                the 10% that
                <br />
                <span style={{ paddingLeft: 24 }}>matters</span>
              </span>
            </div>
          </div>
        </div>
      </Center>
    </Slide>
  );
}

// ── The 100 living pixels ─────────────────────────────────────────────────────
// Owns the grid and its WAAPI choreography (wave → shimmer → settle). Gated on
// useStill(): on a frozen/still render it paints the FINAL state immediately
// (90 faint noise + 10 solid ink) with zero animation and no flash. On the live
// page it paints the HIDDEN initial state (opacity 0, scale 0.4) then drives the
// squares with element.animate(...), so there is never a 1-frame flash of the
// final field before the wave starts. <Slide> remounts children on scroll-in, so
// the effect re-runs and the whole sequence auto-replays.
function GridField() {
  const still = useStill();
  const play = useCarcarPlay();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (still || !play) return; // frozen, or not yet on-screen — no motion
    const root = gridRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-square]"));

    // phase timing (ms)
    const WAVE_SPREAD = 620; // diagonal stagger window for the wave-in
    const WAVE_DUR = 460;
    const KEEP_POP_AT = 1180; // the cluster "emerges" right after the wave lands
    const KEEP_POP_DUR = 620;

    const EASE_OUT = "cubic-bezier(.16,1,.3,1)";
    const EASE_POP = "cubic-bezier(.34,1.56,.64,1)";

    const animations: Animation[] = [];

    // focus-pull: the whole field comes IN of focus as it lands (motion-blur feel)
    animations.push(
      root.animate([{ filter: "blur(11px)" }, { filter: "blur(0px)" }], {
        duration: 880,
        easing: EASE_OUT,
        fill: "both",
      }),
    );

    els.forEach((el) => {
      const keep = el.dataset.keep === "1";
      const r = Number(el.dataset.row);
      const c = Number(el.dataset.col);
      const t = (r + c) / (ROWS - 1 + (COLS - 1)); // 0..1 diagonal distance
      const finalOpacity = keep ? 1 : 0.16;

      // WAVE IN: ripple from the top-left diagonal, scale 0.4→1, fading straight
      // to each square's FINAL opacity — noise comes in already faint, the 10
      // KEEP squares come in solid ink. No "everything flashes full grey" moment.
      animations.push(
        el.animate(
          [
            { opacity: 0, transform: "scale(0.4)" },
            { opacity: finalOpacity, transform: "scale(1)" },
          ],
          {
            duration: WAVE_DUR,
            delay: t * WAVE_SPREAD,
            easing: EASE_OUT,
            fill: "both",
          },
        ),
      );

      // KEEP EMPHASIS: once the field has landed, the 10 cluster squares do a
      // confident little scale-pop so the 10% visibly emerges from the noise.
      if (keep) {
        animations.push(
          el.animate(
            [
              { transform: "scale(1)", offset: 0 },
              { transform: "scale(1.14)", offset: 0.5 },
              { transform: "scale(1)", offset: 1 },
            ],
            {
              duration: KEEP_POP_DUR,
              delay: KEEP_POP_AT,
              easing: EASE_POP,
              fill: "both",
            },
          ),
        );
      }
    });

    return () => {
      for (const a of animations) a.cancel();
    };
  }, [still, play]);

  return (
    <div
      ref={gridRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
        gridAutoRows: `${CELL}px`,
        gap: GAP,
      }}
    >
      {Array.from({ length: TOTAL }).map((_, i) => {
        const keep = KEEP.has(i);
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        return (
          <div
            key={i}
            data-square
            data-row={row}
            data-col={col}
            data-keep={keep ? "1" : undefined}
            data-noise={keep ? undefined : "1"}
            style={{
              width: CELL,
              height: CELL,
              borderRadius: 6,
              background: keep ? INK : MUTED,
              border: keep ? "none" : `1px solid ${LINE}`,
              // FINAL state when still (no flash); HIDDEN initial state when the
              // page will animate (WAAPI takes over on the next frame).
              opacity: still ? (keep ? 1 : 0.16) : 0,
              transform: still ? "none" : "scale(0.4)",
              willChange: still ? undefined : "opacity, transform",
            }}
          />
        );
      })}
    </div>
  );
}
