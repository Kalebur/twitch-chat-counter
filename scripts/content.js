const parser = new MessageParser();

initializeExtension();

function initializeExtension() {
  setTimeout(() => {
    if (getChatArea()) {
      parser.observer.disconnect();
      messagesSent = getChatMessageCount();
      injectStyles(appStyles, document.querySelector("head"));
      setMonitoredUser();
      addChatBadgeToPage();
      parser.initializeObserver(getChatArea());
      parser.achievementHandler.initializeAchievementDisplay();
      initializeDmBadge();
      injectDmList();
    }
  }, 1000);
}
