let tabToState = {};

chrome.browserAction.onClicked.addListener((activeTab) => {
  if (!tabToState[activeTab.id] && tabToState[activeTab.id] !== false) {
    chrome.tabs.executeScript({file: "lib/socket-io-client.js"});
    chrome.tabs.insertCSS({file: "lib/toastify.css"});
    chrome.tabs.executeScript({file: "lib/toastify.js"});
    chrome.tabs.executeScript({file: "content.js"});
    tabToState[activeTab.id] = true;
  } else if (tabToState[activeTab.id] === false) {
    tabToState[activeTab.id] = true;
    chrome.tabs.sendMessage(activeTab.id, {action: "start"}, null, null);
  } else {
    tabToState[activeTab.id] = false;
    chrome.tabs.sendMessage(activeTab.id, {action: "stop"}, null, null);
  }
});
