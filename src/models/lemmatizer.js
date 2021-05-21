import { loadFile } from '../models/load.js';
import * as tf from '@tensorflow/tfjs';

const modelPath = 'src/data/js-model/model.json';
const jsonFile = JSON.parse(loadFile('src/data/simple.json').toString());
const wordListPath = 'src/data/word-lists.txt'

async function lemmatizeInput(input) {
    var config = {
        tagTypes: ['adj', 'adv', 'art', 'con', 'nom', 'ono', 'pre', 'ver', 'pro'],
        strictness: false,
        minimumLength: 3,
        debug: false
    };

    const { default: nlpfr } = await import('nlp-js-tools-french')

    var nlpToolsFr = new nlpfr(input, config);
    var dict = Array.from(nlpToolsFr.lemmatizer())

    var outputList = [];
    // Fill the output_list with the first occurence of each lemmatize word
    var lastId = -1;
    for (var i = 0, len = dict.length; i < len; i++) {
        if (lastId == dict[i].id)
            continue;

        outputList.push(dict[i].lemma);
        lastId = dict[i].id
    }

    return outputList;
}

async function getModel(path) {
    const modelUrl = chrome.runtime.getURL(path);
    return await tf.loadLayersModel(modelUrl)
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
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

async function prepareInput(input) {
    var lemmatizeList = await lemmatizeInput(input)
    var wordList = loadFile(wordListPath).split('\n')

    var preparedInput = new Array(wordList.length).fill(0);

    // If a word in the input string is similar to one in the word list, we put a 1 at the position of this word to do the
    // prediction

    // TODO: levenstein distance
    for (var i = 0; i < lemmatizeList.length; i++) {
        for (var j = 0; j < wordList.length; j++) {
            if (lemmatizeList[i].localeCompare(wordList[j]) == 0) {
                preparedInput[j] = 1;
            }
        }
    }

    return preparedInput
}

// load the model when it's first used
var model = null

async function predict(input) {
    if (model == null) {
        model = await getModel(modelPath)
    }

    var preparedInput = await prepareInput(input)
    var prediction = indexOfMax(Array.from(model.predict(tf.tensor([preparedInput])).dataSync()))

    var response = jsonFile['intents'][prediction]['responses'];
    return response[getRandomInt(response.length)];
}

export { predict };
