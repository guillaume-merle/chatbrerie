import { loadFile } from '../utils/utils.js'
import { Config } from '../config'

/** Class used to prepare the input for the prediction */
class Lemmatizer {
    /**
     * Create an empty list wordList
     */
    constructor() {
        this.wordList = null
    }

    /**
     * Get the user input and create the outputList with all the lemmatized words
     * @param {string} input - user input
     * @returns {array of strings} outputList - All the lemmatized words
     */
    async lemmatizeInput(input) {
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

    /**
     * Get the user input and create the preparedInput array (array of 0 and 1, 1 if there is the word at this
     * index from data/outputs/word-lists.txt in the input and 0 if there is not). We use the dice computation to check
     * if a word is known (due to the little difference between the python lemmatizer and the js lemmatizer and help
     * to understand user input even if there is some typos).
     * This preparedInput is then used to make a prediction
     * @param {string} input - user input
     * @returns {array of int} preparedInput - Array of 0 and 1 (1 if word is present)
     */
    async prepareInput(input) {
        if (!this.wordList) {
            this.wordList = (await loadFile(Config.wordListPath)).split('\n')
        }

        var lemmatizeList = await this.lemmatizeInput(input);
        var preparedInput = new Array(this.wordList.length).fill(0);

        var stringSimilarity = require("string-similarity");

        for (var i = 0; i < lemmatizeList.length; i++) {
            // remove accent and find the best match
            var matches = stringSimilarity.findBestMatch(lemmatizeList[i].normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""), this.wordList)
            if (matches.bestMatch.rating > 0.80) {
                // Add the word if it matches the word well
                preparedInput[matches.bestMatchIndex] = 1;
            }
        }

        return preparedInput;
    }
}

export { Lemmatizer }
