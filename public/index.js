const tester = document.getElementById("tester")
const testerBtn = document.getElementById("tester-btn")
testerBtn.addEventListener('click', getStuff)

const livePrice = document.getElementById("price-display")
const statusIndicator = document.getElementById("status-indicator")
const investment = document.getElementById("investment-amount")

const eventSource = new EventSource("http://localhost:3000/")

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    
    if(data.event === "connected" || data.event === "goldPrice updated")
    {
        statusIndicator.textContent = "🟢"
        const goldPrice = data.goldPrice
        livePrice.textContent = goldPrice
    }
}

eventSource.onerror = () => {
  console.log('Connection failed...')
}

function getStuff() {
    console.log("Button clicked!")
    fetch("http://localhost:3000/")
        .then(res => res.json()) // Parse as JSON since server sends JSON
        .then(data => {
            console.log(data)
            tester.textContent = data
        })
}