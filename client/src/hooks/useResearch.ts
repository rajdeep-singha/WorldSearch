import { useEffect, useRef } from 'react'
import { researchTopic } from '../api/anakin'
import { useStore } from '../store/useStore'

const MOCK_BRIEF = `The US and Iran have traded strikes. A ceasefire is no longer holding.

Russian forces continue bombardment of Ukrainian infrastructure ahead of winter. NATO allies convene emergency session as eastern flank tensions mount.

North Korean ICBM preparations detected at known launch facility. South Korea and Japan activate early warning systems.`

const MOCK_FOCAL = [
  'Strait of Hormuz — CRITICAL: IRGC seizing tankers, 40% shipping reduction',
  'Zaporizhzhia NPP — HIGH: Third grid connection lost, IAEA on-site',
  'Taiwan Strait — HIGH: PLA median line violations increasing',
  'Sahel Region — ELEVATED: Wagner advance continues in Mali',
  'Eastern Europe — ELEVATED: NATO posture shift underway',
]

export function useResearch() {
  const { setInsights } = useStore()
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const fetchInsights = async () => {
    setInsights({ loading: true })
    const result = await researchTopic(
      'Current global geopolitical situation June 2026: active conflicts, military escalations, nuclear threats, key hotspots summary'
    )

    if (result?.answer) {
      // Split into paragraphs — use first 2 as the brief, rest as focal points
      const paras = result.answer
        .split(/\n{2,}/)
        .map(p => p.replace(/\n/g, ' ').trim())
        .filter(p => p.length > 30)

      const worldBrief = paras.slice(0, 2).join('\n\n')

      // Focal points: remaining paragraphs, or sentences that look like hotspot summaries
      const focalPoints = paras.length > 2
        ? paras.slice(2, 8)
        : result.answer
            .split(/[.!?]\s+/)
            .filter(s => s.length > 40)
            .slice(0, 6)
            .map(s => s.trim())

      setInsights({
        worldBrief,
        focalPoints,
        loading: false,
        lastUpdated: new Date(),
      })
    } else {
      setInsights({
        worldBrief: MOCK_BRIEF,
        focalPoints: MOCK_FOCAL,
        loading: false,
        lastUpdated: new Date(),
      })
    }
  }

  useEffect(() => {
    fetchInsights()
    timerRef.current = setInterval(fetchInsights, 15 * 60 * 1000)
    return () => clearInterval(timerRef.current)
  }, [])
}
