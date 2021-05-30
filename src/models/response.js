import { loadFile } from '../utils/utils.js'
import { Config } from '../config'

class Response {
    constructor() {
        this.data = JSON.parse(loadFile(Config.answersPath).toString())
    }

    getResponse(prediction) {
        return this.data[prediction]
    }
}

export { Response }
