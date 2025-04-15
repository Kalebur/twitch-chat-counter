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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "loadSummary") {
    const summary = {};
    summary["today"] = JSON.parse(
      localStorage.getItem("dailyChatSummary") || "{}"
    );
    summary["yesterday"] = JSON.parse(
      localStorage.getItem("previousDailyChatSummary") || "{}"
    );
    summary["week"] = JSON.parse(
      localStorage.getItem("weeklyChatSummary") || "{}"
    );
    summary["lastWeek"] = JSON.parse(
      localStorage.getItem("previousWeeklyChatSummary") || "{}"
    );
    sendResponse(summary);
  }
});
