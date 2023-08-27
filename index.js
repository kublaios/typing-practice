window.displayText = document.querySelector('#display-text').textContent;

function sanitizeText(text) {
    return text
        .replace(/\n/g, ' ') // Replace new lines with spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .replace(/“|„|”/g, '"'); // Replace special quotes with normal quotes
}

function setDisplayText(text) {
    let sanitizedText = sanitizeText(text);
    document.querySelector('#display-text').innerHTML = sanitizedText;
    window.displayText = sanitizedText;
    document.querySelector('#input-text').value = '';
    document.querySelector("#input-text").focus();
}

document.querySelector('#input-text').addEventListener('input', function() {
    // If the displayed text is not yet set, don't process the input
    if (window.displayText === '') { return; }

    // Do not process input if the input text will be longer than the displayed text
    let inputText = this.value;
    if (window.displayText.length < inputText.length) { return ;}

    let result = '';
    let errorFound = false;

    // Loop through the input text and compare it to the displayed text (letter by letter)
    for (let i = 0; i < inputText.length; i++){
        if (inputText[i] !== window.displayText[i] && !errorFound){
            errorFound = true;
        }

        if (errorFound) {
            result += '<span class="incorrect bold">' + window.displayText[i] + '</span>';
            document.querySelector('#input-text').classList.add('incorrect');
        } else {
            result += '<span class="correct bold">' + window.displayText[i] + '</span>';
            document.querySelector('#input-text').classList.remove('incorrect');
        }
    }
    document.querySelector('#display-text').innerHTML = result + window.displayText.substr(inputText.length);
});

// Listener for the 'Use random quote' button which will fetch a random quote from the API
document.getElementById('display-text').addEventListener('htmx:afterSwap', function() {
    setDisplayText(document.querySelector('#display-text').textContent);
})

// Listener for 'Use my own text' button which will set the text to be typed
document.querySelector('#use-text').addEventListener('click', function () {
    // Don't do anything if the input is empty
    if (document.querySelector('#input-text').value === '') { return; }

    // Sanitize text by removing/replacing spacial characters
    setDisplayText(document.querySelector('#input-text').value);
});

// To avoid CORS rejection from the API, strip the headers
// https://github.com/bigskysoftware/htmx/issues/779
document.body.addEventListener('htmx:configRequest', function(event) {
    event.detail.headers = ''
});
