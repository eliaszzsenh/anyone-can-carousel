import { useState } from "react";
import { motion } from "framer-motion";
import {
  Slide,
  Eyebrow,
  head,
  sub,
  ui,
  INK,
  INK_D,
  U,
  Letters,
  useStill,
} from "./kit";

/* ANIMATION (play-then-freeze — the REFRAME as a slot machine):
   1. Eyebrow + headline roll in (Letters). "Nobody's ahead." rises; pencil <U> draws.
   2. THE VISUAL — a monochrome SLOT MACHINE (the slide's hero). The lever pulls
      down, the 3 reels blur-spin and lock one by one on 1 · 1 · 1, and the marquee
      bulbs flash JACKPOT. The "win" everyone chases is a tie: every pull is day one.
   FROZEN (useStill): lever up, reels showing 1·1·1, bulbs lit — the settled win. */

const WH = 134; // reel window height
const SPIN = 22; // digits that blur past before the reel locks

function genStrip(): number[] {
  const a = [1]; // index 0 = the lock value
  for (let k = 0; k < SPIN; k++) a.push(((Math.random() * 9) | 0) + 1);
  return a;
}

const reelNum: React.CSSProperties = {
  height: WH,
  lineHeight: `${WH}px`,
  textAlign: "center",
  fontFamily: ui,
  fontSize: 96,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: INK,
  fontVariantNumeric: "tabular-nums",
};

function Reel({ delay, w }: { delay: number; w: number }) {
  const still = useStill();
  const [cells] = useState(genStrip);
  const total = (cells.length - 1) * WH;
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: WH,
        borderRadius: 14,
        background: "linear-gradient(180deg, #fff, #ededf0)",
        overflow: "hidden",
        boxShadow:
          "inset 0 3px 10px rgba(0,0,0,0.22), inset 0 -3px 8px rgba(0,0,0,0.10)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)",
        }}
      >
        {still ? (
          <div style={reelNum}>1</div>
        ) : (
          <motion.div
            initial={{ y: -total, filter: "blur(0px)" }}
            animate={{
              y: 0,
              filter: ["blur(0px)", "blur(13px)", "blur(13px)", "blur(0px)"],
            }}
            transition={{
              y: { delay, duration: 1.9, ease: [0.06, 0.85, 0.12, 1] },
              filter: { delay, duration: 1.9, times: [0, 0.1, 0.8, 1] },
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              willChange: "transform, filter",
            }}
          >
            {cells.map((d, i) => (
              <div key={i} style={reelNum}>
                {d}
              </div>
            ))}
          </motion.div>
        )}
      </div>
      {/* cylinder shading — fakes the curve of a real reel drum (FOV) so the
          digits darken/recede toward the top + bottom edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.10) 26%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.10) 74%, rgba(0,0,0,0.62) 100%)",
        }}
      />
      {/* payline — a brighter band across the centre line, seen through glass */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          height: WH * 0.46,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.4), rgba(255,255,255,0))",
          mixBlendMode: "overlay",
        }}
      />
      {/* the GLASS in front of the reel — a diagonal gloss + edge highlights */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          pointerEvents: "none",
          background:
            "linear-gradient(122deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.12) 18%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 88%, rgba(255,255,255,0.14) 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
        }}
      />
    </div>
  );
}

