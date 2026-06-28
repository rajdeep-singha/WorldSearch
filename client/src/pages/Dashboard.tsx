import { useEffect } from 'react'
import { Header } from '../components/Header'
import { WorldMap } from '../components/map/WorldMap'
import { LayersPanel } from '../components/map/LayersPanel'
import { InsightsPanel } from '../components/panels/InsightsPanel'
import { NewsFeed } from '../components/feeds/NewsFeed'
import { useNewsSearch } from '../hooks/useNewsSearch'
import { useResearch } from '../hooks/useResearch'
import { useStore } from '../store/useStore'

export default function Dashboard() {
  useNewsSearch()
  useResearch()

  const { computeDefcon } = useStore()

  useEffect(() => {
    computeDefcon()
  }, [])

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', flexDirection: 'column',
      background: '#0a0a0a', overflow: 'hidden',
      fontFamily: 'SF Mono, Monaco, monospace',
    }}>
      <Header />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <LayersPanel />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ flex: 1 }}>
            <WorldMap />
          </div>
          <NewsFeed />
        </div>

        <InsightsPanel />
      </div>
    </div>
  )
}
