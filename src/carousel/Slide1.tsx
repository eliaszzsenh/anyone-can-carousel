import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Slide,
  Eyebrow,
  head,
  ui,
  INK,
  DARK,
  U,
  Letters,
  useStill,
  useCarcarPlay,
} from "./kit";

/* ANIMATION (play-then-freeze) — the EXACT /portfolio CardFan card: dark face-down
   front, white "liquid glass" back (moving sheen), perpetual gentle float, same
   framer-motion springs. Only the card CONTENT differs.
   1. Eyebrow + heading rise (cc-rise); the <U> "every single day." draws after.
   2. The 3 cards sit FACE-DOWN, fanned (front = number + category, rotated -12/0/12).
   3. They FLIP one at a time, card 3 first, finishing with card 1 (indices 2 → 1 → 0),
      slower (~0.85s apart). Each flip (rotateY 0→180, spring) reveals the white glass
      back and the card springs LOWER + BIGGER into the row; the still-face-down cards
      sink a bit. Then the cards keep a slow infinite float (the /portfolio bob).
   4. Freeze on all three revealed, big, low, in a centred row.
   FROZEN PATH (useStill): cards start already flipped in final poses (initial={false}),
   float + sheen disabled (scoped under .carcar-play). */

// brand/agent marks for each card's open space — all inherit the text ink color.
function ClaudeMark({ size = 50 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={INK} aria-hidden>
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}
function GithubMark({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={INK} aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
// "agent" — a clean premium mark (recoloured to ink, white face knockouts).
function AgentMark({ size = 54 }: { size?: number }) {
  return (
    <svg viewBox="230 235 565 565" width={size} height={size} aria-hidden>
      <path
        fill={INK}
        d="M411.377 329.177C444.109 294.85 489.049 274.803 536.459 273.379C584.708 272.21 631.429 290.339 666.262 323.745C701.765 357.54 717.22 399.844 718.304 448.185C718.354 450.547 718.375 452.909 718.366 455.271C728.234 471.33 738.286 487.275 748.521 503.103C752.571 509.437 764.867 528.313 767.092 534.371C768.875 539.229 769.147 544.514 767.872 549.53C761.88 573.96 736.262 568.808 717.074 569.375L717.159 605.8C717.197 616.133 717.972 632.016 715.499 641.415C713.514 649.043 709.52 656 703.934 661.56C687.677 677.839 669.036 674.075 648.116 674.63C641.827 674.797 635.451 674.631 629.155 674.627L524.355 674.552C543.94 696.737 560.136 704.936 590.572 707.515C600.866 708.387 611.872 707.273 622.075 707.737C621.996 720.49 620.585 730.194 611.098 739.46C600.451 749.858 588.823 749.734 575.264 749.854L546.303 749.928C513.701 749.954 481.069 749.844 448.479 749.582C436.902 749.489 427.74 746.582 419.654 738C409.03 726.722 409.394 714.821 409.385 700.678L409.389 679.021C409.384 659.957 409.963 639.753 408.529 620.789C407.339 605.05 401.648 588.279 396.287 573.537C386.451 548.579 372.625 527.325 369.878 499.623C333.841 499.575 307.918 501.831 280.347 473.225C264.653 456.719 256.233 434.61 256.971 411.846C257.542 389.159 267.198 367.651 283.772 352.148C309.206 328.146 335.365 328.39 367.671 328.987C382.055 329.253 396.854 328.747 411.377 329.177Z"
      />
      <path
        fill="#fff"
        d="M369.878 499.623C333.841 499.575 307.918 501.831 280.347 473.225C264.653 456.719 256.233 434.61 256.971 411.846C257.542 389.159 267.198 367.651 283.772 352.148C309.206 328.146 335.365 328.39 367.671 328.987C382.055 329.253 396.854 328.747 411.377 329.177C414.409 330.041 416.933 329.622 419.943 329.907C464.882 334.159 497.377 373.316 495.969 417.768C495.17 440.148 485.496 461.289 469.082 476.524C447.587 496.334 423.676 500.696 395.527 499.962C388.173 499.77 380.366 500.163 372.961 499.818C371.932 499.768 370.904 499.703 369.878 499.623Z"
      />
      <path
        fill={INK}
        d="M351.604 381.689C353.033 381.571 354.465 381.513 355.899 381.516C365.456 381.564 375.703 383.214 382.653 390.419C392.433 400.558 390.451 415.986 390.433 428.989L390.304 468.071L375.304 468.144C375.051 463.231 375.1 457.423 375.026 452.44C365.045 469.674 347.644 475.613 329.182 465.901C324.716 463.551 321.64 459.143 319.302 454.758C315.456 444.094 316.26 432.701 326.047 425.507C339.667 415.494 356.292 421.157 370.54 414.686C375.501 412.189 376.676 406.311 373.227 402.157C364.02 391.065 338.656 391.13 336.9 408.976L336.834 409.713C331.862 409.68 326.956 409.991 321.986 409.731L321.543 408.997C321.031 391.979 336.938 383.467 351.604 381.689Z"
      />
      <path
        fill="#fff"
        d="M374.55 427.124C375.695 428.082 374.793 431.113 374.843 432.507C375.461 449.645 354.233 465.832 338.713 455.188L337.918 454.659C333.312 450.034 330.79 441.952 335.121 436.579C341.869 428.208 358.458 430.544 368.004 428.589C370.428 428.092 372.3 427.661 374.55 427.124Z"
      />
      <path
        fill={INK}
        d="M409.621 386.429L425.761 386.486L425.877 467.82C424.025 468.218 412.661 468.025 410.058 468.014C409.629 441.189 409.711 413.319 409.621 386.429Z"
      />
      <path
        fill={INK}
        d="M414.529 350.482C418.31 349.439 422.359 350.53 425.104 353.332C427.848 356.134 428.856 360.204 427.736 363.963C426.615 367.721 423.543 370.575 419.713 371.417C414.002 372.672 408.331 369.149 406.926 363.473C405.521 357.798 408.893 352.036 414.529 350.482Z"
      />
      <path
        fill={INK}
        d="M625.376 413.344C641.186 411.771 655.287 423.288 656.903 439.094C658.518 454.9 647.038 469.032 631.237 470.689C615.376 472.352 601.179 460.82 599.558 444.955C597.937 429.09 609.507 414.924 625.376 413.344Z"
      />
    </svg>
  );
}

const HAND: {
  cat: string;
  sub: string;
  head: React.ReactNode;
  line: string;
  foot: string;
  icon: React.ReactNode;
}[] = [
  {
    cat: "The panic",
    sub: "heard daily",
    head: (
      <>
        &ldquo;Claude killed <U>[your job]</U>.&rdquo;
      </>
    ),
    line: "The headline that hits you before your coffee does.",
    foot: "you hear it daily",
    icon: <ClaudeMark />,
  },
  {
    cat: "The tool",
    sub: "every a.m.",
    head: (
      <>
        &ldquo;A new repo changes <U>everything</U>.&rdquo;
      </>
    ),
    line: "The tool that supposedly makes you obsolete by lunch.",
    foot: "every single morning",
    icon: <GithubMark />,
  },
  {
    cat: "The hype",
    sub: "on repeat",
    head: (
      <>
        &ldquo;This agent is <U>insane</U>.&rdquo;
      </>
    ),
    line: "The hype that somehow never actually slows down.",
    foot: "again, and again",
    icon: <AgentMark />,
  },
];

// stage + card geometry (1080x1080 canvas)
const CARD_W = 250;
const CARD_H = 348;
const ROW_Y = 200; // flipped — low + big row
const HAND_HIGH = 150; // face-down, nothing flipped yet
const HAND_LOW = 178; // face-down cards sink "a bit" once a flip starts
const ROW_SPREAD = 352;
const HAND_SPREAD = 150;
const FLIP_SCALE = 1.32;

function faceBase(back: boolean): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    borderRadius: 18,
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

/* face-down front — clean B&W playing card: number + sub corner, centred label */
function Front({ card, n }: { card: (typeof HAND)[number]; n: string }) {
  const corner = (rotate = false) => (
    <div
      style={{
        position: "absolute",
        ...(rotate
          ? { bottom: 16, right: 18, transform: "rotate(180deg)" }
          : { top: 16, left: 18 }),
        fontFamily: ui,
        lineHeight: 1,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>
        {n}
      </div>
      <div
        style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.16em",
          opacity: 0.55,
          marginTop: 4,
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
          gap: 14,
          padding: "0 18px",
        }}
      >
        <div
          style={{ width: 38, height: 1, background: "rgba(255,255,255,0.3)" }}
        />
        <div
          style={{
            fontFamily: ui,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: "0.1em",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {card.cat}
        </div>
        <div
          style={{ width: 38, height: 1, background: "rgba(255,255,255,0.3)" }}
        />
      </div>
    </div>
  );
}

/* revealed back — editorial reveal with the moving liquid-glass sheen */
function Back({ card }: { card: (typeof HAND)[number] }) {
  return (
    <div style={{ ...faceBase(true), transform: "rotateY(180deg)" }}>
      {/* subtle moving sheen — the /portfolio liquid-glass reflection */}
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
          padding: "22px 22px 20px",
        }}
      >
        <span
          style={{
            alignSelf: "flex-start",
            fontFamily: ui,
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8A8A90",
            border: "1px solid rgba(0,0,0,0.12)",
            padding: "5px 10px",
            borderRadius: 999,
          }}
        >
          {card.cat}
        </span>
        <div
          style={{
            fontFamily: ui,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            color: INK,
            marginTop: 18,
          }}
        >
          {card.head}
        </div>
        <div
          style={{
            fontFamily: ui,
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.45,
            color: "#6E6E73",
            marginTop: 12,
          }}
        >
          {card.line}
        </div>
        {/* the open space under the title — holds the card's mark (ink color) */}
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
            gap: 9,
            marginTop: 14,
            fontFamily: ui,
            fontSize: 14,
            letterSpacing: "0.01em",
            color: "#9A9AA0",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
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

function FlipHand() {
  const still = useStill();
  const play = useCarcarPlay();
  const [flipped, setFlipped] = useState<boolean[]>(() =>
    still ? [true, true, true] : [false, false, false],
  );

  useEffect(() => {
    if (still || !play) return; // frozen, or not yet on-screen — stay face-down
    // flip card 3 first, finish with card 1 (indices 2 → 1 → 0), slower spacing
    const order = [2, 1, 0];
    const timers = order.map((idx, k) =>
      setTimeout(
        () => setFlipped((f) => f.map((v, j) => (j === idx ? true : v))),
        1300 + k * 850,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [still, play]);

  const anyFlipped = flipped.some(Boolean);

  const pose = (i: number) => {
    if (flipped[i]) {
      return {
        x: (i - 1) * ROW_SPREAD,
        y: ROW_Y,
        rotate: 0,
        scale: FLIP_SCALE,
        zIndex: 40 + i,
      };
    }
    const handY = anyFlipped ? HAND_LOW : HAND_HIGH;
    return {
      x: (i - 1) * HAND_SPREAD,
      y: handY + (i === 1 ? -14 : 0),
      rotate: i === 0 ? -12 : i === 2 ? 12 : 0,
      scale: i === 1 ? 1 : 0.98,
      zIndex: i === 1 ? 6 : 3,
    };
  };

  const spring = {
    type: "spring" as const,
    stiffness: 150,
    damping: 19,
    mass: 0.9,
  };

  return (
    <>
      {/* heading — SHRINKS the moment the first card flips, so the cards dominate */}
      <div
        style={
          {
            position: "absolute",
            top: 132,
            left: 0,
            right: 0,
            textAlign: "center",
          } as React.CSSProperties
        }
      >
        <div
          style={{
            transformOrigin: "top center",
            transform: anyFlipped ? "scale(0.7) translateY(-12px)" : "none",
            transition: still
              ? "none"
              : "transform 0.7s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="cc-fade">
            <Eyebrow text="Be honest" />
          </div>
          <h1 style={{ ...head(86), padding: "0 90px" }}>
            <Letters start={0.12} step={0.024}>
              You hear these <U>every single day.</U>
            </Letters>
          </h1>
        </div>
      </div>

      <div
        className="cc-fade"
        style={
          {
            position: "absolute",
            left: 0,
            right: 0,
            top: 300,
            height: 700,
            "--d": "0.35s",
          } as React.CSSProperties
        }
      >
        {HAND.map((card, i) => (
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
              perspective: 1500,
            }}
          >
            {/* inner: the flip */}
            <motion.div
              initial={false}
              animate={{ rotateY: flipped[i] ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 19 }}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                borderRadius: 18,
                boxShadow: "0 34px 80px -36px rgba(0,0,0,0.6)",
              }}
            >
              {/* float wrapper — the perpetual gentle /portfolio bob */}
              <div
                className="rmp-cardfloat"
                style={{
                  position: "absolute",
                  inset: 0,
                  transformStyle: "preserve-3d",
                  animationDelay: `${-i * 1.3}s`,
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
        @keyframes rmpFloat { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-7px) rotate(0.5deg); } }
        @media (prefers-reduced-motion: reduce) {
          .carcar-play .rmp-card-sheen, .carcar-play .rmp-cardfloat { animation: none; }
        }
      `}</style>
      </div>
    </>
  );
}

export default function Slide1() {
  return (
    <Slide n={1} tone="light">
      <FlipHand />
    </Slide>
  );
}
