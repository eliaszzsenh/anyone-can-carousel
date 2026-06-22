import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Slide,
  Eyebrow,
  head,
  sub,
  ui,
  INK,
  DARK,
  MUTED_D,
  U,
  Letters,
  PencilCircle,
  useStill,
  useCarcarPlay,
} from "./kit";

/* ANIMATION (play-then-freeze) — the /portfolio flip-card mechanic (same as slide
   1), applied to the two proof cards:
   1. Eyebrow + heading + body rise (cc-rise); "real things" <U> draws after.
   2. The two cards sit FACE-DOWN (dark front: number + category). They FLIP one at
      a time — card 2 first, finishing on card 1 — revealing the white "liquid glass"
      back (moving sheen + gentle float, identical to slide 1).
   3. On card 1's revealed back, the animated pencil CHECK draws, then its scribble
      CIRCLE loops around it (kept from before, now ink on white).
   4. Freeze on both cards revealed, side by side.
   FROZEN PATH (useStill): both start flipped in final poses (initial={false}); the
   check/circle/underlines render solid (kit draw CSS absent off .carcar-play). */

// marks for each card's open space — recoloured to the text ink, no background.
function RemplaceMark({ size = 60 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 834 837"
      width={size}
      height={size}
      fill={INK}
      aria-hidden
    >
      <path d="M338 831.006H251L261 697.006L283.5 622.006L319 558.006L375.5 520.506H437.5L485 551.006L527.5 608.506L541 652.506L558 726.506V831.006L477.5 835.506V715.006L464 669.006L437.5 630.006L400.5 608.506L364 630.006L353 664.506L338 715.006L329 792.006L338 831.006Z" />
      <path d="M131 831.006L223 835.506V746.506C223 742.506 232.667 667.173 237.5 630.006L246 528.506L266 454.506L314 371.506L367.5 342.006L413 327.006L473 354.506L498.5 381.006L516 407.506L541 467.006L566.5 539.006L592.5 664.506L599.5 792.006V831.006L690 835.506L685 697.006L659.5 520.506L644 461.006L621 403.506L594 344.506L558 288.506L533.5 265.506L503.5 247.006L462.5 229.506L416 218.506L327.5 243.506L266 288.506L203.5 378.506L171 490.006L145.5 630.006L139 737.506L131 831.006Z" />
      <path d="M100.5 823.506V697.006L103 652.506L112.5 573.006L123 508.506L131 454.506L145.5 403.506L171 327.006L210 252.006L237.5 214.006L293 160.506L321.5 136.506L355.5 123.006L394.5 109.006L430 112.006L462.5 117.006L506 136.506L567 193.006L611.5 255.006L676 425.506L711 583.006L730.5 721.506V831.006L833 823.506L826 709.506L812 583.006L789 442.506L748.5 302.506L709 211.506L659.5 119.506L604 70.5059L538.5 25.0059L454.5 0.505859L339.5 10.0059L260.5 48.5059L192.5 99.5059L123 179.006L76.5 288.506L62.5 327.006L31 444.506L0.5 664.506V823.506H100.5Z" />
    </svg>
  );
}
// radiology mark — background dropped, blue (#0745FE) recoloured to ink, the inner
// white stays card-coloured so it reads as a clean knockout.
function RadiologyMark({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="234 242 540 540" width={size} height={size} aria-hidden>
      <path
        fill={INK}
        d="M564.839 258.218C596.16 257.395 620.138 260.214 639.873 287.606C645.981 296.107 650.069 305.889 651.828 316.209C652.312 319.162 652.567 322.183 652.696 325.171C653.709 348.75 653.014 372.342 653.008 395.941C652.97 405.996 653.041 416.051 653.222 426.104C653.457 438.483 654.108 449.966 652.061 462.737C643.358 516.803 578.545 542.141 538.444 502.84C529.244 493.824 515.337 464.749 508.586 452.332C490.998 420.16 473.643 387.861 456.524 355.437C453.199 349.242 449.945 343.01 446.762 336.741C445.457 334.193 441.25 324.651 438.859 324.242C437.78 325.386 436.874 328.106 436.946 329.621C437.499 341.278 437.623 352.919 437.677 364.58L437.948 456.177C437.961 461.123 438.141 466.339 437.983 471.197C437.536 484.944 440.42 498.793 430.658 510.132C423.911 517.969 417.489 521.042 407.259 522.066C405.158 522.085 403.058 521.93 400.982 521.605C384.821 519 372.647 504.982 371.722 488.618C371.214 479.618 371.532 470.244 371.532 461.198L371.595 407.087L371.586 353.927C371.565 342.292 370.988 325.991 372.974 315.008C376.283 296.746 386.842 280.601 402.248 270.251C417.455 259.932 434.356 256.087 452.397 259.656C486.537 266.409 498.41 296.901 512.915 324.094L560.582 413.62L573.922 438.217C575.823 441.719 581.865 454.633 585.522 455.354C588.466 453.216 587.277 439.675 587.234 435.723C587.207 428.079 587.223 420.434 587.284 412.789L587.284 324.574C572.595 324.089 553.98 327.034 542.366 317.545C536.038 312.376 532.051 304.689 531.24 296.602C530.309 287.229 533.211 277.878 539.285 270.679C545.961 262.755 554.666 259.017 564.839 258.218Z"
      />
      <path
        fill={INK}
        d="M442.792 549.71C452.57 549.3 463.167 549.537 473.005 549.531L524.08 549.454L560.923 549.438C567.889 549.441 574.861 549.406 581.826 549.528C607.339 549.975 630.144 565.248 643.045 586.867C652.288 602.675 654.955 621.479 650.474 639.233C643.518 665.032 622.707 684.769 596.576 690.35C583.965 693.018 574.164 690.586 561.572 698.757C551.549 705.26 544.682 714.659 541.843 726.134L541.765 726.514C539.755 737.165 542.108 748.586 534.038 757.412C517.762 775.212 486.758 766.793 483.923 741.975C483.391 737.316 483.34 732.126 482.407 727.556C480.885 719.819 477.21 712.669 471.804 706.927C457.468 691.588 442.636 693.787 424.209 690.1C413.558 687.462 403.518 682.015 395.321 674.757C354 638.172 367.903 574.63 418.033 554.526C426.811 551.005 433.249 550.236 442.792 549.71Z"
      />
      <path
        fill="#fff"
        d="M472.393 570.489C491.991 569.372 508.775 584.374 509.854 603.974C510.934 623.575 495.9 640.33 476.298 641.373C456.748 642.413 440.048 627.428 438.971 607.88C437.894 588.332 452.847 571.603 472.393 570.489Z"
      />
    </svg>
  );
}

