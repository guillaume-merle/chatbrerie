import { loadFile, generateId, sleep } from '../utils/utils.js'
import { Config } from '../config'

/** Class making a quiz engine to show many quiz for the user */
class QuizController {
    /**
     * Insert the right quiz (thanks to the quizTag) in the current view
     * @param {View} view - the current chatbot view
     * @param {string} quizTag - use to find the right json file corresponding to this quiz
     */
    constructor(view, quizTag) {
        this.view = view
        this.quizPath = [Config.quizBasePath, quizTag + '.json'].join('/')
        this.score = 0
        this.stop = false

        loadFile(this.quizPath).then((quizJson) => {
            this.quiz = JSON.parse(quizJson)
            this.#generateResponseIds()

            this.questionIt = this.quiz[Symbol.iterator]()
            this.currentQuestion = this.questionIt.next().value

            this.view.setQuizMode(this)

            this.view.insertQuizQuestion(this.currentQuestion).then(() => this.#setCallbacks())
        })
    }

    /**
     * Callback called when the user press one of the proposition of answer, check if the answer is valid, load the
     * next question or end the quiz and compute the score
     * @param {event} event
     */
    async callback(event) {
        // unset callbacks to not let the user clicks on the buttons again
        this.#unsetCallbacks()

        var validResponse = this.currentQuestion.responses[this.currentQuestion.valid]
        var message = null

        // check if the answer is valid
        if (event.target.id == validResponse.id) {
            event.target.style.backgroundColor = Config.colorValid
            message = 'Bien joué ! '
            this.score += 1
        } else {
            event.target.style.backgroundColor = Config.colorWrong
            document.getElementById(validResponse.id).style.backgroundColor = Config.colorValid
            message = 'Dommage ! '
        }

        await sleep(1000)
        this.view.insertMessage(message + this.currentQuestion.explanation, 'bot')
        if (this.stop){
            return
        }

        await sleep(3000)
        if (this.stop)
        {
            return
        }

        // go to the next question if there is one, or end the quiz and compute score
        this.currentQuestion = this.questionIt.next().value
        if (this.currentQuestion) {
            this.view.insertQuizQuestion(this.currentQuestion).then(() => this.#setCallbacks())
        } else {
            var finalScore = Math.round(this.score / this.quiz.length * 100)
            this.view.insertMessage('Le quiz est terminé, votre score est de ' + finalScore
                + '%.\nMerci de votre participation !', 'bot')
            this.view.unsetQuizMode()
        }
    }

    /**
     * Exit the quiz and unset callbacks
     */
    exit() {
        this.stop = true
        this.#unsetCallbacks()
        this.view.unsetQuizMode()
    }

    /**
     * Generate a response unique id for a button
     */
    #generateResponseIds() {
        for (const question of this.quiz) {
            for (const response of question.responses) {
                response.id = 'chatbot-quiz-' + generateId()
            }
        }
    }

    /**
     * Set callbacks for all the proposition buttons
     */
    #setCallbacks() {
        for (const response of this.currentQuestion.responses) {
            document.getElementById(response.id).onclick = (event) => this.callback(event) // allows to retain instance context
        }
    }

    /**
     * Unset callbacks of all buttons
     */
    #unsetCallbacks() {
        for (const response of this.currentQuestion.responses) {
            document.getElementById(response.id).onclick = null
        }
    }
}

export { QuizController }
