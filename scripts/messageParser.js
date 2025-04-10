class MessageParser {
  constructor(audioPlayer, achievementHandler) {
    this.latestMessageText = "";
    this.observer = new MutationObserver(this.messageCallback);
    this.config = { childList: true, subtree: false };
    this.audioPlayer = audioPlayer;
    this.achievementHandler = achievementHandler;
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
    this.audioPlayer.playSound();
    this.achievementHandler.displayAchievementForMessageCount(messagesSent);
    this.latestMessageText = messageNode.innerText;
    if (messagesSent === 0) {
      this.increaseMessagesSent(quota);
    }
    this.updateChannelCount();
  }

  increaseMessagesSent(count = 1) {
    messagesSent += count;
    updateNotificationElement(chatNotificationElement);
    this.setLocalStorageValue(localChatCountKey, messagesSent.toString());
  }

  updateChannelCount() {
    const channel = this.getCurrentChannelName();
    const channelSummary =
      JSON.parse(localStorage.getItem("dailyChatSummary")) || {};
    if (!channelSummary[channel]) {
      channelSummary[channel] = 1;
    } else {
      channelSummary[channel] += 1;
    }

    this.setLocalStorageValue(
      "dailyChatSummary",
      JSON.stringify(channelSummary)
    );
    console.log(channelSummary);
  }

  getCurrentChannelName() {
    const channelUrl = location.href;
    return channelUrl.slice(channelUrl.lastIndexOf("/") + 1);
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
