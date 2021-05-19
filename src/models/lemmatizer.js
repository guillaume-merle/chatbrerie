import {loadWordBag} from '../models/load.js';

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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/*var input = "Au revoir";
lemmatizeList = lemmatizeInput(input);

// const fs = require('fs');

// get all the words in the file with all the word we used for the learning into an array
var wordList = loadWordBag("src/data/word-lists.txt") // fs.readFileSync('data/word-lists.txt').toString().split('\n');

// create an array full of 0 for the prediction
var predictInput = new Array(wordList.length).fill(0);

// If a word in the input string is similar to one in the word list, we put a 1 at the position of this word to do the
// prediction

// TODO: levenstein distance
for (var i = 0; i < lemmatizeList.length; i++) {
  for (var j = 0; j < wordList.length; j++) {
    if (lemmatizeList[i].localeCompare(wordList[j]) == 0) {
      predictInput[j] = 1;
    }
  }
}

// parse the json file
var jsonFile = JSON.parse(fs.readFileSync('data/simple.json').toString());
*/
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
const tf = require('@tensorflow/tfjs');
// require('@tensorflow/tfjs-node');

async function callModel(input) {
  var lemmatizeList = lemmatizeInput(input);
  var wordList = loadWordBag("src/data/word-lists.txt").split('\n')

  // create an array full of 0 for the prediction
  var predictInput = new Array(wordList.length).fill(0);

  // If a word in the input string is similar to one in the word list, we put a 1 at the position of this word to do the
  // prediction

  // TODO: levenstein distance
  for (var i = 0; i < lemmatizeList.length; i++) {
    for (var j = 0; j < wordList.length; j++) {
      if (lemmatizeList[i].localeCompare(wordList[j]) == 0) {
        predictInput[j] = 1;
      }
    }
  }

  // parse the json file
  console.log(predictInput);
  var jsonFile = JSON.parse(loadWordBag('src/data/simple.json').toString());

  console.log(input);
  const url_model = chrome.runtime.getURL('src/data/js-model/model.json');
  const model = await tf.loadLayersModel(url_model);

  var prediction = indexOfMax(Array.from(model.predict(tf.tensor([predictInput])).dataSync()))

  var numberOfResponse = jsonFile['intents'][prediction]['responses'].length;
  console.log(jsonFile['intents'][prediction]['responses'][getRandomInt(numberOfResponse)]);
  return jsonFile['intents'][prediction]['responses'][getRandomInt(numberOfResponse)];
}

export { callModel };