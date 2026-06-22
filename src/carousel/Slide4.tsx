import { Slide, Eyebrow, head, sub, ui, INK_D, U, Letters } from "./kit";

/* ANIMATION (play-then-freeze — the calm REFRAME):
   1. Eyebrow + headline roll in (Letters). "Nobody's ahead." rises a beat later;
      its WHITE pencil <U> draws after it lands.
   2. THE VISUAL — ONE idea, not a busy diagram: a "how caught up you are" meter.
      The fill climbs toward "caught up", then SNAPS back to zero (a new thing
      dropped) and climbs again, forever. The leading marker (you) rides it and
      gets reset every cycle. You never reach 100, so nobody pulls ahead.
   3. Bottom line fades in last. Freeze.
   FROZEN (useStill): the fill rests at a partial width (the .carcar-play scoping
   stops the loop), reading as "in progress, never done". */

export default function Slide4() {
  return (
    <Slide n={4} tone="dark">
      <style>{`
        .carcar-play .s4-fill{animation:s4Fill 4.2s cubic-bezier(.5,0,.2,1) 1.5s infinite;}
        @keyframes s4Fill{0%{width:6%}60%{width:84%}67%{width:84%}71%{width:6%}100%{width:6%}}
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

      {/* the "caught up" meter — fills, then resets to zero forever */}
      <div
        className="cc-float"
        style={
          {
            position: "absolute",
            top: 648,
            left: "50%",
            marginLeft: -330,
            width: 660,
            "--fdelay": "2.4s",
            "--fdur": "5.6s",
          } as React.CSSProperties
        }
      >
        <div
          className="cc-fade"
          style={{ ["--d" as string]: "0.7s" } as React.CSSProperties}
        >
          {/* label row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 18,
            }}
          >
            <span
              style={{
                ...sub(27, true),
                color: "rgba(245,245,247,0.9)",
                fontWeight: 600,
              }}
            >
              How caught up you are
            </span>
            <span
              style={{
                fontFamily: ui,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: "rgba(245,245,247,0.5)",
              }}
            >
              resets daily ↺
            </span>
          </div>

          {/* track + fill + leading marker (you) */}
          <div
            style={{
              position: "relative",
              width: 660,
              height: 28,
              borderRadius: 999,
              background: "rgba(245,245,247,0.10)",
              border: "1px solid rgba(245,245,247,0.18)",
            }}
          >
            <div
              className="s4-fill"
              style={{
                position: "absolute",
                left: 0,
                top: -1,
                bottom: -1,
                width: "42%",
                borderRadius: 999,
                background: "#fff",
                boxShadow: "0 0 20px 2px rgba(245,245,247,0.28)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -7,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: "#fff",
                  boxShadow:
                    "0 0 0 7px rgba(245,245,247,0.14), 0 6px 16px rgba(0,0,0,0.45)",
                }}
              />
            </div>
          </div>

          {/* scale ends */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 14,
              fontFamily: ui,
              fontSize: 19,
              fontWeight: 600,
              color: "rgba(245,245,247,0.4)",
            }}
          >
            <span>Day 1</span>
            <span>caught up</span>
          </div>
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
            padding: "0 150px",
            ["--d" as string]: "2.4s",
          }}
        >
          It resets faster than anyone can get ahead.
        </p>
      </div>
    </Slide>
  );
}
