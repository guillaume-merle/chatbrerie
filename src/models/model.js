import { indexOfMax } from '../utils/utils'
import * as tf from '@tensorflow/tfjs';
import { Config } from '../config.js'

/** class with all the model functionality (load the model and make prediction with it) */
class Model {
    /**
     * Load the model from tensorflowjs file
     */
    constructor() {
        this.model = this.#getModel(Config.modelPath)
    }

    /**
     * Predict a response with the user input
     * @param {array of int} preparedInput - array of 0 and 1 (1 if a word is present in the user input)
     * @returns int - The index of the best prediction
     */
    async predict(preparedInput) {
        return indexOfMax(
            Array.from(
                (await this.model).predict(tf.tensor([preparedInput])).dataSync()
            )
        )
    }

    /**
     * Load the tensorflowjs model
     * @param {string} path - path to the tensorflowjs model file
     * @returns the model
     */
    async #getModel(path) {
        const modelUrl = chrome.runtime.getURL(path);
        return await tf.loadLayersModel(modelUrl)
    }
}

export { Model }
