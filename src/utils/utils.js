import { v4 as uuidv4 } from 'uuid'

async function loadFile(path) {
    const url = chrome.runtime.getURL(path)
    return await fetch(url).then(response => response.text())
}

function randomInt(max) {
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

function generateId() {
    return uuidv4()
}

function createBlock(html) {
    var el = document.createElement('div')
    el.classList.add('chatbot-block')
    el.innerHTML = html
    return el
}

export { loadFile, randomInt, indexOfMax, generateId, createBlock }
