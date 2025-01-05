const messageMilestones = [0, 10, 25, 50];
const milestoneAchievements = {
  0: {
    title: "Quota Met",
    body: "Congrats! You met your daily chat quota!",
  },
  10: {
    title: "Getting Chattier",
    body: "Look at you, chatting like a pro!",
  },
  25: {
    title: "Actual Chatterbox",
    body: "You're getting your name out there now! Good on you!",
  },
  50: {
    title: "Lord Spam-A-Lot",
    body: "You've sent 50 messages today! Can you believe that's almost half as many as you've sent during some entire YEARS?!",
  },
};

let numDmsReceived = 0;

chrome.runtime.onMessage.addListener(handleMessageReceived);
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

const autoBonusClicker = setInterval(() => {
  claimBonusPoints();
}, 300000);

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

function increaseDmsReceived() {
  ++numDmsReceived;
}

function updateDmBadge() {
  const dmBadge = document.getElementById("dm-badge");
  if (numDmsReceived > 0) {
    dmBadge.classList.add("displayed");
  } else {
    dmBadge.classList.remove("displayed");
  }
  dmBadge.innerText = numDmsReceived;
}

// ==================== Direct Reply Badge =====================
function initializeDmBadge() {
  let targetElement = document.querySelector(".chat-input__buttons-container");
  if (targetElement !== null) {
    const dmBadge = document.createElement("p");
    dmBadge.classList.add("dm-badge");
    dmBadge.id = "dm-badge";
    targetElement.children[1].prepend(dmBadge);
    dmBadge.addEventListener("click", openDmList);
  }
}

// ==================== Direct Reply List =====================
function addMessageToDmList(message) {
  message.querySelector(`[aria-label="Click to reply"]`).remove();
  const parsedMessage = parseMessageToNewElement(message);
  const dmList = document.getElementById("dm-container");
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn-delete-msg");
  deleteButton.onclick = () => deleteMessage(parsedMessage);
  deleteButton.innerText = "X";
  parsedMessage.appendChild(deleteButton);
  dmList.appendChild(parsedMessage);
}

function parseMessageToNewElement(message) {
  const newMessage = document.createElement("div");
  newMessage.classList.add("direct-chat");
  if (containsReply(message)) {
    newMessage.appendChild(createReplyElement(message));
  }
  newMessage.appendChild(createMessageFromNode(message));
  return newMessage;
}

function containsReply(message) {
  return message.querySelector("p");
}

function createReplyElement(message) {
  const originalMessageText = document.createElement("p");
  originalMessageText.classList.add("reply-text");
  originalMessageText.innerText = message.querySelector("p").innerText;
  return originalMessageText;
}

function createMessageFromNode(messageNode) {
  const newMessage = document.createElement("p");
  newMessage.classList.add("new-message");

  const senderName = getSenderName(messageNode);
  const messageBody = getMessageBody(messageNode);
  newMessage.appendChild(senderName);
  newMessage.appendChild(messageBody);
  return newMessage;
}

function getSenderName(messageNode) {
  const newSenderName = document.createElement("span");
  const senderElem = messageNode.querySelector(".chat-author__display-name");
  newSenderName.innerText = senderElem.innerText;
  newSenderName.style = senderElem.getAttribute("style");
  return newSenderName;
}

function getMessageBody(messageNode) {
  const newMessageBody = document.createElement("span");
  const messageElem = messageNode.querySelectorAll("span");
  for (const span of messageElem) {
    if (span.dataset.aTarget === "chat-line-message-body") {
      newMessageBody.innerText = span.innerText;
      break;
    }
  }
  return newMessageBody;
}

function deleteMessage(message) {
  message.remove();
  --numDmsReceived;
  updateDmBadge();
}

function injectDmList() {
  const dmList = createDmList();
  injectElementIntoPage(dmList);
}

function createDmList() {
  const dmList = document.createElement("dialog");
  dmList.id = "dm-list";
  dmList.classList.add("dm-list");
  const dmContainer = document.createElement("div");
  dmContainer.id = "dm-container";
  dmContainer.classList.add("dm-container");
  dmList.appendChild(dmContainer);
  const closeDmListButton = document.createElement("button");
  closeDmListButton.innerText = "X";
  closeDmListButton.id = "btn-close-dm-list";
  closeDmListButton.classList.add("btn-close-dm-list");
  closeDmListButton.addEventListener("click", closeDmList);
  dmList.appendChild(closeDmListButton);
  return dmList;
}

function openDmList() {
  const dmList = document.getElementById("dm-list");
  dmList.showModal();
  dmList.querySelector("#btn-close-dm-list").focus();
}

function closeDmList() {
  document.getElementById("dm-list").close();
}

// ==================== Bonus Point Auto-Clicker =====================
function claimBonusPoints() {
  const pointsButton = document.querySelector(`[aria-label = "Claim Bonus"]`);
  if (pointsButton) {
    pointsButton.click();
  }
}
