import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  useFantasyCursor,
  useMagnetic,
  useTilt,
  useReveal,
  useMouseParallax,
  useMarquee,
} from "../lib/motion";

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

function SteamCta({ size = "md", label = "Play Free on Steam" }: { size?: "sm" | "md" | "lg"; label?: string }) {
  const pad = size === "lg" ? "px-8 py-4 text-base sm:text-lg" : size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3 text-base";
  const mag = useMagnetic<HTMLAnchorElement>(0.3);
  return (
    <a
      ref={mag}
      href={STEAM_URL}
      {...ext}
      className={`magnetic bg-gold shadow-gold inline-flex items-center justify-center gap-2 rounded-full font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${pad}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 2a10 10 0 0 0-9.96 9.04l5.35 2.21a2.8 2.8 0 0 1 1.6-.5l2.39-3.46v-.05a3.78 3.78 0 1 1 3.78 3.78h-.09l-3.4 2.43a2.83 2.83 0 0 1-5.6.6L2.3 14.5A10 10 0 1 0 12 2Zm-4.6 15.2-1.23-.5a2.12 2.12 0 1 0 1.15-2.85l1.27.53a1.56 1.56 0 1 1-1.2 2.82Zm9.7-7.47a2.52 2.52 0 1 0-2.52 2.52 2.52 2.52 0 0 0 2.52-2.52Zm-4.4 0a1.89 1.89 0 1 1 1.88 1.89 1.89 1.89 0 0 1-1.88-1.89Z"/></svg>
      {label}
      <span className="sr-only">(opens Steam in a new tab)</span>
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

const NAV = [
  ["#why", "Why This Version"],
  ["#druid", "Druid"],
  ["#progress", "Progress"],
  ["#first-login", "First Login"],
  ["#faq", "FAQ"],
] as const;

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors ${scrolled || open ? "glass" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="font-display text-lg font-bold leading-none tracking-wide sm:text-xl">
          <span className="text-gold">RAGNAROK</span>
          <span className="block text-[0.6rem] tracking-[0.35em] text-muted-foreground">THE NEW WORLD</span>
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-7 text-sm font-medium">
            {NAV.map(([h, l]) => (
              <li key={h}><a href={h} className="text-muted-foreground transition-colors hover:text-primary">{l}</a></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><SteamCta size="sm" /></div>
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
            {NAV.map(([h, l]) => (
              <li key={h}><a href={h} onClick={() => setOpen(false)} className="block py-3 text-lg font-medium">{l}</a></li>
            ))}
          </ul>
          <SteamCta />
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const bg = useRef<HTMLDivElement>(null);
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
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-24">
      <div ref={bg} className="absolute inset-0 -z-20 scale-[1.08] will-change-transform">
        <img src={ss(0)} alt="" width={1920} height={1080} fetchPriority="high" className="h-full w-full object-cover" />
      </div>
      <div className="bg-hero-overlay absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="particles pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="rune-ring pointer-events-none absolute -right-40 top-1/2 -z-10 hidden h-[44rem] w-[44rem] -translate-y-1/2 md:block" aria-hidden="true" />
      <div ref={depth} className="mx-auto w-full max-w-7xl px-4 sm:px-6 will-change-transform">
        <div className="max-w-2xl">
          <Eyebrow>Officially licensed · Now on Steam</Eyebrow>
          <h1 id="hero-title" className="text-4xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            <span className="reveal-line"><span style={{ animationDelay: "0.1s" }}>Rediscover Midgard.</span></span><br />
            <span className="reveal-line"><span className="text-gold" style={{ animationDelay: "0.35s" }}>Play Different.</span></span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-foreground/90 sm:text-lg">
            The cross-platform Ragnarok MMORPG. 8 classes, the all-new Druid, refining with no level loss on failure, and resources that keep building while you're away.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <SteamCta size="lg" />
            <a href="#first-login" className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-4 font-semibold transition-colors hover:border-primary hover:text-primary">
              See how to reach First Login <span aria-hidden="true">→</span>
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Key facts">
            {["Free-to-play", "8 classes", "Up to 120 FPS", "Cross-platform progression"].map((c) => (
              <li key={c} className="glass rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm">{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const WHY = [
  { icon: "⚒", title: "Refine with confidence", body: "A failed refine means no level loss — your gear stays intact. Reach +15 with confidence." },
  { icon: "☾", title: "Progress while offline", body: "Idler mechanics keep accumulating resources while you're logged out." },
  { icon: "⚔", title: "One character, many classes", body: "Master multiple classes on a single character, with free stat resets and resource retrievals." },
  { icon: "◈", title: "Play across devices", body: "Your progress syncs across phone, tablet and PC." },
];

function WhyCard({ w, i }: { w: (typeof WHY)[number]; i: number }) {
  const tilt = useTilt<HTMLDivElement>(6);
  return (
    <article
      ref={tilt}
      className="tilt-card glass shadow-card group relative rounded-2xl p-6 transition-transform hover:-translate-y-1"
      style={{ animationDelay: `${i * 0.08}s` }}
    >
      <div className="tilt-glow" aria-hidden="true" />
      <div aria-hidden="true" className="bg-gold tilt-inner mb-5 grid h-12 w-12 place-items-center rounded-xl text-2xl text-primary-foreground">{w.icon}</div>
      <h3 className="tilt-inner text-xl font-bold">{w.title}</h3>
      <p className="tilt-inner mt-3 text-muted-foreground">{w.body}</p>
    </article>
  );
}

function Why() {
  return (
    <section id="why" aria-labelledby="why-title" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionTitle id="why-title" eyebrow="Why this version" title={<>Classic Midgard, <span className="text-gold">less grind pain</span></>} sub="The charm you remember, rebuilt around the things that used to hold you back." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => <WhyCard key={w.title} w={w} i={i} />)}
        </div>
      </div>
    </section>
  );
}

const FORMS = [
  { id: "werewolf", name: "Werewolf", tag: "Feral · Up close", copy: "Shift into the Werewolf and take the fight face to face. A primal form for players who like to lead the charge.", img: 2, tint: "from-primary/40", aura: "radial-gradient(circle at 50% 50%, oklch(0.8 0.14 78 / 35%), transparent 70%)" },
  { id: "wereraptor", name: "Wereraptor", tag: "Swift · Relentless", copy: "Become the Wereraptor and move with speed and instinct. A form built for players who never stand still.", img: 3, tint: "from-chart-4/40", aura: "radial-gradient(circle at 50% 50%, oklch(0.7 0.1 160 / 35%), transparent 70%)" },
  { id: "arcanist", name: "Human Arcanist", tag: "Arcane · Measured", copy: "Stay human and channel nature's magic as an Arcanist. A form for players who prefer to command the field.", img: 4, tint: "from-accent/40", aura: "radial-gradient(circle at 50% 50%, oklch(0.72 0.13 235 / 35%), transparent 70%)" },
];

function Druid() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const imgWrap = useMouseParallax<HTMLDivElement>(12);
  const f = FORMS[active] ?? FORMS[0]!;
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (active + d + FORMS.length) % FORMS.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  return (
    <section id="druid" aria-labelledby="druid-title" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="rune-ring pointer-events-none absolute -left-60 top-10 h-[40rem] w-[40rem] opacity-60" aria-hidden="true" />
      <div
        className="form-aura pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 blur-3xl"
        style={{ background: f.aura, opacity: 0.8 }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl">
        <SectionTitle id="druid-title" eyebrow="New class debut" title={<>The <span className="text-gold">Druid</span>. One class, three forms.</>} sub="Switch between Werewolf, Wereraptor and Human Arcanist — three playstyles in a single class." />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div role="tablist" aria-label="Druid forms" className="glass inline-flex w-full flex-wrap gap-1 rounded-2xl p-1.5 sm:w-auto sm:flex-nowrap sm:rounded-full" onKeyDown={onKey}>
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
                  className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${i === active ? "bg-gold text-primary-foreground shadow-gold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {x.name}
                </button>
              ))}
            </div>
            <div role="tabpanel" id={`panel-${f.id}`} aria-labelledby={`tab-${f.id}`} key={f.id} className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{f.tag}</p>
              <h3 className="mt-2 text-3xl font-bold sm:text-4xl">{f.name}</h3>
              <p className="mt-4 max-w-lg text-lg text-muted-foreground">{f.copy}</p>
              <p className="mt-6 text-sm text-muted-foreground">Exact skills and numbers are revealed in-game — try every form yourself.</p>
              <div className="mt-8"><SteamCta label="Play the Druid free" /></div>
            </div>
          </div>
          <div ref={imgWrap} className="relative will-change-transform">
            <div className={`absolute -inset-6 rounded-[2rem] bg-gradient-to-br ${f.tint} to-transparent blur-2xl transition-colors duration-700`} aria-hidden="true" />
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-card">
              {FORMS.map((x, i) => (
                <img key={x.id} src={ss(x.img)} alt={i === active ? `Official Ragnarok: The New World screenshot — ${x.name} section` : ""} width={1920} height={1080} loading="lazy" decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"}`} />
              ))}
              <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold">Form: {f.name}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Classes() {
  return (
    <section aria-labelledby="classes-title" className="px-4 py-24 sm:px-6">
      <div className="glass shadow-card relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <img src={ss(5)} alt="" width={1920} height={1080} loading="lazy" decoding="async" className="absolute inset-0 -z-0 h-full w-full object-cover opacity-25" />
        <div className="relative grid gap-10 p-8 sm:p-12 md:grid-cols-[auto_1fr] md:items-center lg:p-16">
          <div className="text-center md:text-left">
            <p className="font-display text-gold text-[7rem] font-extrabold leading-none sm:text-[9rem]">8</p>
            <p className="font-display text-xl font-bold tracking-[0.3em]">CLASSES</p>
          </div>
          <div>
            <Eyebrow>Play your way</Eyebrow>
            <h2 id="classes-title" className="text-3xl font-bold sm:text-4xl">Pick a path. Change it later.</h2>
            <p className="mt-4 max-w-xl text-muted-foreground sm:text-lg">Choose from 8 classes — the Druid debuts among them. One character can master different classes, and free stat resets mean an early choice never locks you in.</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {["8 classes", "Druid debuts", "Change classes", "Free stat resets", "100+ looks"].map((t) => (
                <li key={t} className="rounded-full border border-border px-3 py-1 text-sm">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const FRICTION = [
  ["Fear of failed refines", "No level loss on failure — gear stays intact"],
  ["No time to grind every day", "Offline / idler resource accumulation"],
  ["Picked the wrong class?", "Class changes and free stat resets"],
  ["Stuck to one device", "Progress sync across phone, tablet and PC"],
];

function Friction() {
  return (
    <section id="progress" aria-labelledby="progress-title" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionTitle id="progress-title" eyebrow="Grind less, play more" title={<>Old frustrations, <span className="text-gold">official answers</span></>} />
        <ul className="space-y-3">
          {FRICTION.map(([a, b]) => (
            <li key={a} className="glass grid items-center gap-3 rounded-2xl p-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
              <p className="text-muted-foreground line-through decoration-destructive/70">{a}</p>
              <span aria-hidden="true" className="hidden text-2xl text-primary sm:block">→</span>
              <p className="font-semibold"><span className="sr-only">Answer: </span>{b}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Platform() {
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
          <Eyebrow>Cross-platform · PC</Eyebrow>
          <h2 id="pc-title" className="text-3xl font-bold sm:text-4xl">Phone on the go. <span className="text-gold">PC at home.</span></h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">Your progress syncs across phone, tablet and PC. On PC, the game supports up to 120 FPS — actual performance depends on your hardware.</p>
          <details className="glass group mt-8 rounded-2xl p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
              PC requirements (Windows)
              <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">+</span>
            </summary>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {[["Memory (min)", "12 GB RAM"], ["Memory (rec.)", "16 GB RAM"], ["Storage", "30 GB available"], ["Network", "Broadband internet"]].map(([k, v]) => (
                <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">Full specs on the <a className="underline hover:text-primary" href={STEAM_URL} {...ext}>official Steam page</a>.</p>
          </details>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { t: "Open the Steam page", d: "Go to the official Ragnarok: The New World store page." },
  { t: "Download & install", d: "Add it free to your library and install it on Windows." },
  { t: "Gravity account", d: "Create or sign in with a Gravity account through the game launcher." },
  { t: "Log in to the game", d: "Enter Midgard for the first time. That's your First Login." },
];

function FirstLogin() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  return (
    <section id="first-login" aria-labelledby="fl-title" className="px-4 py-24 sm:px-6">
      <div ref={ref} className="mx-auto max-w-7xl">
        <SectionTitle id="fl-title" eyebrow="Your route to Midgard" title={<>Four steps to your <span className="text-gold">First Login</span></>} sub="Clicking isn't the finish line. The adventure begins the moment you log in." />
        <ol className="relative grid gap-5 md:grid-cols-4">
          <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-[3px] md:block">
            <div className="h-full w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full bg-gold transition-all duration-[1400ms] ease-out ${visible ? "w-full" : "w-0"}`}
              />
            </div>
          </div>
          {STEPS.map((s, i) => {
            const last = i === STEPS.length - 1;
            return (
              <li
                key={s.t}
                className={`step-item relative rounded-2xl p-6 text-center ${last ? "bg-gold text-primary-foreground shadow-gold" : "glass"}`}
                style={{ animationDelay: `${0.25 + i * 0.18}s` }}
              >
                <span className={`font-display relative mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full text-2xl font-extrabold ${last ? "bg-background text-primary" : "bg-gold text-primary-foreground"}`}>{i + 1}</span>
                <h3 className="text-lg font-bold">{s.t}</h3>
                <p className={`mt-2 text-sm ${last ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.d}</p>
                {last && <p className="font-display mt-4 text-sm font-extrabold tracking-[0.2em]">★ FIRST LOGIN</p>}
              </li>
            );
          })}
        </ol>
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="rounded-full border border-primary px-4 py-2 font-semibold text-primary">Challenge conversion = First Login</span>
            <span className="rounded-full border border-border px-4 py-2 text-muted-foreground">CTA click ≠ conversion</span>
            <span className="rounded-full border border-border px-4 py-2 text-muted-foreground">Download / install ≠ conversion</span>
          </div>
          <SteamCta size="lg" label="Start step 1 on Steam" />
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const dlg = useRef<HTMLDialogElement>(null);
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const m = useMarquee(70);
  const open = (i: number) => { setIdx(i); dlg.current?.showModal(); };
  const go = (d: number) => setIdx((i) => (i + d + SS.length) % SS.length);

  useEffect(() => { setMounted(true); }, []);

  // Duplicate the list once for a seamless loop
  const loop = [...SS, ...SS];

  return (
    <section aria-labelledby="gallery-title" className="py-24">
      <div className="px-4 sm:px-6"><SectionTitle id="gallery-title" eyebrow="Official media" title="Glimpses of the New World" sub="Official screenshots from the Steam store page." /></div>
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
      <p className="mt-4 text-center text-xs text-muted-foreground">Hover to pause · drag to scroll</p>
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

const FAQ = [
  ["Is it free to play?", "Yes. Ragnarok: The New World is free-to-play on Steam, with optional in-game purchases."],
  ["Is a Gravity account required?", "Yes. The game requires a third-party Gravity account, which you create or sign in to through the game launcher."],
  ["What happens if refining fails?", "According to the official Steam page, a failed refine causes no level loss and your gear stays intact."],
  ["Can I play across devices?", "Yes. The official listing describes progress sync across phone, tablet and PC."],
  ["What are the PC requirements?", "Windows, at least 12 GB RAM (16 GB recommended), 30 GB of storage and a broadband internet connection. Check the Steam page for full specs."],
  ["Which languages are supported?", "Currently English, Indonesian, Thai and Simplified Chinese, as listed on Steam."],
];

function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <SectionTitle id="faq-title" eyebrow="FAQ" title="Before you enter Midgard" />
        <div className="space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="faq-item glass group rounded-2xl px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {q}<span aria-hidden="true" className="text-2xl text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="faq-answer">
                <div>
                  <p className="pt-3 text-muted-foreground">{a}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
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
    <section aria-labelledby="final-title" className="relative isolate overflow-hidden px-4 py-28 text-center sm:px-6">
      <div ref={glow} className="absolute inset-0 -z-20 scale-105 will-change-transform">
        <img src={HEADER} alt="" width={920} height={430} loading="lazy" decoding="async" className="h-full w-full object-cover opacity-30 blur-sm" />
      </div>
      <div className="bg-hero-overlay absolute inset-0 -z-10 rotate-180" />
      <div className="aura-pulse pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.8 0.14 78 / 30%), transparent 70%)" }} aria-hidden="true" />
      <div className="particles pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <h2 id="final-title" className="mx-auto max-w-3xl text-4xl font-extrabold sm:text-5xl md:text-6xl">Your next adventure starts in <span className="text-gold">Midgard.</span></h2>
      <div className="mt-10"><SteamCta size="lg" /></div>
      <p className="mt-6 text-sm text-muted-foreground">Free-to-play · In-game purchases · Gravity account required</p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl">Independent student project created for an educational challenge. Not an official Gravity or Valve website. Game names, images and trademarks belong to their respective owners.</p>
        <ul className="flex gap-6">
          <li><a href={STEAM_URL} {...ext} className="hover:text-primary">Official Steam page</a></li>
          <li><a href={STEAMDB_URL} {...ext} className="hover:text-primary">SteamDB source</a></li>
        </ul>
      </div>
    </footer>
  );
}

function Index() {
  useFantasyCursor();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Why />
        <Druid />
        <Classes />
        <Friction />
        <Platform />
        <FirstLogin />
        <Gallery />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <div className="fixed inset-x-3 bottom-3 z-40 grid sm:hidden"><SteamCta /></div>
    </>
  );
}
