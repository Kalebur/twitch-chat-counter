const localChatCountKey = "dailyChatCount";
const localChatResetTimeKey = "dailyChatResetTime";
const messageCountBadgeId = "messageCountBadge";

let messagesSent = getChatMessageCount();
let chatArea = getChatArea();
let chatNotificationElement = null;
let latestMessageText = "";

function addChatBadgeToPage() {
  let targetElement = document.querySelector(".chat-input__buttons-container");
  if (targetElement !== null) {
    let chatBadge = document.getElementById(messageCountBadgeId);
    if (chatBadge !== null) {
      return;
    }
    chatNotificationElement = createNotificationElement();
    targetElement.children[1].prepend(chatNotificationElement);
  } else {
    setTimeout(() => addChatBadgeToPage(targetElement), 1000);
  }
}

function getChatMessageCount() {
  let currentDate = new Date();
  let storedTime = localStorage.getItem(localChatResetTimeKey);
  let resetDate = new Date(storedTime);

  if (resetDate.getHours() !== 6) {
    resetDate.setHours(6, 0, 0, 0);
    localStorage.setItem(localChatResetTimeKey, resetDate.toISOString());
  }

  if (currentDate > resetDate) {
    resetDate.setDate(resetDate.getDate() + 1);
    localStorage.setItem(localChatResetTimeKey, resetDate.toISOString());
    localStorage.setItem(localChatCountKey, -5);
    return -5;
  }

  return parseInt(localStorage.getItem(localChatCountKey)) ?? -5;
}

function getChatArea() {
  return document.querySelector(".chat-scrollable-area__message-container");
}

function updateNotificationElement(element) {
  element.innerText = messagesSent;
  element.classList.remove("quota-not-met", "quota-met", "quota-exceeded");
  element.classList.add(getNotificationStyle());
}

function createNotificationElement() {
  const element = document.createElement("p");
  element.classList.add(
    "extension-badge",
    "default-cursor",
    getNotificationStyle()
  );
  element.innerText = messagesSent;
  element.id = messageCountBadgeId;
  return element;
}

function getNotificationStyle() {
  if (messagesSent >= 25) {
    return "quota-exceeded";
  } else if (messagesSent >= 0 && messagesSent < 25) {
    return "quota-met";
  } else {
    return "quota-not-met";
  }
}
