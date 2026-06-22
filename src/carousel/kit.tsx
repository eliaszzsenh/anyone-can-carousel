// CARCAR1 shared kit — matches /portfolio EXACTLY. Monochrome, SF Pro (ui), no accent
// color (ink + greys + white only). Every slide imports from here so all 8 stay
// consistent. 1080x1080.
//
// ── ANIMATION SYSTEM (play-then-freeze) ───────────────────────────────────────
// The live page animates; stills/downloads render the FROZEN final state.
//   • Each element's BASE style = its FINAL frozen state (what you see at rest).
//   • To animate an element on entry, add a className: cc-rise | cc-rise-sm |
//     cc-fade | cc-pop | cc-drop | cc-grow, and set its delay with style
//     {"--d": "0.3s"}. These only fire under the .carcar-play root (live page).
//   • DO NOT put cc-* on an element that already has its own transform (rotate /
//     translate) — the keyframe ends at `transform:none` and would wipe it. Wrap
//     it in a plain <div> and animate the wrapper instead.
//   • Pencil marks (PencilUnderline / PencilCircle / any <path className=
//     "cc-pencil-stroke">) DRAW themselves in via stroke-dashoffset. Tune timing
//     with {"--pencil-delay": "0.7s"} on an ancestor. Always set pathLength={1}.
//   • For bespoke JS motion (grid choreography, WAAPI element.animate), put it in
//     a small CHILD component rendered inside <Slide>, with a useEffect gated on
//     `if (useStill()) return;`. It auto-replays on scroll because <Slide>
//     remounts its children each time it re-enters the viewport.
// Stills: append ?still=1 (the screenshot endpoint does) → no animation, final state.

