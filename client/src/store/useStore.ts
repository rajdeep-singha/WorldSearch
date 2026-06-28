import { create } from 'zustand'
import { type GeoEvent, SEED_EVENTS } from '../data/seedEvents'

export interface NewsItem {
  id: string
  title: string
  url: string
  content: string
  source: string
  time: string
  category: 'geopolitics' | 'tech' | 'ai'
  severity?: number
}

export interface Insights {
  worldBrief: string
  focalPoints: string[]
  loading: boolean
  lastUpdated: Date | null
}

export type ResearchStep =
  | 'idle'
  | 'planning'
  | 'searching'
  | 'reading'
  | 'verifying'
  | 'done'

export interface DeepResearch {
  event: GeoEvent | null
  step: ResearchStep
  answer: string
  sources: Array<{ title: string; url: string }>
  loading: boolean
  error: string | null
}

interface Store {
  // Map events
  events: GeoEvent[]
  activeLayerIds: Set<string>
  timeFilter: '1h' | '6h' | '24h' | '48h' | '7d' | 'all'
  liveEventIds: Set<string>

  // News
  geopoliticsNews: NewsItem[]
  techNews: NewsItem[]
  aiNews: NewsItem[]
  newsLoading: boolean

  // Global insights
  insights: Insights

  // Deep research (per event click)
  deepResearch: DeepResearch

  // DEFCON
  defconScore: number
  defconLevel: 1 | 2 | 3 | 4 | 5

  // Selected event
  selectedEvent: GeoEvent | null

  // Actions
  toggleLayer: (id: string) => void
  setTimeFilter: (f: Store['timeFilter']) => void
  setGeopoliticsNews: (items: NewsItem[]) => void
  setTechNews: (items: NewsItem[]) => void
  setAiNews: (items: NewsItem[]) => void
  setNewsLoading: (v: boolean) => void
  setInsights: (i: Partial<Insights>) => void
  addLiveEvent: (id: string) => void
  selectEvent: (e: GeoEvent | null) => void
  computeDefcon: () => void
  setDeepResearch: (d: Partial<DeepResearch>) => void
  clearDeepResearch: () => void
}

const DEEP_RESEARCH_INITIAL: DeepResearch = {
  event: null,
  step: 'idle',
  answer: '',
  sources: [],
  loading: false,
  error: null,
}

export const useStore = create<Store>((set, get) => ({
  events: SEED_EVENTS,
  activeLayerIds: new Set([
    'iran_attack', 'intel_hotspot', 'conflict_zone', 'military_base',
    'nuclear_site', 'radiation', 'spaceport', 'undersea_cable',
    'pipeline', 'fuel_shortage', 'tech', 'geopolitics',
  ]),
  timeFilter: '24h',
  liveEventIds: new Set(),

  geopoliticsNews: [],
  techNews: [],
  aiNews: [],
  newsLoading: false,

  insights: {
    worldBrief: '',
    focalPoints: [],
    loading: false,
    lastUpdated: null,
  },

  deepResearch: DEEP_RESEARCH_INITIAL,

  defconScore: 72,
  defconLevel: 2,
  selectedEvent: null,

  toggleLayer: (id) => set(s => {
    const next = new Set(s.activeLayerIds)
    next.has(id) ? next.delete(id) : next.add(id)
    return { activeLayerIds: next }
  }),

  setTimeFilter: (f) => set({ timeFilter: f }),
  setGeopoliticsNews: (items) => set({ geopoliticsNews: items }),
  setTechNews: (items) => set({ techNews: items }),
  setAiNews: (items) => set({ aiNews: items }),
  setNewsLoading: (v) => set({ newsLoading: v }),
  setInsights: (i) => set(s => ({ insights: { ...s.insights, ...i } })),
  setDeepResearch: (d) => set(s => ({ deepResearch: { ...s.deepResearch, ...d } })),
  clearDeepResearch: () => set({ deepResearch: DEEP_RESEARCH_INITIAL }),

  addLiveEvent: (id) => set(s => {
    const next = new Set(s.liveEventIds)
    next.add(id)
    setTimeout(() => {
      useStore.setState(ss => {
        const n = new Set(ss.liveEventIds)
        n.delete(id)
        return { liveEventIds: n }
      })
    }, 3000)
    return { liveEventIds: next }
  }),

  selectEvent: (e) => set({ selectedEvent: e }),

  computeDefcon: () => {
    const { events, activeLayerIds } = get()
    const active = events.filter(e => activeLayerIds.has(e.category))
    if (active.length === 0) return
    const avg = active.reduce((s, e) => s + e.severity, 0) / active.length
    const level = avg > 80 ? 1 : avg > 65 ? 2 : avg > 50 ? 3 : avg > 35 ? 4 : 5
    set({ defconScore: Math.round(avg), defconLevel: level as 1 | 2 | 3 | 4 | 5 })
  },
}))
