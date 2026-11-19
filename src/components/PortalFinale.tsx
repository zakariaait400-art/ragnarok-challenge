import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./finale.css";

const LIB = "/ragnarok/library-hero-2x.jpg";
const CDN = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4212480";
const GATE_IMG = `${CDN}/5e713dc34913ffbf4c357214f43d1efa65e02a20/ss_5e713dc34913ffbf4c357214f43d1efa65e02a20.1920x1080.jpg?t=1787308460`;

const v = (o: Record<string, string | number>) => o as CSSProperties;
const RUNES = ["✦", "◆", "✧", "◈", "✦", "◆", "✧", "◈", "✦", "◆", "✧", "◈"];
const MOTES = Array.from({ length: 24 }, (_, i) => ({ l: (i * 43) % 100, d: (i * 0.47) % 8, s: 2 + (i % 3), dur: 9 + (i % 6) }));
const FRAGS = [
  { l: 8, t: 30, s: 16, d: 0 },
  { l: 88, t: 22, s: 12, d: 1.4 },
  { l: 14, t: 74, s: 10, d: 2.2 },
  { l: 84, t: 70, s: 14, d: 0.7 },
  { l: 50, t: 88, s: 9, d: 3.1 },
];

export function PortalFinale({ t, cta }: { t: (k: string) => string; cta: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setEntered(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setEntered(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="go2offer" ref={ref} aria-labelledby="final-title" className={`pf-wrap relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-28 text-center sm:px-6 ${entered ? "is-in" : ""}`}>
      <div className="pf-bg absolute inset-0 -z-20" aria-hidden="true">
        <img src={LIB} alt="" width={1568} height={506} loading="lazy" decoding="async" className="pf-art" />
      </div>
      <div className="pf-chars absolute inset-0 -z-10" aria-hidden="true">
        <img src={LIB} alt="" width={1568} height={506} loading="lazy" decoding="async" className="pf-art" />
      </div>
      <div className="pf-veil absolute inset-0 -z-10" aria-hidden="true" />
      <div className="pf-fog pf-fog-a absolute -z-10" aria-hidden="true" />
      <div className="pf-fog pf-fog-b absolute -z-10" aria-hidden="true" />
      <div className="pf-motes pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {MOTES.map((m, i) => (
          <span key={i} style={v({ left: `${m.l}%`, animationDelay: `${m.d}s`, animationDuration: `${m.dur}s`, width: `${m.s}px`, height: `${m.s}px` })} />
        ))}
      </div>
      <div className="pf-frags pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {FRAGS.map((f, i) => (
          <span key={i} className="pf-frag" style={v({ left: `${f.l}%`, top: `${f.t}%`, width: `${f.s}px`, height: `${f.s * 1.5}px`, animationDelay: `${f.d}s` })} />
        ))}
      </div>

      <div className="pf-stage relative" aria-hidden="true">
        <span className="pf-light" />
        <span className="pf-ring pf-ring-1" />
        <span className="pf-ring pf-ring-2" />
        <span className="pf-ring pf-ring-3" />
        <span className="pf-energy" />
        <div className="pf-portal">
          <div className="pf-gate">
            <span className="pf-gate-dark" />
            <img src={GATE_IMG} alt="" width={1920} height={1080} loading="lazy" decoding="async" className="pf-gate-img" />
            <span className="pf-gate-shine" />
          </div>
          <div className="pf-runes">
            {RUNES.map((r, i) => (
              <span key={i} style={v({ "--a": `${i * 30}deg` })}><span>{r}</span></span>
            ))}
          </div>
        </div>
      </div>

      <div className="pf-copy relative z-10 mx-auto mt-6 max-w-4xl">
        <p className="pf-eyebrow">{t("final.eyebrow")}</p>
        <h2 id="final-title" className="pf-title">
          <span>{t("final.title1")}</span>
          <span className="text-gold">{t("final.title2")}</span>
        </h2>
        <p className="pf-line mt-4">{t("final.line")}</p>
        <div className="pf-cta mt-9">
          <span className="pf-spark pf-spark-a" aria-hidden="true" />
          <span className="pf-spark pf-spark-b" aria-hidden="true" />
          <span className="pf-spark pf-spark-c" aria-hidden="true" />
          {cta}
        </div>
        <p className="pf-note mt-6">{t("final.note")}</p>
      </div>
    </section>
  );
}
