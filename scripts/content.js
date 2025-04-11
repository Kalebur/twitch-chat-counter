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
    const summary = JSON.parse(localStorage.getItem("dailyChatSummary"));
    sendResponse(summary);
  }
});
