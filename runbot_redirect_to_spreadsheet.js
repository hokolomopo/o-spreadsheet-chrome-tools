console.log("redirect_to_spreadsheet.js loaded");

document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "m") {
        chrome.runtime.sendMessage({ type: "redirect" }, () => {
            redirect();
        });
    }
});

window.addEventListener("load", function () {
    redirectIfNeeded();
});

function redirectIfNeeded() {
    chrome.runtime.sendMessage({ type: "shouldRedirect" }, (shouldRedirect) => {
        if (!shouldRedirect) {
            clearTimeout(checkUrlTimeoutId);
            return;
        }
        redirect();
        if (!checkUrlTimeoutId) listenToUrlChanges();
    });
}

function redirect() {
    const url = window.location.href;

    if (url.match(/odoo.com\/?$/)) {
        const loginButton =
            document.querySelector("a[href='/web/login']");
        if (loginButton) {
            loginButton.click();
            return;
        }
        // already logged in
        window.location.href = url + (url.endsWith("/") ? "" : "/") + "web";
    } else if (url.match(/web\/login\/?/)) {
        console.log("login page");
        const loginForm = document.querySelector(".oe_login_form");
        const loginInput = loginForm.querySelector("input[name='login']");
        const passwordInput = loginForm.querySelector("input[name='password']");
        const submitButton = loginForm.querySelector("button[type='submit']");

        loginInput.value = "admin";
        passwordInput.value = "admin";
        submitButton.click();
    }
    // main web page
    else if (url.includes("action=menu") || url.match(/web\#cids=1$/)) {
        console.log("main page");
        const documentAppIcon = document.querySelector('a[data-menu-xmlid="documents.menu_root"]');
        if (!documentAppIcon) {
            console.log("no document app icon found...");
            return;
        }
        documentAppIcon.click();
    }
    // document kanban view
    else if (url.includes("model=documents.document") && url.includes("view_type=kanban")) {
        const spreadsheetPreview = document.querySelector("div.o_document_spreadsheet");
        chrome.runtime.sendMessage({ type: "stopRedirect" });
        if (!spreadsheetPreview) {
            console.log("no spreadsheet preview found...");
            return;
        }

        spreadsheetPreview.click();
    } else {
        redirectToRoot();
    }
}

let checkUrlTimeoutId = undefined;
function listenToUrlChanges() {
    const url = window.location.href;
    checkUrlTimeoutId = setTimeout(() => {
        if (window.location.href !== url) {
            redirectIfNeeded();
        }
        listenToUrlChanges();
    }, 100);
}

function redirectToRoot() {
    const url = window.location.href;
    const rootUrl = url.slice(0, url.indexOf("odoo.com") + "odoo.com".length);
    window.location.href = rootUrl;
}
