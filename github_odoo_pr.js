window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded");


const processedButtons = [];
function setupCopyBranchNameButton() {
    const copyButtons = document.querySelectorAll(".gh-header-meta clipboard-copy");
    for (const button of [...copyButtons]) {
        if (processedButtons.includes(button)) continue;

        processedButtons.push(button);
        button.addEventListener("click", () => {
            const branch = document.querySelectorAll(".commit-ref")[1].title.replace(/^.*\:/, "");
            console.log(`Copied branch name "${branch}"`);
            navigator.clipboard.writeText(branch);
        });
    }
}
setupCopyBranchNameButton();
setInterval(setupCopyBranchNameButton, 500);

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
        toast("Added PR info in the clipboard")
    }
});
