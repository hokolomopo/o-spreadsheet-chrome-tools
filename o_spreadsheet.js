window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded");

window.addEventListener("keydown", (e) => {
    if (e.key === "m" && e.ctrlKey) {
        fetch("http://localhost:9090/clear");
        fetch("http://localhost:9000/clear");
        location.reload();
    }
});
