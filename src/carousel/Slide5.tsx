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
  GRAY,
  LINE,
  U,
  Letters,
  PencilCircle,
  EASE,
  useStill,
  useCarcarPlay,
} from "./kit";

/* ANIMATION (play-then-freeze; total entry ≈ 2.6s then FREEZE):
   This is the PAYOFF slide of the value arc, so the ONE square earns a bigger
   moment than slide 3's cluster. Order:
   1. Eyebrow + headline rise (cc-rise). "50 tools." is muted. The oversized
      "one" gets its own beat — wrapped in a plain inline-block that cc-pop's in
      (overshoot), and its thick <U> underline DRAWS right after via
      {"--pencil-delay"} on the heading block.
   2. SquareField (JS child, WAAPI, gated on useStill): the 50 squares WAVE in on
      a diagonal stagger (scale .4→1 + opacity, ~.85s, pop ease), then ONE soft
      shimmer/twinkle pass (~.4s, faint brightness lift) so the field feels alive.
   3. RESOLVE: the 49 non-chosen squares settle to faint (opacity→.55) while the
      ONE ink square holds and SCALES UP confidently (1→1 with an overshoot to
      ~1.14 then settle to 1 — the payoff beat), giving it more emphasis.
   4. THEN the two stacked PencilCircle loops draw around the one square
      ({"--pencil-delay"} on their overlay wrapper, ~1.95s) reading as a hand
      scribbling a circle ~2–3 times around it.
   5. The "one." label + its hand-drawn connector tick fade/rise in LAST
      (cc-fade / cc-rise-sm, ~2.25s).
   FROZEN PATH (useStill): SquareField renders every square at its FINAL state
   immediately (49 faint, 1 solid ink, full size) — no WAAPI, no flash. Pencil
   marks render solid (the kit's draw CSS is absent off the .carcar-play root).
   Final frozen state is IDENTICAL to the original design. */

const COLS = 10;
const ROWS = 5;
const TOTAL = COLS * ROWS;
const CELL = 56; // square size
const GAP = 18;
const CHOSEN = 24; // index of the one solid square (row 2, col 4) — near centre

// choreography timing (seconds) — referenced by both the JS field + pencil delays
const WAVE_START = 0.55; // squares begin waving in after the heading lands
const WAVE_STEP = 0.022; // per-diagonal stagger
const WAVE_DUR = 0.5; // each square's pop-in duration
const RESOLVE_AT = 1.35; // when the 49 fade to faint + the ONE scales up
const PENCIL_AT = 1.95; // when the hand-circle starts drawing (after the one settles)
const LABEL_AT = 2.25; // when the "one." label + connector arrive

