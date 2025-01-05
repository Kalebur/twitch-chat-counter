const animationDuration = 5;
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

// ==================== Achievement Window =====================
function initializeAchievementDisplay() {
  const achievementDisplay = createAchievementDisplay();
  injectElementIntoPage(
    achievementDisplay,
    document.querySelector(".video-player")
  );
}

function createAchievementDisplay() {
  const achievementDisplay = document.createElement("div");
  achievementDisplay.classList.add("achievement-display");
  achievementDisplay.id = "achievement-display";

  const achievementTitle = document.createElement("p");
  achievementTitle.classList.add("achievement-title");
  achievementTitle.id = "achievement-title";
  achievementTitle.innerText = "Achievement Title";
  achievementDisplay.appendChild(achievementTitle);

  const achievementBody = document.createElement("p");
  achievementBody.classList.add("achievement-body");
  achievementBody.id = "achievement-body";
  achievementBody.innerText = "Achievement Body";
  achievementDisplay.appendChild(achievementBody);

  return achievementDisplay;
}

function injectElementIntoPage(element, targetElement = null) {
  if (targetElement === null || targetElement === undefined) {
    targetElement = document.querySelector("body");
  }
  targetElement.appendChild(element);
}

function setAchievementTitle(title) {
  const titleElem = document.getElementById("achievement-title");
  titleElem.innerText = title;
}

function setAchievementBody(body) {
  const bodyElem = document.getElementById("achievement-body");
  bodyElem.innerText = body;
}

function displayAchievementForMessageCount(count) {
  if (
    messageMilestones.includes(count) &&
    milestoneAchievements.hasOwnProperty(count)
  ) {
    setAchievementTitle(milestoneAchievements[count].title);
    setAchievementBody(milestoneAchievements[count].body);
    playAchievementAnimation();
  }
}

function playAchievementAnimation() {
  const achievementElement = document.getElementById("achievement-display");
  achievementElement.classList.add("animate");
  setTimeout(() => {
    achievementElement.classList.remove("animate");
  }, animationDuration * 1000);
}

const achievementBoxClass = `
  .achievement-display {
    position: absolute;
    bottom: -100px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 1rem;
    width: 50%;
    height: 100px;
    min-width: 600px;
    color: white;
    background-color: #9147ff;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }
    `;

const achievementTitleClass = `
  .achievement-title {
    text-align: center;
    font-weight: 800;
    font-size: 2rem;
  }
`;

const achievementBodyClass = `
  .achievement-body {
  text-align: center;
  font-size: 1.4rem;
  }
`;

const animateClass = `
  .animate {
    animation: achievement ${animationDuration}s linear infinite;
  }
`;

const achievementAnimation = `
  @keyframes achievement {
    0% {
    bottom: -100px;
    }

    10% {
      bottom: 25px;
    }

    90% {
    bottom: 25px;
    }

    100% {
    bottom: -100px;
    }
  }
`;

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

const dmBadgeClass = `
  .dm-badge {
    padding: 3px 6px;
    border-radius: 3px;
    width: 25px;
    height: 25px;
    text-align: center;
    margin-right: 3px;
    cursor: pointer;
    background-color: red;
    color: white;
    font-weight: 600;
    display: none;
  }
`;

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

const dmListClass = `
  .dm-list {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    margin: 0;
    border: none;
    padding: 0;
    position: absolute;
    left: 0;
    top: 0;
    background-color: transparent;
    box-sizing: border-box;
  }

  dialog:not([open]) {
    display: none;
  }

  ::backdrop {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const dmContainerClass = `
  .dm-container {
    width: 75vw;
    height: 80vh;
    max-width: 90%;
    padding: 1rem;
    background-color: rgba(88, 22, 88, 0.6);
    border-radius: 8px;
    overflow-y: auto;
  }
`;

const dmListCloseButtonClass = `
  .btn-close-dm-list {
    position: absolute;
    top: 25px;
    right: 25px;
    border-radius: 50%;
    background-color: darkred;
    color: white;
    font-size: 1.2rem;
    width: 50px;
    height: 50px;
    padding: 10px;
    text-align: center;
    vertical-align: middle;
    background-color:
  }
`;

const msgDeleteButtonClass = `
  .btn-delete-msg {
    background-color: darkred;
    color: white;
    font-weight: 900;
    font-size: 1.25rem;
    position: absolute;
    top: 0;
    right: 5px;
    width: 25px;
    height: 25px;
    border-radius: 25%;
    text-align: center;
  }
`;

const directChatClass = `
  .direct-chat {
    position: relative;
    display: flex;
    flex-direction: column;
    color: white;
    border-radius: 8px;
    padding: 4px 8px;
    min-height: 50px;
    min-width: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    margin-bottom: 0.5rem;
  }

  .direct-chat:hover {
    background-color: rgba(128, 128, 128, 0.5);
  }
`;

const replyTextClass = `
  .reply-text {
    font-style: italic;
  }
`;

const newMessageClass = `
  .new-message {
    font-weight: 800;
  }

  .new-message span:first-of-type {
    display: inline-block;
    margin-right: 6px;
  }
`;

// ==================== Bonus Point Auto-Clicker =====================
function claimBonusPoints() {
  const pointsButton = document.querySelector(`[aria-label = "Claim Bonus"]`);
  if (pointsButton) {
    pointsButton.click();
  }
}

const stylesToInject = [
  achievementBoxClass,
  achievementBodyClass,
  achievementTitleClass,
  animateClass,
  achievementAnimation,
  dmBadgeClass,
  dmListClass,
  dmContainerClass,
  dmListCloseButtonClass,
  msgDeleteButtonClass,
  directChatClass,
  replyTextClass,
  newMessageClass,
];
