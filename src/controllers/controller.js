import { Config } from '../config.js'
import { Lemmatizer } from './lemmatizer.js'
import { QuizController } from './quiz-controller.js'
import { Response } from '../models/response.js'
import { Model } from '../models/model.js'
import { View } from '../views/view.js'
import { randomInt, loadFile } from '../utils/utils.js'

class Controller {
    constructor(){
        this.lemmatizer = new Lemmatizer()
        this.model = new Model()
        this.response = new Response()
        this.view = new View(this)
        this.view.init()
    }

    async botAnswer(input) {
        if (input.localeCompare("!quiz") == 0) {
            new QuizController(this.view)
            return
        }

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
        }
        else if (tag.localeCompare('unknown') == 0) {
            this.view.insertImage(Config.imageDontknow)
        }
        else if (tag.localeCompare('quiz') == 0) {
            new QuizController(this.view)
        }
    }
}

export { Controller }
