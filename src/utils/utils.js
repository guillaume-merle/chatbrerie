import { v4 as uuidv4 } from 'uuid'

/**
 * Load a file through the chrome extension
 * @param {string} path - path to a file
 * @returns the load file
 */
async function loadFile(path) {
    const url = chrome.runtime.getURL(path)
    return await fetch(url).then(response => response.text())
}

/**
 * Return a random number between 0 and max
 * @param {int} max - the maximum output value
 * @returns a random number between 0 and max
 */
function randomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Return the index of the maximum value in an array
 * @param {array} arr
 * @returns the maxIndex where there is the maximum value of the array
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

/**
 * Generate a random unique id
 * @returns a random unique id
 */
function generateId() {
    return uuidv4()
}

/**
 * Create a htlm block
 * @param {string} html - html code
 * @returns the div with the html code
 */
function createBlock(html) {
    var el = document.createElement('div')
    el.innerHTML = html
    return el
}

/**
 * Stop the execution during ms milli seconds
 * @param {int} ms - milli seconds
 * @returns a promise (set the timeout)
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export { loadFile, randomInt, indexOfMax, generateId, createBlock, sleep }
