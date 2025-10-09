import http from "node:http"
import path from "node:path"
import { readFile, writeFile} from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { generateNumber } from "./public/generateNumber.js"

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const server = http.createServer(async (req, res) => {
    // Add CORS headers to allow cross-origin requests
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    
    if(req.url === "/")
    {
        res.statusCode = 200
        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")

        setInterval(() => {
            const goldPrice = generateNumber()
            res.write(
                `data: ${JSON.stringify({ event: "goldPrice updated", goldPrice: goldPrice})}\n\n`
            )
        }, 2000)
        // const localTest = getData()
        // writePurchase(localTest)
        // sendResponse(res, 200, "application/json", localTest)
    }
})

function sendResponse(res, statusCode, contentType, payload) {
    res.statusCode = statusCode
    res.setHeader('Content-Type', contentType)
    res.end(payload)
}

function getData() {
    const randomNumber = Math.floor(Math.random() * 100)
    //const phrase = `Your random number is: ${randomNumber}!!!`
    return randomNumber
}

async function parseBody(req) {
    let body = ""

    for await (const chunk of req) {
        body += chunk
    }

    return JSON.parse(body)
}

async function writePurchase(price) {
    const pathJSON = path.join(__dirname, "test.json")
    
    try {
        // Read existing data
        const existingData = await readFile(pathJSON, "utf8")
        const parsed = JSON.parse(existingData)
        
        // Create new purchase entry
        const newPurchase = `I bought gold at: ${price} today!`
        
        // Add to existing data (assuming it's an object with purchases array)
        
        parsed.purchases.push(newPurchase)
        
        // Write back to file
        await writeFile(pathJSON, JSON.stringify(parsed, null, 2), "utf8")
        
    } catch (error) {
        // If file doesn't exist or is corrupted, create new structure
        const newData = {
            purchases: [`I bought gold at: ${price} today!`]
        }
        await writeFile(pathJSON, JSON.stringify(newData, null, 2), "utf8")
    }
}

server.listen(3000, () => {
    console.log("I exist")
})





//TO DO LIST

/*
    Make the price update from the server side (maintain a constant connection, update every few seconds)
    --red light when offline, green when online **DONE**

    --fix memory leak??

    Write the prices to a TEXT file not .json file
    --get the mini-menu to popup

    the server should GET the price number, and when clicked it should POST the price (route accordingly)
*/