import { loadFile } from '../utils/utils.js'
import { Config } from '../config.js'

var Mustache = require('mustache')

class View {
    constructor(controller) {
        this.controller = controller
        this.chatHistory = null
        this.lastSender = ''

        loadFile(Config.botBaseViewPath).then((template) => {
            this.botBaseTemplate = template
        })
        loadFile(Config.clientBaseViewPath).then((template) => {
            this.clientBaseTemplate = template
        })
    }

    init() {
        window.onload = () => {
            loadFile(Config.chatbotViewPath).then((chatbot) => {
                this.insertChatbot(chatbot)
                this.chatHistory = document.getElementById('chat-history')

                this.inputField = document.getElementById('chatbot-input')
                this.inputPlaceholder = this.inputField.placeholder

                this.sendButton = document.getElementById('chat-send-text')

                this.chatbotNav = document.getElementById('chatbot-nav')
                this.standardNav = this.chatbotNav.firstElementChild

                this.sendButton.onclick = () => this.sendCallback()
                this.inputField.onkeypress = (event) => this.sendOnKeyPressCallback(event)

                this.controller.botAnswer('Bonjour')
            })
        }
    }

    async insertMessage(message, type = 'client') {
        var templatePath = type === 'client' ? Config.clientMessageViewPath : Config.botMessageViewPath
        await this.insertBlock(templatePath, {message: message}, type)
    }

    async insertQuizQuestion(question) {
        await this.insertBlock(Config.quizQuestionViewPath, {
            question: question.question,
            responses: question.responses
        })
        this.lastSender = ''
    }

    async insertImage(imagePath) {
        const imageUrl = chrome.runtime.getURL(imagePath)
        await this.insertBlock(Config.imageViewPath, {imageUrl: imageUrl})
    }

    async insertBlock(templatePath, dict, type = 'bot') {
        var baseTemplate = type === 'bot' ? this.botBaseTemplate : this.clientBaseTemplate
        var template = await loadFile(templatePath)

        dict['botAvatar'] = chrome.runtime.getURL(Config.botAvatar)
        dict['clientAvatar'] = chrome.runtime.getURL(Config.clientAvatar)
        dict['chain'] = type === this.lastSender
        this.lastSender = type

        var rendered = Mustache.render(baseTemplate, dict, {yield: template})
        this.chatHistory.innerHTML += rendered
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight
    }

    setQuizMode(quizController) {
        loadFile(Config.quizNavViewPath).then((nav) => {
            this.chatbotNav.innerHTML = nav
            document.getElementById('chat-exit').onclick = () => this.exitQuizCallback(quizController)
        })
    }

    unsetQuizMode() {
        this.chatbotNav.replaceChildren(this.standardNav)
        this.sendButton.onclick = () => this.sendCallback()
    }

    sendCallback() {
        if (this.inputField.value === '') {
            return
        }

        var input = this.inputField.value
        this.insertMessage(input)
        this.inputField.value = ''

        // Let the bot answer
        this.controller.botAnswer(input)
    }

    sendOnKeyPressCallback(event) {
        if (event.keyCode === 13) {
            event.preventDefault()
            this.sendCallback()
        }
    }

    exitQuizCallback(quizController) {
        quizController.exit()
    }

    insertChatbot(chatbot) {
        var el = document.createElement('div')
        el.innerHTML = chatbot
        document.body.appendChild(el)
    }
}

export { View }
