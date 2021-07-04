import { Config } from '../config.js'
import { Lemmatizer } from './lemmatizer.js'
import { QuizController } from './quiz-controller.js'
import { DrugsFormController } from './drugs-form-controller.js'
import { Response } from '../models/response.js'
import { Model } from '../models/model.js'
import { View } from '../views/view.js'
import { randomInt, loadFile } from '../utils/utils.js'

class Controller {
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

    start() {
        this.botAnswer('Bonjour').then(() => {
            this.view.insertFunctions(this.functions.recommandations,
            'Voici quelques idées de choses que vous pouvez me demander et de sujets sur lesquels je peux vous éclairer :')
        })
    }

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
        if (tag.localeCompare('goodbye') == 0) {
            this.view.insertImage(Config.imageGoodbye)
        } else if (tag.localeCompare('unknown') == 0) {
            this.view.insertImage(Config.imageDontknow)
        } else if (tag.localeCompare('event') == 0) {
            new DrugsFormController(this.view)
        } else if (tag.localeCompare('quiz') == 0) {
            new QuizController(this.view)
        }
    }
}

export { Controller }
