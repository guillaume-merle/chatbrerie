import { loadFile, generateId } from '../utils/utils.js'
import { Config } from '../config'

import { GoogleCalendar } from 'datebook'

class DrugsFormController {
    constructor(view) {
        this.view = view
        this.id = generateId()

        this.view.insertForm(this.id).then(() => this.#setCallback())
    }

    callback(event) {
        this.view.insertMessage("Voici votre rappel de<a href=\"" + this.#createDrugEvent() +
            "\" target=\"_blank\"> prise de médicaments</a>", 'bot')
    }

    #setCallback() {
        document.getElementById(this.id).onclick = (event) => this.callback(event)
    }

    #createDrugEvent() {
        const start_date = new Date(document.getElementById("start_date-" + this.id).value + 'T'
            + document.getElementById("time-" + this.id).value)

        const config = {
            title: document.getElementById("title-" + this.id).value,
            location: '',
            description: '',
            start: start_date,
            end: new Date(start_date.getTime() + 30 * 60000),
            // an event that recurs every two weeks:
            recurrence: {
                frequency: document.getElementById("reccurrence-" + this.id).value,
                interval: document.getElementById("rec_number-" + this.id).value,
                end: new Date(document.getElementById("end_date-" + this.id).value)
            }
        }

        const googleCalendar = new GoogleCalendar(config)
        return googleCalendar.render()
    }
}

export { DrugsFormController }
