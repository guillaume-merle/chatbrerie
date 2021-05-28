import { loadFile } from '../models/load.js'

class Response {
    constructor() {
        this.data = JSON.parse(loadFile('src/data/simple.json').toString());
    }

    getResponse(prediction) {
        var response = jsonFile['intents'][prediction]['responses'];
        return response[getRandomInt(response.length)];
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
