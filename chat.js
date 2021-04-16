function sendText() {
    var inputText = document.getElementById('chat-input');
    if (inputText.value === '') {
        return;
    }
    console.log(inputText.value)
    var chatHistory = document.getElementById('chat-history')
    var clientMessage = createClientMessage(inputText.value)
    chatHistory.appendChild(clientMessage)
    inputText.value = ''
}

function createClientMessage(text) {
    var rootDiv = document.createElement("div")
    rootDiv.classList.add("d-flex", "align-items-center", "text-right", "justify-content-end")

    var textDiv = document.createElement("div")
    textDiv.classList.add("pr-2")

    var clientName = document.createElement("span")
    clientName.classList.add("name")
    clientName.innerText = "Vous" // i18n?

    var paragraph = document.createElement("p")
    paragraph.classList.add("msg")
    paragraph.innerText = text

    textDiv.appendChild(clientName)
    textDiv.appendChild(paragraph)

    var avatarDiv = document.createElement("div")
    var avatarImg = document.createElement("img")
    avatarImg.src = "https://i.imgur.com/HpF4BFG.jpg"
    avatarImg.width = "30"
    avatarImg.classList.add("img1")
    avatarDiv.appendChild(avatarImg)

    rootDiv.appendChild(textDiv)
    rootDiv.appendChild(avatarDiv)
    return rootDiv
}
