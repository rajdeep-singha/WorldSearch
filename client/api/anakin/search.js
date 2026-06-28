export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANAKIN_KEY || process.env.VITE_ANAKIN_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANAKIN_KEY not configured' })
  }

  const upstream = await fetch('https://api.anakin.io/v1/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(req.body),
  })

  const data = await upstream.json()
  return res.status(upstream.status).json(data)
}
