import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { W, H } from "./carousel/kit";
import Slide1 from "./carousel/Slide1";
import Slide2 from "./carousel/Slide2";
import Slide3 from "./carousel/Slide3";
import Slide4 from "./carousel/Slide4";
import Slide5 from "./carousel/Slide5";
import Slide6 from "./carousel/Slide6";
import Slide7 from "./carousel/Slide7";
import Slide8 from "./carousel/Slide8";

// The 8 slides. Add / remove / reorder here. Each is a self-contained component
// in src/carousel/. Edit those to change your content.
const slides = [
  <Slide1 key={1} />,
  <Slide2 key={2} />,
  <Slide3 key={3} />,
  <Slide4 key={4} />,
  <Slide5 key={5} />,
  <Slide6 key={6} />,
  <Slide7 key={7} />,
  <Slide8 key={8} />,
];

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif";
const INK = "#1d1d1f";
const REC_BLACK_MS = 1500; // black hold before the slide plays
const REC_PLAY_MS = 10000; // how long it plays before going black again

export default function App() {
  const [view, setView] = useState<"slides" | "record">("slides");
  const [solo, setSolo] = useState<number | null>(null);
  const [solScale, setSolScale] = useState(1);

  // record mode (?rec=N): the live slide, full-screen + scaled, for screen-recording.
  const [recCur, setRecCur] = useState<number | null>(() => {
    const v = new URLSearchParams(window.location.search).get("rec");
    if (v === null) return null;
    const n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  });
  const recActive = recCur !== null && recCur >= 0 && recCur < slides.length;
  const [recScale, setRecScale] = useState(1);
  const [recBlack, setRecBlack] = useState(true);
  const [recTake, setRecTake] = useState(0);

  useEffect(() => {
    const fitRec = () =>
      setRecScale(
        Math.min((window.innerHeight - 24) / H, (window.innerWidth - 24) / W, 1),
      );
    const fitSolo = () =>
      setSolScale(
        Math.min(
          (window.innerHeight - 180) / H,
          (window.innerWidth - 80) / W,
          1,
        ),
      );
    const fit = () => {
      fitRec();
      fitSolo();
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // each "take": hold black for REC_BLACK_MS, then play the slide once.
  useEffect(() => {
    try {
      const u = new URL(window.location.href);
      if (recActive) u.searchParams.set("rec", String(recCur));
      else u.searchParams.delete("rec");
      window.history.replaceState(null, "", u.toString());
    } catch {
      /* noop */
    }
    if (!recActive) return;
    // black START → play → black END: clean black bookends to cut between.
    setRecBlack(true);
    const t1 = setTimeout(() => {
      setRecBlack(false);
      window.dispatchEvent(new Event("ccplay"));
    }, REC_BLACK_MS);
    const t2 = setTimeout(() => {
      setRecBlack(true);
    }, REC_BLACK_MS + REC_PLAY_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [recCur, recActive, recTake]);

  // arrows switch slides, Esc exits.
  useEffect(() => {
    if (!recActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown")
        setRecCur((c) => Math.min((c ?? 0) + 1, slides.length - 1));
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
        setRecCur((c) => Math.max((c ?? 0) - 1, 0));
      else if (e.key === "Escape") setRecCur(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [recActive]);

  const enterRecord = () => {
    try {
      const u = new URL(window.location.href);
      u.searchParams.set("rec", "0");
      window.history.replaceState(null, "", u.toString());
    } catch {
      /* noop */
    }
    setRecCur(0);
  };

  // ── record view ───────────────────────────────────────────────────────────
  if (recActive) {
    return (
      <div
        onClick={() => setRecTake((t) => t + 1)}
        title="← / → switch · click to re-take · Esc to exit"
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        {recBlack && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "#000",
              zIndex: 20,
              pointerEvents: "none",
            }}
          />
        )}
        <div
          style={{
            width: W * recScale,
            height: H * recScale,
            overflow: "hidden",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              transformOrigin: "top left",
              transform: `scale(${recScale})`,
            }}
          >
            <div key={recCur} style={{ width: W, height: H, position: "relative" }}>
              {slides[recCur as number]}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setRecCur(null);
          }}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 30,
            padding: "8px 16px",
            borderRadius: 99,
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(0,0,0,0.4)",
            color: "#fff",
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Exit
        </button>
        <div
          style={{
            position: "fixed",
            bottom: 14,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: FONT,
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            pointerEvents: "none",
          }}
        >
          slide {(recCur as number) + 1} / {slides.length} · black → plays ~10s →
          black · ← / → switch · click to re-take · F11 fullscreen · Esc to exit
        </div>
      </div>
    );
  }

  // ── gallery ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#d0cfc8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 0",
        gap: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(0,0,0,0.32)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Your carousel · 1080×1080
        </div>

        {/* sliding-pill tabs: Slides ⇄ Record */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "rgba(0,0,0,0.06)",
            borderRadius: 999,
            padding: 3,
          }}
        >
          {(["slides", "record"] as const).map((tb) => (
            <button
              key={tb}
              onClick={() => setView(tb)}
              style={{
                position: "relative",
                border: "none",
                background: "transparent",
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.02em",
                color: view === tb ? INK : "rgba(0,0,0,0.45)",
                padding: "8px 24px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "color .2s",
              }}
            >
              {view === tb && (
                <motion.div
                  layoutId="galleryTabPill"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#fff",
                    borderRadius: 999,
                    boxShadow: "0 2px 8px -4px rgba(0,0,0,0.35)",
                    zIndex: 0,
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>
                {tb === "slides" ? "Slides" : "Record"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {view === "slides" ? (
        <>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 11,
              color: "rgba(0,0,0,0.4)",
              letterSpacing: "0.04em",
              marginTop: -16,
            }}
          >
            Click a slide to view it bigger. Export by screen-recording (Record tab).
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {slides.map((node, i) => (
              <div
                key={i}
                onClick={() => setSolo(i)}
                style={{
                  width: W,
                  height: H,
                  flexShrink: 0,
                  position: "relative",
                  cursor: "zoom-in",
                }}
              >
                {node}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 20,
            padding: "44px 48px",
            maxWidth: 640,
            textAlign: "center",
            boxShadow: "0 16px 50px -28px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: INK }}>
            Record a clean video
          </div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 14,
              lineHeight: 1.65,
              color: "rgba(0,0,0,0.6)",
              margin: 0,
            }}
          >
            Opens each slide full-screen at 1080×1080, exactly as it animates here.
            It holds black, then plays the slide once, so you get a clean start
            frame to cut to. Use ← / → to switch, click to re-take, Esc to exit.
            Press F11 first, then screen-record the square.
          </p>
          <button
            onClick={enterRecord}
            style={{
              padding: "12px 28px",
              borderRadius: 99,
              border: "none",
              background: INK,
              color: "#fff",
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.03em",
              cursor: "pointer",
            }}
          >
            Enter record mode
          </button>
        </div>
      )}

      {/* click-to-enlarge viewer */}
      {solo !== null && (
        <div
          onClick={() => setSolo(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(8,8,10,0.97)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: W * solScale,
              height: H * solScale,
              overflow: "hidden",
              borderRadius: 12 * solScale,
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{ transformOrigin: "top left", transform: `scale(${solScale})` }}
            >
              <div style={{ width: W, height: H, position: "relative" }}>
                {slides[solo]}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
