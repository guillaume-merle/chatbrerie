import { generateId } from '../utils/utils.js'

import { GoogleCalendar, OutlookCalendar, YahooCalendar, ICalendar } from 'datebook'

class DrugsFormController {
    constructor(view) {
        this.view = view
        this.id = generateId()

        this.view.insertForm(this.id).then(() => this.#setCallback())
    }

    callback(event) {
        const config = this.#createCalendarConfig()
        const calendarType = document.getElementById("calendar-" + this.id).value

        this.view.insertMessage(this.#createEventMessage(config, calendarType), 'bot')

        this.#unsetCallback()
    }

    #setCallback() {
        document.getElementById(this.id).onclick = (event) => this.callback(event)
    }

    #unsetCallback() {
        document.getElementById(this.id).onclick = null
    }

    #createCalendarConfig() {
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

        return config
    }

    #createEventMessage(config, calendarType) {
        var message = "Voici votre rappel de"

        if (calendarType.localeCompare('google') == 0) {
            const googleCalendar = new GoogleCalendar(config)
            message += "<a href=\"" + googleCalendar.render() + "\""
        } else if (calendarType.localeCompare('outlook') == 0){
            const outlookCalendar = new OutlookCalendar(config)
            message += "<a href=\"" + outlookCalendar.render() + "\""
        } else if (calendarType.localeCompare('yahoo') == 0){
            const yahooCalendar = new YahooCalendar(config)
            message += "<a href=\"" + yahooCalendar.render() + "\""
        } else {
            const iCalendar = new ICalendar(config)
            const calendarFile = new File([iCalendar.render()], { type: 'text/plain' })

            // return link to the file blob
            message += "<a href=\"" + window.URL.createObjectURL(calendarFile) + "\" download=\"" + config.title
                        + ".ics\""
        }

        message += " target=\"_blank\"> prise de médicaments</a>"
        return message
    }
}

export { DrugsFormController }
