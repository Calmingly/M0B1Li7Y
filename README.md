# M0B1Li7Y

Mobile-first progressive web app for a guided mobility routine (`M0B1Li7Y +`) that works offline after first load.

> **Latest updates:** Hero + bottom-sheet UI redesign, timer-low warning, in-app update flow, error logging.

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

## Image budget check
Validate routine image sizes before committing:

```bash
python3 scripts/check_image_budgets.py
```

Optional custom budgets:

```bash
python3 scripts/check_image_budgets.py --max-per-image-kb 180 --max-total-kb 2500
```
