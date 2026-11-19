import { useEffect, useState, type CSSProperties } from "react";
import "./sections-extra.css";

type Kind = "xp" | "coins" | "mat";
type Drop = { id: number; kind: Kind; left: number; dur: number; collect: boolean };

const ICON: Record<Kind, string> = { xp: "✦", coins: "◉", mat: "⬢" };
const KINDS: Kind[] = ["xp", "coins", "mat"];
const v = (o: Record<string, string | number>) => o as CSSProperties;

export function OfflineFarming({ t }: { t: (k: string) => string }) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [focus, setFocus] = useState<Kind | null>(null);
  const [pulse, setPulse] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(rm.matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let n = 0;
    const id = window.setInterval(() => {
      n++;
      const drop: Drop = {
        id: n,
        kind: KINDS[n % 3]!,
        left: 8 + Math.random() * 84,
        dur: 3.4 + Math.random() * 1.4,
        collect: false,
      };
      setDrops((d) => [...d.slice(-11), drop]);
      window.setTimeout(() => setDrops((d) => d.filter((x) => x.id !== drop.id)), drop.dur * 1000);
    }, 950);
    return () => window.clearInterval(id);
  }, [reduced]);

  const collect = () => {
    setDrops((d) => d.map((x) => ({ ...x, collect: true })));
    setPulse((p) => p + 1);
    window.setTimeout(() => setDrops((d) => d.filter((x) => !x.collect)), 650);
  };

  const rows: { k: Kind; label: string; dur: string }[] = [
    { k: "xp", label: t("idle.xp"), dur: "9s" },
    { k: "coins", label: t("idle.coins"), dur: "13s" },
    { k: "mat", label: t("idle.mat"), dur: "17s" },
  ];

  return (
    <section id="offline" aria-labelledby="of-title" className="of-wrap relative isolate overflow-hidden px-4 py-28 sm:px-6">
      <div className="of-bg absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="of-scene-wrap relative">
          <div className="of-scene" data-focus={focus ?? ""}>
            <div className="of-sky of-sky-day" aria-hidden="true" />
            <div className="of-sky of-sky-night" aria-hidden="true" />
            <div className="of-stars" aria-hidden="true">
              {Array.from({ length: 16 }, (_, i) => (
                <span key={i} style={v({ left: `${(i * 23) % 100}%`, top: `${(i * 17) % 45}%`, animationDelay: `${(i * 0.3) % 3}s` })} />
              ))}
            </div>
            <div className="of-sun" aria-hidden="true" />
            <div className="of-moon" aria-hidden="true" />
            <div className="of-hills" aria-hidden="true" />
            <div className="of-tent" aria-hidden="true" />
            <div className="of-fire" aria-hidden="true">
              <span className="of-flame" />
              <span className="of-flame of-flame-2" />
              <span className="of-embers"><span /><span /><span /></span>
            </div>
            <div className="of-char" aria-hidden="true">
              <span className="of-zz">Z</span>
              <span className="of-zz of-zz-2">Z</span>
              <svg viewBox="0 0 120 150" className="of-char-svg">
                <ellipse cx="60" cy="144" rx="46" ry="6" fill="#000" opacity="0.35" />
                <g className="of-breathe">
                  <path d="M34 144 Q38 96 60 88 Q82 96 86 144 Z" fill="#2b1f5c" />
                  <path d="M42 120 Q60 112 78 120" stroke="#ffd76a" strokeWidth="2" fill="none" opacity="0.8" />
                  <circle cx="60" cy="70" r="17" fill="#f1d3ad" />
                  <path d="M42 66 Q60 34 78 66 Z" fill="#6a4bd1" />
                  <path d="M42 66 L78 66" stroke="#ffd76a" strokeWidth="3" />
                  <circle cx="60" cy="34" r="4" fill="#ffd76a" />
                  <path d="M52 74 Q60 79 68 74" stroke="#7a4a3a" strokeWidth="1.6" fill="none" />
                </g>
              </svg>
            </div>
            <div className="of-ground" aria-hidden="true" />

            {drops.map((d) => (
              <span key={d.id} className={`of-drop of-drop-${d.kind} ${d.collect ? "is-collect" : ""}`} style={v({ left: `${d.left}%`, animationDuration: `${d.dur}s` })} aria-hidden="true">
                {ICON[d.kind]}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">{t("idle.label")}</p>
          <h2 id="of-title" className="text-3xl font-extrabold uppercase leading-tight sm:text-5xl">{t("idle.title")}</h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">{t("idle.sub")}</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <span className="classes-chip">{t("idle.chip1")}</span>
            <span className="classes-chip">{t("idle.chip2")}</span>
            <span className="classes-chip">{t("idle.chip3")}</span>
          </div>

          <div className="of-hud glass mt-10 rounded-2xl p-5 sm:p-6" key={pulse}>
            <div className="mb-5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gold"><span className="of-hud-dot" aria-hidden="true" />{t("idle.hud")}</span>
              <span className="text-[0.65rem] font-bold tracking-[0.3em] text-accent">{t("idle.away")}</span>
            </div>
            <ul className="space-y-4">
              {rows.map((r) => (
                <li key={r.k} onMouseEnter={() => setFocus(r.k)} onMouseLeave={() => setFocus(null)} onFocus={() => setFocus(r.k)} onBlur={() => setFocus(null)} tabIndex={0} className={`of-row of-row-${r.k} ${focus === r.k ? "is-focus" : ""}`}>
                  <span className="of-row-icon" aria-hidden="true">{ICON[r.k]}</span>
                  <span className="of-row-label">{r.label}</span>
                  <span className="of-bar" aria-hidden="true"><span className="of-bar-fill" style={v({ animationDuration: r.dur })} /></span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={collect} className="of-collect mt-6 w-full rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.2em] text-primary-foreground">{t("idle.collect")}</button>
            <p className="mt-4 text-center text-xs text-foreground/50">{t("idle.note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
