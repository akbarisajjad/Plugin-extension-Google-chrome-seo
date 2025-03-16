chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    extractContent(request.contentType, request.format);
});

function extractContent(contentType, format) {
    let content = "";
    const pageTitle = sanitizeTitle(document.title);
    switch (contentType) {
        case "text":
            content = extractTextContent();
            break;
        case "text_images":
            content = extractTextContent() + "\n\n" + extractImages();
            break;
        case "headings":
            content = extractHeadings();
            break;
        default:
            console.warn(`Unknown content type: ${contentType}`);
    }
    const filename = generateFilename(pageTitle, format);
    content = formatContent(content, pageTitle, format);
    sendContent(content, filename);
}

function sanitizeTitle(title) {
    return title.replace(/[\/:*?"<>|]/g, "-");
}

function extractTextContent() {
    return document.body.innerText;
}

function extractImages() {
    return Array.from(document.querySelectorAll("img"))
                .map(img => `تصویر: ${img.src}`)
                .join("\n");
}

function extractHeadings() {
    return Array.from(document.querySelectorAll("h2, h3"))
                .map(h => `${h.tagName}: ${h.innerText}`)
                .join("\n");
}

function generateFilename(title, format) {
    const ext = format === "html" ? ".html" : format === "markdown" ? ".md" : ".txt";
    return title + ext;
}

function formatContent(content, title, format) {
    switch (format) {
        case "html":
            return `<html><head><title>${title}</title></head><body><pre>${content}</pre></body></html>`;
        case "markdown":
            return `# ${title}\n\n${content}`;
        default:
            return content;
    }
}

function sendContent(content, filename) {
    chrome.runtime.sendMessage({
        content: content,
        filename: filename
    });
}
