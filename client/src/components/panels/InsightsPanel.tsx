import { useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import type { ResearchStep } from '../../store/useStore'
import { researchTopic } from '../../api/anakin'

const STEP_LABELS: Record<ResearchStep, string> = {
  idle: '',
  planning: 'PLANNING RESEARCH STRATEGY...',
  searching: 'SEARCHING 20+ SOURCES...',
  reading: 'READING & EXTRACTING...',
  verifying: 'CROSS-VERIFYING CLAIMS...',
  done: 'ANALYSIS COMPLETE',
}

const STEP_ORDER: ResearchStep[] = ['planning', 'searching', 'reading', 'verifying', 'done']

// Advance through fake progress steps while waiting for the API
function useResearchProgress(loading: boolean, step: ResearchStep, setDeepResearch: (d: Parameters<ReturnType<typeof useStore>['setDeepResearch']>[0]) => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!loading || step === 'done') return
    const idx = STEP_ORDER.indexOf(step)
    if (idx === -1 || idx >= STEP_ORDER.length - 2) return // hold at verifying until API responds
    timerRef.current = setTimeout(() => {
      setDeepResearch({ step: STEP_ORDER[idx + 1] })
    }, idx === 0 ? 800 : 1800)
    return () => clearTimeout(timerRef.current)
  }, [loading, step])
}

