// Cloud storage via GitHub Gist
// Uses GITHUB_TOKEN from Vercel environment variables

export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GIST_ID = 'eb4d5f8c4c4b4e4b4c4b4e4b'
  
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured' })
  }
  
  const GIST_URL = `https://api.github.com/gists/${GIST_ID}`

  if (req.method === 'GET') {
    try {
      const response = await fetch(GIST_URL, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
      })
      if (!response.ok) return res.status(200).json([])
      
      const data = await response.json()
      const content = data.files['inventory.json']?.content
      if (!content) return res.status(200).json([])
      
      return res.status(200).json(JSON.parse(content))
    } catch (error) {
      return res.status(200).json([])
    }
  }

  if (req.method === 'POST') {
    try {
      const { inventory } = req.body
      
      const response = await fetch(GIST_URL, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: {
            'inventory.json': {
              content: JSON.stringify(inventory, null, 2)
            }
          }
        })
      })

      if (response.ok) {
        return res.status(200).json({ success: true })
      }
      return res.status(500).json({ error: 'Failed to save' })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