import {
  Fragment,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const W = 1080;
export const H = 1080;

// Apple-grade cool palette (copied from Portfolio.tsx — DO NOT add color)
export const WHITE = "#FFFFFF";
export const GRAY = "#F5F5F7";
export const INK = "#1D1D1F";
export const MUTED = "#6E6E73";
export const LINE = "rgba(0,0,0,0.10)";

// dark-slide / card variants
export const DARK = "#202224";
export const INK_D = "#F5F5F7";
export const MUTED_D = "rgba(245,245,247,0.56)";
export const LINE_D = "rgba(255,255,255,0.12)";

export const ui =
  "'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Inter Tight', 'Inter', sans-serif";

// shared easing language — every slide uses these so the whole carousel feels
// like one hand. `out` = smooth settle (default). `pop` = slight overshoot.
// `io` = symmetric in/out for travel.
export const EASE = {
  out: "cubic-bezier(.16,1,.3,1)",
  pop: "cubic-bezier(.34,1.56,.64,1)",
  io: "cubic-bezier(.65,0,.35,1)",
};

// True when the slide should render its FROZEN final state (no animation):
// the screenshot/download endpoint loads /carcar1?still=1, and we also respect
// the user's reduced-motion preference.
export function useStill(): boolean {
  const [still] = useState(() => {
    if (typeof window === "undefined") return true;
    const flagged = new URLSearchParams(window.location.search).has("still");
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    return flagged || reduced;
  });
  return still;
}

// Whether the current slide is on-screen and should be PLAYING its entry. JS-driven
// children (grids, the flip hand) read this so they only start when the slide is in
// view — never pre-playing off-screen (which then looked like a reset/flash on scroll
// in). CSS-class animations are gated the same way by the `.carcar-play` root class.
const CarcarPlayContext = createContext(true);
export function useCarcarPlay(): boolean {
  return useContext(CarcarPlayContext);
}

// The shared animation stylesheet — injected once per slide (identical copies are
// harmless). All entry animations are scoped under `.carcar-play` so the frozen
// (still) render shows base = final state with zero animation.
const CARCAR_ANIM_CSS = `
.carcar-play{--eo:cubic-bezier(.16,1,.3,1);--ep:cubic-bezier(.34,1.32,.64,1);}
.carcar-play .cc-rise{animation:ccRise .82s var(--eo) var(--d,0s) both;will-change:transform,filter,opacity;}
.carcar-play .cc-rise-sm{animation:ccRiseSm .7s var(--eo) var(--d,0s) both;will-change:transform,filter,opacity;}
.carcar-play .cc-fade{animation:ccFade .86s var(--eo) var(--d,0s) both;will-change:filter,opacity;}
.carcar-play .cc-pop{animation:ccPop .62s var(--ep) var(--d,0s) both;will-change:transform,filter,opacity;}
.carcar-play .cc-drop{animation:ccDrop .72s var(--eo) var(--d,0s) both;will-change:transform,filter,opacity;}
.carcar-play .cc-grow{animation:ccGrow .62s var(--eo) var(--d,0s) both;transform-origin:top center;will-change:transform,filter,opacity;}
.carcar-play .cc-pencil-stroke{stroke-dasharray:1;stroke-dashoffset:1;animation:ccDraw var(--pd,.6s) var(--eo) var(--pencil-delay,.5s) both;}
.carcar-play .cc-pencil-stroke-2{stroke-dasharray:1;stroke-dashoffset:1;animation:ccDraw var(--pd,.6s) var(--eo) calc(var(--pencil-delay,.5s) + .12s) both;}
.carcar-play .cc-letter{display:inline-block;animation:ccLetter .6s var(--eo) var(--d,0s) both;will-change:transform,filter,opacity;}
.carcar-play .cc-float{animation:ccFloat var(--fdur,5s) ease-in-out var(--fdelay,1.4s) infinite;will-change:transform;}
.carcar-play .cc-breath{animation:ccBreath var(--bdur,5.5s) ease-in-out var(--bdelay,1.6s) infinite;will-change:transform;}
@keyframes ccRise{from{opacity:0;transform:translateY(22px);filter:blur(7px);}55%{opacity:1;filter:blur(.4px);}to{opacity:1;transform:none;filter:blur(0);}}
@keyframes ccRiseSm{from{opacity:0;transform:translateY(13px);filter:blur(5px);}to{opacity:1;transform:none;filter:blur(0);}}
@keyframes ccFade{from{opacity:0;filter:blur(6px);}to{opacity:1;filter:blur(0);}}
@keyframes ccPop{from{opacity:0;transform:scale(.9);filter:blur(5px);}to{opacity:1;transform:scale(1);filter:blur(0);}}
@keyframes ccDrop{from{opacity:0;transform:translateY(-18px);filter:blur(5px);}to{opacity:1;transform:none;filter:blur(0);}}
@keyframes ccGrow{from{opacity:0;transform:scaleY(.04);filter:blur(5px);}to{opacity:1;transform:scaleY(1);filter:blur(0);}}
@keyframes ccDraw{0%{opacity:0;stroke-dashoffset:1;}12%{opacity:var(--so,1);}100%{opacity:var(--so,1);stroke-dashoffset:0;}}
@keyframes ccLetter{from{opacity:0;transform:translateY(0.42em);filter:blur(7px);}to{opacity:1;transform:translateY(0);filter:blur(0);}}
@keyframes ccFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
@keyframes ccBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.035);}}
@media (prefers-reduced-motion: reduce){
.carcar-play .cc-rise,.carcar-play .cc-rise-sm,.carcar-play .cc-fade,.carcar-play .cc-pop,.carcar-play .cc-drop,.carcar-play .cc-grow,.carcar-play .cc-pencil-stroke,.carcar-play .cc-pencil-stroke-2,.carcar-play .cc-letter,.carcar-play .cc-float,.carcar-play .cc-breath{animation:none!important;opacity:1!important;transform:none!important;filter:none!important;stroke-dashoffset:0!important;}
}
`;

const TOTAL = 8;

export function Foot({ n, dark = false }: { n: number; dark?: boolean }) {
  const c = dark ? MUTED_D : "rgba(29,29,31,0.5)";
  const dot = dark ? "rgba(245,245,247,0.3)" : "rgba(29,29,31,0.3)";
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 56,
          left: 64,
          fontFamily: ui,
          fontSize: 23,
          fontWeight: 600,
          letterSpacing: "0.01em",
          color: c,
        }}
      >
        Eliasz <span style={{ color: dot }}>·</span> building with AI
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 56,
          right: 64,
          fontFamily: ui,
          fontSize: 23,
          fontWeight: 600,
          letterSpacing: "0.01em",
          color: c,
        }}
      >
        {String(n).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </div>
    </>
  );
}

