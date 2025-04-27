class AchievementHandler {
  constructor() {
    this.milestoneAchievements = {
      5: {
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

    this.initializeAchievementDisplay();
  }

  initializeAchievementDisplay() {
    const achievementDisplay = this.createAchievementDisplay();
    this.injectElementIntoPage(
      achievementDisplay,
      document.querySelector(".video-player")
    );
  }

  createAchievementDisplay() {
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

  injectElementIntoPage(element, targetElement = null) {
    if (targetElement === null || targetElement === undefined) {
      targetElement = document.querySelector("body");
    }
    targetElement.appendChild(element);
  }

  displayAchievementForMessageCount(count) {
    if (count in this.milestoneAchievements) {
      this.setAchievementTitle(this.milestoneAchievements[count].title);
      this.setAchievementBody(this.milestoneAchievements[count].body);
      this.playAchievementAnimation();
    }
  }

  setAchievementTitle(title) {
    const titleElem = document.getElementById("achievement-title");
    titleElem.innerText = title;
  }

  setAchievementBody(body) {
    const bodyElem = document.getElementById("achievement-body");
    bodyElem.innerText = body;
  }

  playAchievementAnimation() {
    const achievementElement = document.getElementById("achievement-display");
    achievementElement.classList.add("animate");
    setTimeout(() => {
      achievementElement.classList.remove("animate");
    }, animationDuration * 1000);
  }

  set achievements(achievements) {
    this.milestoneAchievements = achievements;
  }

  get achievements() {
    return this.milestoneAchievements;
  }
}
