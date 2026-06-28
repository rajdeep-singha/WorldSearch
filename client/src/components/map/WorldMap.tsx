import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { useStore } from '../../store/useStore'
import { type GeoEvent } from '../../data/seedEvents'

const CATEGORY_COLORS: Record<string, string> = {
  iran_attack: '#ff4444',
  conflict_zone: '#ff4444',
  intel_hotspot: '#ff8800',
  military_base: '#4488ff',
  nuclear_site: '#ffff00',
  radiation: '#88ff00',
  spaceport: '#00aaff',
  undersea_cable: '#00ddff',
  pipeline: '#ffaa00',
  fuel_shortage: '#ff6600',
  tech: '#44ffaa',
  geopolitics: '#cc88ff',
}

export function WorldMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const { events, activeLayerIds, liveEventIds, selectEvent, addLiveEvent } = useStore()
  const selectedEvent = useStore(s => s.selectedEvent)

  const renderMarkers = (map: maplibregl.Map) => {
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const { events: evts, activeLayerIds: activeLayers, liveEventIds: liveIds } = useStore.getState()
    const visible = evts.filter(e => activeLayers.has(e.category))

    visible.forEach(event => {
      const color = CATEGORY_COLORS[event.category] ?? '#ff4444'
      const size = event.severity > 75 ? 12 : event.severity > 50 ? 9 : 7
      const isLive = liveIds.has(event.id)

      const el = document.createElement('div')
      el.style.cssText = `
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: ${color};
        border: 1.5px solid ${color};
        box-shadow: 0 0 ${event.severity > 75 ? 8 : 4}px ${color}88;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
      `

      if (isLive || event.severity > 75) {
        const ring = document.createElement('div')
        ring.style.cssText = `
          position: absolute; top: -4px; left: -4px;
          width: ${size + 8}px; height: ${size + 8}px;
          border-radius: 50%;
          border: 1px solid ${color};
          animation: pulse-ring 1.5s infinite;
          opacity: 0.6;
        `
        el.appendChild(ring)
      }

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.5)'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)'
      })
      el.addEventListener('click', () => selectEvent(event))

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
        className: 'custom-popup',
      }).setHTML(`
        <div style="
          background: #141414; border: 1px solid ${color}44; padding: 8px 10px;
          font-family: 'SF Mono', monospace; font-size: 10px; max-width: 200px;
          border-left: 2px solid ${color};
        ">
          <div style="color: ${color}; font-size: 9px; text-transform: uppercase; margin-bottom: 4px;">
            ${event.category.replace(/_/g, ' ')} · ${event.severity}
          </div>
          <div style="color: #e8e8e8; font-weight: bold; line-height: 1.3;">${event.title}</div>
          <div style="color: #666; margin-top: 4px;">${event.source} · ${event.time}</div>
        </div>
      `)

      el.addEventListener('mouseenter', () => popup.addTo(map))
      el.addEventListener('mouseleave', () => popup.remove())

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.lng, event.lat])
        .addTo(map)

      markersRef.current.push(marker)
    })
  }

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [15, 30],
      zoom: 2.2,
      attributionControl: false,
    })
    mapRef.current = map

    map.on('load', () => {
      renderMarkers(map)
    })

    return () => map.remove()
  }, [])

  // Re-render markers when layers or live events change
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    renderMarkers(map)
  }, [activeLayerIds, liveEventIds])

  // Live event simulation — pick a random event every 10s
  useEffect(() => {
    const t = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)]
      addLiveEvent(randomEvent.id)
    }, 10000)
    return () => clearInterval(t)
  }, [events])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Time filter bar */}
      <TimeFilter />

      {/* Selected event popup */}
      {selectedEvent && <EventDetail event={selectedEvent} onClose={() => selectEvent(null)} />}
    </div>
  )
}

function TimeFilter() {
  const { timeFilter, setTimeFilter } = useStore()
  const filters = ['1h', '6h', '24h', '48h', '7d', 'all'] as const

  return (
    <div style={{
      position: 'absolute', bottom: '16px', left: '50%',
      transform: 'translateX(-50%)',
      background: '#0d0d0d', border: '1px solid #222',
      display: 'flex', gap: '2px', padding: '3px',
      borderRadius: '4px',
    }}>
      {filters.map(f => (
        <button
          key={f}
          onClick={() => setTimeFilter(f)}
          style={{
            padding: '4px 10px',
            background: timeFilter === f ? '#1e3a1e' : 'transparent',
            border: 'none',
            color: timeFilter === f ? '#44ff44' : '#555',
            cursor: 'pointer',
            borderRadius: '2px',
            fontFamily: 'SF Mono, monospace',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

function EventDetail({ event, onClose }: { event: GeoEvent; onClose: () => void }) {
  const color = CATEGORY_COLORS[event.category] ?? '#ff4444'
  const { setDeepResearch, deepResearch } = useStore()
  const isResearching = deepResearch.event?.id === event.id && deepResearch.loading

  const handleResearch = () => {
    setDeepResearch({ event, step: 'planning', loading: true, answer: '', sources: [], error: null })
  }

  return (
    <div style={{
      position: 'absolute', bottom: '60px', left: '50%',
      transform: 'translateX(-50%)',
      background: '#111', border: `1px solid ${color}44`,
      borderLeft: `3px solid ${color}`,
      padding: '12px 16px', borderRadius: '3px',
      fontFamily: 'SF Mono, monospace', minWidth: '300px',
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ color, fontSize: '9px', textTransform: 'uppercase', marginBottom: '4px' }}>
            {event.category.replace(/_/g, ' ')} · SEVERITY {event.severity}
          </div>
          <div style={{ color: '#e8e8e8', fontSize: '12px', fontWeight: 'bold', lineHeight: 1.3, marginBottom: '6px' }}>
            {event.title}
          </div>
          <div style={{ color: '#888', fontSize: '10px' }}>{event.description}</div>
          <div style={{ color: '#555', fontSize: '9px', marginTop: '6px', marginBottom: '10px' }}>
            {event.source} · {event.time}
          </div>

          {/* Deep Research button */}
          <button
            onClick={handleResearch}
            disabled={isResearching}
            style={{
              background: isResearching ? '#0a2a0a' : '#001a00',
              border: `1px solid ${isResearching ? '#44ff4444' : '#44ff4488'}`,
              color: isResearching ? '#44ff4488' : '#44ff44',
              padding: '5px 12px', borderRadius: '2px',
              fontFamily: 'SF Mono, monospace', fontSize: '9px',
              cursor: isResearching ? 'default' : 'pointer',
              letterSpacing: '1px',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            {isResearching ? (
              <>
                <span style={{ animation: 'blink 0.6s infinite' }}>◈</span>
                ANAKIN RESEARCHING...
              </>
            ) : (
              <>&#9654; DEEP RESEARCH (ANAKIN)</>
            )}
          </button>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#555',
          cursor: 'pointer', fontSize: '14px', marginLeft: '12px', flexShrink: 0,
        }}>&#10005;</button>
      </div>
    </div>
  )
}
