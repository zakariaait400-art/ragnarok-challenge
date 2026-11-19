import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  useFantasyCursor,
  useMagnetic,
  useTilt,
  useReveal,
  useMouseParallax,
  useMarquee,
} from "../lib/motion";
import {
  I18nContext,
  LANGUAGES,
  type Lang,
  type I18nContextValue,
  translate,
  useI18n,
} from "../lib/i18n";

export const STEAM_URL = "https://store.steampowered.com/app/4212480/Ragnarok_The_New_World/";
const STEAMDB_URL = "https://steamdb.info/app/4212480/info/";
const CDN = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4212480";
const HEADER = `${CDN}/95dc4b582f4d09290a50f6ea717136df91247be6/header.jpg?t=1787308460`;
const SS = [
  "49379583f1a9b7b785fb5e8df9999444b4adca02",
  "613a821770b711254b794ec654887573b8e67d18",
  "72c32dd5e97f198ae9662c35263d1a1d2011e632",
  "ed50bc838811f72959e6f224334f2b8acdd8474a",
  "a5eee3c0eb5a78ae27e06ffc484e30df5492f173",
  "eaf59192ab042d69bacd06299272d7ca8209ab61",
  "5e713dc34913ffbf4c357214f43d1efa65e02a20",
  "0c4d07f205be20c10329991aa1aa4457b70cc126",
];
const ss = (i: number, size: "1920x1080" | "600x338" = "1920x1080") =>
  `${CDN}/${SS[i]}/ss_${SS[i]}.${size}.jpg?t=1787308460`;

