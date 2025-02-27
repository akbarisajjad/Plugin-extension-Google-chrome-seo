document.getElementById("extract").addEventListener("click", () => {
    let contentType = document.querySelector('input[name="contentType"]:checked').value;
    let format = document.getElementById("format").value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"]
        });

        chrome.runtime.sendMessage({ contentType, format });
    });
});
