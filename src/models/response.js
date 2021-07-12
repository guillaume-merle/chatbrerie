import { loadFile } from '../utils/utils.js'
import { Config } from '../config'

/** this class is used to get a response with a prediction */
class Response {
    /**
     * load the json file with all the tags and the answers associated
     */
    constructor() {
        loadFile(Config.answersPath).then((answers) => {
            this.data = JSON.parse(answers)
        });
    }

    /**
     * Get the predicted tag with the prediction index
     * @param {int} prediction - prediction index
     * @returns the tag predict
     */
    getResponse(prediction) {
        return this.data[prediction]
    }
}

export { Response }
