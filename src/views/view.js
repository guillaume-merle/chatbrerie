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

    async insertMessage(message, type = 'client') {
        var templatePath = (type.localeCompare('client') == 0 ? Config.clientMessageViewPath : Config.botMessageViewPath)
        await this.insertBlock(templatePath, {message: message})
    }

    async insertQuizQuestion(question, ids) {
        await this.insertBlock(Config.quizQuestionViewPath, {
            question: question.question,
            responses: question.responses,
            ids: ids
        })
    }

    async insertImage(imagePath) {
        const imageUrl = chrome.runtime.getURL(imagePath)
        await this.insertBlock(Config.imageViewPath, {imageUrl: imageUrl})
    }

    async insertBlock(templatePath, dict) {
        var template = await loadFile(templatePath)

        dict['botAvatar'] = chrome.runtime.getURL(Config.botAvatar)
        dict['clientAvatar'] = chrome.runtime.getURL(Config.clientAvatar)

        var rendered = Mustache.render(template, dict)
        this.chatHistory.innerHTML += rendered
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight
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
