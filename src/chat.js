function sendKeyPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendText()
  }
}

function sendText() {
  var inputText = document.getElementById('chat-input');
  if (inputText.value === '') {
    return;
  }
  var chatHistory = document.getElementById('chat-history')
  var clientMessage = createClientMessage(inputText.value)
  chatHistory.appendChild(clientMessage)
  inputText.value = ''

  // Get Chatbot response
  var chatBotMessage = createBotMessage("Yo c'est Chatbrerie")
  chatHistory.appendChild(chatBotMessage)

  chatHistory.scrollTop = chatHistory.scrollHeight
}

function createBotMessage(text) {
  var rootDiv = document.createElement("div")
  rootDiv.classList.add("d-flex", "align-items-center")

  var avatarDiv = document.createElement("div")
  avatarDiv.classList.add("text-left", "pr-1")
  var avatarImg = document.createElement("img")
  avatarImg.src = "https://img.icons8.com/color/40/000000/guest-female.png"
  avatarImg.width = "30"
  avatarImg.classList.add("img-chat")
  avatarDiv.appendChild(avatarImg)

  var textDiv = document.createElement("div")
  textDiv.classList.add("pr-2", "pl-1")

  var clientName = document.createElement("span")
  clientName.classList.add("name")
  clientName.innerText = "Chatbrerie" // i18n?

  var paragraph = document.createElement("p")
  paragraph.classList.add("msg")
  paragraph.innerText = text

  textDiv.appendChild(clientName)
  textDiv.appendChild(paragraph)

  rootDiv.appendChild(avatarDiv)
  rootDiv.appendChild(textDiv)
  return rootDiv
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
  avatarImg.classList.add("img-chat")
  avatarDiv.appendChild(avatarImg)

  rootDiv.appendChild(textDiv)
  rootDiv.appendChild(avatarDiv)
  return rootDiv
}

window.onload = () => {
  document.getElementById("chat-send-text").onclick = sendText
  document.getElementById("chat-input").onkeypress = (event) => sendKeyPress(event)
}