import { loadFile } from '../utils/utils.js'
import { Config } from '../config'

class Lemmatizer {
    constructor() {
        this.wordList = null
    }

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

    async prepareInput(input) {
        if (!this.wordList) {
            this.wordList = (await loadFile(Config.wordListPath)).split('\n')
        }

        var lemmatizeList = await this.lemmatizeInput(input);
        var preparedInput = new Array(this.wordList.length).fill(0);

        var stringSimilarity = require("string-similarity");

        for (var i = 0; i < lemmatizeList.length; i++) {
            var matches = stringSimilarity.findBestMatch(lemmatizeList[i].normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""), this.wordList)
            if (matches.bestMatch.rating > 0.80) {
                preparedInput[matches.bestMatchIndex] = 1;
            }
        }

        return preparedInput;
    }
}

export { Lemmatizer }
