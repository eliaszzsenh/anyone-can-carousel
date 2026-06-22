import { Slide, Eyebrow, head, sub, ui, INK_D, U, Letters } from "./kit";

/* ANIMATION (play-then-freeze — the calm REFRAME breath):
   1. Eyebrow + headline roll in (Letters). "Nobody's ahead." rises a beat later;
      its WHITE pencil <U> draws after it lands.
   2. THE VISUAL — a race START: the bold start line draws top→bottom (~0.95s); the
      5 lanes (the open road AHEAD) draw out left→right, staggered, then begin to
      FLOW (dashed road markings stream rightward forever — time moving, but you're
      still at the line). 5 runner avatars pop onto the start line, ALL level; ONE
      is YOU. "DAY 1" marks the line. The whole grid idles with a slow float.
   3. Bottom body line fades in last. Freeze.
   Frozen base = full lines + avatars present (.carcar-play scoping keeps stills
   static; the flow/float only run live). */

const LANES = [0, 1, 2, 3, 4];
const YOU = 2;

export default function Slide4() {
  return (
    <Slide n={4} tone="dark">
      <style>{`
        .carcar-play .s4-start{transform-origin:top center;animation:s4StartDraw .55s var(--eo) .95s both;}
        @keyframes s4StartDraw{from{transform:scaleY(0);}to{transform:scaleY(1);}}
        .carcar-play .s4-lane{transform-origin:left center;animation:s4LaneDraw .62s var(--eo) var(--d,1s) both, s4Flow 1.1s linear 1.9s infinite;}
        @keyframes s4LaneDraw{from{transform:scaleX(0);opacity:0;}to{transform:scaleX(1);opacity:1;}}
        @keyframes s4Flow{from{background-position:0 0;}to{background-position:40px 0;}}
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

      {/* the starting line — everyone level; the road ahead flows on, empty */}
      <div
        className="cc-float"
        style={
          {
            position: "absolute",
            top: 600,
            left: "50%",
            marginLeft: -360,
            width: 720,
            height: 250,
            "--fdelay": "2.6s",
            "--fdur": "5.5s",
          } as React.CSSProperties
        }
      >
        {/* lanes — dashed road markings that draw in then FLOW right, fading away */}
        {LANES.map((i) => (
          <div
            key={"lane" + i}
            className="s4-lane"
            style={
              {
                position: "absolute",
                left: 78,
                top: 22 + i * 46,
                width: 618,
                height: 3,
                background:
                  "repeating-linear-gradient(to right, rgba(245,245,247,0.6) 0 14px, rgba(245,245,247,0) 14px 40px)",
                WebkitMaskImage:
                  "linear-gradient(to right, #000 0%, #000 24%, transparent 100%)",
                maskImage:
                  "linear-gradient(to right, #000 0%, #000 24%, transparent 100%)",
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
            background: "rgba(245,245,247,0.95)",
            borderRadius: 2,
            boxShadow: "0 0 18px 3px rgba(245,245,247,0.22)",
          }}
        />

        {/* runners — one per lane, ALL on the start line; one is YOU */}
        {LANES.map((i) => {
          const you = i === YOU;
          const sz = you ? 30 : 19;
          return (
            <div
              key={"run" + i}
              className="cc-pop"
              style={
                {
                  position: "absolute",
                  left: 74 - sz / 2,
                  top: 23 + i * 46 - sz / 2,
                  width: sz,
                  height: sz,
                  borderRadius: 999,
                  background: you ? "#fff" : "rgba(245,245,247,0.12)",
                  border: you ? "none" : "2px solid rgba(245,245,247,0.72)",
                  boxShadow: you
                    ? "0 0 0 7px rgba(245,245,247,0.14), 0 8px 20px rgba(0,0,0,0.45)"
                    : "none",
                  "--d": `${1.5 + i * 0.09}s`,
                } as React.CSSProperties
              }
            />
          );
        })}

        {/* "you" tag above the highlighted runner */}
        <div
          className="s4-label"
          style={
            {
              position: "absolute",
              left: 74,
              top: 23 + YOU * 46 - 44,
              transform: "translateX(-50%)",
              fontFamily: ui,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#fff",
              whiteSpace: "nowrap",
              "--d": "2.1s",
            } as React.CSSProperties
          }
        >
          you
        </div>

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
              "--d": "2.2s",
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
            ["--d" as string]: "2.4s",
          }}
        >
          Everyone is standing at the same starting line.
        </p>
      </div>
    </Slide>
  );
}
