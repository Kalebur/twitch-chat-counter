chrome.runtime.onMessage.addListener(handleMessageReceived);

function handleMessageReceived(message, sender, sendResponse) {
  switch (message) {
    case "injectCountBadge":
      initializeExtension();
      return false;

    case "updateCount":
      const badge = document.getElementById(messageCountBadgeId);
      if (badge !== null) {
        messagesSent = getChatMessageCount();
        updateNotificationElement(badge);
      }
      return false;

    case "newReplyReceivedInNonActiveTab":
      console.log("Message received!");
      return false;

    default:
      return false;
  }
}
