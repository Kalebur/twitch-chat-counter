const localChatCountKey = "dailyChatCount";
const localChatResetTimeKey = "dailyChatResetTime";
const messageCountBadgeId = "messageCountBadge";
const messageMilestones = [5, 10, 25, 50];

let quota = parseInt(localStorage.getItem("dailyChatQuota")) || 5;
let messagesSent = getChatMessageCount();
let chatArea = getChatArea();
let chatNotificationElement = null;

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
  let storedTime =
    localStorage.getItem(localChatResetTimeKey) ?? new Date(2000, 1, 1);
  let resetDate = new Date(storedTime);

  if (resetDate.getHours() !== 6) {
    resetDate.setHours(6, 0, 0, 0);
    localStorage.setItem(localChatResetTimeKey, resetDate.toISOString());
  }

  if (currentDate > resetDate) {
    if (currentDate.getDay() === 1) {
      updatePreviousWeekSummary();
    }
    const nextResetDate = createNewResetDateFromExistingDate(currentDate);
    localStorage.setItem(localChatResetTimeKey, nextResetDate.toISOString());
    localStorage.setItem(localChatCountKey, 0);

    localStorage.setItem(
      "previousDailyChatSummary",
      localStorage.getItem("dailyChatSummary") || JSON.stringify({})
    );
    localStorage.setItem("dailyChatSummary", JSON.stringify({}));
    return 0;
  }

  return parseInt(localStorage.getItem(localChatCountKey)) ?? -quota;
}

function updatePreviousWeekSummary() {
  const weeklySummary = JSON.parse(
    localStorage.getItem("weeklyChatSummary") || "{}"
  );
  localStorage.setItem(
    "previousWeeklyChatSummary",
    JSON.stringify(weeklySummary)
  );
  localStorage.setItem("weeklyChatSummary", JSON.stringify({}));
}

function createNewResetDateFromExistingDate(date) {
  const newResetDate = date;
  newResetDate.setHours(6, 0, 0, 0);
  newResetDate.setDate(newResetDate.getDate() + 1);
  return newResetDate;
}

function getChatArea() {
  return document.querySelector(".chat-scrollable-area__message-container");
}

function updateNotificationElement(element) {
  element.innerText = calculateQuotaDifference();
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
  element.innerText = calculateQuotaDifference();
  element.id = messageCountBadgeId;
  return element;
}

function calculateQuotaDifference() {
  if (messagesSent < quota) {
    return -(quota - messagesSent);
  }
  return messagesSent;
}

function getNotificationStyle() {
  if (messagesSent >= quota * 2) {
    return "quota-exceeded";
  } else if (messagesSent >= quota && messagesSent < quota * 2) {
    return "quota-met";
  } else {
    return "quota-not-met";
  }
}
