window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded");

function odooTaskUrl(taskId) {
    return `[${taskId}](https://www.odoo.com/web#id=${taskId}&cids=1&menu_id=4720&action=333&active_id=2328&model=project.task&view_type=form)`;
}

function getBranch() {
    const compare = document.querySelector("#head-ref-selector").innerText;
    const branch = compare.split(":")[1].trim();
    return branch;
}

function getBaseBranch(branch) {
    const splitted = branch.split("-");
    if (splitted[0] === "saas") {
        return splitted[0] + "-" + splitted[1];
    }
    return splitted[0];
}

function getDevRepo() {
    const url = window.location.href;
    if (url.includes("odoo/enterprise")) {
        return "odoo-dev:enterprise";
    }
    return "odoo-dev";
}

function buildCompareURL() {
    const url = window.location.href;
    const prefix = url.split("compare/")[0];

    const baseBranch = getBaseBranch(getBranch());
    const repo = getDevRepo();

    const compareURL = prefix + "compare/" + baseBranch + "..." + repo + ":" + getBranch() +"?expand=1";
    return compareURL;
}


window.addEventListener("keydown", (e) => {
    if (e.key === "m" && e.ctrlKey) {
        if(document.querySelector(".pre-mergability .color-fg-success")){
            setupPRText();
        }else {
            window.location.href = buildCompareURL();
        }
    }
});

function setupPRText(){
    const textArea = document.querySelector("textarea#pull_request_body");

    let text = textArea.textContent;

    const odooTaskId = text.match(/Task:(.+)/)[1].trim();

    text = text.replace(odooTaskId, odooTaskUrl(odooTaskId));

    textArea.textContent = text;
}
