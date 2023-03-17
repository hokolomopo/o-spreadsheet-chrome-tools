console.log("background.js loaded");

const tabIdsWithRedirection = [];

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    switch (msg.type) {
        case "redirect":
            tabIdsWithRedirection.push(sender.tab.id);
            return;
        case "shouldRedirect":
            sendResponse(tabIdsWithRedirection.includes(sender.tab.id));
            break;
        case "stopRedirect":
            tabIdsWithRedirection.splice(tabIdsWithRedirection.indexOf(sender.tab.id), 1);
            return;
    }
});
