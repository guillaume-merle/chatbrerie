import { loadFile, generateId } from '../utils/utils.js'
import { Config } from '../config'

class QuizController {
    constructor(view) {
        this.view = view

        loadFile(Config.quizPath).then((quizJson) => {
            this.quiz = JSON.parse(quizJson)
            this.#generateResponseIds()

            this.questionIt = this.quiz[Symbol.iterator]()
            this.currentQuestion = this.questionIt.next().value

            this.view.insertQuizQuestion(this.currentQuestion).then(() => this.#setCallbacks())
        })
    }

    callback(event) {
        var validResponse = this.currentQuestion.responses[this.currentQuestion.valid]

        var message = null

        if (event.target.id == validResponse.id) {
            event.target.style.backgroundColor = Config.colorValid
            message = 'Bien joué ! '
        } else {
            event.target.style.backgroundColor = Config.colorWrong
            document.getElementById(validResponse.id).style.backgroundColor = Config.colorValid
            message = 'Dommage ! '
        }

        this.view.insertMessage(message + this.currentQuestion.explanation, 'bot')

        this.#unsetCallbacks()
        this.currentQuestion = this.questionIt.next().value

        if (this.currentQuestion) {
            this.view.insertQuizQuestion(this.currentQuestion).then(() => this.#setCallbacks())
        } else {
            this.view.insertMessage('Le quiz est terminé, merci de votre participation !', 'bot')
        }
    }

    #generateResponseIds() {
        for (const question of this.quiz) {
            for (const response of question.responses) {
                response.id = 'chatbot-quiz-' + generateId()
            }
        }
    }

    #setCallbacks() {
        console.log(this)
        // bind to retain context in callback
        this.callback = this.callback.bind(this)

        for (const response of this.currentQuestion.responses) {
            document.getElementById(response.id).onclick = this.callback
        }
    }

    #unsetCallbacks() {
        for (const response of this.currentQuestion.responses) {
            document.getElementById(response.id).onclick = null
        }
    }
}

export { QuizController }
