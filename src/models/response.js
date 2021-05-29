import { loadFile, randomInt } from '../utils/utils.js'
import { Config } from '../config'

class Response {
    constructor() {
        this.data = JSON.parse(loadFile(Config.answersPath).toString());
    }

    getResponse(prediction) {
        var response = this.data['intents'][prediction]['responses'];
        return response[randomInt(response.length)];
    }
}

export { Response }