function SquareField() {
  const still = useStill();
  const play = useCarcarPlay();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (still || !play) return; // frozen, or not yet on-screen — no motion
    const root = ref.current;
    if (!root) return;
    const cells = Array.from(root.querySelectorAll<HTMLElement>("[data-sq]"));

    // focus-pull: the field comes INTO focus as it lands (motion-blur feel)
    root.animate([{ filter: "blur(11px)" }, { filter: "blur(0px)" }], {
      duration: 820,
      easing: EASE.out,
      fill: "both",
    });

    cells.forEach((el) => {
      const i = Number(el.dataset.sq);
      const isOne = i === CHOSEN;
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      // diagonal stagger: top-left first, bottom-right last
      const delay = WAVE_START + (col + row) * WAVE_STEP;

      // 1) WAVE IN — pop from small + transparent to full size.
      el.animate(
        [
          { opacity: 0, transform: "scale(0.4)", offset: 0 },
          { opacity: 1, transform: "scale(1.06)", offset: 0.7 },
          { opacity: 1, transform: "scale(1)", offset: 1 },
        ],
        {
          duration: WAVE_DUR * 1000,
          delay: delay * 1000,
          easing: EASE.pop,
          fill: "forwards",
        },
      );

      // 2) SHIMMER — a single soft twinkle pass across the whole field, right
      //    after the wave lands. A gentle brightness lift, diagonal sweep.
      const shimmerAt = WAVE_START + 0.55 + (col + row) * 0.012;
      el.animate(
        [
          { filter: "brightness(1)", offset: 0 },
          { filter: "brightness(1.35)", offset: 0.5 },
          { filter: "brightness(1)", offset: 1 },
        ],
        {
          duration: 420,
          delay: shimmerAt * 1000,
          easing: "ease-in-out",
          fill: "none",
        },
      );

      // 3) RESOLVE — the 49 fade to faint; the ONE holds + scales up confidently.
      const inner = el.querySelector<HTMLElement>("[data-box]");
      if (isOne) {
        // the payoff beat: overshoot then settle, a touch more than a cluster.
        inner?.animate(
          [
            { transform: "scale(1)", offset: 0 },
            { transform: "scale(1.16)", offset: 0.5 },
            { transform: "scale(1)", offset: 1 },
          ],
          {
            duration: 620,
            delay: RESOLVE_AT * 1000,
            easing: EASE.pop,
            fill: "forwards",
          },
        );
      } else {
        // settle from the bright wave-in (opacity ~1) down to the faint rest state.
        el.animate([{ opacity: 1 }, { opacity: 0.55 }], {
          duration: 600,
          delay: RESOLVE_AT * 1000,
          easing: EASE.out,
          fill: "forwards",
        });
      }
    });
  }, [still, play]);

  const gridW = COLS * CELL + (COLS - 1) * GAP;
  const chosenCol = CHOSEN % COLS;
  const chosenRow = Math.floor(CHOSEN / COLS);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: "50%",
        top: 470,
        transform: "translateX(-50%)",
        width: gridW,
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
        gap: GAP,
      }}
    >
      {Array.from({ length: TOTAL }).map((_, i) => {
        const isOne = i === CHOSEN;
        // ANTI-FLASH: when playing, non-chosen squares start hidden+small and the
        // WAAPI wave reveals them; when still, they render at their FINAL state.
        // (The chosen square's outer wrapper still fades in with the wave so it
        // doesn't pop alone; its inner box owns the resolve scale.)
        const hiddenStart = !still;
        return (
          <div
            key={i}
            data-sq={i}
            style={{
              position: "relative",
              width: CELL,
              height: CELL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // start state for the WAAPI wave (overwritten by fill:forwards)
              opacity: hiddenStart ? 0 : isOne ? 1 : 0.55,
              transform: hiddenStart ? "scale(0.4)" : "none",
            }}
          >
            {isOne ? (
              /* solid, slightly larger square — the ONE tool that matters.
                 (The hand-circle is rendered as a top overlay AFTER the grid so
                 it paints ON TOP of the neighbouring squares, not behind them.) */
              <div
                data-box
                style={{
                  width: CELL + 8,
                  height: CELL + 8,
                  borderRadius: 12,
                  background: INK,
                  boxShadow: "0 18px 40px -18px rgba(0,0,0,0.45)",
                }}
              />
            ) : (
              <div
                data-box
                style={{
                  width: CELL,
                  height: CELL,
                  borderRadius: 10,
                  background: GRAY,
                  border: `1px solid ${LINE}`,
                  // opacity lives on the outer wrapper (animated); keep box solid
                }}
              />
            )}
          </div>
        );
      })}

      {/* "one." label beside the hand-circled square — sketchy connector.
          fades/rises in LAST. Wrapped so cc-* doesn't fight the own transform:
          the positioned wrapper holds translateY(-50%); the cc-fade rides on an
          inner plain div. */}
      <div
        style={{
          position: "absolute",
          left: chosenCol * (CELL + GAP) + CELL + 56,
          top: chosenRow * (CELL + GAP) + CELL / 2,
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          className="cc-fade"
          style={{ "--d": `${LABEL_AT}s` } as React.CSSProperties}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* hand-drawn connector tick (wobbly, not a perfect 1px rule) */}
            <svg
              width="38"
              height="16"
              viewBox="0 0 38 16"
              aria-hidden
              style={{ overflow: "visible", flexShrink: 0 }}
            >
              <path
                className="cc-pencil-stroke"
                pathLength={1}
                d="M2 9 C 12 5, 22 12, 36 7"
                fill="none"
                stroke={INK}
                strokeWidth={3}
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontFamily: ui,
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              one.
            </span>
          </div>
        </div>
      </div>

      {/* HAND-CIRCLED overlay — rendered LAST + z-indexed so the two scribble
          loops paint ON TOP of every neighbouring square. Centered on the black
          square's center. The PencilCircle loops draw themselves in; we delay
          the draw to ~1.95s (after the one square settles) via --pencil-delay on
          this ancestor. The own rotate transforms stay on plain divs (the cc-*
          draw lives inside the SVG paths, never on these wrappers). */}
      <div
        style={
          {
            position: "absolute",
            left: chosenCol * (CELL + GAP) + CELL / 2,
            top: chosenRow * (CELL + GAP) + CELL / 2,
            width: 0,
            height: 0,
            zIndex: 5,
            pointerEvents: "none",
            "--pencil-delay": `${PENCIL_AT}s`,
          } as React.CSSProperties
        }
      >
        <div style={{ transform: "rotate(-7deg)" }}>
          <PencilCircle color={INK} size={208} />
        </div>
        <div style={{ transform: "rotate(9deg)" }}>
          <PencilCircle color={INK} size={238} />
        </div>
      </div>
    </div>
  );
}

