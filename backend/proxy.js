import { createServer } from 'http'
import { request } from 'https'
import fs from 'fs'
import path from 'path'

const PORT = 5000
const HF_API_URL = 'router.huggingface.co'
const HF_MODEL = 'HuggingFaceTB/SmolLM3-3B'
let HF_TOKEN = ''

console.log('Starting from directory:', process.cwd())

console.log('🚀 Starting AI Chat Proxy (Node.js)...')
console.log(`📊 Model: ${HF_MODEL}`)

// Read .env file (simple version)
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    if (!fs.existsSync(envPath)) {
      console.log('⚠️  No .env file found at:', envPath)
      return
    }
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (!trimmedLine || trimmedLine.startsWith('#')) return
      const [key, ...valueParts] = trimmedLine.split('=')
      const value = valueParts.join('=').trim()
      if (key && value) {
        process.env[key] = value
      }
    })
    console.log('✅ Environment loaded from .env')
  } catch (e) {
    console.log('❌ Error loading .env:', e.message)
  }
}

loadEnv()

const server = createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  // Health check
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', model: HF_MODEL }))
    return
  }

  // Chat endpoint
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const data = JSON.parse(body)
        const message = data.message || ''

        console.log(`📨 Message: ${message}`)

        const token = process.env.HF_TOKEN || process.env.HF_API_TOKEN || process.env.VITE_HF_API_TOKEN

        if (!token) {
          console.error('❌ HF_TOKEN not set!')
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'HF_TOKEN not configured in .env' }))
          return
        }

        // Call HuggingFace Router API (OpenAI-compatible)
        const options = {
          hostname: HF_API_URL,
          port: 443,
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }

        const hfReq = request(options, (hfRes) => {
          let hfData = ''

          hfRes.on('data', chunk => {
            hfData += chunk.toString()
          })

          hfRes.on('end', () => {
            if (hfRes.statusCode === 200) {
              const result = JSON.parse(hfData)
              let generatedText = result.choices?.[0]?.message?.content || ''

              // Strip <think> tags and their content
              generatedText = generatedText.replace(/<think>[\s\S]*?<\/think>/g, '').trim()

              console.log(`✅ Response: ${generatedText.substring(0, 50)}...`)

              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ response: generatedText }))
            } else {
              console.error(`❌ HF API Error: ${hfRes.statusCode}`)
              res.writeHead(hfRes.statusCode || 500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                error: `API error: ${hfRes.statusCode}`,
                details: hfData
              }))
            }
          })
        })

        hfReq.on('error', (err) => {
          console.error('❌ Request error:', err.message)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: err.message }))
        })

        const systemPrompt = `Du bist der professionelle KI-Assistent von Pascal Hintermaier. 
Antworte immer auf Deutsch. Gib NIEMALS deine internen Gedankengänge (wie <think>...</think>) in deiner Antwort aus. 
Deine Aufgabe ist es, Fragen zu Pascals Projekten, Fähigkeiten und seinem Hintergrund als IT-Experte zu beantworten. 
Kontaktdaten: E-Mail: ${process.env.CONTACT_EMAIL || 'pascal.hintermaier@example.com'}, GitHub: ${process.env.CONTACT_GITHUB || 'Kein GitHub'}, LinkedIn: ${process.env.CONTACT_LINKEDIN || 'Kein LinkedIn'}.`

        hfReq.write(JSON.stringify({
          model: HF_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
          stream: false
        }))
        hfReq.end()

      } catch (err) {
        console.error('❌ JSON parse error:', err.message)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })

    return
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(PORT, () => {
  console.log(`\n🎉 Server running on http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/health`)
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`)
  console.log('\nPress Ctrl+C to stop\n')
})
