import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useTiltVars } from "./YouTubeMedia";
import "./sections-extra.css";

const MAX = 15;
const FAIL_EVERY = 4;
type Phase = "idle" | "charging" | "success" | "kept";

const v = (o: Record<string, string | number>) => o as CSSProperties;

function Sparks({ seed }: { seed: number }) {
  const parts = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2 + Math.random() * 0.35;
        const d = 120 + Math.random() * 110;
        return {
          dx: Math.cos(a) * d,
          dy: Math.sin(a) * d,
          delay: Math.random() * 0.12,
          size: 3 + Math.random() * 5,
          gold: i % 3 !== 0,
        };
      }),
    [seed],
  );
  return (
    <div className="sr-sparks" aria-hidden="true">
      {parts.map((p, i) => (
        <span
          key={i}
          className={p.gold ? "is-gold" : "is-cyan"}
          style={v({ "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--d": `${p.delay}s`, "--s": `${p.size}px` })}
        />
      ))}
    </div>
  );
}

export function SafeRefine({ t }: { t: (k: string) => string }) {
  const [level, setLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [seed, setSeed] = useState(0);
  const timers = useRef<number[]>([]);
  const altar = useTiltVars<HTMLDivElement>();

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const refine = () => {
    if (phase !== "idle") return;
    if (level >= MAX) {
      setLevel(0);
      setAttempts(0);
      return;
    }
    const n = attempts + 1;
    setAttempts(n);
    setSeed((s) => s + 1);
    setPhase("charging");
    later(() => {
      if (n % FAIL_EVERY === 0) {
        setPhase("kept");
      } else {
        setLevel((l) => Math.min(MAX, l + 1));
        setPhase("success");
      }
      later(() => setPhase("idle"), 1600);
    }, 950);
  };

  const pct = level / MAX;
  const label = level >= MAX ? t("refine.reset") : t("refine.btn");

  return (
    <section id="safe-refine" aria-labelledby="sr-title" className="sr-wrap relative isolate overflow-hidden px-4 py-28 sm:px-6">
      <div className="sr-bg absolute inset-0 -z-10" aria-hidden="true" />
      <div className="sr-motes pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} style={v({ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 0.41) % 5}s`, animationDuration: `${7 + (i % 5)}s`, "--m": `${2 + (i % 3)}px` })} />
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">{t("refine.label")}</p>
          <h2 id="sr-title" className="text-3xl font-extrabold uppercase leading-tight sm:text-5xl">{t("refine.title")}</h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">{t("refine.sub")}</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <span className="classes-chip">{t("refine.chip1")}</span>
            <span className="classes-chip">{t("refine.chip2")}</span>
            <span className="classes-chip">{t("refine.chip3")}</span>
          </div>
          <p className="mt-8 text-xs text-foreground/45">{t("refine.demo")}</p>
        </div>

        <div className="flex flex-col items-center">
          <div ref={altar} className="sr-altar" data-phase={phase} style={v({ "--lv": pct.toFixed(3) })}>
            <div className="sr-altar-inner">
              <div className="sr-altar-glow" aria-hidden="true" />
              <div className="sr-rune-circle" aria-hidden="true">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" className="sr-rune-line" />
                  <circle cx="50" cy="50" r="34" className="sr-rune-line sr-rune-line-b" />
                  {Array.from({ length: 12 }, (_, i) => {
                    const a = (i / 12) * Math.PI * 2;
                    return <circle key={i} cx={50 + Math.cos(a) * 46} cy={50 + Math.sin(a) * 46} r="2" className="sr-rune-dot" />;
                  })}
                </svg>
              </div>
              <svg className="sr-ring" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="47" className="sr-ring-track" />
                <circle cx="50" cy="50" r="47" pathLength={1} className="sr-ring-fill" />
              </svg>
              <div className="sr-shield" aria-hidden="true" />
              <svg className="sr-crack" viewBox="0 0 100 100" aria-hidden="true">
                <path d="M52 8 L60 36 L46 56 L64 80 L56 96" />
                <path d="M46 56 L30 66" />
                <path d="M60 36 L78 30" />
              </svg>
              <div className="sr-gear" aria-hidden="true">
                <svg viewBox="0 0 60 200">
                  <defs>
                    <linearGradient id="sr-blade" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#ffffff" />
                      <stop offset="0.5" stopColor="#bfefff" />
                      <stop offset="1" stopColor="#6aa8ff" />
                    </linearGradient>
                    <linearGradient id="sr-hilt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ffe9a8" />
                      <stop offset="1" stopColor="#c58a1c" />
                    </linearGradient>
                  </defs>
                  <path d="M30 4 L38 40 L38 140 L30 150 L22 140 L22 40 Z" fill="url(#sr-blade)" />
                  <path d="M30 14 L30 140" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                  <path d="M8 146 Q30 134 52 146 L48 156 Q30 146 12 156 Z" fill="url(#sr-hilt)" />
                  <path d="M26 154 L34 154 L34 184 L26 184 Z" fill="#5a3a8f" />
                  <circle cx="30" cy="190" r="7" fill="url(#sr-hilt)" />
                </svg>
              </div>
              <div className="sr-flash" aria-hidden="true" />
              {seed > 0 && <Sparks key={seed} seed={seed} />}
              {phase === "kept" && <span className="sr-badge">{t("refine.kept")}</span>}
              {phase === "success" && <span className="sr-badge is-up">{t("refine.up")}</span>}
              <div className="sr-level" aria-live="polite">
                <span className="sr-level-label">{t("refine.level")}</span>
                <span className="sr-level-num">+{level}</span>
              </div>
            </div>
          </div>

          <div className="sr-track mt-10 w-full max-w-[520px]" aria-hidden="true">
            <div className="sr-track-line"><div className="sr-track-fill" /></div>
            {Array.from({ length: MAX + 1 }, (_, i) => (
              <span key={i} className={`sr-pip ${i <= level ? "is-on" : ""} ${i === level ? "is-cur" : ""}`} style={v({ left: `${(i / MAX) * 100}%` })}>
                {i % 5 === 0 ? `+${i}` : ""}
              </span>
            ))}
          </div>

          <button type="button" onClick={refine} disabled={phase !== "idle"} className="sr-btn mt-10 rounded-full px-8 py-4 text-base font-extrabold tracking-[0.2em] text-primary-foreground disabled:opacity-70">
            {label}
          </button>
        </div>
      </div>
    </section>
  );
}
