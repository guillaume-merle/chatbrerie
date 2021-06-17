import { Config } from '../config.js'
import { Lemmatizer } from './lemmatizer.js'
import { QuizController } from './quiz-controller.js'
import { Response } from '../models/response.js'
import { Model } from '../models/model.js'
import { View } from '../views/view.js'
import { randomInt, loadFile } from '../utils/utils.js'

import { GoogleCalendar } from 'datebook'

class Controller {
    constructor(){
        this.lemmatizer = new Lemmatizer()
        this.model = new Model()
        this.response = new Response()
        this.view = new View(this)
        this.view.init()
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
            // User input

            // Create config
            this.view.insertMessage("Voici votre rappel de<a href=\"" + this.createDrugEvent() +
                "\" target=\"_blank\"> prise de médicaments</a>", 'bot')
        } else if (tag.localeCompare('quiz') == 0) {
            new QuizController(this.view)
        }
    }

    createDrugEvent() {
        const config = {
            title: 'Happy Hour', // Drug name
            location: '',
            description: '',
            start: new Date('2022-07-08T19:00:00'),
            end: new Date('2022-07-08T23:30:00'),
            // an event that recurs every two weeks:
            recurrence: {
                frequency: 'WEEKLY',
                interval: 2
            }
        }

        const googleCalendar = new GoogleCalendar(config)
        return googleCalendar.render()
    }
}

export { Controller }
