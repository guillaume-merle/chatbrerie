import { indexOfMax } from '../utils/utils'
import * as tf from '@tensorflow/tfjs';

class Model {
    constructor() {
        this.modelPath = 'src/data/js-model/model.json'
        this.model = this.#getModel(this.modelPath)
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
