chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    if (changeInfo.url) {
      handleUrlChange(changeInfo.url, tabId);
    }
  } catch (error) {
    console.log(error);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (isStreamChannelUrl(tab.url)) {
    chrome.tabs.sendMessage(activeInfo.tabId, "updateCount");
  }
});

function handleUrlChange(tabUrl, tabId) {
  if (isStreamChannelUrl(tabUrl)) {
    chrome.tabs.sendMessage(tabId, "injectCountBadge");
  }
}

function isStreamChannelUrl(url) {
  if (url.includes("twitch.tv")) {
    const splitUrl = url.split("https://");
    const streamUrl = splitUrl[1].split("/");

    return streamUrl.length === 2 && streamUrl[1] !== "directory";
  }
  return false;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`In background: ${message}`);
});
