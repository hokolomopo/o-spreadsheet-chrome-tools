console.log("O-Spreadsheet Chrome Extension - Odoo Dashboard Switch Loaded");

document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "l") {
        if (isEditingDashboard()){
            switchToDashboard();
        } else if (isOnDashboard()){
            switchToDashboardEdit();
        }
    }
});

function switchToDashboard(){
    let url = window.location.href;
    url = url.replace("action=action_edit_dashboard", "")
    url = url.replace("spreadsheet_id", "dashboard_id")
    window.location.href = url;
}

function switchToDashboardEdit(){
    let url = window.location.href;
    url = url.replace("dashboard_id", "spreadsheet_id")
    url += "&action=action_edit_dashboard"
    window.location.href = url;
}

function isEditingDashboard(){
    const url = window.location.href;
    return url.includes("action=action_edit_dashboard");
}

function isOnDashboard(){
    const url = window.location.href;
    return url.includes("dashboard_id=");
}
