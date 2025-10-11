const statusIndicator = document.getElementById("status-indicator")

const livePrice = document.getElementById("price-display")
const investment = document.getElementById("investment-amount")
const investBtn = document.getElementById("invest-btn")
investBtn.addEventListener('click', logTransaction)


const successModal = document.getElementById("success-modal")
const investmentSummary = document.getElementById("investment-summary")
const modalCloseBtn = successModal.querySelector('button')

modalCloseBtn.addEventListener('click', () => {
    successModal.close()
})

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
  console.log('Connection failed...', error)
  statusIndicator.textContent = "🔴"
}

function logTransaction(event) {
    event.preventDefault()
    fetch("http://localhost:3000/",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            goldPrice: livePrice.textContent,
            investment: investment.value,
            timestamp: new Date().toISOString()
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("POST SUCCESSFUL:     " + data)
        const ounces = (investment.value / livePrice.textContent).toFixed(2)
        investmentSummary.textContent = `You just bought ${ounces} (ozt) for${investment.value}. \n You will receive documentation shortly.`
        investment.value = ""
        successModal.showModal()
    })
    .catch(error => {
        console.error("POST FAILED: ", error)
    })
}