const CARDS: {
  cat: string;
  sub: string;
  head: React.ReactNode;
  foot: string;
  check: boolean;
  pencilDelay: string;
  icon: React.ReactNode;
}[] = [
  {
    cat: "Shipped",
    sub: "app store",
    head: (
      <>
        Approved on the <U>Shopify App Store</U>
      </>
    ),
    foot: "Real product. Live.",
    check: true,
    pencilDelay: "2.5s",
    icon: <RemplaceMark />,
  },
  {
    cat: "Built",
    sub: "radiology",
    head: (
      <>
        A tool that reads <U>scans</U> for radiologists
      </>
    ),
    foot: "Real users. Real stakes.",
    check: false,
    pencilDelay: "1.7s",
    icon: <RadiologyMark />,
  },
];

const CARD_W = 372;
const CARD_H = 484;
const SPREAD = 198; // half-distance between the two card centres

function faceBase(back: boolean): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    borderRadius: 22,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    ...(back
      ? { background: "#fff", color: INK, border: "1px solid #E4E4E7" }
      : {
          background: DARK,
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.16)",
        }),
  };
}

function Front({ card, n }: { card: (typeof CARDS)[number]; n: string }) {
  const corner = (rotate = false) => (
    <div
      style={{
        position: "absolute",
        ...(rotate
          ? { bottom: 22, right: 24, transform: "rotate(180deg)" }
          : { top: 22, left: 24 }),
        fontFamily: ui,
        lineHeight: 1,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>
        {n}
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.16em",
          opacity: 0.55,
          marginTop: 5,
          textTransform: "uppercase",
        }}
      >
        {card.sub}
      </div>
    </div>
  );
  return (
    <div style={faceBase(false)}>
      {corner()}
      {corner(true)}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <div
          style={{ width: 44, height: 1, background: "rgba(255,255,255,0.3)" }}
        />
        <div
          style={{
            fontFamily: ui,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {card.cat}
        </div>
        <div
          style={{ width: 44, height: 1, background: "rgba(255,255,255,0.3)" }}
        />
      </div>
    </div>
  );
}

function Back({ card }: { card: (typeof CARDS)[number] }) {
  return (
    <div
      style={
        {
          ...faceBase(true),
          transform: "rotateY(180deg)",
          "--pencil-delay": card.pencilDelay,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="rmp-card-sheen"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, transparent 34%, rgba(255,160,150,0.12) 50%, rgba(184,156,235,0.10) 57%, transparent 72%)",
          backgroundSize: "250% 100%",
        }}
      />
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "34px 32px 30px",
        }}
      >
        {card.check && (
          <div
            style={{
              position: "relative",
              width: 96,
              height: 96,
              marginBottom: 26,
            }}
          >
            <svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              fill="none"
              style={{ position: "absolute", inset: 0 }}
            >
              <path
                className="cc-pencil-stroke"
                pathLength={1}
                d="M28 50 L44 66 L70 32"
                stroke={INK}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <PencilCircle color={INK} size={150} />
          </div>
        )}
        <span
          style={{
            alignSelf: "flex-start",
            fontFamily: ui,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8A8A90",
            border: "1px solid rgba(0,0,0,0.12)",
            padding: "6px 12px",
            borderRadius: 999,
          }}
        >
          {card.cat}
        </span>
        <div
          style={{
            fontFamily: ui,
            fontSize: 33,
            fontWeight: 600,
            letterSpacing: "-0.028em",
            lineHeight: 1.12,
            color: INK,
            marginTop: 22,
          }}
        >
          {card.head}
        </div>
        {/* open space under the title — holds the card's mark (ink color) */}
        <div
          style={{
            flex: 1,
            minHeight: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.92,
          }}
        >
          {card.icon}
        </div>
        <div style={{ height: 1, background: "rgba(0,0,0,0.12)" }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 16,
            fontFamily: ui,
            fontSize: 15,
            color: "#9A9AA0",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: INK,
              flexShrink: 0,
            }}
          />
          {card.foot}
        </div>
      </div>
    </div>
  );
}

