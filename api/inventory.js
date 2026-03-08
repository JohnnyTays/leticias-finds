// Vercel Serverless Function - stores GitHub token server-side (not exposed to client)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = 'JohnnyTays/leticias-finds'
const FILE_PATH = 'public/inventory.json'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Return current inventory
    const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/main/${FILE_PATH}`)
    const data = await response.json()
    return res.status(200).json(data)
  }
  
  if (req.method === 'POST') {
    const { inventory } = req.body
    
    // Get file SHA first
    const shaResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    })
    const shaData = await shaResponse.json()
    
    // Update file
    const content = Buffer.from(JSON.stringify(inventory, null, 2)).toString('base64')
    const updateResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update inventory via app',
        content: content,
        sha: shaData.sha
      })
    })
    
    if (updateResponse.ok) {
      return res.status(200).json({ success: true })
    } else {
      return res.status(500).json({ error: 'Failed to update' })
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' })
}
