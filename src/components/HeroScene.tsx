import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { TrailerRune } from "./YouTubeMedia";
import "./hero-scene.css";

/* Official Steam key art + logo + approved microtrailer, all already in /public/ragnarok. */
const LIB = "/ragnarok/library-hero-2x.jpg";
const CAPSULE = "/ragnarok/hero-capsule-2x.jpg";
const LOGO = "/ragnarok/logo-2x.png";
const VIDEO_WEBM = "/ragnarok/microtrailer.webm";
const VIDEO_MP4 = "/ragnarok/microtrailer.mp4";

const v = (o: Record<string, string | number>) => o as CSSProperties;
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const RUNES = ["✦", "◆", "✧", "◈", "✦", "◆", "✧", "◈"];
const SPARKS = Array.from({ length: 18 }, (_, i) => ({
  l: 52 + ((i * 29) % 40),
  t: 20 + ((i * 17) % 60),
  d: (i * 0.37) % 4,
  s: 3 + (i % 3) * 2,
}));
const MOTES = Array.from({ length: 22 }, (_, i) => ({
  l: (i * 47) % 100,
  d: (i * 0.53) % 9,
  s: 2 + (i % 3),
  dur: 8 + (i % 6),
}));

export function HeroScene({ t, cta }: { t: (k: string) => string; cta: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(rm.matches);
    const el = root.current;
    if (!el) return;

    /* Smoothed pointer + scroll values written to CSS variables. Skipped entirely for reduced motion. */
    if (!rm.matches) {
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      let raf = 0;
      let tx = 0, ty = 0, cx = 0, cy = 0;
      let ts = 0, cs = 0;
      const loop = () => {
        cx += (tx - cx) * 0.07;
        cy += (ty - cy) * 0.07;
        cs += (ts - cs) * 0.12;
        el.style.setProperty("--mx", cx.toFixed(4));
        el.style.setProperty("--my", cy.toFixed(4));
        el.style.setProperty("--s", cs.toFixed(4));
        const busy = Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(ts - cs) > 0.0005;
        raf = busy ? requestAnimationFrame(loop) : 0;
      };
      const kick = () => {
        if (!raf) raf = requestAnimationFrame(loop);
      };
      const onScroll = () => {
        ts = clamp(window.scrollY / Math.max(window.innerHeight * 0.9, 1));
        kick();
      };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        tx = clamp((e.clientX - r.left) / r.width) - 0.5;
        ty = clamp((e.clientY - r.top) / r.height) - 0.5;
        kick();
      };
      const onLeave = () => {
        tx = 0;
        ty = 0;
        kick();
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      if (fine) {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
      }
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        cancelAnimationFrame(raf);
      };
    }
  }, []);

  /* Gameplay clip plays only while the hero is on screen; paused otherwise. */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || reduced) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) vid.play().catch(() => {});
      else vid.pause();
    }, { threshold: 0.05 });
    io.observe(vid);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section id="top" ref={root} aria-labelledby="hero-title" className="hero-scene relative isolate min-h-[100svh] overflow-hidden">
      {/* Layer 1–2 · Midgard key art, sharp, slow parallax + scroll push */}
      <div className="hs-world" aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet={CAPSULE} />
          <img src={LIB} alt="" width={1568} height={506} fetchPriority="high" className="hs-art" />
        </picture>
        <div className="hs-shaft hs-shaft-a" />
        <div className="hs-shaft hs-shaft-b" />
        <div className="hs-fog hs-fog-a" />
        <div className="hs-fog hs-fog-b" />
        <div className="hs-veil" />
      </div>

      {/* Layer 4 · Portal with gameplay clip inside */}
      <div className="hs-portal-wrap" aria-hidden="true">
        <div className="hs-glow" />
        <div className="hs-portal">
          <span className="hs-ring hs-ring-1" />
          <span className="hs-ring hs-ring-2" />
          <span className="hs-ring hs-ring-3" />
          <span className="hs-energy" />
          <div className="hs-portal-frame">
            <img src={LIB} alt="" className="hs-portal-poster" />
            <video
              ref={videoRef}
              className="hs-portal-video"
              autoPlay={!reduced}
              muted
              loop
              playsInline
              preload="metadata"
              poster={LIB}
              disablePictureInPicture
              aria-hidden="true"
            >
              <source src={VIDEO_WEBM} type="video/webm" />
              <source src={VIDEO_MP4} type="video/mp4" />
            </video>
            <span className="hs-portal-shine" />
          </div>
          <span className="hs-pulse" />
          <div className="hs-runes">
            {RUNES.map((r, i) => (
              <span key={i} style={v({ "--a": `${i * 45}deg` })}>
                <span>{r}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hs-trailer">
        <TrailerRune label={t("hero.trailer")} />
      </div>

      {/* Layer 5 · Foreground particles, crystals, sparks — fastest parallax */}
      <div className="hs-fg" aria-hidden="true">
        {MOTES.map((m, i) => (
          <span key={i} className="hs-mote" style={v({ left: `${m.l}%`, animationDelay: `${m.d}s`, animationDuration: `${m.dur}s`, width: `${m.s}px`, height: `${m.s}px` })} />
        ))}
        {SPARKS.map((p, i) => (
          <span key={i} className="hs-spark" style={v({ left: `${p.l}%`, top: `${p.t}%`, animationDelay: `${p.d}s`, width: `${p.s}px`, height: `${p.s}px` })} />
        ))}
        <span className="hs-crystal hs-crystal-a" />
        <span className="hs-crystal hs-crystal-b" />
        <span className="hs-crystal hs-crystal-c" />
      </div>

      {/* Copy · left side on desktop, bottom on mobile */}
      <div className="hs-copy relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 sm:px-6">
        <div className="max-w-xl">
          <img src={LOGO} alt="Ragnarok: The New World" width={460} height={180} className="hs-logo mb-5 h-auto w-[min(70vw,400px)]" />
          <h1 id="hero-title" className="hs-title">
            <span>{t("hero.title1")}</span>
            <span className="text-gold">{t("hero.title2")}</span>
          </h1>
          <p className="hs-sub mt-6">{t("hero.body")}</p>
          <div className="hs-cta mt-8">{cta}</div>
        </div>
      </div>

      <div className="hs-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-32" aria-hidden="true" />
    </section>
  );
}
