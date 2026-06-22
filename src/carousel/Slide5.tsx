import { motion } from "framer-motion";
import {
  Slide,
  Eyebrow,
  head,
  sub,
  INK,
  MUTED,
  LINE,
  WHITE,
  U,
  Letters,
  PencilCircle,
  useStill,
} from "./kit";

/* ANIMATION (play-then-freeze; total entry ≈ 2.8s then FREEZE):
   The PAYOFF of the value arc — and DELIBERATELY not a grid (slide 3 owns the
   grid). The metaphor is convergence: a scattered clutter of mismatched "tools"
   collapses into the ONE.
   1. Eyebrow fades; headline rolls in per-letter (Letters). "50 tools." is muted.
      "You need" rolls, then the oversized "one" POPS (cc-pop) and its thick <U>
      underline draws (--pencil-delay on the heading block).
   2. ToolConverge (framer): ~11 tool tiles fade in SCATTERED + tilted, hold a beat
      (the clutter), then all sweep INTO the centre and vanish (the "50" collapsing).
   3. As they merge, the ONE solid ink tile springs up at the centre.
   4. The hand-drawn PencilCircle scribbles around it (--pencil-delay ~2.1s).
   5. The bottom body line rises in last (cc-rise-sm).
   FROZEN PATH (useStill): ToolConverge renders ONLY the final state — the one ink
   tile + the circle — no scattered tiles, no motion. */

const TILE = 104;
const ONE = 150;

// scattered "tools": varied offsets + tilts around the centre. They all converge.
const SCATTER: { x: number; y: number; r: number }[] = [
  { x: -316, y: -96, r: -12 },
  { x: 306, y: -120, r: 10 },
  { x: -252, y: 84, r: 7 },
  { x: 268, y: 104, r: -8 },
  { x: -128, y: -176, r: -6 },
  { x: 152, y: -182, r: 8 },
  { x: -12, y: 182, r: -5 },
  { x: -332, y: 8, r: 6 },
  { x: 324, y: 4, r: -7 },
  { x: 150, y: 180, r: 9 },
  { x: -182, y: 168, r: -9 },
];

// a small set of monochrome line-glyphs so the tiles read as DIFFERENT tools.
function Glyph({ i }: { i: number }) {
  const c = {
    fill: "none",
    stroke: "#9a9aa1",
    strokeWidth: 5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const g = i % 6;
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden>
      {g === 0 && <circle cx="23" cy="23" r="13" {...c} />}
      {g === 1 && <rect x="11" y="11" width="24" height="24" rx="6" {...c} />}
      {g === 2 && <path d="M23 9 L37 35 L9 35 Z" {...c} />}
      {g === 3 && (
        <>
          <line x1="12" y1="17" x2="34" y2="17" {...c} />
          <line x1="12" y1="29" x2="27" y2="29" {...c} />
        </>
      )}
      {g === 4 && (
        <>
          <line x1="23" y1="11" x2="23" y2="35" {...c} />
          <line x1="11" y1="23" x2="35" y2="23" {...c} />
        </>
      )}
      {g === 5 && (
        <>
          <circle cx="18" cy="18" r="5" {...c} />
          <circle cx="30" cy="30" r="5" {...c} />
          <line x1="22" y1="22" x2="26" y2="26" {...c} />
        </>
      )}
    </svg>
  );
}

const oneTile = (
  <div
    style={{
      width: ONE,
      height: ONE,
      borderRadius: 34,
      background: INK,
      boxShadow: "0 30px 60px -26px rgba(0,0,0,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width="66" height="66" viewBox="0 0 46 46" aria-hidden>
      <path
        d="M13 24 l7 7 l13 -17"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const tileBase: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: TILE,
  height: TILE,
  marginLeft: -TILE / 2,
  marginTop: -TILE / 2,
  borderRadius: 24,
  background: WHITE,
  border: `1px solid ${LINE}`,
  boxShadow: "0 18px 40px -22px rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function ToolConverge() {
  const still = useStill();

  const center: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: ONE,
    height: ONE,
    marginLeft: -ONE / 2,
    marginTop: -ONE / 2,
  };

  if (still) {
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 430,
          height: 460,
        }}
      >
        <div style={center}>{oneTile}</div>
        <div style={{ position: "absolute", left: "50%", top: "50%" }}>
          <PencilCircle color={INK} size={300} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={
        {
          position: "absolute",
          left: 0,
          right: 0,
          top: 430,
          height: 460,
          ["--pencil-delay" as string]: "2.1s",
        } as React.CSSProperties
      }
    >
      {SCATTER.map((p, i) => (
        <motion.div
          key={i}
          style={tileBase}
          initial={{ x: p.x, y: p.y, rotate: p.r, opacity: 0, scale: 0.6 }}
          animate={{
            x: [p.x, p.x, p.x, 0],
            y: [p.y, p.y, p.y, 0],
            rotate: [p.r, p.r, p.r, 0],
            opacity: [0, 1, 1, 0],
            scale: [0.6, 1, 1, 0.3],
          }}
          transition={{
            duration: 1.7,
            delay: 0.5 + i * 0.04,
            times: [0, 0.16, 0.5, 1],
            ease: "easeInOut",
          }}
        >
          <Glyph i={i} />
        </motion.div>
      ))}

      <motion.div
        style={center}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 1.75,
          type: "spring",
          stiffness: 210,
          damping: 16,
        }}
      >
        {oneTile}
      </motion.div>

      <div style={{ position: "absolute", left: "50%", top: "50%" }}>
        <PencilCircle color={INK} size={300} />
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
        <h1 style={{ ...head(88), padding: "0 90px" }}>
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
          <span
            className="cc-pop"
            style={
              { display: "inline-block", "--d": "0.92s" } as React.CSSProperties
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

      {/* the convergence visual (framer child; frozen → final one-tile + circle) */}
      <ToolConverge />

      {/* body line */}
      <div
        className="cc-rise-sm"
        style={
          {
            position: "absolute",
            bottom: 120,
            left: 0,
            right: 0,
            textAlign: "center",
            "--d": "2.7s",
          } as React.CSSProperties
        }
      >
        <p style={{ ...sub(34), padding: "0 120px" }}>
          And the patience to actually use it.
        </p>
      </div>
    </Slide>
  );
}
