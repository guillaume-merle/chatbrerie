import { loadFile } from '../models/load.js';
import * as tf from '@tensorflow/tfjs';

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

export prepareInput
