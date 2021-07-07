import { loadFile, generateId, sleep } from '../utils/utils.js'
import { Config } from '../config'
import * as path from 'path'


class QuizController {
    constructor(view, quizTag) {
        this.view = view
        this.quizPath = path.join(Config.quizBasePath, quizTag + '.json')
        this.score = 0

        loadFile(Config.quizBasePath).then((quizJson) => {
            this.quiz = JSON.parse(quizJson)
            this.#generateResponseIds()

            this.questionIt = this.quiz[Symbol.iterator]()
            this.currentQuestion = this.questionIt.next().value

            this.view.setQuizMode(this)

            this.view.insertQuizQuestion(this.currentQuestion).then(() => this.#setCallbacks())
        })
    }

    async callback(event) {
        // unset callbacks to not let the user clicks on the buttons again
        this.#unsetCallbacks()

        var validResponse = this.currentQuestion.responses[this.currentQuestion.valid]

        var message = null

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

        this.currentQuestion = this.questionIt.next().value

        await sleep(3000)

        if (this.currentQuestion) {
            this.view.insertQuizQuestion(this.currentQuestion).then(() => this.#setCallbacks())
        } else {
            var finalScore = Math.round(this.score / this.quiz.length * 100)
            this.view.insertMessage('Le quiz est terminé, votre score est de ' + finalScore + '%.\nMerci de votre participation !', 'bot')
            this.view.unsetQuizMode()
        }
    }

    exit() {
        this.#unsetCallbacks()
        this.view.unsetQuizMode()
    }

    #generateResponseIds() {
        for (const question of this.quiz) {
            for (const response of question.responses) {
                response.id = 'chatbot-quiz-' + generateId()
            }
        }
    }

    #setCallbacks() {
        for (const response of this.currentQuestion.responses) {
            document.getElementById(response.id).onclick = (event) => this.callback(event) // allows to retain instance context
        }
    }

    #unsetCallbacks() {
        for (const response of this.currentQuestion.responses) {
            document.getElementById(response.id).onclick = null
        }
    }
}

export { QuizController }
