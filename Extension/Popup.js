document.getElementById("extract").addEventListener("click", () => {
    try {
        const contentType = document.querySelector('input[name="contentType"]:checked').value;
        const format = document.getElementById("format").value;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
                console.error("Error querying tabs: ", chrome.runtime.lastError);
                return;
            }
            const activeTab = tabs[0];
            if (!activeTab) {
                console.error("No active tab found.");
                return;
            }

            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ["content.js"]
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error executing script: ", chrome.runtime.lastError);
                    return;
                }
                chrome.runtime.sendMessage({ contentType, format });
            });
        });
    } catch (error) {
        console.error("An error occurred: ", error);
    }
});
