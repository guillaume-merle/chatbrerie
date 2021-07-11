import { Config } from '../config.js'
import { Lemmatizer } from './lemmatizer.js'
import { QuizController } from './quiz-controller.js'
import { DrugsFormController } from './drugs-form-controller.js'
import { Response } from '../models/response.js'
import { Model } from '../models/model.js'
import { View } from '../views/view.js'
import { randomInt, loadFile } from '../utils/utils.js'

/** Class representing the main chatbot controller. Get the user input and respond through the model prediction */
class Controller {
    /**
     * Load the json file and init the lemmatizer, the model, the response class and the view
     */
    constructor() {
        loadFile(Config.functionsPath).then((functionsJson) => {
            this.functions = JSON.parse(functionsJson)
        })

        this.lemmatizer = new Lemmatizer()
        this.model = new Model()
        this.response = new Response()
        this.view = new View(this)
        this.view.init()
    }

    /**
     * Insert the first bot message when the page load. Say hello and show some functionalities
     */
    start() {
        this.botAnswer('Bonjour').then(() => {
            this.view.insertMessage('Voici quelques idées de choses que vous pouvez me demander et de sujets sur lesquels je peux vous éclairer :', 'bot')
            this.view.insertFunctions(this.functions.recommandations)
        })
    }

    /**
     * Get the user input and give an answer to him. Also add gif if needed or launch the quizz/form controller
     * @param {string} input - the user entry
     */
    async botAnswer(input) {
        var preparedInput = await this.lemmatizer.prepareInput(input)
        var prediction = await this.model.predict(preparedInput)

        var responseBlock = this.response.getResponse(prediction)

        var responses = responseBlock['responses']
        var message = responses[randomInt(responses.length)]

        if (message) {
            this.view.insertMessage(message, 'bot')
        }

        var tag = responseBlock['tag']
        if (tag === 'goodbye') {
            this.view.insertImage(Config.imageGoodbye)
        } else if (tag.localeCompare('unknown') == 0) {
            this.view.insertImage(Config.imageDontknow)
        } else if (tag.localeCompare('event') == 0) {
            new DrugsFormController(this.view)
        } else if (/quiz-.*$/.test(tag)) {
            new QuizController(this.view, tag)
        } else if (tag === 'functions-list') {
            this.view.insertFunctions(this.functions.all)
        }
    }
}

export { Controller }
