import { indexOfMax } from '../utils/utils'
import * as tf from '@tensorflow/tfjs';
import { Config } from '../config'

class Model {
    constructor() {
        this.model = this.#getModel(Config.modelPath)
    }

    async predict(preparedInput) {
        return indexOfMax(
            Array.from(
                (await this.model).predict(tf.tensor([preparedInput])).dataSync()
            )
        )
    }

    async #getModel(path) {
        const modelUrl = chrome.runtime.getURL(path);
        return await tf.loadLayersModel(modelUrl)
    }
}

export { Model }
