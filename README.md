# M0B1Li7Y

Small browser-based mobility routine app built from the preserved image assets.

## Features
- **Today dashboard** with readiness score and adaptive coaching recommendation
- **Readiness check-in** (energy, soreness, mood) persisted by day in `localStorage`
- **Adaptive recommendation engine** that suggests session intensity, tempo scaling, and progression mode
- **Quick actions**: save check-in, apply plan, start recommended session
- **Program tracks**: Beginner Momentum, Office Reset, Athletic Flow, Recovery Restore
- **Consistency & quest system**: rolling consistency score plus weekly checkpoints
- **Streak shield**: protect today’s streak day with earned shield tokens
- **2-minute rescue mode**: fast auto-guided session for low-motivation days
- **Post-session reflection**: effort/form logging with micro-coach adjustments for the next plan
- **Accountability ping**: simple buddy check-in tracking for weekly momentum
- Guided-first 12-step flow with a fitness-tech visual style
- Large routine player with progress ring, timer, and step imagery
- Beginner Coach tips that adapt by movement phase
- Countdown timer for timed steps and an untimed reps step (`Counter Pushups`)
- Controls: `Start`, `Pause/Resume`, `Back`, `Next/Finish`, `Reset`
- **Tabs**: `Routine`, `History`, and `Settings`
- **History tab**: recent sessions, day-by-day activity rows, total sessions, streak, weekly stats, active minutes
- **Settings tab**: progression mode (`Manual`/`Auto`), sound/haptics toggles, and app color schemes (`Default`, `Cobalt`, `Emerald`, `Sunset`)
- Session history and settings persisted in `localStorage`

## Kept assets
- Routine images in `img/`
- App/icon images in `icons/`

## Run locally
```bash
python3 -m http.server 4173
```

Open http://localhost:4173
