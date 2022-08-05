window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded");

function odooTaskUrl(taskId) {
    return `[${taskId}](https://www.odoo.com/web#id=${taskId}&cids=1&menu_id=4720&action=333&active_id=2328&model=project.task&view_type=form)`;
}

window.addEventListener("keydown", (e) => {
    if (e.key === "m" && e.ctrlKey) {
        const textArea = document.querySelector("textarea");

        let text = textArea.textContent;

        const lines = text.trim().split("\n");
        const lastLine = lines[lines.length - 1];
        const odooTaskId = lastLine.match(/([0-9]+)/)[0];
        if (!odooTaskId) {
            console.warn("Odoo task ID not found");
            return;
        }

        text = text.replace(odooTaskId, odooTaskUrl(odooTaskId));

        textArea.textContent = text;
    }
});
