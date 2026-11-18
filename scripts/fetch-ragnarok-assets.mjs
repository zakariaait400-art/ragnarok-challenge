import fs from "node:fs/promises";
import path from "node:path";

const assets = [
  {
    name: "library-hero-2x.jpg",
    url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4212480/c004334b9511cf37539bfb8b8aeae2d6d740a534/library_hero_2x.jpg"
  },
  {
    name: "logo-2x.png",
    url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4212480/d464c027a8d13aaeb85fe343d0744d97ead71763/logo_2x.png"
  },
  {
    name: "microtrailer.mp4",
    url: "https://video.fastly.steamstatic.com/store_trailers/4212480/247566644/93bac4cbb55c38157a6c4cb203ad9eb1768803c5/1775620731/microtrailer.mp4"
  },
  {
    name: "microtrailer.webm",
    url: "https://video.fastly.steamstatic.com/store_trailers/4212480/247566644/93bac4cbb55c38157a6c4cb203ad9eb1768803c5/1775620731/microtrailer.webm"
  },
  {
    name: "trailer-poster.jpg",
    url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257315994/1600ab91c7f29280909c4c62ea1ac2e7cd569153/movie_full.jpg"
  },
  {
    name: "header-2x.jpg",
    url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4212480/95dc4b582f4d09290a50f6ea717136df91247be6/header_2x.jpg"
  },
  {
    name: "hero-capsule-2x.jpg",
    url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4212480/5bb97a6d0f3f011d45d0d81b39fddc06c4220315/hero_capsule_2x.jpg"
  }
];

const outDir = path.resolve("public/ragnarok");
await fs.mkdir(outDir, { recursive: true });

for (const asset of assets) {
  const out = path.join(outDir, asset.name);
  try {
    const res = await fetch(asset.url, {
      headers: { "user-agent": "Mozilla/5.0" }
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(out, buf);
    console.log(`✓ ${asset.name} (${Math.round(buf.length / 1024)} KB)`);
  } catch (err) {
    console.error(`✗ ${asset.name}: ${err.message}`);
  }
}
