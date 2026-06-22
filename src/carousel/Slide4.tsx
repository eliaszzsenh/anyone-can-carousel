import { motion } from "framer-motion";
import {
  Slide,
  Eyebrow,
  head,
  sub,
  ui,
  INK_D,
  U,
  Letters,
  useStill,
} from "./kit";

/* ANIMATION (play-then-freeze — the REFRAME, one giant number):
   1. Eyebrow + the thesis line roll in (Letters).
   2. THE HERO — a huge "Day 1" arrives (scale + focus-pull blur), its pencil
      underline draws in. It's the whole field's number.
   3. A single row of avatars settles in under it — everyone, you among them, all on
      the same day. Caption lands last.
   FROZEN (useStill): "Day 1" + underline + the row, settled. */

const FIELD = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const YOU = 5;

export default function Slide4() {
  const still = useStill();
  return (
    <Slide n={4} tone="dark">
      {/* thesis */}
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div className="cc-fade">
          <Eyebrow text="The reframe" dark />
        </div>
        <h1
          style={{
            ...head(50, true),
            fontWeight: 500,
            color: "rgba(245,245,247,0.82)",
            padding: "0 150px",
          }}
        >
          <Letters start={0.12} step={0.018}>
            You can't be behind in something moving this fast.
          </Letters>
        </h1>
      </div>

      {/* the hero number */}
      <div
        className="cc-float"
        style={
          {
            position: "absolute",
            top: 372,
            left: 0,
            right: 0,
            textAlign: "center",
            ["--fdelay" as string]: "3s",
            ["--fdur" as string]: "6s",
            ["--pencil-delay" as string]: "2.4s",
          } as React.CSSProperties
        }
      >
        {/* soft glow behind the number */}
        <motion.div
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            position: "absolute",
            left: "50%",
            top: "52%",
            width: 760,
            height: 420,
            transform: "translate(-50%,-50%)",
            background:
              "radial-gradient(closest-side, rgba(245,245,247,0.10), rgba(245,245,247,0))",
            pointerEvents: "none",
          }}
        />
        <motion.div
          initial={still ? false : { opacity: 0, scale: 0.74, filter: "blur(16px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 1.5, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block" }}
        >
          <span
            style={{
              fontFamily: ui,
              fontSize: 270,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 0.9,
              color: "#fff",
            }}
          >
            Day <U color="#fff" thickness={14}>1</U>
          </span>
        </motion.div>
      </div>

      {/* the field — everyone, on the same day; one is you */}
      <div
        style={{
          position: "absolute",
          top: 736,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
        }}
      >
        {FIELD.map((i) => {
          const you = i === YOU;
          return (
            <div key={i} style={{ position: "relative" }}>
              {you && (
                <motion.div
                  initial={still ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.1, duration: 0.5 }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "calc(100% + 12px)",
                    transform: "translateX(-50%)",
                    fontFamily: ui,
                    fontSize: 17,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#fff",
                  }}
                >
                  you
                </motion.div>
              )}
              <motion.div
                initial={still ? false : { opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 2.5 + i * 0.05,
                  duration: 0.45,
                  ease: [0.34, 1.4, 0.64, 1],
                }}
                style={{
                  width: you ? 30 : 22,
                  height: you ? 30 : 22,
                  borderRadius: 999,
                  background: you ? "#fff" : "rgba(245,245,247,0.16)",
                  border: you ? "none" : "2px solid rgba(245,245,247,0.55)",
                  boxShadow: you ? "0 0 0 7px rgba(245,245,247,0.10)" : "none",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* caption */}
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
            {
              ...sub(30, true),
              color: INK_D,
              ["--d" as string]: "3.2s",
            } as React.CSSProperties
          }
        >
          Nobody's ahead. Even the experts started today.
        </p>
      </div>
    </Slide>
  );
}
