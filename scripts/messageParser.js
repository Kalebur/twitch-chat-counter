const observer = new MutationObserver(messageCallback);
const config = { childList: true, subtree: false };

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
    parseNode(mutation.addedNodes[0]);
  }
}

async function parseNode(node) {
  if (isValidMessage(node)) {
    let user = node.children[0].dataset.aUser;
    if (user === userToMonitor) {
      handleUserMessage(node);
    } else if (isMessageDirectedAtMonitoredUser(node)) {
      handleDm(node);
    }
  }
}

function handleUserMessage(message) {
  increaseMessagesSent();
  playSound();
  displayAchievementForMessageCount(messagesSent);
  latestMessageText = message.innerText;
  if (messagesSent === 0) {
    increaseMessagesSent(quota);
  }
  clearLatestMessage();
}

function clearLatestMessage() {
  setTimeout(() => {
    latestMessageText = "";
  }, 100);
}

function handleDm(dm) {
  dm.classList.add("msg-highlighted");
  increaseDmsReceived();
  updateDmBadge();
  addMessageToDmList(dm);
}

function increaseMessagesSent(count = 1) {
  messagesSent += count;
  updateNotificationElement(chatNotificationElement);
  setLocalStorageValue(localChatCountKey, messagesSent.toString());
}

function setLocalStorageValue(key, value) {
  localStorage.setItem(key, value);
}

function isValidMessage(message) {
  return (
    message !== null &&
    message !== undefined &&
    message.querySelector(".chat-line__timestamp") === null &&
    message.childElementCount > 0 &&
    message.children[0].hasAttribute("data-a-user") &&
    message.innerText !== latestMessageText
  );
}

function isMessageDirectedAtMonitoredUser(messageNode) {
  return messageNode.innerText.toLowerCase().includes(`@${userToMonitor}`);
}
