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
