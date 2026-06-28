import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

const DEFCON_COLORS: Record<number, string> = { 1: '#ff0040', 2: '#ff4400', 3: '#ffaa00', 4: '#00aaff', 5: '#2d8a6e' }

export function Header() {
  const { defconLevel, defconScore, events, activeLayerIds } = useStore()
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC')
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const activeCount = events.filter(e => activeLayerIds.has(e.category)).length
  const color = DEFCON_COLORS[defconLevel] ?? '#ffaa00'

  return (
    <header style={{
      background: '#0d0d0d',
      borderBottom: '1px solid #1e1e1e',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: '16px',
      flexShrink: 0,
      fontSize: '11px',
      fontFamily: 'SF Mono, Monaco, monospace',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #00aaff, #0044ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: 'bold'
        }}>&#8853;</div>
        <span style={{ color: '#e8e8e8', fontWeight: 'bold', letterSpacing: '2px' }}>WORLD MONITOR</span>
        <span style={{ color: '#555' }}>v1.0</span>
      </div>

      <div style={{ color: '#333' }}>|</div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="live-dot"></span>
        <span style={{ color: '#44ff44', letterSpacing: '1px' }}>LIVE</span>
      </div>

      <div style={{ color: '#333' }}>|</div>

      {/* Time */}
      <span style={{ color: '#666', letterSpacing: '0.5px' }}>{time}</span>

      <div style={{ flex: 1 }} />

      {/* Event count */}
      <span style={{ color: '#555' }}>{activeCount} EVENTS</span>

      <div style={{ color: '#333' }}>|</div>

      {/* DEFCON */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: '#0a0a0a', border: `1px solid ${color}33`,
        padding: '3px 10px', borderRadius: '3px',
      }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: color, boxShadow: `0 0 8px ${color}`,
          animation: defconLevel <= 2 ? 'blink 0.8s infinite' : 'none'
        }} />
        <span style={{ color, fontWeight: 'bold', letterSpacing: '1px' }}>
          DEFCON {defconLevel}
        </span>
        <span style={{ color: '#555' }}>{defconScore}%</span>
      </div>
    </header>
  )
}
