chrome.runtime.onInstalled.addListener(() => {
    createContextMenu();
});

function createContextMenu() {
    chrome.contextMenus.create({
        id: "extractText",
        title: "استخراج متن صفحه",
        contexts: ["all"]
    });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "extractText") {
        executeContentScript(tab.id, "content.js");
    }
});

function executeContentScript(tabId, scriptFile) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: [scriptFile]
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleDownload(request.content, request.filename);
    sendResponse({ success: true });
});

function handleDownload(content, filename) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: true
    });
}
