import { loadFile } from '../utils/utils.js'
import { Config } from '../config'

class Response {
    constructor() {
        loadFile(Config.answersPath).then((answers) => {
            this.data = JSON.parse(answers)
        });
    }

    getResponse(prediction) {
        return this.data[prediction]
    }
}

export { Response }
