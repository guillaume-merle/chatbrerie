import { loadFile } from '../utils/utils.js'
import { Config } from '../config.js'

var Mustache = require('mustache')

class View {
    constructor(controller) {
        this.controller = controller
        this.chatHistory = null
    }

    init() {
        window.onload = () => {
            loadFile(Config.chatbotViewPath).then((chatbot) => {
                this.insertChatbot(chatbot)
                this.chatHistory = document.getElementById('chat-history')

                document.getElementById("chat-send-text").onclick = this.sendText
                document.getElementById("chatbot-input").onkeypress = (event) => this.sendOnKeyPress(event)

                this.controller.botAnswer('Bonjour').then((message) => {
                    this.insertMessage(message, 'bot')
                    this.chatHistory.scrollTop = this.chatHistory.scrollHeight
                })
            })
        }
    }

    insertMessage(message, type = 'client') {
        var templatePath = (type.localeCompare('client') == 0 ? Config.clientMessageViewPath : Config.botMessageViewPath)

        loadFile(templatePath).then((template) => {
            var rendered = Mustache.render(template, {message: message})
            this.chatHistory.innerHTML += rendered
        })
    }

    sendText() {
        var inputText = document.getElementById('chatbot-input')
        if (inputText.value === '') {
            return
        }

        var input = inputText.value
        this.insertMessage(inputText.value)
        inputText.value = ''

        // Get Chatbot response
        var answer = this.controller.botAnswer(input).then((answer) => {
            this.insertMessage(answer, 'bot')
            this.chatHistory.scrollTop = this.chatHistory.scrollHeight
        })
    }

    sendOnKeyPress(event) {
        if (event.keyCode === 13) {
            event.preventDefault()
            this.sendText()
        }
    }

    insertChatbot(chatbot) {
        var el = document.createElement('div')
        el.innerHTML = chatbot
        document.body.appendChild(el)
    }
}

export { View }
