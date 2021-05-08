import * as tf from '@tensorflow/tfjs-node';

const model = await tf.loadLayersModel('file://../data/js-model/model.json');

var input = "Bonjour";
// TODO: Apply lemmatizer to input

// TODO: We need to create this array with the word list (in data/) and using levenstein distance to match the
// different words
const input = tf.tensor([[0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]]);

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

var prediction = indexOfMax(Array.from(model.predict(input).dataSync()))
console.log(prediction)

// TODO: Get one random response for this category (prediction index in the json file) and return it
