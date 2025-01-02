const localChatCountKey = "dailyChatCount";
const localChatResetTimeKey = "dailyChatResetTime";
const userToMonitorLocalStorageKey = "userToMonitor";
const messageCountBadgeId = "messageCountBadge";
const extensionAudioPlayerId = "extensionAudioPlayer";
const config = { childList: true, subtree: true };
let userToMonitor = "";

const goalMetAudioLink =
  "https://cdn.discordapp.com/attachments/1090349167890669578/1317579809647493221/newthingget.mp3?ex=675f3352&is=675de1d2&hm=a40511aaeac2d14b82d36905938579b60265d491013f9b1f22d334de769cc42e&";
const goalExceededAudioLink =
  "https://cdn.discordapp.com/attachments/1090349167890669578/1317588656394997903/eq-ding.mp3?ex=675f3b8f&is=675dea0f&hm=506b79babcaf452d7ef4e07a57192b88c454e47845cac4450a1314af67036345&";

let messagesSent = getChatMessageCount();
let chatArea = null;
let chatNotificationElement = null;
let latestMessageText = "";

const messageCallback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    handleMutation(mutation);
  }
};

const observer = new MutationObserver(messageCallback);
chrome.runtime.onMessage.addListener(handleMessageReceived);

setTimeout(() => {
  if (getChatArea()) {
    setTargetUser();
    addChatBadgeToPage();
    initializeObserver();
    injectAudioPlayer();
  }
}, 1000);

function setTargetUser() {
  userToMonitor = localStorage.getItem(userToMonitorLocalStorageKey);
  if (userToMonitor === null) {
    userToMonitor = prompt("What is your twitch handle?");
    localStorage.setItem(userToMonitorLocalStorageKey, userToMonitor);
  }
}

function initializeObserver() {
  chatArea = getChatArea();
  observer.observe(chatArea, config);
}

function injectAudioPlayer() {
  const player = document.createElement("audio");
  player.id = extensionAudioPlayerId;
  player.src = goalMetAudioLink;
  player.style =
    "width: 1px; height: 1px; position: absolute; top: 0; left: -1px;";
  document.querySelector("body").appendChild(player);
}

function handleMessageReceived(message, sender, sendResponse) {
  switch (message) {
    case "injectCountBadge":
      setTimeout(() => {
        observer.disconnect();
        messagesSent = getChatMessageCount();
        addChatBadgeToPage(chatArea);
        updateNotificationElement(chatNotificationElement);
        initializeObserver();
        injectAudioPlayer();
      }, 1000);
      return false;

    case "updateCount":
      const badge = document.getElementById(messageCountBadgeId);
      if (badge !== null) {
        messagesSent = getChatMessageCount();
        updateNotificationElement(badge);
      }
      return false;

    default:
      return false;
  }
}

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
  element.setAttribute("style", getNotificationStyle());
}

function createNotificationElement() {
  const element = document.createElement("p");
  element.setAttribute("style", getNotificationStyle());
  element.innerText = messagesSent;
  element.id = messageCountBadgeId;
  return element;
}

function handleMutation(mutation) {
  if (mutation.type === "childList") {
    let latestMessage = chatArea.children[chatArea.childElementCount - 1];
    if (latestMessage === null) {
      return;
    }
    if (latestMessage.innerText !== latestMessageText) {
      if (
        !latestMessage.children[0] ||
        !latestMessage.children[0].hasAttribute("data-a-user")
      ) {
        return;
      }
      var user = latestMessage.children[0].dataset.aUser;
      if (user === userToMonitor) {
        ++messagesSent;
        updateNotificationElement(chatNotificationElement);
        localStorage.setItem(localChatCountKey, messagesSent.toString());
        playSound();
      }
      latestMessageText = latestMessage.innerText;
    }
  }
}

function playSound() {
  const messageMilestones = [0, 10, 25, 50];
  const player = document.querySelector(`#${extensionAudioPlayerId}`);
  if (player === null) {
    return;
  }
  if (messagesSent === 0) {
    player.src = goalMetAudioLink;
  } else if (messagesSent >= 25) {
    player.src = goalExceededAudioLink;
  }

  if (messageMilestones.includes(messagesSent)) {
    player.play();
  }
}

function getNotificationStyle() {
  return `background-color: ${
    messagesSent >= 0 ? (messagesSent >= 25 ? "gold" : "#00DC85") : "darkred"
  }; color: ${
    messagesSent >= 0 ? "black" : "white"
  }; padding: 3px 6px; border-radius: 8px; text-align: center; font-weight: bold; cursor: default;`;
}
