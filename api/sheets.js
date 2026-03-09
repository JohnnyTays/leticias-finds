// Cloud storage via GitHub private repo
// Uses GITHUB_TOKEN from Vercel environment variables

export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const REPO_OWNER = 'JohnnyTays'
  const REPO_NAME = 'leticias-inventory'
  const FILE_PATH = 'inventory.json'
  
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured' })
  }
  
  const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`

  if (req.method === 'GET') {
    try {
      const response = await fetch(API_URL, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
      })
      if (!response.ok) return res.status(200).json([])
      
      const data = await response.json()
      const content = Buffer.from(data.content, 'base64').toString()
      return res.status(200).json(JSON.parse(content))
    } catch (error) {
      return res.status(200).json([])
    }
  }

  if (req.method === 'POST') {
    try {
      const { inventory } = req.body
      
      // Get current file SHA
      let sha = null
      try {
        const getResponse = await fetch(API_URL, {
          headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        })
        if (getResponse.ok) {
          const existing = await getResponse.json()
          sha = existing.sha
        }
      } catch {}

      // Update file
      const content = Buffer.from(JSON.stringify(inventory, null, 2)).toString('base64')
      const updateResponse = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update inventory',
          content: content,
          ...(sha ? { sha } : {})
        })
      })

      if (updateResponse.ok) {
        return res.status(200).json({ success: true })
      }
      return res.status(500).json({ error: 'Failed to save' })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
