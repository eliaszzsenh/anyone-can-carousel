import {
  Slide,
  Center,
  Eyebrow,
  head,
  sub,
  INK,
  ui,
  U,
  Letters,
  PencilCircle,
} from "./kit";

/* ANIMATION (play-then-freeze; built on the kit's cc-* + cc-pencil-stroke system) —
   the FINALE of the value arc, choreographed as one confident hand:
   1. ~0.00s  Eyebrow + headline RISE in (cc-rise). Then the pencil <U> under
              "simple." draws itself left→right (--pencil-delay 0.55s on the head wrap).
   2. ~0.95s  The hand-drawn pencil CIRCLE draws (PencilCircle, --pencil-delay on its
              wrapper) — the looping "yes" gesture lands first.
   3. ~1.55s  The CHECKMARK draws INSIDE the circle (cc-pencil-stroke on the raw
              <path>, --pencil-delay on its svg) — circle, then check = a decisive tick.
   4. ~1.95s  "Anyone can. Including" FADES up (cc-fade) — the setup line.
   5. ~2.30s  CRESCENDO — the oversized "you" POPS in (cc-pop, slight overshoot; the
              span has no transform of its own so the scale is safe). It gets a clear
              beat alone before its mark lands.
   6. ~2.62s  The extreme hand underline SWEEPS in under "you": the bold path
              (cc-pencil-stroke) then the lighter doubled pass (cc-pencil-stroke-2),
              left→right, the down-stroke trailing off the line last — the final
              flourish. Freeze on the fully drawn "you" + underline. (~2.9s total.)
   Elements that animate: headline (cc-rise), "simple" <U> (draw), circle (draw),
   checkmark (draw), subline (cc-fade), "you" (cc-pop), "you" underline (draw). */

export default function Slide7() {
  return (
    <Slide n={7} tone="light">
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 0,
          right: 0,
          textAlign: "center",
          // "simple." underline draws right after the headline rolls in
          ["--pencil-delay" as any]: "0.85s",
        }}
      >
        <div className="cc-fade">
          <Eyebrow text="The takeaway" />
        </div>
        <h1 style={{ ...head(86), padding: "0 110px" }}>
          <Letters start={0.12} step={0.024}>
            Building with AI is <U thickness={9}>simple.</U>
          </Letters>
        </h1>
      </div>

      <Center>
        <div
          style={{
            marginTop: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* hand-drawn pencil circle + checkmark (mono ink, on-brand).
              Sequence: the PencilCircle loops in first (--pencil-delay on this
              wrapper drives its strokes), then the checkmark ticks inside it. */}
          <div
            className="cc-float"
            style={{
              position: "relative",
              width: 210,
              height: 210,
              // the circle gesture lands first
              ["--pencil-delay" as any]: "0.95s",
              ["--fdelay" as any]: "2.2s",
              ["--fdur" as any]: "4.8s",
            }}
          >
            <svg
              width="210"
              height="210"
              viewBox="0 0 156 156"
              fill="none"
              style={{
                position: "absolute",
                inset: 0,
                // the tick draws AFTER the circle closes — a decisive "yes"
                ["--pencil-delay" as any]: "1.55s",
              }}
            >
              <path
                className="cc-pencil-stroke"
                pathLength={1}
                d="M52 80 L72 102 L108 54"
                stroke={INK}
                strokeWidth={4.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <PencilCircle color={INK} size={210} />
          </div>

          {/* emphasis line — "you" is oversized + extreme hand-drawn underline.
              Setup line fades up, then the word pops as the crescendo. */}
          <div
            className="cc-fade"
            style={{
              marginTop: 96,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 0,
              ...sub(40),
              color: INK,
              fontWeight: 500,
              flexWrap: "wrap",
              ["--d" as any]: "1.95s",
            }}
          >
            <span>Anyone can. Including&nbsp;</span>
            {/* the word pointed straight at the viewer — POPS in (no own transform,
                so cc-pop's scale is safe), then its underline sweeps in last */}
            <span
              className="cc-pop"
              style={{
                position: "relative",
                display: "inline-block",
                fontFamily: ui,
                fontSize: 132,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                color: INK,
                marginLeft: 6,
                // beat alone after the subline, then the underline trails right behind
                ["--d" as any]: "2.30s",
                ["--pencil-delay" as any]: "2.62s",
              }}
            >
              {/* refined underline (the /soulignage #2 style), scaled by the
                  big "you" — draws in last as the crescendo */}
              <U thickness={10}>you</U>
            </span>
            {/* the period punches in after "you" lands — matches slide 5's "one." */}
            <span
              className="cc-pop"
              style={{
                display: "inline-block",
                fontFamily: ui,
                fontSize: 132,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                color: INK,
                ["--d" as any]: "3.0s",
              }}
            >
              .
            </span>
          </div>
        </div>
      </Center>
    </Slide>
  );
}
