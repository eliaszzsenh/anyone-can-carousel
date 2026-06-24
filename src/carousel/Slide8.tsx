import {
  Slide,
  Center,
  Eyebrow,
  head,
  sub,
  ui,
  INK,
  MUTED,
  WHITE,
  LINE,
  U,
  Letters,
  PencilCircle,
} from "./kit";

/* ANIMATION (for the render / play-then-freeze):
   1. Eyebrow + heading rise in (y+24, blur 8→0) over 0.6s, ease [0.16,1,0.3,1].
      The pencil underline under "simple" draws in left→right (stroke-dashoffset)
      at ~0.7s, 0.5s, like it's being hand-drawn.
   2. The ink "Comment SETUP" pill RISES in (y+40) at ~0.5s, then a gentle infinite
      pulse: box-shadow ring expands 0→26px and fades, scale 1↔1.03 (~2.6s loop).
   3. The hand-drawn arrow + "do this" scribble draw in at ~1.0s (stroke-dashoffset),
      pointing at the pill, as if annotated by hand.
   4. The "and I'll DM you..." line + the small secondary row fade/slide up at ~0.9s.
   Elements that animate: heading (rise), underline (draw), CTA pill (rise + pulse
   ring), hand arrow (draw), support lines.
   NOTE: "SETUP" is a placeholder keyword — swap for the final ManyChat trigger word. */

