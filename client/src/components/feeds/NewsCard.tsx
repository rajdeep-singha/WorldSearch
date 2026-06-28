import type { NewsItem } from '../../store/useStore'

const SOURCE_COLORS: Record<string, string> = {
  REUTERS: '#ff8800', BBC: '#ff4444', AP: '#4488ff',
  'AL JAZEERA': '#00aaff', BLOOMBERG: '#ff8800', CNN: '#ff4444',
  DW: '#4488ff', DEFAULT: '#888',
}

export function NewsCard({ item }: { item: NewsItem }) {
  const severityColor = item.severity
    ? item.severity > 75 ? '#ff4444' : item.severity > 60 ? '#ff8800' : item.severity > 45 ? '#ffaa00' : '#44aa44'
    : '#555'

  const sourceColor = SOURCE_COLORS[item.source.toUpperCase()] ?? SOURCE_COLORS.DEFAULT

  return (
    <a
      href={item.url !== '#' ? item.url : undefined}
      target="_blank"
      rel="noreferrer"
      style={{ textDecoration: 'none' }}
      className="new-event"
    >
      <div
        style={{
          padding: '8px 10px',
          borderBottom: '1px solid #1a1a1a',
          borderLeft: `2px solid ${severityColor}44`,
          cursor: 'pointer',
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#141414')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{
            background: sourceColor + '22', color: sourceColor,
            fontSize: '8px', padding: '1px 5px', borderRadius: '2px',
            letterSpacing: '0.5px',
          }}>
            {item.source.slice(0, 12).toUpperCase()}
          </span>
          {item.severity && item.severity > 70 && (
            <span style={{
              background: '#ff444422', color: '#ff4444',
              fontSize: '8px', padding: '1px 5px', borderRadius: '2px',
            }}>
              HIGH
            </span>
          )}
          <span style={{ color: '#444', fontSize: '9px', marginLeft: 'auto' }}>{item.time}</span>
        </div>
        <div style={{
          color: '#ccc', fontSize: '10px', lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.title}
        </div>
      </div>
    </a>
  )
}
