const tester = document.getElementById("tester")
//tester.textContent = "NEWWWW"
const testerBtn = document.getElementById("tester-btn")
testerBtn.addEventListener('click', getStuff)

const livePrice = document.getElementById("price-display")
const investment = document.getElementById("investment-amount")
setInterval(generateNumber, 2000)


function getStuff() {
    console.log("Button clicked!")
    fetch("http://localhost:3000/")
        .then(res => res.json()) // Parse as JSON since server sends JSON
        .then(data => {
            console.log(data)
            tester.textContent = data
        })
}

function generateNumber() {
    const randomNumber = Math.floor(Math.random() * 100)
    livePrice.textContent = randomNumber
}