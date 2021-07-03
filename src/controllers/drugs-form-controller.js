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
        const form = document.getElementById("drug-form-" + this.id)
        console.log(form.childNodes)

        this.view.insertMessage("Voici votre rappel de<a href=\"" + this.#createDrugEvent() +
            "\" target=\"_blank\"> prise de médicaments</a>", 'bot')
    }


    /*handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const value = Object.fromEntries(data.entries());
        // Create config
        console.log({ value });
    }*/

    #setCallback() {
        document.getElementById(this.id).onclick = (event) => this.callback(event)
    }

    #createDrugEvent(form) {
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

export { DrugsFormController }
