// console.log('test')

function loadWordBag(path) {
    const url = chrome.runtime.getURL(path);
    var allText;
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, false);
    xhr.onreadystatechange = function ()
    {
        // alert("I am here");
        if(xhr.readyState === 4)
        {
            if(xhr.status === 200 || xhr.status == 0)
            {
                allText = xhr.responseText;
            }
        }
    }
    xhr.send(null);
    return allText;
}

export { loadWordBag };

// loadWordBag("word-lists.txt");