initializeExtension();

function initializeExtension() {
  setTimeout(() => {
    if (getChatArea()) {
      observer.disconnect();
      messagesSent = getChatMessageCount();
      injectStyles(appStyles, document.querySelector("head"));
      setMonitoredUser();
      addChatBadgeToPage();
      initializeObserver(getChatArea());
      injectAudioPlayer();
      initializeAchievementDisplay();
      initializeDmBadge();
      injectDmList();
    }
  }, 1000);
}
