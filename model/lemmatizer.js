var NlpjsTFr = require('nlp-js-tools-french');

const fs = require('fs');

var config = {
    tagTypes: ["adj", "adv", "art", "con", "nom", "ono", "pre", "ver", "pro"],
    strictness: false,
    minimumLength: 3,
    debug: false
};

test = "Bonjour, comment allez-vous ?";

// TODO: Convert the output in a list of word
// If there is multiple same ids, we only take the first one
var nlpToolsFr = new NlpjsTFr(test, config);
console.log(Array.from(nlpToolsFr.lemmatizer()))
