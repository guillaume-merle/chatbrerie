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

                this.controller.botAnswer('Bonjour')
            })
        }
    }

    insertMessage(message, type = 'client') {
        var templatePath = (type.localeCompare('client') == 0 ? Config.clientMessageViewPath : Config.botMessageViewPath)
        this.insertBlock(templatePath, {message: message})
    }

    insertQuizQuestion(question) {
        this.insertBlock(Config.quizQuestionViewPath, {
            question: question.question,
            responses: question.responses
        })
    }

    insertImage(imagePath) {
        const imageUrl = chrome.runtime.getURL(imagePath)
        this.insertBlock(Config.imageViewPath, {imageUrl: imageUrl})
    }

    insertBlock(templatePath, dict) {
        loadFile(templatePath).then((template) => {
            dict['botAvatar'] = chrome.runtime.getURL(Config.botAvatar)
            dict['clientAvatar'] = chrome.runtime.getURL(Config.clientAvatar)
            var rendered = Mustache.render(template, dict)
            this.chatHistory.innerHTML += rendered
            this.chatHistory.scrollTop = this.chatHistory.scrollHeight
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

        // Let the bot answer
        this.controller.botAnswer(input)
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