export function InsightsPanel() {
  const { insights, deepResearch, setDeepResearch, clearDeepResearch } = useStore()
  const isResearching = deepResearch.event !== null
  const researchStartedRef = useRef<string | null>(null)

  useResearchProgress(deepResearch.loading, deepResearch.step, setDeepResearch)

  // Fire the actual Anakin research call when an event is set
  useEffect(() => {
    if (!deepResearch.event || !deepResearch.loading) return
    const eventId = deepResearch.event.id
    if (researchStartedRef.current === eventId) return
    researchStartedRef.current = eventId

    const query = `Detailed intelligence analysis: ${deepResearch.event.title}. Location coordinates: ${deepResearch.event.lat},${deepResearch.event.lng}. Category: ${deepResearch.event.category}. ${deepResearch.event.description}. Provide verified facts, key actors, historical context, and geopolitical implications.`

    researchTopic(query).then(result => {
      if (result) {
        setDeepResearch({
          step: 'done',
          loading: false,
          answer: result.answer,
          sources: result.sources ?? [],
        })
      } else {
        setDeepResearch({
          step: 'done',
          loading: false,
          answer: 'Research could not be completed. Anakin API may be unavailable or the API key is not configured.',
          sources: [],
          error: 'API unavailable',
        })
      }
    }).catch(() => {
      setDeepResearch({
        step: 'done',
        loading: false,
        answer: 'Research failed. Check your VITE_ANAKIN_KEY in .env.',
        sources: [],
        error: 'Request failed',
      })
    })
  }, [deepResearch.event?.id])

  return (
    <div style={{
      width: '280px', flexShrink: 0, height: '100%',
      background: '#0d0d0d', borderLeft: '1px solid #1e1e1e',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'SF Mono, monospace', fontSize: '10px',
    }}>

      {/* Header */}
      <div style={{
        padding: '8px 12px', borderBottom: '1px solid #1e1e1e',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isResearching && (
            <button
              onClick={() => { clearDeepResearch(); researchStartedRef.current = null }}
              style={{
                background: 'none', border: 'none', color: '#555',
                cursor: 'pointer', fontSize: '10px', padding: '0',
              }}
              title="Back to World Brief"
            >
              &#8592;
            </button>
          )}
          <span style={{ color: '#888', letterSpacing: '1px', fontSize: '9px' }}>
            {isResearching ? 'DEEP RESEARCH' : 'AI INSIGHTS'}
          </span>
          {isResearching && (
            <span style={{
              background: '#44ff4411', color: '#44ff44',
              fontSize: '8px', padding: '1px 5px', borderRadius: '2px',
              letterSpacing: '0.5px',
            }}>ANAKIN</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {(insights.loading || deepResearch.loading) ? (
            <span style={{ color: '#ffaa00', fontSize: '9px', animation: 'blink 1s infinite' }}>
              {deepResearch.loading ? STEP_LABELS[deepResearch.step] : 'LOADING...'}
            </span>
          ) : (
            <>
              <span className="live-dot" />
              <span style={{ color: '#44ff44', fontSize: '9px' }}>LIVE</span>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isResearching ? (
          <DeepResearchView />
        ) : (
          <WorldBriefView />
        )}
      </div>
    </div>
  )
}

function DeepResearchView() {
  const { deepResearch } = useStore()
  const { event, step, loading, answer, sources, error } = deepResearch

  const CATEGORY_COLORS: Record<string, string> = {
    iran_attack: '#ff4444', conflict_zone: '#ff4444', intel_hotspot: '#ff8800',
    military_base: '#4488ff', nuclear_site: '#ffff00', radiation: '#88ff00',
    spaceport: '#00aaff', undersea_cable: '#00ddff', pipeline: '#ffaa00',
    fuel_shortage: '#ff6600', tech: '#44ffaa', geopolitics: '#cc88ff',
  }
  const color = event ? (CATEGORY_COLORS[event.category] ?? '#ff4444') : '#ff4444'

  return (
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Event title card */}
      {event && (
        <div style={{
          borderLeft: `2px solid ${color}`,
          paddingLeft: '10px',
          paddingTop: '4px', paddingBottom: '4px',
        }}>
          <div style={{ color, fontSize: '8px', textTransform: 'uppercase', marginBottom: '3px' }}>
            {event.category.replace(/_/g, ' ')} · SEVERITY {event.severity}
          </div>
          <div style={{ color: '#e8e8e8', fontSize: '11px', fontWeight: 'bold', lineHeight: 1.3 }}>
            {event.title}
          </div>
          <div style={{ color: '#555', fontSize: '9px', marginTop: '3px' }}>
            {event.source} · {event.time}
          </div>
        </div>
      )}

      {/* Research pipeline steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {STEP_ORDER.filter(s => s !== 'done').map((s, i) => {
          const currentIdx = STEP_ORDER.indexOf(step)
          const stepIdx = STEP_ORDER.indexOf(s)
          const isDone = !loading || currentIdx > stepIdx
          const isActive = step === s && loading
          const isPending = currentIdx < stepIdx && loading

          return (
            <div key={s} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              opacity: isPending ? 0.3 : 1,
              transition: 'opacity 0.3s',
            }}>
              <div style={{
                width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0,
                border: `1px solid ${isDone ? '#44ff44' : isActive ? '#ffaa00' : '#333'}`,
                background: isDone ? '#44ff4422' : isActive ? '#ffaa0022' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '8px',
                animation: isActive ? 'blink 0.6s infinite' : 'none',
              }}>
                {isDone ? <span style={{ color: '#44ff44' }}>✓</span> : <span style={{ color: '#555' }}>{i + 1}</span>}
              </div>
              <span style={{
                color: isDone ? '#44ff44' : isActive ? '#ffaa00' : '#444',
                fontSize: '9px', letterSpacing: '0.5px',
              }}>
                {STEP_LABELS[s]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Answer */}
      {step === 'done' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            borderTop: '1px solid #1e1e1e', paddingTop: '10px',
            color: '#555', fontSize: '8px', letterSpacing: '1px',
          }}>
            &#9672; VERIFIED ANALYSIS
          </div>

          {error ? (
            <div style={{ color: '#ff4444', fontSize: '10px', lineHeight: 1.5 }}>{answer}</div>
          ) : (
            <div style={{ color: '#ccc', fontSize: '10px', lineHeight: 1.7 }}>
              {answer.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} style={{ marginBottom: '8px' }}>{para}</p>
              ))}
            </div>
          )}

          {/* Citations */}
          {sources.length > 0 && (
            <div>
              <div style={{ color: '#555', fontSize: '8px', letterSpacing: '1px', marginBottom: '6px' }}>
                &#9672; SOURCES ({sources.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sources.slice(0, 8).map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#44ff4488',
                      fontSize: '9px',
                      textDecoration: 'none',
                      display: 'flex', alignItems: 'flex-start', gap: '4px',
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#44ff44')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#44ff4488')}
                  >
                    <span style={{ color: '#333', flexShrink: 0 }}>[{i + 1}]</span>
                    <span>{src.title || src.url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div style={{ color: '#333', fontSize: '8px', marginTop: '4px' }}>
            Powered by Anakin /v1/research · {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', opacity: 0.4 }}>
          {[100, 80, 100, 60].map((w, i) => (
            <div key={i} style={{
              height: '9px', background: '#1e1e1e', borderRadius: '2px', width: `${w}%`,
              animation: 'blink 1.5s infinite',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      )}
    </div>
  )
}

function WorldBriefView() {
  const { insights } = useStore()

  return (
    <>
      {/* World Brief */}
      <div style={{ padding: '12px', borderBottom: '1px solid #1e1e1e' }}>
        <div style={{ color: '#555', fontSize: '9px', letterSpacing: '1px', marginBottom: '8px' }}>
          &#9672; WORLD BRIEF
        </div>
        {insights.worldBrief ? (
          <div style={{ color: '#ccc', lineHeight: '1.6', fontSize: '10px' }}>
            {insights.worldBrief.split('\n\n').map((p, i) => (
              <p key={i} style={{ marginBottom: '8px' }}>{p}</p>
            ))}
          </div>
        ) : (
          <div>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: '10px', background: '#1e1e1e', borderRadius: '2px',
                marginBottom: '6px', width: i === 3 ? '60%' : '100%',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Focal Points */}
      <div style={{ padding: '12px' }}>
        <div style={{ color: '#555', fontSize: '9px', letterSpacing: '1px', marginBottom: '8px' }}>
          &#9672; FOCAL POINTS
        </div>
        {insights.focalPoints.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {insights.focalPoints.slice(0, 6).map((point, i) => {
              const isCritical = point.toLowerCase().includes('critical')
              const isHigh = point.toLowerCase().includes('high')
              const color = isCritical ? '#ff4444' : isHigh ? '#ff8800' : '#ffaa00'
              const parts = point.split(' — ')
              return (
                <div key={i} style={{ borderLeft: `2px solid ${color}44`, paddingLeft: '8px' }}>
                  <div style={{ color: '#e8e8e8', lineHeight: '1.4' }}>
                    {parts[0] && <span style={{ color }}>{parts[0]}</span>}
                    {parts[1] && <span style={{ color: '#888' }}> — {parts[1]}</span>}
                    {!parts[1] && <span>{point}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                height: '28px', background: '#141414',
                borderRadius: '2px', marginBottom: '4px',
              }} />
            ))}
          </div>
        )}

        {insights.lastUpdated && (
          <div style={{ color: '#333', fontSize: '9px', marginTop: '12px' }}>
            Updated {insights.lastUpdated.toLocaleTimeString()}
          </div>
        )}

        {/* Hint */}
        <div style={{
          marginTop: '16px', padding: '8px', background: '#44ff4408',
          border: '1px solid #44ff4422', borderRadius: '2px',
        }}>
          <div style={{ color: '#44ff4488', fontSize: '9px', lineHeight: 1.5 }}>
            &#9654; Click any map marker then press<br />
            <strong style={{ color: '#44ff44' }}>DEEP RESEARCH</strong> for Anakin-verified<br />
            intelligence with cited sources.
          </div>
        </div>
      </div>
    </>
  )
}
