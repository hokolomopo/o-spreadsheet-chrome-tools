console.log("Odoo Customization Script Loaded");

function injectStyle(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.append(style);
}

injectStyle(`
    .o_kanban_project_tasks .bg-warning {
        background-color: rgba(var(--danger-rgb)) !important;
    }

    .o_kanban_project_tasks .o_status_changes_requested {
        color: rgba(var(--danger-rgb)) !important;
    }
`);
