let numDmsReceived = 0;

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
  const deleteAllDmsButton = document.createElement("button");
  deleteAllDmsButton.classList.add("btn-delete-all-dms");
  deleteAllDmsButton.innerText = "Delete All DMs";
  deleteAllDmsButton.id = "btn-delete-all-dms";
  deleteAllDmsButton.addEventListener("click", deleteAllDms);
  dmList.appendChild(deleteAllDmsButton);
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

function deleteAllDms() {
  const dmContainer = document.getElementById("dm-container");
  while (dmContainer.childElementCount > 0) {
    dmContainer.children[0].remove();
  }
  numDmsReceived = 0;
  updateDmBadge();
}
