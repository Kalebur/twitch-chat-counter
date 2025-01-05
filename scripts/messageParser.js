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
      ++messagesSent;
      updateNotificationElement(chatNotificationElement);
      localStorage.setItem(localChatCountKey, messagesSent.toString());
      playSound();
      displayAchievementForMessageCount(messagesSent);
      latestMessageText = node.innerText;
    } else if (isMessageDirectedAtMonitoredUser(node)) {
      node.classList.add("msg-highlighted");
      increaseDmsReceived();
      updateDmBadge();
      addMessageToDmList(node);
    }
  }
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