function SlotMachine() {
  const still = useStill();
  const CW = 452; // cabinet width
  const bulbs = Array.from({ length: 9 });
  return (
    <div style={{ position: "relative", width: CW + 64 }}>
      {/* win glow behind the cabinet (blooms when the reels lock) */}
      <div
        className="slot-glow"
        style={{
          position: "absolute",
          inset: -40,
          borderRadius: 60,
          background:
            "radial-gradient(closest-side, rgba(245,245,247,0.18), rgba(245,245,247,0))",
          pointerEvents: "none",
        }}
      />

      {/* the lever — yanks DOWN fast (velocity + motion blur), holds, springs back,
          triggering the spin */}
      <motion.div
        initial={false}
        animate={
          still
            ? {}
            : {
                y: [0, 64, 64, 0],
                filter: [
                  "blur(0px)",
                  "blur(8px)",
                  "blur(1px)",
                  "blur(7px)",
                  "blur(0px)",
                ],
              }
        }
        transition={{
          delay: 0.55,
          y: {
            duration: 1.0,
            times: [0, 0.14, 0.45, 0.85],
            ease: [0.4, 0, 0.12, 1],
          },
          filter: { duration: 1.0, times: [0, 0.1, 0.28, 0.62, 0.88] },
        }}
        style={{
          position: "absolute",
          right: 0,
          top: 96,
          width: 56,
          height: 210,
          zIndex: 1,
          willChange: "transform, filter",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 34,
            left: 22,
            width: 12,
            height: 150,
            borderRadius: 7,
            background: "linear-gradient(90deg, #6f6f74, #d6d6da, #6f6f74)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 6,
            width: 44,
            height: 44,
            borderRadius: 999,
            background:
              "radial-gradient(circle at 34% 30%, #ffffff, #9a9aa0 70%, #6c6c70)",
            boxShadow: "0 8px 18px rgba(0,0,0,0.5)",
          }}
        />
      </motion.div>

      {/* cabinet */}
      <div
        style={{
          position: "relative",
          width: CW,
          borderRadius: "150px 150px 30px 30px",
          background: "linear-gradient(180deg, #2c2c31 0%, #161618 100%)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow:
            "0 50px 110px -46px rgba(0,0,0,0.9), inset 0 2px 0 rgba(255,255,255,0.07)",
          padding: "30px 30px 28px",
        }}
      >
        {/* marquee: bulbs + JACKPOT */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginBottom: 14,
            }}
          >
            {bulbs.map((_, i) => (
              <div
                key={i}
                className="slot-bulb"
                style={
                  {
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    background: "#fff",
                    boxShadow: "0 0 12px 3px rgba(255,255,255,0.55)",
                    ["--bd" as string]: `${i * 0.07}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <div
            style={{
              fontFamily: ui,
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: "0.06em",
              color: "#fff",
              textShadow: "0 0 22px rgba(255,255,255,0.35)",
            }}
          >
            DAY ONE
          </div>
        </div>

        {/* reel bay — recessed panel holding the 3 reels */}
        <div
          style={{
            position: "relative",
            borderRadius: 22,
            background: "linear-gradient(180deg, #0e0e0f, #1a1a1c)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "inset 0 6px 20px rgba(0,0,0,0.6)",
            padding: 18,
            display: "flex",
            gap: 14,
            justifyContent: "center",
          }}
        >
          <Reel delay={1.0} w={118} />
          <Reel delay={1.4} w={118} />
          <Reel delay={1.8} w={118} />
        </div>

        {/* base: coin slot + two buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 26,
            marginTop: 24,
          }}
        >
          <div
            style={{
              width: 96,
              height: 12,
              borderRadius: 7,
              background: "#0c0c0d",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8)",
            }}
          />
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                background:
                  "radial-gradient(circle at 34% 30%, #e9e9ec, #86868b)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Slide4() {
  return (
    <Slide n={4} tone="dark">
      <style>{`
        .carcar-play .slot-bulb{animation:slotBulb 0.7s ease-in-out infinite;animation-delay:calc(3.7s + var(--bd,0s));}
        @keyframes slotBulb{0%,100%{opacity:0.3;}50%{opacity:1;}}
        .carcar-play .slot-glow{opacity:0;animation:slotGlow 1.1s ease-out 3.5s forwards;}
        @keyframes slotGlow{from{opacity:0;}to{opacity:1;}}
      `}</style>

      <div
        style={{
          position: "absolute",
          top: 88,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div className="cc-fade">
          <Eyebrow text="The reframe" dark />
        </div>
        <h1 style={{ ...head(62, true), padding: "0 120px" }}>
          <Letters start={0.12} step={0.018}>
            You can't be behind in something{" "}
            <span style={{ color: INK_D }}>moving this fast.</span>
          </Letters>
        </h1>
        <div
          style={{
            ...head(56, true),
            marginTop: 22,
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

      {/* the slot machine — the hero */}
      <div
        className="cc-float"
        style={
          {
            position: "absolute",
            top: 486,
            left: "50%",
            marginLeft: -258,
            ["--fdelay" as string]: "4s",
            ["--fdur" as string]: "5.6s",
          } as React.CSSProperties
        }
      >
        <div
          className="cc-fade"
          style={{ ["--d" as string]: "0.6s" } as React.CSSProperties}
        >
          <SlotMachine />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 96,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <p
          className="cc-fade"
          style={
            {
              ...sub(27, true),
              ["--d" as string]: "3.4s",
            } as React.CSSProperties
          }
        >
          Every pull lands on day one. For everyone.
        </p>
      </div>
    </Slide>
  );
}
