import Lemmatizer from './lemmatizer.js'
import Response from '../models/response.js'
import Model from '../models/model.js'
import View from '../views/view.js'

class Controller {
    constructor(){
        this.model = new Model()
        this.response = new Response()
        this.lemmatizer = new Lemmatizer()
        this.view = new View(this)
    }

    async botAnswer(input) {
        var preparedInput = await this.lemmatizer.prepareInput(input)
        var prediction = this.model.predict(preparedInput)

        return this.response.getResponse(prediction)
    }
}

export { Controller }
