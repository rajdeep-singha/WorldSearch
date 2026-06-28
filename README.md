# WorldNews — AI-Powered Geopolitical Intelligence Dashboard

A real-time geopolitical monitoring platform that combines an interactive world map with AI-driven deep research. Track 50+ live conflict zones, military escalations, nuclear threats, and critical infrastructure incidents — and get instant AI-generated intelligence reports on any event.

---

## Features

- **Interactive World Map** — MapLibre GL dark-themed map with color-coded, severity-ranked event markers across 50+ geopolitical hotspots
- **12 Toggleable Intelligence Layers** — Filter by category: conflict zones, military bases, nuclear sites, radiation watch, undersea cables, pipelines, spaceports, and more
- **AI Deep Research** — Click any event to trigger an Anakin agentic research job; get a multi-step intelligence report with verified sources in seconds
- **Live News Feeds** — Three real-time panels (Geopolitics, Technology, AI/ML) sourced from the Anakin Search API, refreshed every 5 minutes
- **DEFCON Threat Gauge** — Automatically computed threat level (1–5) based on active event severity, displayed in the header with a live indicator
- **Global Insights Panel** — AI-generated world brief and focal points, refreshed every 15 minutes
- **Time Filtering** — Slice events by recency: 1h, 6h, 24h, 48h, 7d, or all

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Mapping | MapLibre GL + Deck.gl |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| AI / Data | Anakin API (Search + Agentic Research) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anakin API](https://anakin.ai) key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/WorldNews.git
cd WorldNews/client

# Install dependencies
npm install
```

### Configuration

Copy the example env file and add your API key:

```bash
cp .env.example .env
```

```env
# .env
VITE_ANAKIN_KEY=your_anakin_api_key_here
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`. The Vite dev server proxies all `/api/anakin` requests to `https://api.anakin.io/v1` with your API key injected server-side — no CORS issues, no key exposed to the browser.

### Production Build

```bash
npm run build     # Compile TypeScript and bundle with Vite
npm run preview   # Preview the production build locally
```

---

## Project Structure

```
client/
├── src/
│   ├── api/
│   │   └── anakin.ts           # Anakin API client (search, agentic research, polling)
│   ├── components/
│   │   ├── Header.tsx          # DEFCON gauge + live clock
│   │   ├── feeds/
│   │   │   ├── NewsFeed.tsx    # Three-panel live news ticker
│   │   │   └── NewsCard.tsx    # Individual news card
│   │   ├── map/
│   │   │   ├── WorldMap.tsx    # MapLibre world map + event markers
│   │   │   └── LayersPanel.tsx # 12-layer filter sidebar
│   │   └── panels/
│   │       └── InsightsPanel.tsx # World brief + deep research output
│   ├── data/
│   │   └── seedEvents.ts       # 50 seed geopolitical events + layer definitions
│   ├── hooks/
│   │   ├── useNewsSearch.ts    # News polling (5-min interval)
│   │   └── useResearch.ts      # Insights polling (15-min interval)
│   ├── pages/
│   │   ├── Landing.tsx         # Hero page with search
│   │   └── Dashboard.tsx       # Main monitoring dashboard
│   └── store/
│       └── useStore.ts         # Zustand global store
├── public/                     # Static assets
├── vite.config.ts              # Vite config + API proxy
├── vercel.json                 # Vercel deployment config
└── .env.example                # Environment variable template
```

---

## Deployment

The project is configured for [Vercel](https://vercel.com) out of the box.

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set the **Root Directory** to `client`
4. Add the environment variable `VITE_ANAKIN_KEY` in Vercel project settings
5. Deploy

Vercel serverless functions proxy API requests server-side so the API key is never exposed in the client bundle.

---

## Anakin API Integration

### Search API
Used for live news feeds. Queries are sent every 5 minutes per category.

```
POST /search
{ "prompt": "geopolitical conflict 2026", "limit": 8 }
```

### Agentic Research API
Used for on-demand deep research when a map event is selected. The job is submitted, then polled every 5 seconds until complete (up to 2 minutes).

```
POST /agentic-search   → returns job ID
GET  /agentic-search/:id → poll until status === "completed"
```

Both endpoints fall back to mock data if the API is unavailable or times out.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint |

---

## License

MIT
