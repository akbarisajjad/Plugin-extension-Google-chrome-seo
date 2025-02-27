chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "extractText",
        title: "استخراج متن صفحه",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "extractText") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let blob = new Blob([request.content], { type: "text/plain" });
    let url = URL.createObjectURL(blob);

    chrome.downloads.download({
        url: url,
        filename: request.filename,
        saveAs: true
    });

    sendResponse({ success: true });
});
