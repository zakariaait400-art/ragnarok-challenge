import { useEffect, useState, type CSSProperties } from "react";
import "./codex.css";

const Q_KEYS = ["faq.q0", "faq.q1", "faq.q2", "faq.q3", "faq.q4", "faq.q5"] as const;
const A_KEYS = ["faq.a0", "faq.a1", "faq.a2", "faq.a3", "faq.a4", "faq.a5"] as const;
const GLYPHS = ["✦", "☾", "⚔", "◈", "❖", "✧"];
const v = (o: Record<string, string | number>) => o as CSSProperties;

function RuneBurst() {
  return (
    <span className="cx-burst" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <span key={i} style={v({ "--dx": `${Math.cos(a) * 90}px`, "--dy": `${Math.sin(a) * 90}px` })} />;
      })}
    </span>
  );
}

export function AdventurerCodex({ t }: { t: (k: string) => string }) {
  const [active, setActive] = useState(0);
  const [burst, setBurst] = useState(0);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const select = (i: number) => {
    setActive(mobile && active === i ? -1 : i);
    setBurst((b) => b + 1);
  };

  const shown = active < 0 ? 0 : active;

  return (
    <section id="faq" aria-labelledby="faq-title" className="cx-wrap relative isolate overflow-hidden px-4 py-24 sm:px-6">
      <div className="cx-bg absolute inset-0 -z-10" aria-hidden="true" />
      <div className="cx-runes pointer-events-none absolute left-1/2 top-1/2 -z-10" aria-hidden="true">
        <span className="cx-rune-ring cx-rune-ring-a" />
        <span className="cx-rune-ring cx-rune-ring-b" />
      </div>
      <div className="cx-motes pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} style={v({ left: `${(i * 41) % 100}%`, animationDelay: `${(i * 0.45) % 6}s`, animationDuration: `${8 + (i % 6)}s`, "--m": `${2 + (i % 3)}px` })} />
        ))}
      </div>

      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">{t("faq.eyebrow")}</p>
          <h2 id="faq-title" className="text-3xl font-extrabold leading-tight sm:text-5xl">{t("faq.title")}</h2>
        </header>

        <div className="cx-grid">
          <ol className="cx-list">
            {Q_KEYS.map((qKey, i) => {
              const on = i === active;
              return (
                <li key={qKey}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-expanded={on}
                    aria-controls={`cx-answer-${i}`}
                    className={`cx-tab ${on ? "is-active" : ""}`}
                  >
                    <span className="cx-rune" aria-hidden="true">{GLYPHS[i]}</span>
                    <span className="cx-q">{t(qKey)}</span>
                    <span className="cx-chev" aria-hidden="true">+</span>
                  </button>
                  <div id={`cx-answer-${i}`} role="region" className={`cx-mobile-a ${on ? "is-open" : ""}`}>
                    <div><p>{t(A_KEYS[i]!)}</p></div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="cx-panel-wrap">
            <article key={shown} className="cx-panel" aria-live="polite">
              <div className="cx-panel-frame" aria-hidden="true" />
              <div className="cx-glyph-wrap">
                <span className="cx-glyph-ring" aria-hidden="true" />
                <span key={`g${burst}`} className="cx-glyph" aria-hidden="true">{GLYPHS[shown]}</span>
                {burst > 0 && <RuneBurst key={burst} />}
              </div>
              <p className="cx-label">{String(shown + 1).padStart(2, "0")} / 06</p>
              <h3 className="cx-panel-q">{t(Q_KEYS[shown]!)}</h3>
              <p className="cx-panel-a">{t(A_KEYS[shown]!)}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
