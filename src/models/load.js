function loadFile(path) {
    const url = chrome.runtime.getURL(path);
    var allText;
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, false);
    xhr.onreadystatechange = function ()
    {
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

export { loadFile };
