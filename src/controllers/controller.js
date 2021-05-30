import { Lemmatizer } from './lemmatizer.js'
import { Response } from '../models/response.js'
import { Model } from '../models/model.js'
import { View } from '../views/view.js'
import { randomInt } from '../utils/utils.js'

class Controller {
    constructor(){
        this.model = new Model()
        this.response = new Response()
        this.lemmatizer = new Lemmatizer()
        this.view = new View(this)
        this.view.init()
    }

    async botAnswer(input) {
        var preparedInput = await this.lemmatizer.prepareInput(input)
        var prediction = await this.model.predict(preparedInput)

        var responses = this.response.getResponse(prediction)["responses"]
        return responses[randomInt(responses.length)]
    }
}

export { Controller }