export function Eyebrow({
  text,
  dark = false,
}: {
  text: string;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        fontFamily: ui,
        fontSize: 38,
        fontWeight: 600,
        letterSpacing: "0.01em",
        color: dark ? MUTED_D : MUTED,
        marginBottom: 30,
      }}
    >
      {text}
    </div>
  );
}

export function Slide({
  children,
  tone = "light",
  n,
  foot = true,
}: {
  children: React.ReactNode;
  tone?: "light" | "gray" | "dark";
  n: number;
  foot?: boolean;
}) {
  const bg = tone === "dark" ? DARK : tone === "gray" ? GRAY : WHITE;
  const still = useStill();
  const rootRef = useRef<HTMLDivElement>(null);
  // cap mode (?cap=N, used by the MP4 recorder): the slide stays armed until the
  // recorder fires a `ccplay` event, so the capture catches the play-in from t0.
  const [cap] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("cap"),
  );
  // rec mode (?rec=N, the record view): like cap, the slide stays ARMED and waits
  // for a `ccplay` event instead of auto-playing on scroll — so the record view can
  // hold a black screen, then trigger the entry exactly ONCE (no IO double-start).
  // Unlike cap it keeps the perpetual loops (the live bounce/sheen/pulse).
  const [rec] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("rec"),
  );
  // armed = on-screen the content is hidden and nothing animates yet; on first
  // entry (and again each re-entry) we PLAY: reveal + (re)start every animation.
  // `playGen` bumps to remount children so CSS animations restart cleanly.
  const [playing, setPlaying] = useState(false);
  const [playGen, setPlayGen] = useState(0);

  useEffect(() => {
    if (still) return; // frozen render — never animate
    const el = rootRef.current;
    if (!el) return;

    // a `ccplay` window event ALWAYS (re)starts the play-in. The MP4 recorder and
    // the /carcar1?rec=N record view both fire it; harmless on the normal page.
    const onPlay = () => {
      setPlayGen((g) => g + 1);
      setPlaying(true);
    };
    window.addEventListener("ccplay", onPlay);

    if (cap || rec) {
      // ARMED until ccplay (no IntersectionObserver autoplay → the entry fires
      // exactly once, when told). cap also needs a keep-alive rAF so the
      // deterministic begin-frame recorder keeps advancing CSS animations; rec
      // runs on the live page where the normal rAF loop is enough.
      let rafId = 0;
      if (cap) {
        rafId = requestAnimationFrame(function ka() {
          rafId = requestAnimationFrame(ka);
        });
      }
      return () => {
        window.removeEventListener("ccplay", onPlay);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }

    let lastEnter = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const now = Date.now();
            if (now - lastEnter < 400) continue;
            lastEnter = now;
            setPlayGen((g) => g + 1);
            setPlaying(true);
          } else {
            setPlaying(false);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      window.removeEventListener("ccplay", onPlay);
      io.disconnect();
    };
  }, [still, cap, rec]);

  const show = still || playing;

  return (
    <CarcarPlayContext.Provider value={show}>
      <div
        ref={rootRef}
        className={show && !still ? "carcar-play" : undefined}
        style={{
          width: W,
          height: H,
          flexShrink: 0,
          overflow: "hidden",
          position: "relative",
          background: bg,
        }}
      >
        {!still && <style>{CARCAR_ANIM_CSS}</style>}
        {/* In the MP4 capture (cap mode) the deterministic virtual-time clock races
            whenever a perpetual animation keeps requesting frames, so kill the
            infinite loops (card float / sheen / CTA pulse) during capture only —
            the live page (and the record view) keep the bounce. */}
        {cap && (
          <style>{`.rmp-cardfloat,.rmp-card-sheen,.cc1-cta-pulse,.cc-float,.cc-breath{animation:none!important;}`}</style>
        )}
        {/* keyed wrapper restarts CSS animations on each entry; opacity keeps the
            content hidden while armed so the pre-play / reset is never visible. */}
        <div
          key={playGen}
          style={{ opacity: show ? 1 : 0, transition: "none" }}
        >
          {children}
        </div>
        {foot && <Foot n={n} dark={tone === "dark"} />}
      </div>
    </CarcarPlayContext.Provider>
  );
}