export default function Slide5() {
  return (
    <Slide n={5} tone="light">
      <div
        style={
          {
            position: "absolute",
            top: 128,
            left: 0,
            right: 0,
            textAlign: "center",
            // the "one" underline draws right after the emphasis line pops in
            "--pencil-delay": "1.25s",
          } as React.CSSProperties
        }
      >
        <div className="cc-fade">
          <Eyebrow text="The trap" />
        </div>
        <h1
          style={{
            ...head(88),
            padding: "0 90px",
          }}
        >
          <Letters start={0.12} step={0.022}>
            You don't need <span style={{ color: MUTED }}>50 tools.</span>
          </Letters>
        </h1>
        <h1
          style={{
            ...head(88),
            padding: "0 90px",
            marginTop: 6,
            lineHeight: 1.0,
          }}
        >
          <Letters start={0.5} step={0.03}>
            You need
          </Letters>{" "}
          {/* the oversized "one" gets its own beat — plain inline-block wrapper
              owns the cc-pop (the <U> word itself is position:relative for the
              underline, so we DON'T put cc-pop directly on it). */}
          <span
            className="cc-pop"
            style={
              {
                display: "inline-block",
                "--d": "0.92s",
              } as React.CSSProperties
            }
          >
            <span
              style={{
                fontSize: 132,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
              }}
            >
              <U thickness={13}>one</U>
            </span>
          </span>
          {/* the period punches in AFTER "one" has popped + settled */}
          <span
            className="cc-pop"
            style={
              { display: "inline-block", "--d": "1.5s" } as React.CSSProperties
            }
          >
            .
          </span>
        </h1>
      </div>

      {/* the 50-square field (JS-choreographed child; frozen → final state) */}
      <SquareField />

      {/* body line */}
      <Center pad={120}>
        <div
          className="cc-rise-sm"
          style={
            {
              position: "absolute",
              bottom: 132,
              left: 0,
              right: 0,
              textAlign: "center",
              "--d": "2.4s",
            } as React.CSSProperties
          }
        >
          <p style={{ ...sub(34), padding: "0 120px" }}>
            And the patience to actually use it.
          </p>
        </div>
      </Center>
    </Slide>
  );
}
