export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANAKIN_KEY || process.env.VITE_ANAKIN_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANAKIN_KEY not configured' })
  }

  const { id } = req.query

  const upstream = await fetch(`https://api.anakin.io/v1/agentic-search/${id}`, {
    headers: {
      'X-API-Key': apiKey,
    },
  })

  const data = await upstream.json()
  return res.status(upstream.status).json(data)
}
