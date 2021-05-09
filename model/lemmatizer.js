var NlpjsTFr = require('nlp-js-tools-french');

const fs = require('fs');

var config = {
    tagTypes: ["adj", "adv", "art", "con", "nom", "ono", "pre", "ver", "pro"],
    strictness: false,
    minimumLength: 3,
    debug: false
};

test = "Bonjour, comment allez-vous ?";


// TODO: If there is multiple same ids, we only take the first one
var nlpToolsFr = new NlpjsTFr(test, config);
var output_list = [];
var dict = Array.from(nlpToolsFr.lemmatizer())
console.log(Array.from(nlpToolsFr.lemmatizer()))

for (var i = 0, len = dict.length; i < len; i++){
       output_list.push(dict[i].lemma)
    }
console.log(output_list)
