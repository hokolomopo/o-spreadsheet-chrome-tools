

function injectFile(filePath) {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(filePath);
    script.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
}

injectFile("global_injected_script.js");
