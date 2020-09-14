
let tabToState = new Map<number, boolean>();

chrome.browserAction.onClicked.addListener((activeTab) => {
    if (activeTab.id === undefined) {
        throw Error("activeTab.id is undefined")
    }
    if (!tabToState.get(activeTab.id) && tabToState.get(activeTab.id) !== false) {
        chrome.tabs.insertCSS({file: "lib/toastify.css"});
        chrome.tabs.executeScript({file: "src/vendor.js"});
        chrome.tabs.executeScript({file: "src/content_script.js"});
        tabToState.set(activeTab.id, true);
    } else if (tabToState.get(activeTab.id) === false) {
        tabToState.set(activeTab.id, true);
        chrome.tabs.sendMessage(activeTab.id, {action: "start"});
    } else {
        tabToState.set(activeTab.id, false);
        chrome.tabs.sendMessage(activeTab.id, {action: "stop"});
    }
});
