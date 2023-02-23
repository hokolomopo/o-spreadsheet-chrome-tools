window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded");

window.addEventListener("keydown", (e) => {
    if (e.key === "m" && e.ctrlKey) {
        fetch("http://localhost:9090/clear");
        fetch("http://localhost:9000/clear");
        location.reload();
    }
});

var s = document.createElement("script");
s.src = chrome.extension.getURL("o_spreadsheet_injected_script.js");
(document.head || document.documentElement).appendChild(s);
s.onload = function () {
    s.remove();
};
