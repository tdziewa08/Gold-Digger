import http from "node:http"
import path from "node:path"
import { readFile, writeFile} from "node:fs/promises"


const server = http.createServer((req, res) => {
    // Add CORS headers to allow cross-origin requests
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    
    if(req.url === "/")
    {
        res.setHeader("Content-Type", "application/json")
        console.log("I exist in the IF block")
        res.end(JSON.stringify({message: "Test text I want to put into the app"}))
    }
})

server.listen(3000, () => {
    console.log("I exist")
})
