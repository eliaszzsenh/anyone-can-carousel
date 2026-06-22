import { motion } from "framer-motion";
import { Slide, Eyebrow, head, ui, INK_D, U, Letters, useStill } from "./kit";

/* ANIMATION (play-then-freeze — the REFRAME, made tangible):
   1. Eyebrow + headline roll in (Letters). "Nobody's ahead." rises; its WHITE
      pencil <U> draws after it lands.
   2. THE VISUAL — a STANDINGS card. The rows fade up; the rank numbers come in as
      a normal ladder (1, 2, 3) and then ROLL — every rank flips to 1. The board
      everyone fears doesn't exist: it's a tie, Day 1, nobody ahead.
   FROZEN (useStill): every rank shows 1, rows settled — the final tie. */

const ROWS = [
  { name: "You", from: 2, you: true },
  { name: "The “experts”", from: 1, you: false },
  { name: "Everyone else", from: 3, you: false },
];

const RH = 52; // rank roll cell height

function RankRoll({ from, delay }: { from: number; delay: number }) {
  const still = useStill();
  const num: React.CSSProperties = {
    height: RH,
    lineHeight: `${RH}px`,
    fontFamily: ui,
    fontSize: 42,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    color: "#fff",
    textAlign: "center",
    fontVariantNumeric: "tabular-nums",
  };
  if (still || from === 1) return <div style={{ ...num, width: 40 }}>1</div>;
  return (
    <div style={{ height: RH, width: 40, overflow: "hidden" }}>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: -RH }}
        transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={num}>{from}</div>
        <div style={num}>1</div>
      </motion.div>
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

      {/* the standings card — everyone ranks 1 */}
      <div
        className="cc-float"
        style={
          {
            position: "absolute",
            top: 522,
            left: "50%",
            marginLeft: -360,
            width: 720,
            "--fdelay": "2.6s",
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
                <RankRoll from={r.from} delay={1.55 + i * 0.12} />
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 999,
                    flexShrink: 0,
                    background: r.you ? "#fff" : "rgba(245,245,247,0.10)",
                    border: r.you
                      ? "none"
                      : "2px solid rgba(245,245,247,0.45)",
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
