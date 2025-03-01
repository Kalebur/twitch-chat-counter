class MessageParser {
  constructor() {
    this.latestMessageText = "";
  }

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

const observer = new MutationObserver(messageCallback);
const config = { childList: true, subtree: false };
const parser = new MessageParser();

function initializeObserver(elementToObserve) {
  observer.observe(elementToObserve, config);
}

function messageCallback(mutationList, observer) {
  for (const mutation of mutationList) {
    handleMutation(mutation);
  }
}

function handleMutation(mutation) {
  if (mutation.type === "childList") {
    if (mutation.addedNodes.length === 0) return;
    parser.parseNode(mutation.addedNodes[0]);
  }
}
