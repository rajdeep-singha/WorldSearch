import  { useStore, type NewsItem } from '../../store/useStore'
import { NewsCard } from './NewsCard'

const FEED_CONFIG = [
  { key: 'geopoliticsNews', label: 'GEOPOLITICS', color: '#cc88ff' },
  { key: 'techNews', label: 'TECHNOLOGY', color: '#44ffaa' },
  { key: 'aiNews', label: 'AI / ML', color: '#00aaff' },
] as const

export function NewsFeed() {
  const store = useStore()
  const { newsLoading } = store

  return (
    <div style={{
      height: '200px', flexShrink: 0,
      borderTop: '1px solid #1e1e1e',
      display: 'flex',
      background: '#0a0a0a',
    }}>
      {FEED_CONFIG.map(({ key, label, color }) => {
        const items = store[key] as NewsItem[]
        return (
          <div key={key} style={{
            flex: 1, borderRight: '1px solid #1e1e1e',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Feed header */}
            <div style={{
              padding: '6px 10px', borderBottom: '1px solid #1e1e1e',
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#0d0d0d',
              flexShrink: 0,
            }}>
              <span style={{ color, fontSize: '9px', letterSpacing: '1px' }}>{label}</span>
              {items.length > 0 && (
                <span style={{
                  background: color + '22', color,
                  fontSize: '8px', padding: '1px 5px', borderRadius: '10px',
                }}>
                  {items.length}
                </span>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="live-dot" style={{ width: '4px', height: '4px' }} />
                <span style={{ color: '#44ff44', fontSize: '8px' }}>LIVE</span>
              </div>
            </div>

            {/* Feed items */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {newsLoading && items.length === 0 ? (
                [1, 2, 3].map(i => (
                  <div key={i} style={{
                    padding: '8px 10px', borderBottom: '1px solid #1a1a1a',
                  }}>
                    <div style={{ height: '8px', background: '#1e1e1e', borderRadius: '2px', marginBottom: '4px', width: '40%' }} />
                    <div style={{ height: '10px', background: '#141414', borderRadius: '2px' }} />
                  </div>
                ))
              ) : (
                items.map(item => <NewsCard key={item.id} item={item} />)
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
