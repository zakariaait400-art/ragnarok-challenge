import { useEffect, useRef, useState, useCallback } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isTouch = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none), (pointer: coarse)").matches;

/** Custom fantasy cursor: gold/rune glow with a subtle trailing halo. Desktop only. */
export function useFantasyCursor() {
  useEffect(() => {
    if (reducedMotion() || isTouch()) return;
    const dot = document.createElement("div");
    const trail = document.createElement("div");
    dot.className = "cursor-rune-dot";
    trail.className = "cursor-rune-trail";
    const wrap = document.createElement("div");
    wrap.style.position = "fixed";
    wrap.style.inset = "0";
    wrap.style.pointerEvents = "none";
    wrap.style.zIndex = "9999";
    wrap.append(dot, trail);
    document.documentElement.classList.add("cursor-rune-enabled");
    document.body.appendChild(wrap);

    let rx = 0,
      ry = 0,
      dx = 0,
      dy = 0,
      raf = 0;
    const move = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      trail.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (Math.abs(dx - rx) > 0.5 || Math.abs(dy - ry) > 0.5) {
        raf = requestAnimationFrame(loop);
      } else raf = 0;
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest("button, a, [role='tab'], img, .tilt-card, .marquee-card"))
        document.documentElement.classList.add("cursor-rune-active");
    };
    const out = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest("button, a, [role='tab'], img, .tilt-card, .marquee-card"))
        document.documentElement.classList.remove("cursor-rune-active");
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mouseout", out, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-rune-enabled", "cursor-rune-active");
      wrap.remove();
    };
  }, []);
}

/** Magnetic hover: element gently follows the pointer while hovered. */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || isTouch()) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}

/** 3D tilt + mouse-follow glow for important cards. */
export function useTilt<T extends HTMLElement>(max = 8) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || isTouch()) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg)`;
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max]);
  return ref;
}

/** IntersectionObserver-based reveal-on-scroll. Returns ref + visible flag. */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) { setVisible(true); return; }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/** Subtle parallax of an element based on pointer position within a container. */
export function useMouseParallax<T extends HTMLElement>(depth = 18) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || isTouch()) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top - 100 || e.clientY > r.bottom + 100) return;
      const x = (e.clientX / window.innerWidth - 0.5) * depth;
      const y = (e.clientY / window.innerHeight - 0.5) * depth;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [depth]);
  return ref;
}

/** Drag/swipe + autoplay marquee controller. */
export function useMarquee(speed = 60) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ active: false, startX: 0, offset: 0, base: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!trackRef.current) return;
    drag.current.active = true;
    drag.current.startX = e.clientX;
    const m = trackRef.current.style.transform.match(/translateX\((-?\d+\.?\d*)px\)/);
    drag.current.base = m ? parseFloat(m[1]) : 0;
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
    setPaused(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active || !trackRef.current) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.offset = drag.current.base + dx;
    trackRef.current.style.transform = `translateX(${drag.current.offset}px)`;
  }, []);

  const endDrag = useCallback(() => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (trackRef.current) {
      trackRef.current.style.transform = "";
    }
    setPaused(false);
  }, []);

  return {
    containerRef,
    trackRef,
    paused,
    setPaused,
    onPointerDown,
    onPointerMove,
    endDrag,
    speed,
  };
}
