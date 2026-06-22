import { Slide, Eyebrow, head, sub, ui, INK_D, U, Letters } from "./kit";

/* ANIMATION (play-then-freeze — the calm REFRAME breath; restraint over flash):
   1. Eyebrow + headline block rise in (cc-rise). "moving this fast." is white.
   2. "Nobody's ahead." rises a beat later; its WHITE pencil <U> draws in after it lands.
   3. THE VISUAL — a starting GRID: the bold START line draws top→bottom (~0.95s); the
      5 lanes (the open road AHEAD) draw out left→right, staggered; then a runner pops in
      on each lane, ALL on the start line (nobody is ahead); "DAY 1" marks the line.
   4. Bottom body line fades in last. Freeze.
   Frozen base = full lines + dots present (the .carcar-play scoping keeps stills static).
   Elements: headline, underline (draw), start line (draw), 5 lanes (draw), 5 runners
   (pop), Day 1 (fade-up), body. */

export default function Slide4() {
  return (
    <Slide n={4} tone="dark">
      <style>{`
        .carcar-play .s4-start{transform-origin:top center;animation:s4StartDraw .55s var(--eo) .95s both;}
        @keyframes s4StartDraw{from{transform:scaleY(0);}to{transform:scaleY(1);}}
        .carcar-play .s4-lane{transform-origin:left center;animation:s4LaneDraw .62s var(--eo) var(--d,1s) both;}
        @keyframes s4LaneDraw{from{transform:scaleX(0);opacity:0;}to{transform:scaleX(1);opacity:1;}}
        .carcar-play .s4-label{animation:s4LabelUp .6s var(--eo) var(--d,0s) both;}
        @keyframes s4LabelUp{from{opacity:0;transform:translate(-50%,8px);}to{opacity:1;transform:translate(-50%,0);}}
      `}</style>

      <div
        style={{
          position: "absolute",
          top: 128,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div className="cc-fade">
          <Eyebrow text="The reframe" dark />
        </div>
        <h1 style={{ ...head(80, true), padding: "0 96px" }}>
          <Letters start={0.12} step={0.018}>
            You can't be behind in something{" "}
            <span style={{ color: INK_D }}>moving this fast.</span>
          </Letters>
        </h1>
        <div
          style={{
            ...head(72, true),
            marginTop: 34,
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

      {/* the starting GRID — everyone lined up at the same start; the lanes (the
          road ahead) stretch out empty, so nobody is ahead. */}
      <div
        style={{
          position: "absolute",
          top: 612,
          left: "50%",
          transform: "translateX(-50%)",
          width: 720,
          height: 250,
        }}
      >
        {/* lanes — the open road ahead, fading into the distance (empty) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={"lane" + i}
            className="s4-lane"
            style={
              {
                position: "absolute",
                left: 74,
                top: 22 + i * 46,
                width: 626,
                height: 2,
                background:
                  "linear-gradient(to right, rgba(245,245,247,0.28), rgba(245,245,247,0))",
                transformOrigin: "left center",
                "--d": `${1.05 + i * 0.08}s`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* the START line — bold; everyone is AT it */}
        <div
          className="s4-start"
          style={{
            position: "absolute",
            left: 74,
            top: 8,
            width: 4,
            height: 212,
            background: "rgba(245,245,247,0.92)",
            borderRadius: 2,
            boxShadow: "0 0 16px 2px rgba(245,245,247,0.18)",
          }}
        />

        {/* runners — one per lane, ALL on the start line (nobody ahead) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={"run" + i}
            className="cc-pop"
            style={
              {
                position: "absolute",
                left: 68,
                top: 16 + i * 46,
                width: 16,
                height: 16,
                borderRadius: 999,
                background: "#fff",
                boxShadow: "0 0 0 4px rgba(245,245,247,0.10)",
                "--d": `${1.5 + i * 0.09}s`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* DAY 1 — marks the start line */}
        <div
          className="s4-label"
          style={
            {
              position: "absolute",
              left: 74,
              top: 238,
              transform: "translateX(-50%)",
              fontFamily: ui,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(245,245,247,0.6)",
              whiteSpace: "nowrap",
              "--d": "2.05s",
            } as React.CSSProperties
          }
        >
          Day 1
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <p
          className="cc-fade"
          style={{
            ...sub(28, true),
            padding: "0 160px",
            ["--d" as string]: "2.25s",
          }}
        >
          Everyone is standing at the same starting line.
        </p>
      </div>
    </Slide>
  );
}
