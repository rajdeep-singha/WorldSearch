// All requests go through Vite's dev proxy (/api/anakin → https://api.anakin.io/v1)
// X-API-Key is injected server-side by the proxy — no CORS issues
const BASE = '/api/anakin'

async function post(endpoint: string, body: object) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${endpoint} → ${res.status}`)
  return res.json()
}

async function get(endpoint: string) {
  const res = await fetch(`${BASE}${endpoint}`)
  if (!res.ok) throw new Error(`GET ${endpoint} → ${res.status}`)
  return res.json()
}

// Recursively extract all string values from a nested object as readable prose
function extractText(val: unknown, depth = 0): string {
  if (typeof val === 'string') {
    // If it looks like JSON, try to parse and recurse
    const trimmed = val.trim()
    if ((trimmed.startsWith('{') || trimmed.startsWith('[')) ) {
      try { return extractText(JSON.parse(trimmed), depth) } catch { /* not JSON */ }
    }
    return trimmed
  }
  if (Array.isArray(val)) {
    return val.map(v => extractText(v, depth + 1)).filter(Boolean).join('\n\n')
  }
  if (val && typeof val === 'object') {
    const obj = val as Record<string, unknown>
    // Prefer known text fields in priority order
    const textFields = ['answer', 'content', 'text', 'summary', 'result', 'response', 'message', 'body', 'output']
    for (const field of textFields) {
      if (obj[field] && typeof obj[field] === 'string') return extractText(obj[field], depth)
    }
    // Fallback: join all string values
    return Object.values(obj)
      .filter(v => typeof v === 'string' && (v as string).length > 20)
      .map(v => extractText(v, depth + 1))
      .join('\n\n')
  }
  return ''
}

function extractSources(val: unknown): Array<{ title: string; url: string }> {
  if (!val || typeof val !== 'object') return []
  const obj = val as Record<string, unknown>
  const raw = obj.sources ?? obj.citations ?? obj.references ?? obj.links ?? []
  if (!Array.isArray(raw)) return []
  return raw
    .filter((s): s is Record<string, unknown> => s && typeof s === 'object')
    .map(s => ({
      title: String(s.title ?? s.name ?? s.url ?? ''),
      url: String(s.url ?? s.link ?? s.href ?? ''),
    }))
    .filter(s => s.url)
}

//  Search API (synchronous) 
export interface SearchResult {
  url: string
  title: string
  snippet: string
  date?: string
}

export async function searchNews(prompt: string, limit = 8): Promise<SearchResult[]> {
  try {
    const data = await post('/search', { prompt, limit })
    const raw = data.results ?? data.data ?? []
    return raw.map((r: Record<string, unknown>) => ({
      url: String(r.url ?? ''),
      title: String(r.title ?? ''),
      snippet: String(r.snippet ?? r.description ?? r.content ?? ''),
      date: r.date ? String(r.date) : undefined,
    }))
  } catch {
    return []
  }
}

//  Agentic Research (async — submit → poll) 
export interface ResearchResult {
  answer: string
  sources: Array<{ title: string; url: string }>
}

async function pollJob(id: string, intervalMs = 5000, timeoutMs = 120000): Promise<ResearchResult> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, intervalMs))
    const data = await get(`/agentic-search/${id}`)
    console.log('[Anakin] poll response:', data)

    const status = data.status ?? data.state

    if (status === 'completed' || status === 'done' || status === 'success') {
      // Anakin returns text in generatedJson.summary
      const gj = data.generatedJson
      const answer =
        gj?.summary ??
        gj?.structured_data?.summary ??
        gj?.structured_data?.answer ??
        extractText(gj) ??
        extractText(data.result ?? data)

      // Sources may be in structured_data.sources or structured_data.references
      const sources =
        extractSources(gj?.structured_data) ||
        extractSources(gj) ||
        extractSources(data.result ?? data)

      return { answer: answer || 'No summary available.', sources }
    }
    if (status === 'failed' || status === 'error') throw new Error('Agentic search job failed')
  }
  throw new Error('Agentic search timed out')
}

export async function researchTopic(prompt: string): Promise<ResearchResult | null> {
  try {
    const submitRes = await post('/agentic-search', { prompt })
    console.log('[Anakin] agentic-search submit response:', submitRes)

    const jobId = submitRes.id ?? submitRes.job_id ?? submitRes.jobId
      ?? submitRes.data?.id ?? submitRes.data?.job_id

    if (!jobId) {
      if (submitRes.result || submitRes.answer || submitRes.content) {
        return {
          answer: extractText(submitRes.result ?? submitRes),
          sources: extractSources(submitRes.result ?? submitRes),
        }
      }
      console.error('[Anakin] No job ID in response:', submitRes)
      return null
    }

    return await pollJob(jobId)
  } catch (e) {
    console.error('[Anakin] researchTopic error:', e)
    return null
  }
}