const TITLE = "Ragnarok: The New World — Rediscover Midgard, Play Free on Steam";
const DESC =
  "Officially licensed cross-platform Ragnarok MMORPG. 8 classes including the new Druid, refining with no level loss on failure, offline progress. Free-to-play on Steam.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ss(0) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ss(0) },
    ],
    links: [{ rel: "preload", as: "image", href: ss(0) }],
  }),
  component: Index,
});

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Primary CTA — now smooth-scrolls to #offer instead of going to Steam */
function OfferCta({ size = "md", label, glow = false }: { size?: "sm" | "md" | "lg"; label: string; glow?: boolean }) {
  const pad = size === "lg" ? "px-8 py-4 text-base sm:text-lg" : size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3 text-base";
  const mag = useMagnetic<HTMLAnchorElement>(0.3);
  const onClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("offer");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return (
    <a
      ref={mag}
      href="#offer"
      onClick={onClick}
      className={`magnetic bg-gold shadow-gold ${glow ? "cta-glow" : ""} inline-flex items-center justify-center gap-2 rounded-full font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${pad}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 2a10 10 0 0 0-9.96 9.04l5.35 2.21a2.8 2.8 0 0 1 1.6-.5l2.39-3.46v-.05a3.78 3.78 0 1 1 3.78 3.78h-.09l-3.4 2.43a2.83 2.83 0 0 1-5.6.6L2.3 14.5A10 10 0 1 0 12 2Zm-4.6 15.2-1.23-.5a2.12 2.12 0 1 0 1.15-2.85l1.27.53a1.56 1.56 0 1 1-1.2 2.82Zm9.7-7.47a2.52 2.52 0 1 0-2.52 2.52 2.52 2.52 0 0 0 2.52-2.52Zm-4.4 0a1.89 1.89 0 1 1 1.88 1.89 1.89 1.89 0 0 1-1.88-1.89Z"/></svg>
      {label}
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">{children}</p>;
}

function SectionTitle({ eyebrow, title, sub, id }: { eyebrow: string; title: React.ReactNode; sub?: string; id?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground sm:text-lg">{sub}</p>}
    </div>
  );
}

const NAV_KEYS = ["nav.why", "nav.druid", "nav.progress", "nav.firstLogin", "nav.faq"] as const;
const NAV_HREFS = ["#why", "#druid", "#progress", "#first-login", "#faq"] as const;

function Header({ t }: { t: (k: string) => string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const { lang, setLang } = useI18nCtx();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy for active section
  useEffect(() => {
    const sections = NAV_HREFS.map((h) => document.querySelector(h)).filter(Boolean) as Element[];
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".lang-selector")) setLangOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [langOpen]);

  const currentLang = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <header className={`nav-premium ${scrolled || open ? "nav-scrolled" : "nav-transparent"}`}>
      <div className="nav-border-glow" aria-hidden="true" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="nav-logo group" aria-label="Ragnarok: The New World — home">
          <img src="/ragnarok/logo-2x.png" alt="" width={120} height={48} className="h-9 w-auto transition-opacity group-hover:opacity-90" />
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-7 text-sm font-medium">
            {NAV_KEYS.map((key, i) => (
              <li key={key}>
                <a
                  href={NAV_HREFS[i]}
                  className={`nav-link ${activeSection === NAV_HREFS[i] ? "nav-link-active" : ""}`}
                >
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="lang-selector relative">
            <button
              type="button"
              className="lang-trigger"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label="Select language"
              onClick={() => setLangOpen((o) => !o)}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
              <span className="lang-trigger-code">{currentLang.native}</span>
            </button>
            {langOpen && (
              <ul className="lang-dropdown" role="listbox" aria-label="Languages">
                {LANGUAGES.map((l) => (
                  <li key={l.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={l.code === lang}
                      className={`lang-option ${l.code === lang ? "lang-option-active" : ""}`}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                    >
                      <span className="lang-option-native">{l.native}</span>
                      <span className="lang-option-label">{l.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="hidden sm:block"><OfferCta size="sm" label={t("cta.offerSm")} /></div>
          <button
            type="button"
            className="rounded-md p-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border px-4 pb-6 lg:hidden">
          <ul className="flex flex-col py-2">
            {NAV_KEYS.map((key, i) => (
              <li key={key}><a href={NAV_HREFS[i]} onClick={() => setOpen(false)} className="block py-3 text-lg font-medium">{t(key)}</a></li>
            ))}
          </ul>
          <OfferCta label={t("cta.offer")} />
        </nav>
      )}
    </header>
  );
}

function useI18nCtx() {
  return useI18n();
}

const HERO_POSTER = "/ragnarok/library-hero-2x.jpg";
const HERO_VIDEO_WEBM = "/ragnarok/microtrailer.webm";
const HERO_VIDEO_MP4 = "/ragnarok/microtrailer.mp4";
const HERO_LOGO = "/ragnarok/logo-2x.png";

function Hero({ t }: { t: (k: string) => string }) {
  const bg = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const depth = useMouseParallax<HTMLDivElement>(16);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (bg.current) bg.current.style.transform = `translate3d(0, ${Math.min(window.scrollY, 900) * 0.25}px, 0) scale(1.08)`;
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? v.play().catch(() => {}) : v.pause(); },
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-24">
      <div ref={bg} className="absolute inset-0 -z-20 scale-[1.08] will-change-transform">
        <img src={HERO_POSTER} alt="" width={1920} height={1080} fetchPriority="high" className="hero-poster h-full w-full object-cover" />
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}
          aria-hidden="true"
          className="hero-video absolute inset-0 h-full w-full object-cover"
        >
          <source src={HERO_VIDEO_WEBM} type="video/webm" />
          <source src={HERO_VIDEO_MP4} type="video/mp4" />
        </video>
      </div>
      <div className="hero-rays absolute inset-0 -z-10" aria-hidden="true" />
      <div className="hero-fog absolute inset-0 -z-10" aria-hidden="true" />
      <div className="hero-fog-2 absolute inset-0 -z-10" aria-hidden="true" />
      <div className="bg-hero-overlay absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="hero-particles pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="rune-ring hero-rune-1 pointer-events-none absolute -right-52 top-1/2 -z-10 hidden h-[48rem] w-[48rem] -translate-y-1/2 md:block" aria-hidden="true" />
      <div className="rune-ring hero-rune-2 pointer-events-none absolute -left-52 top-1/3 -z-10 hidden h-[36rem] w-[36rem] opacity-40 lg:block" aria-hidden="true" />
      <div ref={depth} className="mx-auto w-full max-w-7xl px-4 sm:px-6 will-change-transform">
        <div className="max-w-2xl">
          <img
            src={HERO_LOGO}
            alt="Ragnarok: The New World"
            width={460}
            height={180}
            fetchPriority="high"
            className="hero-logo mb-4 h-auto w-[min(70vw,420px)]"
          />
          <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          <h1 id="hero-title" className="text-4xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            <span className="reveal-line"><span style={{ animationDelay: "0.1s" }}>{t("hero.title1")}</span></span><br />
            <span className="reveal-line"><span className="text-gold" style={{ animationDelay: "0.35s" }}>{t("hero.title2")}</span></span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-foreground/90 sm:text-lg">
            {t("hero.body")}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <OfferCta size="lg" glow label={t("cta.startJourney")} />
            <a href="#first-login" className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-4 font-semibold transition-colors hover:border-primary hover:text-primary">
              {t("cta.howFirstLogin")} <span aria-hidden="true">→</span>
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Key facts">
            {[t("hero.fact1"), t("hero.fact2"), t("hero.fact3"), t("hero.fact4")].map((c) => (
              <li key={c} className="glass rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm">{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const WHY_ICONS = ["⚒", "☾", "⚔", "◈"];
const WHY_COLORS = [
  "oklch(0.8 0.14 78 / 45%)",
  "oklch(0.72 0.13 235 / 45%)",
  "oklch(0.7 0.1 160 / 45%)",
  "oklch(0.7 0.15 40 / 45%)",
];

function WhyPortal({ t }: { t: (k: string) => string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mobileIdx, setMobileIdx] = useState(0);
  const parallax = useMouseParallax<HTMLDivElement>(7);
  const active = hovered ?? mobileIdx;
  const current = active;
  const orbitRadius = 42;

  const whyData = [
    { icon: WHY_ICONS[0]!, title: t("why.f0t"), body: t("why.f0b"), color: WHY_COLORS[0]! },
    { icon: WHY_ICONS[1]!, title: t("why.f1t"), body: t("why.f1b"), color: WHY_COLORS[1]! },
    { icon: WHY_ICONS[2]!, title: t("why.f2t"), body: t("why.f2b"), color: WHY_COLORS[2]! },
    { icon: WHY_ICONS[3]!, title: t("why.f3t"), body: t("why.f3b"), color: WHY_COLORS[3]! },
  ];
  const w = whyData[current] ?? whyData[0]!;

  return (
    <section id="why" aria-labelledby="why-title" className="why-section relative isolate scroll-mt-20 overflow-hidden px-4 pb-24 pt-36 sm:px-6 sm:pt-40">
      <img
        src={ss(1)}
        alt=""
        width={1920}
        height={1080}
        loading="lazy"
        decoding="async"
        className="why-bg absolute inset-0 -z-30 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div className="why-bg-vignette absolute inset-0 -z-20" aria-hidden="true" />
      <div className="hero-particles pointer-events-none absolute inset-0 -z-10 opacity-35" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <SectionTitle
          id="why-title"
          eyebrow={t("why.eyebrow")}
          title={<>{t("why.title1")}<span className="text-gold">{t("why.title2")}</span></>}
          sub={t("why.sub")}
        />

        <div ref={parallax} className="relative hidden md:block will-change-transform">
          <div
            className="portal-stage"
            style={{ ["--portal-color" as string]: w.color }}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="portal-backdrop-orb" aria-hidden="true" />
            <div className="portal-glow" aria-hidden="true" />
            <div className="portal-arc" aria-hidden="true" />
            <div className="portal-ring portal-ring-outer" aria-hidden="true" />
            <div className="portal-ring portal-ring-mid" aria-hidden="true" />
            <div className="portal-ring portal-ring-inner" aria-hidden="true" />

            <div className="portal-core grid place-items-center text-center">
              <div key={active} className="portal-info animate-in fade-in zoom-in-95 duration-500">
                <p className="font-display text-gold text-xl font-bold leading-tight lg:text-2xl">{w.title}</p>
                <p className="mx-auto mt-3 max-w-[13.5rem] text-sm leading-relaxed text-foreground/75">{w.body}</p>
              </div>
            </div>

            <div className={`orbit-track ${hovered !== null ? "orbit-track-paused" : ""}`}>
              {whyData.map((item, i) => {
                const angle = (i / whyData.length) * Math.PI * 2 - Math.PI / 2;
                const left = 50 + Math.cos(angle) * orbitRadius;
                const top = 50 + Math.sin(angle) * orbitRadius;
                return (
                  <button
                    key={item.title}
                    type="button"
                    className="sigil"
                    data-active={i === active}
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      ["--portal-color" as string]: item.color,
                    }}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    aria-label={item.title}
                  >
                    <span className="sigil-counter">
                      <span className="sigil-icon" aria-hidden="true">{item.icon}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="portal-legend mx-auto mt-3 flex max-w-3xl items-center justify-center gap-2 text-center text-xs text-foreground/55">
            <span className="h-px w-10 bg-primary/30" aria-hidden="true" />
            {t("why.hint")}
            <span className="h-px w-10 bg-primary/30" aria-hidden="true" />
          </div>
        </div>

        <div className="md:hidden">
          <div
            className="portal-stage portal-stage-mobile mx-auto mb-7"
            style={{ ["--portal-color" as string]: w.color }}
          >
            <div className="portal-backdrop-orb" aria-hidden="true" />
            <div className="portal-glow" aria-hidden="true" />
            <div className="portal-arc" aria-hidden="true" />
            <div className="portal-ring portal-ring-outer" aria-hidden="true" />
            <div className="portal-ring portal-ring-mid" aria-hidden="true" />
            <div className="portal-core grid place-items-center text-center">
              <div key={active} className="portal-info animate-in fade-in zoom-in-95 duration-400">
                <p className="font-display text-gold text-sm font-bold leading-tight">{w.title}</p>
              </div>
            </div>
          </div>

          <div className="rune-selector" role="tablist" aria-label="Feature sigils">
            {whyData.map((item, i) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={i === mobileIdx}
                onClick={() => setMobileIdx(i)}
                className={`rune-selector-item glass rounded-2xl p-5 text-center transition-all ${i === mobileIdx ? "border-primary shadow-gold opacity-100" : "opacity-65"}`}
              >
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gold text-xl text-primary-foreground" aria-hidden="true">{item.icon}</div>
                <h3 className="text-sm font-bold">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">Swipe to explore</p>
        </div>
      </div>
    </section>
  );
}

const FORMS = [
  { id: "werewolf", name: "Werewolf", img: 2, accent: "oklch(0.82 0.14 78 / 42%)" },
  { id: "wereraptor", name: "Wereraptor", img: 3, accent: "oklch(0.7 0.1 160 / 42%)" },
  { id: "arcanist", name: "Human Arcanist", img: 4, accent: "oklch(0.72 0.13 235 / 42%)" },
];

function Druid({ t }: { t: (k: string) => string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = useMouseParallax<HTMLDivElement>(8);
  const f = FORMS[active] ?? FORMS[0]!;

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (active + d + FORMS.length) % FORMS.length;
    setActive(n);
    refs.current[n]?.focus();
  };

  return (
    <section
      id="druid"
      aria-labelledby="druid-title"
      className="druid-section relative isolate overflow-hidden px-4 py-28 sm:px-6"
      style={{ ["--druid-accent" as string]: f.accent }}
    >
      <div className="druid-bg absolute inset-0 -z-30" aria-hidden="true">
        {FORMS.map((x, i) => (
          <img
            key={x.id}
            src={ss(x.img)}
            alt=""
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${i === active ? "scale-105 opacity-35" : "scale-110 opacity-0"}`}
          />
        ))}
      </div>
      <div className="druid-vignette absolute inset-0 -z-20" aria-hidden="true" />
      <div className="druid-word pointer-events-none absolute inset-x-0 top-10 -z-10 text-center" aria-hidden="true">DRUID</div>
      <div className="druid-rune pointer-events-none absolute right-[-12rem] top-1/2 -z-10 h-[42rem] w-[42rem] -translate-y-1/2" aria-hidden="true" />
      <div className="hero-particles pointer-events-none absolute inset-0 -z-10 opacity-30" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>{t("druid.eyebrow")}</Eyebrow>
          <h2 id="druid-title" className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            {t("druid.title1")}<span className="text-gold">{t("druid.title2")}</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
            {t("druid.body")}
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="order-2 lg:order-1">
            <div
              role="tablist"
              aria-label="Druid forms"
              className="druid-tabs"
              onKeyDown={onKey}
            >
              {FORMS.map((x, i) => (
                <button
                  key={x.id}
                  ref={(el) => { refs.current[i] = el; }}
                  role="tab"
                  id={`tab-${x.id}`}
                  aria-selected={i === active}
                  aria-controls={`panel-${x.id}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="druid-tab"
                  data-active={i === active}
                >
                  <span className="druid-tab-num" aria-hidden="true">0{i + 1}</span>
                  <span className="druid-tab-name">{x.name}</span>
                  <span className="druid-tab-line" aria-hidden="true" />
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              id={`panel-${f.id}`}
              aria-labelledby={`tab-${f.id}`}
              key={f.id}
              className="druid-copy mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-accent">{t("druid.selectedForm")}</p>
              <h3 className="mt-2 text-3xl font-bold sm:text-4xl">{f.name}</h3>
              <p className="mt-4 max-w-md leading-relaxed text-foreground/70">
                {t("druid.formDesc")}
              </p>
              <div className="mt-7"><OfferCta label={t("cta.playDruid")} /></div>
            </div>
          </div>

          <div ref={stage} className="order-1 relative lg:order-2 will-change-transform">
            <div className="druid-stage-glow absolute -inset-12 -z-10" aria-hidden="true" />
            <div className="druid-stage">
              <div className="druid-stage-rim" aria-hidden="true" />
              {FORMS.map((x, i) => (
                <img
                  key={x.id}
                  src={ss(x.img)}
                  alt={i === active ? "Official Ragnarok: The New World screenshot used for the Druid feature section" : ""}
                  width={1920}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  className={`druid-stage-image ${i === active ? "is-active" : ""}`}
                />
              ))}
              <div className="druid-stage-shade" aria-hidden="true" />
              <div className="druid-stage-label">
                <span className="druid-stage-dot" aria-hidden="true" />
                {f.name}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-foreground/45">
          {t("druid.note")}
        </p>
      </div>
    </section>
  );
}

function Classes({ t }: { t: (k: string) => string }) {
  const parallax = useMouseParallax<HTMLDivElement>(10);
  const [hovered, setHovered] = useState<number | null>(null);
  const labels = ["Knight", "Wizard", "Druid", "Archer", "Assassin", "Priest", "Blacksmith", "Merchant"];
  return (
    <section aria-labelledby="classes-title" className="classes-section relative isolate overflow-hidden px-4 py-28 sm:px-6">
      <img
        src={ss(5)}
        alt=""
        width={1920}
        height={1080}
        loading="lazy"
        decoding="async"
        className="classes-bg absolute inset-0 -z-30 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div className="classes-vignette absolute inset-0 -z-20" aria-hidden="true" />
      <div className="hero-particles pointer-events-none absolute inset-0 -z-10 opacity-25" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow>{t("classes.eyebrow")}</Eyebrow>
          <h2 id="classes-title" className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            {t("classes.title1")}<span className="text-gold">{t("classes.title2")}</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
            {t("classes.body")}
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {[t("classes.chip1"), t("classes.chip2"), t("classes.chip3"), t("classes.chip4"), t("classes.chip5")].map((label) => (
              <span key={label} className="classes-chip">{label}</span>
            ))}
          </div>

          <div className="mt-9"><OfferCta label={t("cta.choosePath")} /></div>
        </div>

        <div ref={parallax} className="classes-orbit-wrap will-change-transform">
          <div className="classes-orbit" aria-label="Eight available classes visualized as eight paths">
            <div className="classes-orbit-halo" aria-hidden="true" />
            <div className="classes-orbit-ring classes-orbit-ring-a" aria-hidden="true" />
            <div className="classes-orbit-ring classes-orbit-ring-b" aria-hidden="true" />
            <div className="classes-orbit-ring classes-orbit-ring-c" aria-hidden="true" />
            <div className="classes-orbit-sweep" aria-hidden="true" />
            <div className="classes-sparkles" aria-hidden="true" />

            <svg className="classes-energy-lines" viewBox="0 0 100 100" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const x = 50 + Math.cos(angle) * 42;
                const y = 50 + Math.sin(angle) * 42;
                const druid = i === 2;
                return (
                  <line
                    key={i}
                    className={`classes-energy-line ${druid ? "is-druid" : ""}`}
                    x1="50" y1="50" x2={x} y2={y}
                  />
                );
              })}
            </svg>

            <div className="classes-core">
              <span className="classes-eight">8</span>
              <span className="classes-core-label">CLASSES</span>
            </div>

            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
              const radius = 42;
              const left = 50 + Math.cos(angle) * radius;
              const top = 50 + Math.sin(angle) * radius;
              const druid = i === 2;
              const label = labels[i] ?? `Class ${i + 1}`;
              return (
                <div
                  key={i}
                  className="class-node-pos"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${i * 0.18}s`,
                  }}
                >
                  <button
                    type="button"
                    className={`class-node ${druid ? "class-node-druid" : ""}`}
                    data-active={hovered === i}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onBlur={() => setHovered(null)}
                    aria-label={druid ? "Druid — new class debut" : `${label} class`}
                  >
                    <span aria-hidden="true">{druid ? "D" : String(i + 1).padStart(2, "0")}</span>
                    {druid && <em>DRUID</em>}
                    <span className="class-node-tooltip">{druid ? "DRUID · NEW" : label.toUpperCase()}</span>
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-center text-xs uppercase tracking-[0.24em] text-foreground/45">
            {t("classes.note")}
          </p>
        </div>
      </div>
    </section>
  );
}

