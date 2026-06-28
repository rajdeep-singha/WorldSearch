import { useEffect, useRef } from 'react'
import { searchNews } from '../api/anakin'
import type { SearchResult } from '../api/anakin'
import { useStore } from '../store/useStore'
import type { NewsItem } from '../store/useStore'

const MOCK_GEO: NewsItem[] = [
  { id: 'm1', title: 'Iran-US tensions escalate in Persian Gulf', url: '#', content: '', source: 'Reuters', time: '1h ago', category: 'geopolitics', severity: 85 },
  { id: 'm2', title: 'Russia launches overnight strikes on Kyiv', url: '#', content: '', source: 'BBC', time: '2h ago', category: 'geopolitics', severity: 80 },
  { id: 'm3', title: 'North Korea tests new ballistic missile', url: '#', content: '', source: 'AP', time: '3h ago', category: 'geopolitics', severity: 78 },
  { id: 'm4', title: 'NATO emergency session over Eastern Europe', url: '#', content: '', source: 'DW', time: '4h ago', category: 'geopolitics', severity: 70 },
  { id: 'm5', title: 'China conducts military drills near Taiwan', url: '#', content: '', source: 'Al Jazeera', time: '5h ago', category: 'geopolitics', severity: 75 },
]

const MOCK_TECH: NewsItem[] = [
  { id: 't1', title: 'Anthropic releases Claude 4 with enhanced reasoning', url: '#', content: '', source: 'The Verge', time: '2h ago', category: 'tech', severity: 40 },
  { id: 't2', title: 'US imposes new chip export controls on China', url: '#', content: '', source: 'Bloomberg', time: '3h ago', category: 'tech', severity: 60 },
  { id: 't3', title: 'SpaceX Starship completes orbital test flight', url: '#', content: '', source: 'Ars Technica', time: '5h ago', category: 'tech', severity: 30 },
  { id: 't4', title: 'Cyberattack disrupts European energy networks', url: '#', content: '', source: 'Wired', time: '1h ago', category: 'tech', severity: 70 },
]

const MOCK_AI: NewsItem[] = [
  { id: 'a1', title: 'China PLA releases military-grade AI model', url: '#', content: '', source: 'MIT Tech Review', time: '4h ago', category: 'ai', severity: 72 },
  { id: 'a2', title: 'OpenAI GPT-5 deployed in defense applications', url: '#', content: '', source: 'Defense One', time: '6h ago', category: 'ai', severity: 65 },
  { id: 'a3', title: 'AI-guided drone systems tested in conflict zones', url: '#', content: '', source: 'Reuters', time: '2h ago', category: 'ai', severity: 80 },
  { id: 'a4', title: 'DeepSeek R2 surpasses US models in benchmarks', url: '#', content: '', source: 'Bloomberg', time: '8h ago', category: 'ai', severity: 55 },
]

function toNewsItem(r: SearchResult, category: NewsItem['category'], idx: number): NewsItem {
  const ago = Math.floor(Math.random() * 12) + 1
  let source = 'WIRE'
  try {
    source = new URL(r.url).hostname.replace('www.', '').split('.')[0].toUpperCase()
  } catch { /* keep default */ }
  return {
    id: `search-${category}-${idx}`,
    title: r.title,
    url: r.url,
    content: r.snippet ?? '',
    source,
    time: `${ago}h ago`,
    category,
    severity: Math.floor(Math.random() * 40) + 40,
  }
}

export function useNewsSearch() {
  const { setGeopoliticsNews, setTechNews, setAiNews, setNewsLoading } = useStore()
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const fetchAll = async () => {
    setNewsLoading(true)
    const [geo, tech, ai] = await Promise.allSettled([
      searchNews('geopolitical conflict military war 2026', 8),
      searchNews('technology cybersecurity semiconductor 2026', 6),
      searchNews('artificial intelligence AI military defense 2026', 6),
    ])

    if (geo.status === 'fulfilled' && geo.value.length > 0)
      setGeopoliticsNews(geo.value.map((r, i) => toNewsItem(r, 'geopolitics', i)))
    else setGeopoliticsNews(MOCK_GEO)

    if (tech.status === 'fulfilled' && tech.value.length > 0)
      setTechNews(tech.value.map((r, i) => toNewsItem(r, 'tech', i)))
    else setTechNews(MOCK_TECH)

    if (ai.status === 'fulfilled' && ai.value.length > 0)
      setAiNews(ai.value.map((r, i) => toNewsItem(r, 'ai', i)))
    else setAiNews(MOCK_AI)

    setNewsLoading(false)
  }

  useEffect(() => {
    fetchAll()
    timerRef.current = setInterval(fetchAll, 5 * 60 * 1000)
    return () => clearInterval(timerRef.current)
  }, [])
}
