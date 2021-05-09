var NlpjsTFr = require('nlp-js-tools-french');

const fs = require('fs');

var config = {
    tagTypes: ["adj", "adv", "art", "con", "nom", "ono", "pre", "ver", "pro"],
    strictness: false,
    minimumLength: 3,
    debug: false
};

test = "Bonjour, des comment allez-vous ?";

var nlpToolsFr = new NlpjsTFr(test, config);
var output_list = [];

var dict = Array.from(nlpToolsFr.lemmatizer())

// Fill the output_list with the first occurence of each lemmatize word
var last_id = -1;
for (var i = 0, len = dict.length; i < len; i++){
        if (last_id == dict[i].id)
            continue;

        output_list.push(dict[i].lemma);
        last_id = dict[i].id
    }

console.log(output_list)