function FlipProof() {
  const still = useStill();
  const play = useCarcarPlay();
  const [flipped, setFlipped] = useState<boolean[]>(() =>
    still ? [true, true] : [false, false],
  );

  useEffect(() => {
    if (still || !play) return;
    // flip card 2 first, finish on card 1 (the checkmark card)
    const order = [1, 0];
    const timers = order.map((idx, k) =>
      setTimeout(
        () => setFlipped((f) => f.map((v, j) => (j === idx ? true : v))),
        900 + k * 760,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [still, play]);

  const pose = (i: number) => {
    const x = i === 0 ? -SPREAD : SPREAD;
    if (flipped[i]) {
      return { x, y: 0, rotate: 0, scale: 1, zIndex: 20 + i };
    }
    return {
      x,
      y: -10,
      rotate: i === 0 ? -5 : 5,
      scale: 0.96,
      zIndex: 10 + i,
    };
  };

  const spring = {
    type: "spring" as const,
    stiffness: 150,
    damping: 19,
    mass: 0.9,
  };

  return (
    <div
      className="cc-fade"
      style={
        {
          position: "absolute",
          left: 0,
          right: 0,
          top: 408,
          height: 520,
          "--d": "0.4s",
        } as React.CSSProperties
      }
    >
      {CARDS.map((card, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={pose(i)}
          transition={spring}
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: CARD_W,
            height: CARD_H,
            marginLeft: -CARD_W / 2,
            perspective: 1600,
          }}
        >
          <motion.div
            initial={false}
            animate={{ rotateY: flipped[i] ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 19 }}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              borderRadius: 22,
              boxShadow: "0 40px 90px -40px rgba(0,0,0,0.7)",
            }}
          >
            <div
              className="rmp-cardfloat"
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                animationDelay: `${-i * 1.6}s`,
              }}
            >
              <Front card={card} n={String(i + 1).padStart(2, "0")} />
              <Back card={card} />
            </div>
          </motion.div>
        </motion.div>
      ))}

      <style>{`
        .carcar-play .rmp-card-sheen { animation: rmpSheen 5.5s ease-in-out infinite; }
        @keyframes rmpSheen { 0%,100% { background-position: 140% 0; } 50% { background-position: -40% 0; } }
        .carcar-play .rmp-cardfloat { animation: rmpFloat 5s ease-in-out infinite; }
        @keyframes rmpFloat { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(0.4deg); } }
        @media (prefers-reduced-motion: reduce) {
          .carcar-play .rmp-card-sheen, .carcar-play .rmp-cardfloat { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default function Slide6() {
  return (
    <Slide n={6} tone="dark">
      <div
        style={
          {
            position: "absolute",
            top: 118,
            left: 0,
            right: 0,
            textAlign: "center",
            padding: "0 110px",
            "--pencil-delay": "0.85s",
          } as React.CSSProperties
        }
      >
        <div className="cc-fade">
          <Eyebrow text="Who's telling you this" dark />
        </div>
        <h1 style={{ ...head(82, true) }}>
          <Letters start={0.12} step={0.026}>
            I built <U color="#fff">real things</U> with AI.
          </Letters>
        </h1>
        <p
          className="cc-fade"
          style={
            {
              ...sub(30, true),
              marginTop: 30,
              maxWidth: 760,
              marginLeft: "auto",
              marginRight: "auto",
              "--d": "0.8s",
            } as React.CSSProperties
          }
        >
          So I know what's{" "}
          <span style={{ color: "#fff", fontWeight: 500 }}>real</span> here, and
          what's just <span style={{ color: MUTED_D }}>noise</span>.
        </p>
      </div>

      <FlipProof />
    </Slide>
  );
}
