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
    return Math.random().toString(36).slice(2)
}

export { loadFile, randomInt, indexOfMax, generateId }
