import { useState } from "react";
import { motion } from "framer-motion";
import { Slide, Eyebrow, head, ui, INK_D, U, Letters, useStill } from "./kit";

/* ANIMATION (play-then-freeze — the REFRAME as a casino lock):
   1. Eyebrow + headline roll in (Letters). "Nobody's ahead." rises; its WHITE
      pencil <U> draws after it lands.
   2. THE VISUAL — a STANDINGS card. Each rank is a SLOT-MACHINE reel: digits blur
      past fast in 3D, decelerate, and LOCK on 1 — one row after another, each with
      a bloom flash. Every rank lands on 1: a tie, Day 1, nobody ahead.
   FROZEN (useStill): each reel shows 1, settled — the final tie. */

const ROWS = [
  { name: "You", you: true },
  { name: "The “experts”", you: false },
  { name: "Everyone else", you: false },
];

const RH = 56; // reel cell height
const SPIN = 26; // how many digits blur past before locking

function genStrip(): number[] {
  const arr = [1]; // index 0 = the lock value
  for (let k = 0; k < SPIN; k++) arr.push(((Math.random() * 9) | 0) + 1);
  return arr;
}

const numStyle: React.CSSProperties = {
  height: RH,
  lineHeight: `${RH}px`,
  width: 54,
  textAlign: "center",
  fontFamily: ui,
  fontSize: 46,
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: "#fff",
  fontVariantNumeric: "tabular-nums",
};

function SlotReel({ delay }: { delay: number }) {
  const still = useStill();
  const [cells] = useState(genStrip);
  if (still) return <div style={numStyle}>1</div>;
  const total = (cells.length - 1) * RH; // strip travel: last cell → cell 0 ("1")
  return (
    <div
      style={{
        position: "relative",
        width: 54,
        height: RH,
        // a touch of 3D so the reel reads like a real wheel
        transform: "perspective(900px) rotateX(8deg)",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: RH,
          width: 54,
          overflow: "hidden",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 32%, #000 68%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 32%, #000 68%, transparent 100%)",
        }}
      >
        <motion.div
          initial={{ y: -total, filter: "blur(0px)" }}
          animate={{
            y: 0,
            filter: ["blur(0px)", "blur(11px)", "blur(11px)", "blur(0px)"],
          }}
          transition={{
            y: { delay, duration: 1.7, ease: [0.08, 0.85, 0.12, 1] },
            filter: { delay, duration: 1.7, times: [0, 0.12, 0.78, 1] },
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            willChange: "transform, filter",
          }}
        >
          {cells.map((d, i) => (
            <div key={i} style={numStyle}>
              {d}
            </div>
          ))}
        </motion.div>
      </div>
      {/* bloom flash behind the digit as it locks */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0, 0.9, 0], scale: [0.5, 0.5, 1.5, 2.2] }}
        transition={{ delay: delay + 1.42, duration: 0.85, times: [0, 0.25, 0.5, 1] }}
        style={{
          position: "absolute",
          inset: -12,
          zIndex: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.6), rgba(255,255,255,0))",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function Slide4() {
  return (
    <Slide n={4} tone="dark">
      <div
        style={{
          position: "absolute",
          top: 122,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div className="cc-fade">
          <Eyebrow text="The reframe" dark />
        </div>
        <h1 style={{ ...head(78, true), padding: "0 100px" }}>
          <Letters start={0.12} step={0.018}>
            You can't be behind in something{" "}
            <span style={{ color: INK_D }}>moving this fast.</span>
          </Letters>
        </h1>
        <div
          style={{
            ...head(70, true),
            marginTop: 30,
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

      {/* the standings card — every reel locks on rank 1 */}
      <div
        className="cc-float"
        style={
          {
            position: "absolute",
            top: 522,
            left: "50%",
            marginLeft: -360,
            width: 720,
            "--fdelay": "4s",
            "--fdur": "5.6s",
          } as React.CSSProperties
        }
      >
        <div
          className="cc-fade"
          style={
            {
              ["--d" as string]: "0.7s",
              background: "rgba(245,245,247,0.05)",
              border: "1px solid rgba(245,245,247,0.13)",
              borderRadius: 30,
              padding: "30px 34px 34px",
              boxShadow: "0 40px 90px -50px rgba(0,0,0,0.8)",
            } as React.CSSProperties
          }
        >
          {/* header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 22,
            }}
          >
            <span
              style={{
                fontFamily: ui,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(245,245,247,0.42)",
              }}
            >
              Standings
            </span>
            <span
              style={{
                fontFamily: ui,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: "rgba(245,245,247,0.7)",
              }}
            >
              Day 1
            </span>
          </div>

          {/* rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ROWS.map((r, i) => (
              <div
                key={r.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "12px 16px",
                  borderRadius: 18,
                  background: r.you ? "rgba(245,245,247,0.10)" : "transparent",
                  border: r.you
                    ? "1px solid rgba(245,245,247,0.16)"
                    : "1px solid transparent",
                }}
              >
                <SlotReel delay={1.5 + i * 0.45} />
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 999,
                    flexShrink: 0,
                    background: r.you ? "#fff" : "rgba(245,245,247,0.10)",
                    border: r.you ? "none" : "2px solid rgba(245,245,247,0.45)",
                  }}
                />
                <span
                  style={{
                    fontFamily: ui,
                    fontSize: 32,
                    fontWeight: r.you ? 600 : 500,
                    letterSpacing: "-0.02em",
                    color: r.you ? "#fff" : "rgba(245,245,247,0.66)",
                  }}
                >
                  {r.name}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: ui,
                    fontSize: 19,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: "rgba(245,245,247,0.34)",
                  }}
                >
                  tied
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}
