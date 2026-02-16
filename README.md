# M0B1Li7Y

Mobile-first progressive web app for a guided mobility routine (`M0B1Li7Y +`) that works offline after first load.

## Features
- One-tap start with step-by-step timer flow
- 12-step routine including untimed push-up set and user-selectable walk duration
- Pause/resume, next/back, and transition cues (sound + haptics)
- History for last 7 days with streak count
- Settings for cues, walk duration, and optional offline image caching
- Bend routine imagery fetched at runtime with local TTL cache and graceful fallback
- Installable PWA with service worker and app shell caching

## Run locally
```bash
python3 -m http.server 4173
```
Then open `http://localhost:4173`.
