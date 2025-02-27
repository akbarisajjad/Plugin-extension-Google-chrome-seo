chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    extractContent(request.contentType, request.format);
});

function extractContent(contentType, format) {
    let content = "";
    let pageTitle = document.title.replace(/[\/:*?"<>|]/g, "-");

    if (contentType === "text") {
        content = document.body.innerText;
    } else if (contentType === "text_images") {
        let images = Array.from(document.querySelectorAll("img"))
                          .map(img => `تصویر: ${img.src}`).join("\n");
        content = document.body.innerText + "\n\n" + images;
    } else if (contentType === "headings") {
        content = Array.from(document.querySelectorAll("h2, h3"))
                       .map(h => `${h.tagName}: ${h.innerText}`).join("\n");
    }

    let filename = pageTitle + (format === "html" ? ".html" : format === "markdown" ? ".md" : ".txt");

    if (format === "html") {
        content = `<html><head><title>${pageTitle}</title></head><body><pre>${content}</pre></body></html>`;
    } else if (format === "markdown") {
        content = `# ${pageTitle}\n\n` + content;
    }

    chrome.runtime.sendMessage({
        content: content,
        filename: filename
    });
}
