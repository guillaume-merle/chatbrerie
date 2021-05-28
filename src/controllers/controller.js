import prepareInput from 'lemmatizer.js'
import Response from '../models/response.js'
import Model from '../models/model.js'
import View from '../views/view.js'

class Controller {
    constructor(){
        this.view = new View()
        this.model = new Model()
        this.response = new Response()
    }

    async botAnswer(input) {
        var preparedInput = await prepareInput(input)
        var prediction = this.model.predict(input)

        return this.response.getResponse(prediction)
    }
}
