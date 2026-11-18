# Ragnarok official Steam assets

These asset URLs come from the SteamDB metadata page for App ID **4212480** and point to Steam's official CDN.

Source page:
https://steamdb.info/app/4212480/info/

## Hero assets

- Background hero (2x)  
  https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4212480/c004334b9511cf37539bfb8b8aeae2d6d740a534/library_hero_2x.jpg

- Transparent logo (2x)  
  https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4212480/d464c027a8d13aaeb85fe343d0744d97ead71763/logo_2x.png

- Official microtrailer MP4  
  https://video.fastly.steamstatic.com/store_trailers/4212480/247566644/93bac4cbb55c38157a6c4cb203ad9eb1768803c5/1775620731/microtrailer.mp4

- Official microtrailer WebM  
  https://video.fastly.steamstatic.com/store_trailers/4212480/247566644/93bac4cbb55c38157a6c4cb203ad9eb1768803c5/1775620731/microtrailer.webm

- Trailer poster / still  
  https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257315994/1600ab91c7f29280909c4c62ea1ac2e7cd569153/movie_full.jpg

- Header 2x  
  https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4212480/95dc4b582f4d09290a50f6ea717136df91247be6/header_2x.jpg

- Hero capsule 2x  
  https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4212480/5bb97a6d0f3f011d45d0d81b39fddc06c4220315/hero_capsule_2x.jpg

## Fastest workflow in Bolt

Run:

```bash
node scripts/fetch-ragnarok-assets.mjs
```

The files will be downloaded into:

```
public/ragnarok/
```

Recommended hero usage:

- `/ragnarok/microtrailer.webm` + `/ragnarok/microtrailer.mp4` as muted looping video sources
- `/ragnarok/library-hero-2x.jpg` as poster/fallback
- `/ragnarok/logo-2x.png` as the official transparent logo

Keep the exact challenge CTA:
https://store.steampowered.com/app/4212480/Ragnarok_The_New_World/
