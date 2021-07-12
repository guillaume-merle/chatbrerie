import { loadFile, createBlock } from '../utils/utils.js'
import { Config } from '../config.js'

var Mustache = require('mustache')

/** class managing all the view */
class View {
    /**
     * Save the controller and create chatHistory and lastSender attributes
     * @param {Controller} controller - the controller associated to this view
     */
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

    /**
     * Init the chatbot popup
     */
    init() {
        window.onload = () => {
            loadFile(Config.chatbotViewPath).then((chatbot) => {
                this.insertChatbot(chatbot)

                this.popup = document.getElementById('chatbrerie-popup')
                this.popup.onclick = () => this.disablePopup()
                document.getElementById('chat-btn').onclick = () => this.disablePopup()
                setTimeout(() => this.disablePopup(), 5000)

                this.chatHistory = document.getElementById('chat-history')

                this.inputField = document.getElementById('chatbot-input')
                this.inputPlaceholder = this.inputField.placeholder

                this.sendButton = document.getElementById('chat-send-text')

                this.chatbotNav = document.getElementById('chatbot-nav')
                this.standardNav = this.chatbotNav.firstElementChild

                this.sendButton.onclick = () => this.sendCallback()
                this.inputField.onkeypress = (event) => this.sendOnKeyPressCallback(event)

                this.controller.start()

                this.chatHistory.onclick = (event) => this.functionButtonCallback(event) // event delegation
            })
        }
    }

    /**
     * Insert a message in the chatbot
     * @param {string} message - the message to print in the chatbot
     * @param {string} type - bot or client
     */
    async insertMessage(message, type = 'bot') {
        var templatePath = type === 'client' ? Config.clientMessageViewPath : Config.botMessageViewPath
        await this.insertBlock(templatePath, {message: message}, type)
    }

    /**
     * Insert a quiz question in the chatbot (question + responses)
     * @param {dict} question - contain the question and the responses
     */
    async insertQuizQuestion(question) {
        await this.insertBlock(Config.quizQuestionViewPath, {
            question: question.question,
            responses: question.responses
        })
        this.lastSender = ''
    }

    /**
     * Insert a form for creating a calendar event in the chatbot
     * @param {int} id - unique id for the form
     */
    async insertForm(id) {
        await this.insertBlock(Config.formMessageViewPath, {
            id: id
        })
        this.lastSender = ''
    }

    /**
     * Insert an image in the chatbot
     * @param {string} imagePath - path to the image file
     */
    async insertImage(imagePath) {
        const imageUrl = chrome.runtime.getURL(imagePath)
        await this.insertBlock(Config.imageViewPath, {imageUrl: imageUrl})
    }

    /**
     * Insert multiple functions in the chatbot (for standard functionalities)
     * @param {array} functions - array of functions
     */
    async insertFunctions(functions) {
        await this.insertBlock(Config.functionsViewPath, {functions: functions})
    }

    /**
     * Insert a html block in the chatbot
     * @param {string} templatePath - path to the html template
     * @param {dict} dict - dict containing the bot and client avatar and the last sender
     * @param {string} type - client or bot
     */
    async insertBlock(templatePath, dict, type = 'bot') {
        var baseTemplate = type === 'bot' ? this.botBaseTemplate : this.clientBaseTemplate
        var template = await loadFile(templatePath)

        dict['botAvatar'] = chrome.runtime.getURL(Config.botAvatar)
        dict['clientAvatar'] = chrome.runtime.getURL(Config.clientAvatar)
        dict['chain'] = type === this.lastSender
        this.lastSender = type

        var rendered = Mustache.render(baseTemplate, dict, {yield: template})

        this.chatHistory.appendChild(createBlock(rendered))

        this.chatHistory.scrollTop = this.chatHistory.scrollHeight
    }

    /**
     * Set the chatbot in quiz mode. It stops if the user finish the quiz or use the button to stop it
     * @param {QuizController} quizController - set the chatbot in quiz mode
     */
    setQuizMode(quizController) {
        loadFile(Config.quizNavViewPath).then((nav) => {
            this.chatbotNav.innerHTML = nav
            document.getElementById('chat-exit').onclick = () => this.exitQuizCallback(quizController)
        })
    }

    /**
     * Unset the quiz mode
     */
    unsetQuizMode() {
        this.chatbotNav.replaceChildren(this.standardNav)
        this.sendButton.onclick = () => this.sendCallback()
    }

    /**
     * Callback used on the button to send a message
     */
    sendCallback() {
        if (this.inputField.value === '') {
            return
        }

        var input = this.inputField.value
        this.insertMessage(input, 'client')
        this.inputField.value = ''

        // Let the bot answer
        this.controller.botAnswer(input)
    }

    /**
     * Callback used to send a message with enter key
     * @param {event} event
     */
    sendOnKeyPressCallback(event) {
        if (event.keyCode === 13) {
            event.preventDefault()
            this.sendCallback()
        }
    }

    /**
     * Callback used on button where the chatbot shows its standard functionalities
     * @param {event} event
     */
    functionButtonCallback(event) {
        if (!event.target.classList.contains('chatbot-btn-function')) {
            return
        }

        var message = event.target.dataset.message
        this.insertMessage(message, 'client')
        this.controller.botAnswer(message)
    }

    /**
     * Callback use to exit the quiz mode
     * @param {QuizController} quizController
     */
    exitQuizCallback(quizController) {
        quizController.exit()
    }

    /**
     * Insert the chatbot in the doctolib page
     * @param {string} chatbot - html chatbot code
     */
    insertChatbot(chatbot) {
        var block = createBlock(chatbot)
        document.body.appendChild(block)
    }

    /**
     * Make the popul invisible
     */
    disablePopup() {
        this.popup.style.display = 'none'
    }
}

export { View }
