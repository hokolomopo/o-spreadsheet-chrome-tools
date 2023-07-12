window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded");

function odooTaskUrl(taskId) {
    return `[${taskId}](https://www.odoo.com/web#id=${taskId}&cids=1&menu_id=4720&action=333&active_id=2328&model=project.task&view_type=form)`;
}

window.addEventListener("keydown", (e) => {
    if (e.key === "m" && e.ctrlKey) {
        const textArea = document.querySelector("textarea#pull_request_body");

        let text = textArea.textContent;

        const odooTaskId = text.match(/Task:(.+)/)[1].trim();

        text = text.replace(odooTaskId, odooTaskUrl(odooTaskId));

        textArea.textContent = text;
    }
});
