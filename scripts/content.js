const audioPlayer = new AudioPlayer();
const achievementHandler = new AchievementHandler();
const parser = new MessageParser(audioPlayer, achievementHandler);

initializeExtension();

function initializeExtension() {
  if (document.querySelectorAll("style").length < 2) {
    injectStyles(appStyles, document.querySelector("head"));
  }
  setTimeout(() => {
    if (getChatArea()) {
      parser.observer.disconnect();
      initializeLocalStorageValues();
      messagesSent = getChatMessageCount();
      setMonitoredUser();
      addChatBadgeToPage();
      parser.initializeObserver(getChatArea());
      parser.achievementHandler.initializeAchievementDisplay();
      initializeDmBadge();
      injectDmList();
    }
  }, 1000);
}

function initializeLocalStorageValues() {
  localStorage.setItem(
    "dailyChatQuota",
    localStorage.getItem("dailyChatQuota") ?? 5
  );
  localStorage.setItem(
    "dailyChatResetTime",
    localStorage.getItem("dailyChatResetTime") ?? new Date().toISOString()
  );
  localStorage.setItem(
    "dailyChatSummary",
    localStorage.getItem("dailyChatSummary") ?? JSON.stringify({})
  );
  localStorage.setItem(
    "previousDailyChatSummary",
    localStorage.getItem("previousDailyChatSummary") ?? JSON.stringify({})
  );
  localStorage.setItem(
    "weeklyChatSummary",
    localStorage.getItem("weeklyChatSummary") ?? JSON.stringify({})
  );
  localStorage.setItem(
    "previousWeeklyChatSummary",
    localStorage.getItem("previousWeeklyChatSummary") ?? JSON.stringify({})
  );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "loadSummary") {
    const summary = createSummary();
    sendResponse(summary);
  } else if (message.action === "loadSettings") {
    const settings = loadSettings();
    sendResponse(settings);
  }
});

function createSummary() {
  const result = {};
  result["today"] = JSON.parse(
    localStorage.getItem("dailyChatSummary") || "{}"
  );
  result["yesterday"] = JSON.parse(
    localStorage.getItem("previousDailyChatSummary") || "{}"
  );
  result["week"] = JSON.parse(
    localStorage.getItem("weeklyChatSummary") || "{}"
  );
  result["lastWeek"] = JSON.parse(
    localStorage.getItem("previousWeeklyChatSummary") || "{}"
  );
  return result;
}

function loadSettings() {
  const result = {};
  result.username = localStorage.getItem("userToMonitor");
  result.dailyQuota = localStorage.getItem("dailyChatQuota");
  return result;
}
