import http from "node:http"
import path from "node:path"
import { readFile, writeFile, appendFile} from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { generateNumber } from "./public/generateNumber.js"

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//memory leak fix
const connectedClients = new Set()
let priceUpdateInterval = null

const server = http.createServer(async (req, res) => {
    try {
        console.log(`🔥 Request received: ${req.method} ${req.url}`) // Add this line
        // Add CORS headers to allow cross-origin requests
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type")

        if (req.method === "OPTIONS")
        {
            console.log("✅ Handling OPTIONS preflight request")
            res.statusCode = 200
            res.end()
            return  // Exit early
        }
        else if(req.url === "/" && req.method === "POST")
        {
            console.log("tryin to post")
            try {
                const purchaseData = await parseBody(req)
                await writePurchase(purchaseData)
                sendResponse(res, 200, "application/json", JSON.stringify({
                    message: "Investment logged", 
                    success: true
                }))
            } catch (error) {
                console.error("❌ POST error:", error)
                // Send proper error response
                sendResponse(res, 500, "application/json", JSON.stringify({
                    message: "Failed to log investment",
                    success: false,
                    error: error.message
                }))
            }
        }
        else if (req.url === "/" && req.method === "GET")
        {
            try {
                res.statusCode = 200
                res.setHeader("Content-Type", "text/event-stream")
                res.setHeader("Cache-Control", "no-cache")
                res.setHeader("Connection", "keep-alive")

                // Add client to set
                connectedClients.add(res)

                // Send initial price
                const initialPrice = generateNumber()
                res.write(`data: ${JSON.stringify({ event: "connected", goldPrice: initialPrice})}\n\n`)

                // Start shared interval ONLY if first client
                if(connectedClients.size === 1)
                {
                    priceUpdateInterval = setInterval(() => {
                        const goldPrice = generateNumber()
                        const message = `data: ${JSON.stringify({ event: "goldPrice updated", goldPrice: goldPrice})}\n\n`
                        
                        // Send to ALL clients
                        connectedClients.forEach(clientRes => {
                            try {
                                clientRes.write(message)
                            } catch (error) {
                                connectedClients.delete(clientRes)
                            }
                        })
                    }, 2000)
                }

                // Clean up when client disconnects
                req.on('close', () => {
                    connectedClients.delete(res)
                    // Stop interval if no clients left
                    if(connectedClients.size === 0 && priceUpdateInterval)
                    {
                        clearInterval(priceUpdateInterval)
                        priceUpdateInterval = null
                    }
                })
            } catch (error) {
                console.error("❌ SSE setup error:", error)
                connectedClients.delete(res)  // Clean up
                if (!res.headersSent)
                {
                    res.statusCode = 500
                    res.end("SSE connection failed")
                }
            }
        }
        else
        {
            // Try to serve static files first
            const requestedPath = req.url === '/' ? '/index.html' : req.url
            const filePath = path.join(__dirname, 'public', requestedPath)
            
            const served = await serveStaticFile(filePath, res)
            
            if (!served)
            {
                // Serve 404.html page
                console.log(`404 - Route not found: ${req.method} ${req.url}`)
                const notFoundPath = path.join(__dirname, 'public', '404.html')
                const served404 = await serveStaticFile(notFoundPath, res)
                
                if (!served404)
                {
                    // Fallback if 404.html doesn't exist
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/plain')
                    res.end('404 - Page Not Found')
                }
            }
        }
    } catch (error) {
        console.error("💥 Server error:", error)
        
        // Send error response if headers haven't been sent
        if (!res.headersSent)
        {
            // Try to serve 404.html for errors
            const errorPagePath = path.join(__dirname, 'public', '404.html')
            const served = await serveStaticFile(errorPagePath, res)
            
            if (!served)
            {
                // Fallback JSON error response
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ 
                    message: 'Internal server error',
                    error: error.message 
                }))
            }
        }
    }
})

async function parseBody(req) {
    try {
        let body = ""
        
        for await (const chunk of req) {
            body += chunk
        }
        
        return JSON.parse(body)
    } catch (error) {
        console.error("❌ Error parsing request body:", error)
        throw new Error("Invalid JSON in request body")
    }
}

async function writePurchase(purchaseData) {
    const pathJSON = path.join(__dirname, "investments.txt")

    console.log("writePurchase called with:", purchaseData) // Add this
    console.log("Writing to:", pathJSON) // Add this

    const log = `${purchaseData.timestamp}, amount paid: $${purchaseData.investment}, price per Oz: ${purchaseData.goldPrice}\n`
    try {
        await appendFile(pathJSON, log, "utf8")
        console.log("✅ Successfully wrote to investments.txt") // Add this
    } catch (error) {
        console.error("❌ Error writing file:", error) // Add this
        throw error
    }
}

function sendResponse(res, statusCode, contentType, payload) {
    res.statusCode = statusCode
    res.setHeader('Content-Type', contentType)
    res.end(payload)
}

async function serveStaticFile(filePath, res) {
    try {
        const content = await readFile(filePath, "utf8")
        const ext = path.extname(filePath).toLowerCase()
        
        // Set content type based on file extension
        let contentType = 'text/html'
        if (ext === '.css') contentType = 'text/css'
        if (ext === '.js') contentType = 'application/javascript'
        if (ext === '.png') contentType = 'image/png'
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
        
        res.statusCode = 200
        res.setHeader('Content-Type', contentType)
        res.end(content)
        return true
    } catch (error) {
        return false
    }
}

server.listen(3000, () => {
    console.log("Server running on port 3000")
}).on('error', (error) => {
    console.error("❌ Server failed to start:", error)
    process.exit(1)
})