export default function Slide8() {
  return (
    <Slide n={8} tone="light" foot={false}>
      <Center pad={120}>
        {/* personal sign-off — circular photo, framed by a hand-drawn pencil
            circle that draws itself in (the "encadrement" around the cut-out). */}
        <div
          className="cc-float"
          style={
            {
              marginBottom: 34,
              "--fdelay": "3s",
              "--fdur": "4.6s",
            } as React.CSSProperties
          }
        >
          <div
            className="cc-pop"
            style={
              {
                position: "relative",
                width: 156,
                height: 156,
                // pops in after the headline rolls + around the CTA (not first, not
                // dead-last), then the pencil ring scribbles around it.
                "--d": "1.35s",
                "--pencil-delay": "1.8s",
              } as React.CSSProperties
            }
          >
            {/* PLACEHOLDER avatar — no real photo ships with the repo.
                To use YOUR face: drop a square photo at public/profile.jpg, then
                replace this whole <div> with:
                  <img src="/profile.jpg" alt="you" style={{ width:156, height:156,
                    borderRadius:"50%", objectFit:"cover", display:"block",
                    border:"1px solid rgba(0,0,0,0.08)" }} />
                Don't want a face at all? Delete this entire photo block. */}
            <div
              style={{
                width: 156,
                height: 156,
                borderRadius: "50%",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                overflow: "hidden",
                background: "#ececee",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <svg width="96" height="96" viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="8.5" r="4" fill="#b9b9bf" />
                <path
                  d="M3.5 22c0-4.7 3.8-8 8.5-8s8.5 3.3 8.5 8z"
                  fill="#b9b9bf"
                />
              </svg>
            </div>
            <PencilCircle color={INK} size={290} />
          </div>
        </div>
        <div className="cc-rise" style={{ "--d": "0s" } as React.CSSProperties}>
          <Eyebrow text="Want all of it?" />
        </div>

        <h1
          style={
            {
              ...head(92),
              maxWidth: 880,
              "--pencil-delay": "1.3s",
            } as React.CSSProperties
          }
        >
          <Letters start={0.22} step={0.024}>
            I make building with AI <U thickness={9}>simple.</U>
          </Letters>
        </h1>

        <p
          className="cc-rise"
          style={
            {
              ...sub(30),
              marginTop: 34,
              maxWidth: 680,
              "--d": "0.5s",
            } as React.CSSProperties
          }
        >
          My exact setup, the agent, the prompts, AND how I made this carousel.
        </p>

        {/* ── Comment-to-DM CTA (primary action) ── */}
        <div
          className="cc1-cta-rise"
          style={{
            position: "relative",
            marginTop: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          {/* pill + its right-side annotation, anchored to the pill's RIGHT EDGE
              (left:100%) so the arrow always sits in the open space beside the
              button and points back at it with a gap — never crossing under it. */}
          <div
            style={{
              position: "relative",
              display: "inline-flex",
            }}
          >
            <div
              className="cc1-cta-pulse"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                background: INK,
                color: WHITE,
                fontFamily: ui,
                fontSize: 34,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                padding: "26px 52px",
                borderRadius: 999,
              }}
            >
              Comment{" "}
              <span style={{ fontWeight: 700 }}>&ldquo;SETUP&rdquo;</span>
            </div>

            {/* "do this" + hand-drawn pencil arrow — smaller, nudged RIGHT of the
                centred pill with a clear gap (never behind it). Sequenced AFTER the
                pill: shaft draws → "do this" fades → arrowhead prongs draw. */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                marginLeft: 26,
                width: 250,
                height: 110,
                pointerEvents: "none",
                zIndex: 5,
              }}
            >
              <span
                className="cc-fade"
                style={
                  {
                    position: "absolute",
                    top: -2,
                    left: 132,
                    fontFamily: ui,
                    fontSize: 38,
                    fontWeight: 600,
                    color: INK,
                    transform: "rotate(4deg)",
                    whiteSpace: "nowrap",
                    "--d": "2.05s",
                  } as React.CSSProperties
                }
              >
                do this
              </span>
              <svg
                viewBox="0 0 250 110"
                fill="none"
                style={{ position: "absolute", inset: 0, overflow: "visible" }}
              >
                {/* wobbly pencil shaft: from under "do this" (right) curving
                    down-LEFT to a tip near the pill's right edge */}
                <path
                  className="cc-pencil-stroke"
                  pathLength={1}
                  style={{ ["--pencil-delay" as any]: "1.7s" }}
                  d="M120 40 C 86 34, 56 46, 34 54 C 26 57, 19 59, 14 60"
                  stroke={INK}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  className="cc-pencil-stroke-2"
                  pathLength={1}
                  style={{
                    ["--pencil-delay" as any]: "1.7s",
                    ["--so" as any]: 0.34,
                  }}
                  d="M122 46 C 90 40, 62 52, 40 59 C 30 62, 22 63, 17 63"
                  stroke={INK}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  opacity={0.34}
                />
                {/* arrowhead pointing LEFT at the pill (two curved prongs) — draws
                    AFTER the shaft, one prong then the other (like slide 3) */}
                <path
                  className="cc-pencil-stroke"
                  pathLength={1}
                  style={{ ["--pencil-delay" as any]: "2.2s" }}
                  d="M14 60 C 19 55, 23 52, 27 49"
                  stroke={INK}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
                <path
                  className="cc-pencil-stroke"
                  pathLength={1}
                  style={{ ["--pencil-delay" as any]: "2.3s" }}
                  d="M14 60 C 18 65, 21 69, 24 73"
                  stroke={INK}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <p style={{ ...sub(28), maxWidth: 640 }}>
            and I&rsquo;ll DM you my setup + how I built this reel, free.
          </p>
        </div>
      </Center>

      {/* secondary row: follow + tomorrow tease (small, replaces the standard Foot) */}
      <div
        className="cc1-sec-slide"
        style={{
          position: "absolute",
          bottom: 70,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          fontFamily: ui,
        }}
      >
        <span style={{ fontSize: 25, fontWeight: 600, color: INK }}>
          + follow for more
        </span>
        <span style={{ width: 1, height: 16, background: LINE }} />
        <span style={{ fontSize: 25, fontWeight: 500, color: MUTED }}>
          I share everything I build
        </span>
      </div>

      <style>{`
        /* All cc1-* entry animations are scoped under .carcar-play so the frozen
           (still) render — which has no .carcar-play root — shows each element's
           base/classless style, which IS its final state:
             • CTA wrapper: no inline opacity  → classless = visible
             • arrow paths: dasharray only set inside cc1-arrow-* rules → classless
               = no dasharray = fully drawn
             • secondary row: no inline opacity → classless = visible
           The infinite pulse is also gated so the still doesn't catch it mid-scale. */
        .carcar-play .cc1-cta-rise { animation: cc1Rise 0.85s cubic-bezier(0.16,1,0.3,1) 1.05s both; }
        @keyframes cc1Rise { from { opacity: 0; transform: translateY(24px); filter: blur(7px); } 55% { filter: blur(.4px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        /* pulse only starts once everything has settled (~2.9s), so the entry reads clean */
        .carcar-play .cc1-cta-pulse { animation: cc1Pulse 2.8s ease-in-out 2.9s infinite; }
        @keyframes cc1Pulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(29,29,31,0.0); }
          50%      { transform: scale(1.03); box-shadow: 0 0 0 26px rgba(29,29,31,0.0), 0 0 0 0 rgba(29,29,31,0.18); }
        }
        /* the do-this arrow uses the kit's cc-pencil-stroke draw (same as slide 3),
           sequenced: shaft at 1.7s, "do this" at 2.05s, arrowhead prongs at 2.2/2.3s. */
        .carcar-play .cc1-sec-slide { animation: cc1Slide 0.7s cubic-bezier(0.16,1,0.3,1) 2.6s both; }
        @keyframes cc1Slide { from { opacity: 0; transform: translateY(18px); filter: blur(5px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @media (prefers-reduced-motion: reduce) {
          .carcar-play .cc1-cta-rise, .carcar-play .cc1-cta-pulse, .carcar-play .cc1-sec-slide { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </Slide>
  );
}
