import { motion } from "framer-motion";
import {
  Slide,
  Eyebrow,
  head,
  ui,
  INK,
  MUTED,
  WHITE,
  DARK,
  LINE,
  U,
  Letters,
  useStill,
} from "./kit";

/* ANIMATION (framer cascade + kit cc-* draws; plays under .carcar-play, then freezes):
   The hype FEED that makes you feel behind, then the verdict it all funnels to.
   1. Eyebrow + the two heading lines roll in (Letters / cc-rise). "feel behind."'s
      pencil <U> draws after (--pencil-delay 1s).
   2. 3 notification cards DROP in from above with a framer spring, staggered — like
      hype notifications landing on a lock screen (icon + source tag + timestamp +
      the hype headline).
   3. THE BEAT — 3 hand-drawn funnel strokes DRAW in (cc-pencil-stroke, --pd 0.7s,
      --pencil-delay 1.25s) so the 3 rows visibly funnel to one mouth.
   4. The single dark ink bar (the verdict) GROWS in from its top edge (cc-grow,
      --d 1.8s); its label + word fade a beat later.
   FROZEN PATH (useStill): framer cards render at their final state (initial=false);
   the cc-* draws show their base (final) state off the .carcar-play root. */

const FEED = [
  { tag: "BREAKING", time: "now", text: "Claude killed your job." },
  { tag: "TRENDING", time: "2m", text: "A new repo changes everything." },
  { tag: "VIRAL", time: "5m", text: "This agent is insane." },
];

export default function Slide2() {
  const still = useStill();
  const pillW = 560;
  const funnelH = 116;
  const mouthX = pillW / 2;
  const mouthY = funnelH - 14;

  // hand-drawn (imperfect, wobbly) funnel stroke from a card edge to the mouth.
  const Stroke = ({ startX, bow }: { startX: number; bow: number }) => {
    const c1x = startX + (mouthX - startX) * 0.3 + bow;
    const c1y = funnelH * 0.34;
    const c2x = startX + (mouthX - startX) * 0.72 - bow * 0.6;
    const c2y = funnelH * 0.7;
    const d = `M${startX} 4 C ${c1x} ${c1y}, ${c2x} ${c2y}, ${mouthX} ${mouthY}`;
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

      {/* the hype feed → funnel → verdict */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 446,
          width: pillW,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 3 notification cards drop in from above (framer spring), staggered */}
        {FEED.map((c, i) => (
          <motion.div
            key={c.text}
            initial={still ? false : { y: -56, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              delay: 0.5 + i * 0.14,
              type: "spring",
              stiffness: 320,
              damping: 24,
            }}
            style={{
              width: pillW,
              marginBottom: 15,
              padding: "17px 22px",
              borderRadius: 18,
              background: WHITE,
              border: `1px solid ${LINE}`,
              boxShadow: "0 14px 34px -22px rgba(0,0,0,0.38)",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 13,
                background: INK,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: ui,
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "rgba(29,29,31,0.42)",
                  }}
                >
                  {c.tag}
                </span>
                <span
                  style={{
                    fontFamily: ui,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "rgba(29,29,31,0.3)",
                    marginLeft: "auto",
                  }}
                >
                  {c.time}
                </span>
              </div>
              <div
                style={{
                  fontFamily: ui,
                  fontSize: 27,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  color: INK,
                  marginTop: 3,
                }}
              >
                {c.text}
              </div>
            </div>
          </motion.div>
        ))}

        {/* funnel — 3 BIG hand-drawn converging pencil strokes; draw AFTER cards land */}
        <div
          style={{
            position: "relative",
            width: pillW,
            height: funnelH,
            marginTop: 2,
            ["--pencil-delay" as any]: "1.25s",
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
            <Stroke startX={pillW * 0.16} bow={26} />
            <Stroke startX={pillW * 0.5} bow={-9} />
            <Stroke startX={pillW * 0.84} bow={-26} />
          </svg>
        </div>

        {/* single ink bar — the verdict the 3 rows collapse into. */}
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
            ["--d" as any]: "1.8s",
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
              ["--d" as any]: "2.22s",
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
              ["--d" as any]: "2.22s",
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
              ["--d" as any]: "2.34s",
            }}
          >
            Keep you anxious.
          </span>
        </div>
      </div>
    </Slide>
  );
}
