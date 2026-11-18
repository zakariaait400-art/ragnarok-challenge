# Project memory

## Product intent & audience

- Landing page for a Steam-listed fantasy RPG with Norse mythology theme (Midgard)
- Audience: gamers interested in cross-platform RPG play, flexible class systems, offline progression
- Key product features: "Refine with confidence", "Progress while offline", "One character, many classes", "Play across devices"

## Brand personality & voice

- Fantasy/immersive tone; sections framed as in-game interface elements rather than SaaS marketing
- "Living Midgard Portal" concept replaces conventional card grids with magical/orbital metaphors
- Dark cinematic mood; gold/magical accent colors for portal energy

## Visual design & UX direction

- Dark backgrounds using official Steam screenshots with heavy gradient/blur overlays
- Animated magical portal as focal point: rotating rune rings, flickering energy arcs, breathing glowing core, golden particles
- Feature sigils orbit a central portal; hover grows/glows sigil, shifts portal aura color, reveals title + description inside core
- Mouse parallax for depth; auto-rotating orbit that pauses on hover
- Mobile: orbit becomes horizontal swipeable rune selector with compact mini-portal updating on tap
- No heavy animation libraries — CSS + minimal React/JS only
- Accessibility/perf: mobile smoothness prioritized; reduce complexity on small screens

## Decisions, constraints & rationale

- Framework: vite-react
- Motion utilities live in `motion.ts`: `useTilt` (used by Platform section), `useMouseParallax`
- `WHY` constant holds feature content; `WhyPortal` replaced former `WhyCard` grid layout
- `Index` component composes sections; each section is a standalone component
- CSS kept in a separate stylesheet, not CSS-in-JS
- Existing verified text must be preserved exactly; no invented claims about the game
- Only targeted section may be modified per request; other sections remain untouched
- Build verification via `vite build` (passes cleanly)

## Open questions & assumptions

- Exact game name, Steam app ID, and launch status not yet confirmed
- Full section inventory beyond Why/Platform unknown — likely includes hero, features, media, footer
- Color palette specifics beyond "gold/magical on dark" not yet codified
- Typography choices not yet discussed
- No `.bolt/prompt` exists yet; global instructions may be added later