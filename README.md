# M0B1Li7Y - Motion Atelier (main4 variant)

A full creative rebuild of the original mobility app with a fresh design language and a simpler flow.

## What changed
- Reimagined interface with an atmospheric glass-panel visual style
- New Readiness Mixer workflow for energy, soreness, mood, time, and body focus
- Recommendation output powered by existing core logic in src/modules/recommendation.js
- Ritual generator that maps recommendations to movement library entries
- Lightweight progression dashboard with XP, streak, consistency, and weekly quest
- Snapshot timeline for recent generated plans

## Run

```bash
python3 -m http.server 4173
```

Open http://localhost:4173

## Test

```bash
npm test
```
