import { motion } from "framer-motion";
import { Slide, Eyebrow, head, sub, ui, INK_D, U, Letters, useStill } from "./kit";

/* ANIMATION (play-then-freeze — minimal, a calm breather):
   1. Eyebrow + headline roll in (Letters). "Nobody's ahead." rises; pencil <U> draws.
   2. THE VISUAL — one thin line (the road). Everyone is a small dot BUNCHED at the
      very start; the whole road ahead is empty. You're one of the dots. The line
      draws in, the dots settle, a faint "now" sits at the start. That's it.
   FROZEN (useStill): line drawn, dots settled at the start. */

// a tight cluster of dots at the start — everyone, together, at zero
const CLUSTER: { x: number; y: number; you?: boolean }[] = [
  { x: 0, y: 0, you: true },
  { x: 24, y: -10 },
  { x: -22, y: -6 },
  { x: 14, y: 16 },
  { x: -16, y: 14 },
  { x: 30, y: 12 },
];

export default function Slide4() {
  const still = useStill();
  const CW = 760; // composition width
  const lineY = 120; // baseline inside the composition
  const startX = 132; // where everyone is bunched

  return (
    <Slide n={4} tone="dark">
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div className="cc-fade">
          <Eyebrow text="The reframe" dark />
        </div>
        <h1 style={{ ...head(80, true), padding: "0 100px" }}>
          <Letters start={0.12} step={0.018}>
            You can't be behind in something{" "}
            <span style={{ color: INK_D }}>moving this fast.</span>
          </Letters>
        </h1>
        <div
          style={{
            ...head(72, true),
            marginTop: 32,
            ["--pencil-delay" as string]: "1.15s",
          }}
        >
          <Letters start={0.6} step={0.03}>
            <U color="#fff" thickness={8}>
              Nobody's ahead.
            </U>
          </Letters>
        </div>
      </div>

      {/* the road — one line, everyone bunched at the start, the rest empty */}
      <div
        className="cc-float"
        style={
          {
            position: "absolute",
            top: 600,
            left: "50%",
            marginLeft: -CW / 2,
            width: CW,
            height: 240,
            ["--fdelay" as string]: "2.6s",
            ["--fdur" as string]: "6s",
          } as React.CSSProperties
        }
      >
        {/* the line (draws left → right) */}
        <motion.div
          initial={still ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.6, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: 20,
            top: lineY,
            width: CW - 40,
            height: 2,
            transformOrigin: "left center",
            background:
              "linear-gradient(to right, rgba(245,245,247,0.5) 0%, rgba(245,245,247,0.5) 12%, rgba(245,245,247,0.06) 60%, rgba(245,245,247,0) 100%)",
          }}
        />

        {/* "start" tick at the bunch */}
        <motion.div
          initial={still ? false : { opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 1.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: startX - 1,
            top: lineY - 58,
            width: 2,
            height: 116,
            background: "rgba(245,245,247,0.85)",
          }}
        />

        {/* the dots — everyone, bunched at the start; one is you */}
        {CLUSTER.map((d, i) => (
          <motion.div
            key={i}
            initial={still ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 2.0 + i * 0.07,
              duration: 0.5,
              ease: [0.34, 1.4, 0.64, 1],
            }}
            style={{
              position: "absolute",
              left: startX + d.x - (d.you ? 13 : 9),
              top: lineY + d.y - (d.you ? 13 : 9),
              width: d.you ? 26 : 18,
              height: d.you ? 26 : 18,
              borderRadius: 999,
              background: d.you ? "#fff" : "rgba(245,245,247,0.14)",
              border: d.you ? "none" : "2px solid rgba(245,245,247,0.6)",
              boxShadow: d.you ? "0 0 0 6px rgba(245,245,247,0.10)" : "none",
            }}
          />
        ))}

        {/* "you" label under the bunch */}
        <motion.div
          initial={still ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: startX,
            top: lineY + 52,
            transform: "translateX(-50%)",
            fontFamily: ui,
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          you
        </motion.div>

        {/* the empty road ahead — a faint marker at the far end */}
        <motion.div
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.7, duration: 0.6 }}
          style={{
            position: "absolute",
            right: 18,
            top: lineY - 16,
            fontFamily: ui,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(245,245,247,0.3)",
          }}
        >
          the rest →
        </motion.div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <p
          className="cc-fade"
          style={
            { ...sub(28, true), ["--d" as string]: "2.8s" } as React.CSSProperties
          }
        >
          Everyone started today.
        </p>
      </div>
    </Slide>
  );
}
