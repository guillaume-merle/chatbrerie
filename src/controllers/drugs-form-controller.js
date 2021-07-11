import { generateId } from '../utils/utils.js'

import { GoogleCalendar, OutlookCalendar, YahooCalendar, ICalendar } from 'datebook'

/** Class for creating Drugs Form */
class DrugsFormController {
    /**
     * Insert form to the current view
     * @param {View} view - the current chatbot view
     */
    constructor(view) {
        this.view = view
        this.id = generateId()

        this.view.insertForm(this.id).then(() => this.#setCallback())
    }

    /**
     * Callback called when the user press the validation button. Create the event and send it to the user
     * @param {event} event
     */
    callback(event) {
        const config = this.#createCalendarConfig()
        const calendarType = document.getElementById("calendar-" + this.id).value

        this.view.insertMessage(this.#createEventMessage(config, calendarType), 'bot')

        this.#unsetCallback()
    }

    /**
     * Set the callback on the validation button
     */
    #setCallback() {
        document.getElementById(this.id).onclick = (event) => this.callback(event)
    }

    /**
     * Remove the callback from the validation button after the user use it to prevent modification
     */
    #unsetCallback() {
        document.getElementById(this.id).onclick = null
    }

    /**
     * Create the datebook configuration for the calendar event
     * @returns config - the configuration of the calendar event
     */
    #createCalendarConfig() {
        const start_date = new Date(document.getElementById("start_date-" + this.id).value + 'T'
            + document.getElementById("time-" + this.id).value)

        const config = {
            title: document.getElementById("title-" + this.id).value,
            location: '',
            description: "N'oubliez pas votre prescription !",
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

    /**
     * Create the calendar event message with the link in it for the client
     * @param {dict} config - the datebook config
     * @param {string} calendarType - the calendar app (google, apple, outlook, ...)
     * @returns message - string with the message for the client
     */
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
