import { loadFile, randomInt } from '../utils/utils.js'

class Response {
    constructor() {
        this.data = JSON.parse(loadFile('src/data/simple.json').toString());
    }

    getResponse(prediction) {
        var response = jsonFile['intents'][prediction]['responses'];
        return response[randomInt(response.length)];
    }
}

export { Response }
