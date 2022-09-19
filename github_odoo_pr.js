window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded");

const branch = document.querySelectorAll(".commit-ref")[1].title.replace(/^.*\:/, "");

const copyButtons = document.querySelectorAll("clipboard-copy");
for (const button of [...copyButtons]) {
    button.addEventListener("click", () => {
      navigator.clipboard.writeText(branch);
    });
}

window.addEventListener("keydown", (e) => {
    if (e.key === "m" && e.ctrlKey) {
        const pr = window.location.href;

        const url = window.location.href;
        const location = url.includes("/odoo/enterprise") ? "enterprise" : "community";

        const strForClipboard = `<b>pr ${location}: </b><a href=${pr}>${pr}</a> </br><b>branch ${location}: </b>${branch}`;

        var type = "text/html";
        var blob = new Blob([strForClipboard], { type });
        var data = [new ClipboardItem({ [type]: blob })];

        navigator.clipboard.write(data);

        console.log({ branch, pr });
    }
});
