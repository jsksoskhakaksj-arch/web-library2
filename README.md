# Web Library — Milestone 1 (frontend foundation)
Vanilla HTML/CSS/JS (ES modules), LocalStorage, Lucide icons (CDN), GitHub Pages compatible.

## Run locally
ES modules need an HTTP server (not file://): `python3 -m http.server 8000` then open http://localhost:8000.
## Deploy
Push to GitHub → Settings → Pages → deploy from branch root.

## Architecture
- `js/data/storage.js` — async repositories (`websiteRepo`, `categoryRepo`, `collectionRepo`, `prefs`). Replace this file's internals with Supabase later; the UI doesn't change.
- `js/core` — state store, event bus, hash router. `js/features` — UI per feature. `js/utils` — helpers.
- Websites: `{id,url,title,description,thumbnail,favicon,categoryId,tags[],notes,favorite,createdAt,updatedAt,lastVisitedAt}`.

## Decisions
- Duplicate check compares URLs ignoring `www.`, trailing slash, hash and case (single local user).
- Metadata is entered manually; no scraping. Sample data seeds on first run or if stored data is corrupted.
- Collections/Categories/Favorites/Settings pages are placeholders (Favorites links to the filtered library).

## Known limitations
- Add/Edit categories UI, collections UI, and tag filtering chips are not built yet.
- Native `confirm()` is used for delete. Lucide and fonts load from CDNs (needs internet).
- Not yet tested in a real browser at 375/768/1440 px.
