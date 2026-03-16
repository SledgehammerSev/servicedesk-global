# IT Support — ServiceDesk-Global

A real-time coverage simulator and staffing planner for the harrison.ai global IT support team.

**Live:** [https://harrison-ai.github.io/hai-it-support-servicedesk-global/](https://harrison-ai.github.io/hai-it-support-servicedesk-global/)

## What it does

- **Who's on now** — Live view of which agents are currently on shift across all time zones, with drag-to-scrub time exploration
- **Coverage heatmap** — 24hr × 7day coverage map per monitored location showing gaps, single-agent risk, and peak staffing in local time
- **Agent perspectives** — Per-agent view showing solo hours, overlap breakdown, and handoff analysis
- **Gap-fill modelling** — Suggest proposed agents to fill coverage gaps with configurable minimum staffing levels (1/hr, 2+/hr, 3+/hr)
- **Staffing justification** — Auto-generated business case with base vs proposed coverage comparison, cost estimates in multiple currencies, and print/PDF export
- **Multi-company coverage** — Switch between coverage models (24/7 all, business hours only, per-entity)
- **DST-aware** — Automatic daylight saving adjustments for AU, NZ, US, CA, UK, and EU regions
- **Public holidays** — Built-in holiday calendars for 16 countries (2025–2028)
- **Save/load** — Export and import configurations as JSON, with localStorage defaults

## Locations covered

Sydney · Chennai · Ho Chi Minh City · London · New York · Austin · Los Angeles (and 50+ searchable cities)

## Tech stack

- **React 18** — UI framework
- **Vite** — Build tool and dev server
- **GitHub Pages** — Hosting (via `gh-pages`)
- **No external dependencies** — All timezone, DST, holiday, and coverage logic is self-contained

## Development

```bash
# Install dependencies
npm install

# Local dev server with hot reload
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npx gh-pages -d dist
```

## Project structure

```
src/
├── App.jsx    — Full application (components, logic, data)
└── main.jsx   — React mount point
```

## Maintainer

John Manoukian — IT Support Lead, harrison.ai