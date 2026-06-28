import { useStore } from '../../store/useStore'
import { LAYER_CONFIG } from '../../data/seedEvents'

export function LayersPanel() {
  const { activeLayerIds, toggleLayer, events } = useStore()

  const countForLayer = (id: string) => events.filter(e => e.category === id).length

  return (
    <div style={{
      width: '180px', height: '100%', flexShrink: 0,
      background: '#0d0d0d', borderRight: '1px solid #1e1e1e',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'SF Mono, monospace', fontSize: '10px',
      overflowY: 'auto',
    }}>
      <div style={{
        padding: '8px 10px', borderBottom: '1px solid #1e1e1e',
        color: '#555', letterSpacing: '1px', fontSize: '9px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>LAYERS</span>
        <span style={{ color: '#333' }}>&#9660;</span>
      </div>

      <div style={{ padding: '4px 0' }}>
        {LAYER_CONFIG.map(layer => {
          const active = activeLayerIds.has(layer.id)
          const count = countForLayer(layer.id)
          return (
            <div
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 10px', cursor: 'pointer',
                background: 'transparent',
                transition: 'background 0.1s',
                opacity: active ? 1 : 0.4,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#141414')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: active ? layer.color : '#333',
                flexShrink: 0,
                boxShadow: active ? `0 0 4px ${layer.color}88` : 'none',
              }} />
              <span style={{
                flex: 1, color: active ? '#e8e8e8' : '#555',
                fontSize: '9px', letterSpacing: '0.5px',
              }}>{layer.label}</span>
              <span style={{ color: '#333', fontSize: '9px' }}>{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
