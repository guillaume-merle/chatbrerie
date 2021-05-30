import { loadFile } from '../utils/utils.js'
import { Config } from '../config.js'

class View {
    constructor(controller) {
        this.controller = controller
    }

    init() {
        window.onload = () => {
            loadFile(Config.chatbotViewPath).then((chatbot) => {
                this.insertChatbot(chatbot)

                document.getElementById("chat-send-text").onclick = this.sendText
                document.getElementById("chatbot-input").onkeypress = (event) => this.sendOnKeyPress(event)

                this.controller.botAnswer('Bonjour').then((message) => {
                    var chatBotMessage = this.createBotMessage(message)
                    var chatHistory = document.getElementById('chat-history')
                    chatHistory.appendChild(chatBotMessage)

                    chatHistory.scrollTop = chatHistory.scrollHeight
                })
            })
        }
    }

    createClientMessage(text) {
        var rootDiv = document.createElement("div")
        rootDiv.classList.add("d-flex", "align-items-center", "text-right", "justify-content-end")

        var textDiv = document.createElement("div")
        textDiv.classList.add("pr-2")

        var clientName = document.createElement("span")
        clientName.classList.add("chatbot-name")
        clientName.innerText = "Vous" // i18n?

        var paragraph = document.createElement("p")
        paragraph.classList.add("chatbot-msg")
        paragraph.innerText = text

        textDiv.appendChild(clientName)
        textDiv.appendChild(paragraph)

        var avatarDiv = document.createElement("div")
        var avatarImg = document.createElement("img")
        avatarImg.src = "https://i.imgur.com/HpF4BFG.jpg"
        avatarImg.width = "30"
        avatarImg.classList.add("img-chat")
        avatarDiv.classList.add("align-self-start")
        avatarDiv.appendChild(avatarImg)

        rootDiv.appendChild(textDiv)
        rootDiv.appendChild(avatarDiv)
        return rootDiv
    }

    sendText() {
        var inputText = document.getElementById('chatbot-input');
        if (inputText.value === '') {
            return;
        }

        var input = inputText.value;
        var chatHistory = document.getElementById('chat-history')
        var clientMessage = this.createClientMessage(inputText.value)
        chatHistory.appendChild(clientMessage)
        inputText.value = ''

        // Get Chatbot response
        var answer = this.controller.botAnswer(input).then((answer) => {
            var chatBotMessage = this.createBotMessage(answer)
            chatHistory.appendChild(chatBotMessage)

            chatHistory.scrollTop = chatHistory.scrollHeight
        })
    }

    sendOnKeyPress(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.sendText()
        }
    }

    createBotMessage(text) {
        var rootDiv = document.createElement("div")
        rootDiv.classList.add("d-flex", "align-items-center")

        var avatarDiv = document.createElement("div")
        avatarDiv.classList.add("text-left", "pr-1", "align-self-start")
        var avatarImg = document.createElement("img")
        avatarImg.src = "https://img.icons8.com/color/40/000000/guest-female.png"
        avatarImg.width = "30"
        avatarImg.classList.add("img-chat")
        avatarDiv.appendChild(avatarImg)

        var textDiv = document.createElement("div")
        textDiv.classList.add("pr-2", "pl-1")

        var clientName = document.createElement("span")
        clientName.classList.add("chatbot-name")
        clientName.innerText = "Chatbrerie" // i18n?

        var paragraph = document.createElement("p")
        paragraph.classList.add("chatbot-msg")
        paragraph.innerText = text

        textDiv.appendChild(clientName)
        textDiv.appendChild(paragraph)

        rootDiv.appendChild(avatarDiv)
        rootDiv.appendChild(textDiv)
        return rootDiv
    }

    insertChatbot(chatbot) {
        document.body.innerHTML += chatbot
    }
}

export { View }
