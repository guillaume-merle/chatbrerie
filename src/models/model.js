import * as tf from '@tensorflow/tfjs';

const modelPath = 'src/data/js-model/model.json';

class Model {
    constructor() {
        this.model = getModel(modelPath)
    }

    predict(preparedInput) {
        return indexOfMax(
            Array.from(
                model.predict(tf.tensor([preparedInput]))
                .dataSync()
            )
        )
    }
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

async function getModel(path) {
    const modelUrl = chrome.runtime.getURL(path);
    return await tf.loadLayersModel(modelUrl)
}