const FRICTION_KEYS = ["progress.p0", "progress.p1", "progress.p2", "progress.p3"] as const;
const ANSWER_KEYS = ["progress.a0", "progress.a1", "progress.a2", "progress.a3"] as const;

function Friction({ t }: { t: (k: string) => string }) {
  return (
    <section id="progress" aria-labelledby="progress-title" className="progress-section relative isolate overflow-hidden px-4 py-28 sm:px-6">
      <div className="progress-grid-bg absolute inset-0 -z-20" aria-hidden="true" />
      <div className="progress-glow absolute left-1/2 top-1/2 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />

      <div className="mx-auto max-w-6xl">
        <SectionTitle
          id="progress-title"
          eyebrow={t("progress.eyebrow")}
          title={<>{t("progress.title1")}<span className="text-gold">{t("progress.title2")}</span></>}
          sub={t("progress.sub")}
        />

        <div className="progress-forge">
          {FRICTION_KEYS.map((pKey, i) => (
            <article key={pKey} className="progress-lane">
              <div className="progress-index" aria-hidden="true">0{i + 1}</div>

              <div className="progress-before">
                <span className="progress-kicker">{t("progress.kickerBefore")}</span>
                <p>{t(pKey)}</p>
                <span className="progress-strike" aria-hidden="true" />
              </div>

              <div className="progress-transfer" aria-hidden="true">
                <span className="progress-transfer-line" />
                <span className="progress-transfer-core">→</span>
              </div>

              <div className="progress-after">
                <span className="progress-kicker">{t("progress.kickerAfter")}</span>
                <p>{t(ANSWER_KEYS[i]!)}</p>
                <span className="progress-after-glow" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Platform({ t }: { t: (k: string) => string }) {
  const tilt = useTilt<HTMLDivElement>(5);
  return (
    <section aria-labelledby="pc-title" className="px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div ref={tilt} className="tilt-card relative will-change-transform">
          <div className="tilt-glow rounded-2xl" aria-hidden="true" />
          <img src={ss(6, "1920x1080")} alt="Official Ragnarok: The New World gameplay screenshot" width={1920} height={1080} loading="lazy" decoding="async" className="aspect-video w-full rounded-2xl border border-border object-cover shadow-card" />
          <div className="glass absolute -bottom-6 right-4 rounded-2xl px-5 py-3 text-center" style={{ animation: "float-y 5s ease-in-out infinite" }}>
            <p className="font-display text-gold text-3xl font-extrabold">120</p>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground">FPS SUPPORT</p>
          </div>
        </div>
        <div>
          <Eyebrow>{t("pc.eyebrow")}</Eyebrow>
          <h2 id="pc-title" className="text-3xl font-bold sm:text-4xl">{t("pc.title1")}<span className="text-gold">{t("pc.title2")}</span></h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">{t("pc.body")}</p>
          <details className="glass group mt-8 rounded-2xl p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
              {t("pc.requirements")}
              <span aria-hidden="true" className="text-2xl text-primary transition-transform group-open:rotate-45">+</span>
            </summary>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {[["Memory (min)", "12 GB RAM"], ["Memory (rec.)", "16 GB RAM"], ["Storage", "30 GB available"], ["Network", "Broadband internet"]].map(([k, v]) => (
                <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">{t("pc.fullSpecs")} <a className="underline hover:text-primary" href={STEAM_URL} {...ext}>{t("pc.steamPage")}</a>.</p>
          </details>
        </div>
      </div>
    </section>
  );
}

const STEP_KEYS = ["fl.s0t", "fl.s1t", "fl.s2t", "fl.s3t"] as const;
const STEP_DESC_KEYS = ["fl.s0d", "fl.s1d", "fl.s2d", "fl.s3d"] as const;

function FirstLogin({ t }: { t: (k: string) => string }) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  return (
    <section id="first-login" aria-labelledby="fl-title" className="px-4 py-24 sm:px-6">
      <div ref={ref} className="mx-auto max-w-7xl">
        <SectionTitle id="fl-title" eyebrow={t("fl.eyebrow")} title={<>{t("fl.title1")}<span className="text-gold">{t("fl.title2")}</span></>} sub={t("fl.sub")} />
        <ol className="relative grid gap-5 md:grid-cols-4">
          <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-[3px] md:block">
            <div className="h-full w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full bg-gold transition-all duration-[1400ms] ease-out ${visible ? "w-full" : "w-0"}`}
              />
            </div>
          </div>
          {STEP_KEYS.map((sKey, i) => {
            const last = i === STEP_KEYS.length - 1;
            return (
              <li
                key={sKey}
                className={`step-item relative rounded-2xl p-6 text-center ${last ? "bg-gold text-primary-foreground shadow-gold" : "glass"}`}
                style={{ animationDelay: `${0.25 + i * 0.18}s` }}
              >
                <span className={`font-display relative mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full text-2xl font-extrabold ${last ? "bg-background text-primary" : "bg-gold text-primary-foreground"}`}>{i + 1}</span>
                <h3 className="text-lg font-bold">{t(sKey)}</h3>
                <p className={`mt-2 text-sm ${last ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{t(STEP_DESC_KEYS[i]!)}</p>
                {last && <p className="font-display mt-4 text-sm font-extrabold tracking-[0.2em]">{t("fl.badge")}</p>}
              </li>
            );
          })}
        </ol>
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="rounded-full border border-primary px-4 py-2 font-semibold text-primary">{t("fl.tag")}</span>
            <span className="rounded-full border border-border px-4 py-2 text-muted-foreground">{t("fl.tag2")}</span>
            <span className="rounded-full border border-border px-4 py-2 text-muted-foreground">{t("fl.tag3")}</span>
          </div>
          <OfferCta size="lg" label={t("cta.startStep1")} />
        </div>
      </div>
    </section>
  );
}

function Gallery({ t }: { t: (k: string) => string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const m = useMarquee(70);
  const open = (i: number) => { setIdx(i); dlg.current?.showModal(); };
  const go = (d: number) => setIdx((i) => (i + d + SS.length) % SS.length);

  useEffect(() => { setMounted(true); }, []);

  const loop = [...SS, ...SS];

  return (
    <section aria-labelledby="gallery-title" className="py-24">
      <div className="px-4 sm:px-6"><SectionTitle id="gallery-title" eyebrow={t("gallery.eyebrow")} title={t("gallery.title")} sub={t("gallery.sub")} /></div>
      <div
        ref={m.containerRef}
        className="group relative overflow-hidden"
        onMouseEnter={() => m.setPaused(true)}
        onMouseLeave={() => { m.setPaused(false); }}
      >        <div
          ref={m.trackRef}
          className="marquee-track"
          style={{
            animation: `marquee-scroll ${m.speed}s linear infinite`,
            animationPlayState: mounted && !m.paused ? "running" : "paused",
          }}
          onPointerDown={m.onPointerDown}
          onPointerMove={m.onPointerMove}
          onPointerUp={m.endDrag}
          onPointerLeave={m.endDrag}
        >
          {loop.map((_, i) => {
            const real = i % SS.length;
            return (
              <button
                type="button"
                key={i}
                onClick={() => open(real)}
                onDragStart={(e) => e.preventDefault()}
                className="marquee-card relative block w-[80vw] shrink-0 overflow-hidden rounded-xl border border-border sm:w-[45vw] lg:w-[31vw] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Open screenshot ${real + 1} of ${SS.length}`}
                style={{ touchAction: "pan-y" }}
              >
                <img
                  src={ss(real, "600x338")}
                  alt={`Official Ragnarok: The New World screenshot ${real + 1}`}
                  width={600}
                  height={338}
                  loading={i < SS.length ? "lazy" : undefined}
                  decoding="async"
                  draggable={false}
                  className="aspect-video w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">{t("gallery.hint")}</p>
      <dialog ref={dlg} aria-label="Screenshot viewer" onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}
        onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}
        className="m-auto w-[min(95vw,1200px)] bg-transparent p-0 text-foreground backdrop:bg-background/90">
        <div className="relative">
          <img src={ss(idx)} alt={`Official screenshot ${idx + 1} of ${SS.length}`} width={1920} height={1080} className="aspect-video w-full rounded-xl object-cover" />
          <div className="mt-3 flex items-center justify-between gap-2">
            <button type="button" onClick={() => go(-1)} className="glass rounded-full px-4 py-2 font-semibold">← Prev</button>
            <span className="text-sm text-muted-foreground">{idx + 1} / {SS.length}</span>
            <button type="button" onClick={() => go(1)} className="glass rounded-full px-4 py-2 font-semibold">Next →</button>
            <button type="button" onClick={() => dlg.current?.close()} className="bg-gold rounded-full px-4 py-2 font-semibold text-primary-foreground" autoFocus>Close</button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

const FAQ_Q_KEYS = ["faq.q0", "faq.q1", "faq.q2", "faq.q3", "faq.q4", "faq.q5"] as const;
const FAQ_A_KEYS = ["faq.a0", "faq.a1", "faq.a2", "faq.a3", "faq.a4", "faq.a5"] as const;

function Faq({ t }: { t: (k: string) => string }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <SectionTitle id="faq-title" eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
        <div className="space-y-3">
          {FAQ_Q_KEYS.map((qKey, i) => (
            <details key={qKey} className="faq-item glass group rounded-2xl px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {t(qKey)}<span aria-hidden="true" className="text-2xl text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="faq-answer">
                <div>
                  <p className="pt-3 text-muted-foreground">{t(FAQ_A_KEYS[i]!)}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ t }: { t: (k: string) => string }) {
  const glow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (glow.current) {
          const y = (window.innerHeight - glow.current.getBoundingClientRect().top) * 0.04;
          glow.current.style.transform = `translate3d(0, ${y}px, 0) scale(1.05)`;
        }
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <section id="offer" aria-labelledby="final-title" className="relative isolate overflow-hidden px-4 py-28 text-center sm:px-6 scroll-mt-20">
      <div ref={glow} className="absolute inset-0 -z-20 scale-105 will-change-transform">
        <img src={HEADER} alt="" width={920} height={430} loading="lazy" decoding="async" className="h-full w-full object-cover opacity-30 blur-sm" />
      </div>
      <div className="bg-hero-overlay absolute inset-0 -z-10 rotate-180" />
      <div className="aura-pulse pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.8 0.14 78 / 30%), transparent 70%)" }} aria-hidden="true" />
      <div className="particles pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <h2 id="final-title" className="mx-auto max-w-3xl text-4xl font-extrabold sm:text-5xl md:text-6xl">{t("final.title1")}<span className="text-gold">{t("final.title2")}</span></h2>
      <div className="mt-10"><OfferCta size="lg" glow label={t("cta.goOffer")} /></div>
      <p className="mt-6 text-sm text-muted-foreground">{t("final.note")}</p>
    </section>
  );
}

function Footer({ t }: { t: (k: string) => string }) {
  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl">{t("footer.disclaimer")}</p>
        <ul className="flex gap-6">
          <li><a href={STEAM_URL} {...ext} className="hover:text-primary">{t("footer.steam")}</a></li>
          <li><a href={STEAMDB_URL} {...ext} className="hover:text-primary">{t("footer.steamdb")}</a></li>
        </ul>
      </div>
    </footer>
  );
}

function Index() {
  useFantasyCursor();
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("ragnarok-lang");
      if (saved && ["en", "th", "id", "zh"].includes(saved)) return saved as Lang;
    }
    return "en";
  });
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof localStorage !== "undefined") localStorage.setItem("ragnarok-lang", l);
  }, []);
  const t = useCallback((key: string) => translate(lang, key), [lang]);
  const ctx: I18nContextValue = { lang, setLang, t };

  return (
    <I18nContext.Provider value={ctx}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">{t("skip.content")}</a>
      <Header t={t} />
      <main id="main">
        <Hero t={t} />
        <WhyPortal t={t} />
        <Druid t={t} />
        <Classes t={t} />
        <Friction t={t} />
        <Platform t={t} />
        <FirstLogin t={t} />
        <Gallery t={t} />
        <Faq t={t} />
        <FinalCta t={t} />
      </main>
      <Footer t={t} />
      <div className="fixed inset-x-3 bottom-3 z-40 grid sm:hidden"><OfferCta label={t("cta.offer")} /></div>
    </I18nContext.Provider>
  );
}
