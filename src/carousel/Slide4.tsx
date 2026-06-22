import { motion } from "framer-motion";
import { Slide, Eyebrow, head, sub, ui, INK_D, U, Letters, useStill } from "./kit";

/* ANIMATION (play-then-freeze — minimal + legible):
   1. Eyebrow + headline roll in (Letters). "Nobody's ahead." rises; pencil <U> draws.
   2. THE VISUAL — three labelled progress tracks (You / The experts / Everyone). Each
      track is empty and every marker sits at the SAME point: zero. A faint vertical
      line links the three markers so you SEE they're level. The road ahead is empty.
   FROZEN (useStill): tracks drawn, all three markers at the start. */

const ROWS = [
  { name: "You", you: true },
  { name: "The “experts”", you: false },
  { name: "Everyone else", you: false },
];

const LABEL_W = 250; // right-aligned label column
const TRACK_X = 286; // where every marker sits (the start)
const TRACK_W = 470; // empty road to the right
const ROW_GAP = 78;

export default function Slide4() {
  const still = useStill();
  const CW = TRACK_X + TRACK_W + 10;
  const rowY = (i: number) => 28 + i * ROW_GAP;

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

      {/* three tracks — every marker stuck at zero, level with each other */}
      <div
        className="cc-float"
        style={
          {
            position: "absolute",
            top: 556,
            left: "50%",
            marginLeft: -CW / 2,
            width: CW,
            height: ROW_GAP * 2 + 56,
            ["--fdelay" as string]: "2.6s",
            ["--fdur" as string]: "6s",
          } as React.CSSProperties
        }
      >
        {/* "0%" header above the start */}
        <motion.div
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          style={{
            position: "absolute",
            left: TRACK_X,
            top: -2,
            transform: "translate(-50%, -100%)",
            fontFamily: ui,
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "rgba(245,245,247,0.45)",
          }}
        >
          DAY 1
        </motion.div>

        {/* faint vertical line linking the three markers — proves they're level */}
        <motion.div
          initial={still ? false : { opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 2.4, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: TRACK_X - 1,
            top: rowY(0) - 14,
            width: 2,
            height: rowY(2) - rowY(0) + 28,
            transformOrigin: "top center",
            background: "rgba(245,245,247,0.28)",
          }}
        />

        {ROWS.map((r, i) => (
          <div key={r.name}>
            {/* label */}
            <motion.div
              initial={still ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                left: 0,
                top: rowY(i),
                width: LABEL_W,
                transform: "translateY(-50%)",
                textAlign: "right",
                fontFamily: ui,
                fontSize: 30,
                fontWeight: r.you ? 600 : 500,
                letterSpacing: "-0.01em",
                color: r.you ? "#fff" : "rgba(245,245,247,0.62)",
              }}
            >
              {r.name}
            </motion.div>

            {/* empty track */}
            <motion.div
              initial={still ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.7 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                left: TRACK_X,
                top: rowY(i),
                width: TRACK_W,
                height: 4,
                borderRadius: 999,
                transformOrigin: "left center",
                transform: "translateY(-50%)",
                background:
                  "linear-gradient(to right, rgba(245,245,247,0.16) 0%, rgba(245,245,247,0.05) 55%, rgba(245,245,247,0) 100%)",
              }}
            />

            {/* the marker — at zero */}
            <motion.div
              initial={still ? false : { opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.1 + i * 0.12, duration: 0.5, ease: [0.34, 1.4, 0.64, 1] }}
              style={{
                position: "absolute",
                left: TRACK_X - (r.you ? 14 : 10),
                top: rowY(i) - (r.you ? 14 : 10),
                width: r.you ? 28 : 20,
                height: r.you ? 28 : 20,
                borderRadius: 999,
                background: r.you ? "#fff" : "rgba(245,245,247,0.14)",
                border: r.you ? "none" : "2px solid rgba(245,245,247,0.6)",
                boxShadow: r.you ? "0 0 0 7px rgba(245,245,247,0.10)" : "none",
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 116,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <p
          className="cc-fade"
          style={
            { ...sub(28, true), ["--d" as string]: "2.9s" } as React.CSSProperties
          }
        >
          Even the experts are starting from zero.
        </p>
      </div>
    </Slide>
  );
}