export function Center({
  children,
  pad = 100,
}: {
  children: React.ReactNode;
  pad?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${pad}px`,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

// headline style helpers (SF Pro, weight 600, tight). dark = on dark slide.
export const head = (size: number, dark = false): React.CSSProperties => ({
  fontFamily: ui,
  fontWeight: 600,
  fontSize: size,
  letterSpacing: "-0.035em",
  lineHeight: 1.02,
  color: dark ? INK_D : INK,
  margin: 0,
});
export const sub = (size: number, dark = false): React.CSSProperties => ({
  fontFamily: ui,
  fontWeight: 400,
  fontSize: size,
  lineHeight: 1.45,
  color: dark ? MUTED_D : MUTED,
  margin: 0,
});

// ── Per-letter reveal (the /portfolio RollText feel, as an ENTRANCE) ───────────
// Wrap a headline in <Letters> and each character rises into place one after
// another with a soft blur bloom, staggered left-to-right. Honors `still` (frozen
// final = letters at rest, fully visible) and only animates under .carcar-play.
//   • Words stay intact (inline-block, no mid-word line breaks); whitespace kept.
//   • Mixed children work: an emphasis wrapper like <U>word</U> keeps its pencil
//     underline while its inner letters roll in (the counter flows across it).
//   • Tune with start (delay before the first letter, s) + step (per-letter, s).
function splitLetters(
  node: React.ReactNode,
  ctr: { i: number },
  start: number,
  step: number,
  keyPrefix: string,
): React.ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    // split into word / whitespace tokens so words never break mid-letter
    return String(node)
      .split(/(\s+)/)
      .map((tok, k) => {
        if (tok === "") return null;
        if (/^\s+$/.test(tok)) {
          return (
            <span key={`${keyPrefix}-sp${k}`} style={{ whiteSpace: "pre" }}>
              {tok}
            </span>
          );
        }
        const letters = Array.from(tok).map((ch, j) => {
          const d = start + ctr.i * step;
          ctr.i += 1;
          return (
            <span
              key={j}
              className="cc-letter"
              style={{ ["--d" as string]: `${d}s` } as React.CSSProperties}
            >
              {ch}
            </span>
          );
        });
        return (
          <span
            key={`${keyPrefix}-w${k}`}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {letters}
          </span>
        );
      });
  }
  if (Array.isArray(node)) {
    return node.map((n, k) => (
      <Fragment key={`${keyPrefix}-f${k}`}>
        {splitLetters(n, ctr, start, step, `${keyPrefix}-${k}`)}
      </Fragment>
    ));
  }
  if (isValidElement(node)) {
    return cloneElement(
      node,
      undefined,
      splitLetters(
        (node.props as { children?: React.ReactNode }).children,
        ctr,
        start,
        step,
        `${keyPrefix}-e`,
      ),
    );
  }
  return node;
}

export function Letters({
  children,
  start = 0,
  step = 0.03,
}: {
  children: React.ReactNode;
  /** delay before the first letter (seconds) */
  start?: number;
  /** per-letter stagger (seconds) */
  step?: number;
}) {
  const still = useStill();
  if (still) return <>{children}</>; // frozen final state — no per-letter spans
  return <>{splitLetters(children, { i: 0 }, start, step, "L")}</>;
}

// ── Portfolio playing-card (revealed / "back" face) ───────────────────────────
// Dark playing card: corner number + label + headline + footer. Matches CardFan.
// Used for slide 1 (the 3 phrases) and reusable.
export function PlayCard({
  n,
  label,
  head: headline,
  foot,
  w = 270,
  h = 376,
  rotate = 0,
  mark,
}: {
  n: string;
  label: string;
  head: React.ReactNode;
  foot?: string;
  w?: number;
  h?: number;
  rotate?: number;
  mark?: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 20,
        background: DARK,
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: "0 30px 70px -34px rgba(0,0,0,0.55)",
        position: "relative",
        transform: `rotate(${rotate}deg)`,
        display: "flex",
        flexDirection: "column",
        padding: "26px 26px 24px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 24,
          fontFamily: ui,
          lineHeight: 1,
        }}
      >
        <div
          style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          {n}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 22,
          right: 24,
          fontFamily: ui,
          lineHeight: 1,
          transform: "rotate(180deg)",
        }}
      >
        <div
          style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          {n}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 6px",
        }}
      >
        {mark && <div style={{ marginBottom: 24 }}>{mark}</div>}
        <span
          style={{
            fontFamily: ui,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.55)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <div
          style={{
            fontFamily: ui,
            fontSize: 38,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.08,
            color: "#fff",
            marginTop: 18,
          }}
        >
          {headline}
        </div>
      </div>
      {foot && (
        <>
          <div style={{ height: 1, background: "rgba(255,255,255,0.16)" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              marginTop: 15,
              fontFamily: ui,
              fontSize: 18,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#fff",
                flexShrink: 0,
              }}
            />
            {foot}
          </div>
        </>
      )}
    </div>
  );
}

// ── Hand-drawn pencil marks (the personality layer) ───────────────────────────
// Emphasis = an imperfect, sketchy PENCIL mark, NOT a color change (palette stays
// mono). Each mark uses an feTurbulence displacement filter for the organic hand-drawn
// wobble. Reusable + animatable later (stroke draw-in via stroke-dashoffset).
// imperfect underline that stretches under a word (smooth wobbly vector, no filter)
export function PencilUnderline({
  color = INK,
  thickness = 7,
}: {
  color?: string;
  /** kept for API compat; mapped to a thin refined stroke (capped). */
  thickness?: number;
}) {
  // "Pencil (refined)" — chosen on /soulignage (#2). A single thin, gently-wavy
  // stroke that sits BELOW the descenders (bottom in em, so it clears the letters
  // at any text size) and stays thin everywhere (fixed 14px svg height → the
  // strokeWidth renders true, not stretched). Keeps the hand-drawn draw-in.
  const sw = Math.min(4.6, Math.max(2.8, thickness * 0.5));
  return (
    <svg
      viewBox="0 0 300 14"
      preserveAspectRatio="none"
      aria-hidden
      style={{
        position: "absolute",
        left: "-2%",
        bottom: "-0.24em",
        width: "104%",
        height: 14,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <path
        className="cc-pencil-stroke"
        pathLength={1}
        d="M4 8 C 70 5, 150 10, 220 7 C 258 5, 284 9, 296 7"
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// wrap a word/phrase so it gets the imperfect pencil underline (same text color)
export function U({
  children,
  color = INK,
  thickness = 7,
}: {
  children: React.ReactNode;
  color?: string;
  thickness?: number;
}) {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <PencilUnderline color={color} thickness={thickness} />
    </span>
  );
}

// scribble-circle: 2-3 imperfect overlapping loops (varying thickness), like someone
// circling a thing 2-3 times with a pencil. Absolutely centered on its parent.
export function PencilCircle({
  color = INK,
  size = 240,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: size,
        height: size,
        transform: "translate(-50%,-50%)",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className="cc-pencil-stroke"
          pathLength={1}
          d="M50 104 C 40 58, 150 44, 168 92 C 182 144, 58 166, 34 110 C 27 94, 33 82, 46 76"
          strokeWidth="6"
          transform="rotate(-4 100 100)"
        />
        <path
          className="cc-pencil-stroke-2"
          pathLength={1}
          d="M56 94 C 52 56, 146 60, 158 100 C 166 146, 62 156, 44 102 C 38 88, 44 80, 54 75"
          strokeWidth="3.4"
          transform="rotate(5 100 100)"
          opacity="0.85"
          style={{ "--so": 0.85 } as React.CSSProperties}
        />
      </g>
    </svg>
  );
}
