class MessageParser {
  constructor() {
    this.latestMessageText = "";
    this.observer = new MutationObserver(this.messageCallback);
    this.config = { childList: true, subtree: false };
  }

  initializeObserver(elementToObserve) {
    this.observer.observe(elementToObserve, this.config);
  }

  handleMutation(mutation) {
    if (mutation.type === "childList") {
      if (mutation.addedNodes.length === 0) return;
      this.parseNode(mutation.addedNodes[0]);
    }
  }

  messageCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      this.handleMutation(mutation);
    }
  };

  async parseNode(node) {
    if (this.isValidMessage(node)) {
      let user = node.children[0].dataset.aUser;
      if (user === userToMonitor) {
        this.handleUserMessage(node);
      } else if (this.isMessageDirectedAtMonitoredUser(node)) {
        this.handleDm(node);
      }
    }
  }

  isValidMessage(messageNode) {
    return (
      messageNode !== null &&
      messageNode !== undefined &&
      messageNode.querySelector(".chat-line__timestamp") === null &&
      messageNode.childElementCount > 0 &&
      messageNode.children[0].hasAttribute("data-a-user") &&
      messageNode.innerText !== this.latestMessageText
    );
  }

  handleUserMessage(messageNode) {
    this.increaseMessagesSent();
    playSound();
    displayAchievementForMessageCount(messagesSent);
    this.latestMessageText = messageNode.innerText;
    if (messagesSent === 0) {
      increaseMessagesSent(quota);
    }
  }

  increaseMessagesSent(count = 1) {
    messagesSent += count;
    updateNotificationElement(chatNotificationElement);
    this.setLocalStorageValue(localChatCountKey, messagesSent.toString());
  }

  setLocalStorageValue(key, value) {
    localStorage.setItem(key, value);
  }

  handleDm(dm) {
    dm.classList.add("msg-highlighted");
    increaseDmsReceived();
    updateDmBadge();
    addMessageToDmList(dm);
  }

  isMessageDirectedAtMonitoredUser(messageNode) {
    return messageNode.innerText.toLowerCase().includes(`@${userToMonitor}`);
  }
}
