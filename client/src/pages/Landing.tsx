import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchNews } from '../api/anakin'
import type { SearchResult } from '../api/anakin'

export default function Landing() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    const data = await searchNews(query.trim(), 6)
    setResults(data)
    setLoading(false)
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>

      {/* Background video — clearer, less overlay */}
      <video
        autoPlay muted loop playsInline
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0,
        }}
      >
        <source src="/bg1.mp4" type="video/mp4" />
      </video>

      {/* Lighter overlay so video is visible */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.65) 100%)',
      }} />

      {/* Subtle vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', width: '100%', maxWidth: '700px',
        padding: '0 32px',
      }}>

        {/* Live badge — pill style like reference */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '999px', padding: '5px 14px',
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)',
          marginBottom: '36px',
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#44ff44', boxShadow: '0 0 6px #44ff44',
            animation: 'blink 1.5s infinite',
          }} />
          <span style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '12px', letterSpacing: '0.5px',
            fontFamily: 'Inter, sans-serif', fontWeight: 400,
          }}>
            Live Global Intelligence · Powered by Anakin
          </span>
        </div>

        {/* Main headline — Playfair Display, mixed style like reference */}
        <h1 style={{
          textAlign: 'center', margin: '0 0 16px',
          lineHeight: 1.1,
        }}>
          <span style={{
            display: 'block',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: 'clamp(42px, 6vw, 72px)',
            color: '#ffffff',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            letterSpacing: '-0.5px',
          }}>
            Monitor the
          </span>
          <span style={{
            display: 'block',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 400, fontStyle: 'italic',
            fontSize: 'clamp(42px, 6vw, 72px)',
            color: '#00d4ff',
            textShadow: '0 0 40px rgba(0,212,255,0.4)',
            letterSpacing: '-0.5px',
          }}>
            World.
          </span>
        </h1>

        {/* Subtitle — Inter, light */}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300, fontSize: 'clamp(14px, 1.5vw, 17px)',
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center', lineHeight: 1.7,
          marginBottom: '40px', maxWidth: '480px',
        }}>
          AI-verified geopolitical intelligence. Every conflict, every flash point — researched, verified, and mapped in real time.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ width: '100%', marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '6px', overflow: 'hidden',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
            onFocusCapture={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.45)')}
            onBlurCapture={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search any conflict, country, event..."
              style={{
                flex: 1, padding: '15px 20px',
                background: 'transparent', border: 'none', outline: 'none',
                color: '#e8e8e8', fontSize: '14px',
                fontFamily: 'Inter, sans-serif', fontWeight: 300,
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '15px 24px',
                background: 'rgba(0,212,255,0.12)',
                border: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)',
                color: loading ? '#00d4ff55' : '#00d4ff',
                cursor: loading ? 'default' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px', fontWeight: 500,
                letterSpacing: '0.5px',
                flexShrink: 0, transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(0,212,255,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.12)' }}
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Search results */}
        {searched && (
          <div style={{
            width: '100%', marginBottom: '24px',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px', overflow: 'hidden',
            maxHeight: '260px', overflowY: 'auto',
          }}>
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ height: '9px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '6px', width: '35%' }} />
                  <div style={{ height: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
                </div>
              ))
            ) : results.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
                No results — try a different search
              </div>
            ) : (
              results.map((r, i) => {
                let source = 'WIRE'
                try { source = new URL(r.url).hostname.replace('www.', '').split('.')[0].toUpperCase() } catch { /* skip */ }
                return (
                  <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                    <div
                      style={{
                        padding: '11px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        borderLeft: '2px solid transparent',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(0,212,255,0.06)'
                        e.currentTarget.style.borderLeftColor = '#00d4ff55'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderLeftColor = 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          background: 'rgba(0,212,255,0.12)', color: 'rgba(0,212,255,0.7)',
                          fontSize: '9px', padding: '2px 7px', borderRadius: '3px',
                          fontFamily: 'SF Mono, monospace', letterSpacing: '0.5px',
                        }}>{source}</span>
                        {r.date && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>{r.date}</span>}
                      </div>
                      <div style={{
                        color: 'rgba(255,255,255,0.85)', fontSize: '13px',
                        fontFamily: 'Inter, sans-serif', fontWeight: 500,
                        lineHeight: 1.4, marginBottom: '3px',
                      }}>
                        {r.title}
                      </div>
                      <div style={{
                        color: 'rgba(255,255,255,0.35)', fontSize: '11px',
                        fontFamily: 'Inter, sans-serif', fontWeight: 300,
                        lineHeight: 1.5,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {r.snippet}
                      </div>
                    </div>
                  </a>
                )
              })
            )}
          </div>
        )}

        {/* CTA buttons — like reference */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: searched ? 0 : '8px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '14px 32px',
              background: 'rgba(255,255,255,0.92)',
              border: 'none', borderRadius: '6px',
              color: '#0a0a0a', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px', fontWeight: 500,
              letterSpacing: '0.2px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.92)'; e.currentTarget.style.transform = 'none' }}
          >
            Open Dashboard
          </button>

          <button
            onClick={() => inputRef.current?.focus()}
            style={{
              padding: '14px 24px',
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px', fontWeight: 400,
              letterSpacing: '0.2px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            Search intelligence ↓
          </button>
        </div>

        {/* Stats row — like reference */}
        <div style={{
          display: 'flex', gap: '40px', marginTop: '52px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '28px',
        }}>
          {[
            { val: '50+', label: 'Live Events' },
            { val: '<5s', label: 'Search Latency' },
            { val: '12', label: 'Intel Layers' },
            { val: 'A–F', label: 'DEFCON Grading' },
          ].map(({ val, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700, fontSize: '22px',
                color: 'rgba(255,255,255,0.9)',
              }}>{val}</div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 300, fontSize: '11px',
                color: 'rgba(255,255,255,0.35)',
                marginTop: '3px', letterSpacing: '0.3px',
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
