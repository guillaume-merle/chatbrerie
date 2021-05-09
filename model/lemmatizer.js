function lemmatizeInput(input) {
  var NlpjsTFr = require('nlp-js-tools-french');

  var config = {
    tagTypes: ["adj", "adv", "art", "con", "nom", "ono", "pre", "ver", "pro"],
    strictness: false,
    minimumLength: 3,
    debug: false
  };

  var nlpToolsFr = new NlpjsTFr(input, config);
  var outputList = [];

  var dict = Array.from(nlpToolsFr.lemmatizer())

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

var input = "Bonjour, ceci est un des tests. Au revoir";
lemmatizeList = lemmatizeInput(input);

const fs = require('fs');

var wordList = fs.readFileSync('data/word-lists.txt').toString().split('\n');
console.log(wordList);
