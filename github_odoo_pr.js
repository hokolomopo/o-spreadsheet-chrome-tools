window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded");

const branch = document.querySelectorAll(".commit-ref")[1].title.replace(/^.*\:/, "");

const copyButtons = document.querySelectorAll("clipboard-copy");
for (const button of [...copyButtons]) {
    button.addEventListener("click", () => {
        console.log(`Copied branch name "${branch}"`);
        navigator.clipboard.writeText(branch);
    });
}

window.addEventListener("keydown", (e) => {
    if (e.key === "m" && e.ctrlKey) {
        const pr = window.location.href;

        const url = window.location.href;
        const location = url.includes("/odoo/enterprise") ? "enterprise" : "community";

        const prStr = `<b>pr ${location}: </b><a href=${pr}>${pr}</a> </b>`;

        const runbotLink = `https://runbot.odoo.com/runbot/r-d-1?search=${branch}`;
        const branchStr = `<b>branch ${location}: </b><a href=${runbotLink}>${branch}</a> </b>`;

        const strForClipboard = prStr + "</br>" + branchStr;

        var type = "text/html";
        var blob = new Blob([strForClipboard], { type });
        var data = [new ClipboardItem({ [type]: blob })];

        navigator.clipboard.write(data);

        console.log({ branch, pr });
    }
});