import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./yt-media.css";

export type YTVideo = { id: string; title: string; tag: string };

export const YT_VIDEOS = {
  gilded: { id: "5hY9Gps1je0", title: "Dream Box Update Preview", tag: "Official · Gilded Bloom" },
  trapper: { id: "rFhWopYh-b4", title: "Endless Tower LV50 · Goblin Leader as Trapper POV", tag: "Community gameplay" },
  halloween: { id: "t_V5MbND8zU", title: "Halloween Nights · Two New Class Paths", tag: "Official · New class paths" },
} satisfies Record<string, YTVideo>;

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useTiltVars<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return ref;
}

function YTThumb({ id }: { id: string }) {
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
  return (
    <img
      src={src}
      alt=""
      width={1280}
      height={720}
      loading="lazy"
      decoding="async"
      className="yt-thumb-img"
      onError={() => setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
    />
  );
}

function YTLightbox({ video, onClose }: { video: YTVideo; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="yt-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="yt-lightbox-frame">
        <button type="button" className="yt-lightbox-close" onClick={onClose} aria-label="Close video">✕</button>
        <div className="yt-lightbox-player">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className="yt-lightbox-title">{video.title}</p>
      </div>
    </div>
  );
}

function YTPortalCard({ video, compact = false }: { video: YTVideo; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`yt-card ${compact ? "yt-card-compact" : ""}`} aria-label={`Play video: ${video.title}`}>
        <YTThumb id={video.id} />
        <span className="yt-vignette" aria-hidden="true" />
        <span className="yt-sweep" aria-hidden="true" />
        <span className="yt-play" aria-hidden="true">
          <span className="yt-play-ring" />
          <span className="yt-play-core">▶</span>
        </span>
        <span className="yt-watch-label" aria-hidden="true">WATCH</span>
        <span className="yt-card-meta">
          <em>{video.tag}</em>
          <strong>{video.title}</strong>
        </span>
      </button>
      {open && createPortal(<YTLightbox video={video} onClose={close} />, document.body)}
    </>
  );
}

export function DruidGameWindow() {
  const tilt = useTiltVars<HTMLDivElement>();
  return (
    <div ref={tilt} className="druid-window" aria-label="Official Ragnarok video preview">
      <div className="druid-window-glow" aria-hidden="true" />
      <span className="druid-window-tag">OFFICIAL VIDEO</span>
      <div className="druid-window-inner">
        <YTPortalCard video={YT_VIDEOS.halloween} compact />
      </div>
    </div>
  );
}

export function MonitorGameplay() {
  const tilt = useTiltVars<HTMLDivElement>();
  return (
    <div ref={tilt} className="monitor-wrap">
      <div className="monitor-energy" aria-hidden="true" />
      <div className="monitor-screen">
        <YTPortalCard video={YT_VIDEOS.trapper} compact />
        <div className="monitor-scan" aria-hidden="true" />
      </div>
    </div>
  );
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53) % 100,
  delay: ((i * 0.37) % 6).toFixed(2),
  dur: 6 + (i % 5),
  size: 2 + (i % 3),
}));

export function WatchMidgard() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const stage = useTiltVars<HTMLDivElement>();
  const paused = hovered !== null;
  const list = [YT_VIDEOS.gilded, YT_VIDEOS.trapper, YT_VIDEOS.halloween];

  useEffect(() => {
    if (paused || reduced()) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % list.length), 5200);
    return () => window.clearInterval(id);
  }, [paused, list.length]);

  return (
    <section aria-labelledby="watch-title" className="watch-section relative isolate overflow-hidden px-4 py-28 sm:px-6">
      <div className="watch-bg absolute inset-0 -z-10" aria-hidden="true" />
      <div className="watch-particles pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span key={i} style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
        ))}
      </div>

      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">Official gameplay media</p>
          <h2 id="watch-title" className="watch-title text-3xl font-extrabold leading-tight sm:text-5xl">
            WATCH <span className="text-gold">MIDGARD</span> IN MOTION
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">Trailers, updates and gameplay. Pick a video and press play.</p>
        </header>

        <div ref={stage} className="watch-stage" onMouseLeave={() => setHovered(null)}>
          <div className="watch-rune-ring" aria-hidden="true" />
          {list.map((v, i) => {
            const slot = (((i - active) % 3) + 3) % 3;
            return (
              <div
                key={v.id}
                className={`watch-slot watch-slot-${slot} ${hovered === i ? "is-hovered" : ""}`}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
              >
                <div className="watch-card-float"><YTPortalCard video={v} /></div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center gap-3" role="tablist" aria-label="Choose a video">
          {list.map((v, i) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Show ${v.title}`}
              onClick={() => setActive(i)}
              className={`watch-dot ${active === i ? "is-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrailerRune({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="hs-rune-btn" aria-label={`${label}: ${YT_VIDEOS.halloween.title}`}>
        <span className="hs-rune-ring" aria-hidden="true" />
        <span className="hs-rune-core" aria-hidden="true">▶</span>
        <span className="hs-rune-text">{label}</span>
      </button>
      {open && createPortal(<YTLightbox video={YT_VIDEOS.halloween} onClose={close} />, document.body)}
    </>
  );
}
