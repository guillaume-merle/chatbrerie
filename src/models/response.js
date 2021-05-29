import { loadFile, randomInt } from '../utils/utils.js'

class Response {
    constructor() {
        this.data = JSON.parse(loadFile('src/data/simple.json').toString());
    }

    getResponse(prediction) {
        console.log(prediction)
        console.log(this.data['intents'])
        var response = this.data['intents'][prediction]['responses'];
        return response[randomInt(response.length)];
    }
}

export { Response }
