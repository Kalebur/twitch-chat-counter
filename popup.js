let settings = {};

window.addEventListener("DOMContentLoaded", async () => {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!activeTab.url.includes("https://www.twitch.tv")) {
    displayExtensionErrorMessage();
    return;
  }

  initializeEventListeners(activeTab);
  displayExtensionBody();

  await renderSummaries(activeTab);
});

const displayExtensionErrorMessage = () => {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.innerHTML =
    "Extension functionality unavailable outside of Twitch. Please navigate to a <a href='https://www.twitch.tv/' target='__blank' rel='noreferrer'>Twitch</a> page and try again.";
};

const initializeEventListeners = (activeTab) => {
  const summaryHtmlTab = document.getElementById("summary");
  const settingsHtmlTab = document.getElementById("settings");
  const twitchHandleInput = document.getElementById("twitchHandle");
  const quotaInput = document.getElementById("dailyQuota");
  summaryHtmlTab.addEventListener("click", async (e) => {
    await showSection(e, activeTab);
  });
  settingsHtmlTab.addEventListener("click", async (e) => {
    await showSection(e, activeTab);
  });
  twitchHandleInput.addEventListener("input", (e) => {
    handleInput(e, activeTab);
  });
  quotaInput.addEventListener("input", (e) => {
    handleInput(e, activeTab);
  });
};

const displayExtensionBody = () => {
  document.getElementById("extension-body").classList.remove("hidden");
};

const showSection = async (e, activeTab) => {
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".popup-section");

  for (const tab of tabs) {
    tab.classList.remove("active");
  }
  for (const section of sections) {
    section.classList.add("hidden");
  }

  e.target.classList.add("active");
  const targetSection = e.target.innerText;

  if (targetSection === "Summary") {
    sections[0].classList.remove("hidden");
  } else {
    sections[1].classList.remove("hidden");
    const settingsData = await chrome.tabs.sendMessage(activeTab.id, {
      action: "loadSettings",
    });
    settings = settingsData;
    populateSettings(settingsData);
  }
};

const populateSettings = (settingsData) => {
  const usernameInput = document.getElementById("twitchHandle");
  usernameInput.value = settingsData.username;
  const quotaInput = document.getElementById("dailyQuota");
  quotaInput.value = settingsData.dailyQuota;
  populateAchievements(settingsData);
};

const populateAchievements = (settingsData) => {
  const achievementList = document.getElementById("achievements");
  achievementList.innerHTML = "";
  for (const achievement in settingsData.achievements) {
    const { title, body } = settingsData.achievements[achievement];
    achievementList.appendChild(
      createAchievementField(achievement, title, body)
    );
  }
};

const createAchievementField = (
  milestoneCount = -1,
  title = "A New Achievement",
  body = "Congrats! You achieved something!"
) => {
  const fieldGroup = document.createElement("li");
  fieldGroup.classList.add("input-group");
  const milestoneLabel = document.createElement("label");
  milestoneLabel.innerText = "Chat Count";
  const milestoneField = document.createElement("input");
  milestoneField.setAttribute("type", "number");
  milestoneField.setAttribute("min", "0");
  milestoneField.value = milestoneCount;
  milestoneLabel.appendChild(milestoneField);

  const titleLabel = document.createElement("label");
  titleLabel.innerText = "Title";
  const titleField = document.createElement("input");
  titleField.value = title;
  titleLabel.appendChild(titleField);

  const bodyLabel = document.createElement("label");
  bodyLabel.innerText = "Body";
  const bodyField = document.createElement("textarea");
  bodyField.value = body;
  bodyLabel.appendChild(bodyField);

  fieldGroup.appendChild(milestoneLabel);
  fieldGroup.appendChild(milestoneField);
  fieldGroup.appendChild(titleLabel);
  fieldGroup.appendChild(titleField);
  fieldGroup.appendChild(bodyLabel);
  fieldGroup.appendChild(bodyField);

  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-btn");
  removeButton.innerText = "Remove";
  fieldGroup.appendChild(removeButton);
  removeButton.addEventListener("click", (e) => {
    e.target.parentNode.remove();
  });

  return fieldGroup;
};

const handleInput = (event, activeTab) => {
  const newSettings = Object.assign({}, settings);
  if (event.target.getAttribute("name") === "twitchHandle") {
    newSettings.username = event.target.value;
  } else if (event.target.getAttribute("name") === "dailyQuota") {
    if (parseInt(event.target.value) < 1) {
      event.target.value = 1;
    }
    newSettings.dailyQuota = event.target.value;
  }
  chrome.tabs.sendMessage(activeTab.id, {
    action: "updateSettings",
    settings: newSettings,
  });
};

const renderSummaries = async (activeTab) => {
  const summariesContainer = document.getElementById("summaries");
  const summary = await chrome.tabs.sendMessage(activeTab.id, {
    action: "loadSummary",
  });
  const dailySummary = await createSummary("Today", summary.today);
  summariesContainer.appendChild(dailySummary);
  const yesterdaySummary = await createSummary("Yesterday", summary.yesterday);
  summariesContainer.appendChild(yesterdaySummary);
  const weeklySummary = await createSummary("This Week", summary.week);
  summariesContainer.appendChild(weeklySummary);
  const lastWeekSummary = await createSummary("Last Week", summary.lastWeek);
  summariesContainer.appendChild(lastWeekSummary);
};

const createSummary = async (summaryName, summaryData) => {
  const summarySection = document.createElement("section");
  const summaryTitle = document.createElement("h1");
  const summaryList = document.createElement("ul");
  summaryTitle.innerText = `${summaryName}`;

  const summaryItems = await createChannelItems(summaryData);
  for (const item of summaryItems) {
    summaryList.appendChild(item);
  }
  const totalElement = document.createElement("h2");
  totalElement.innerText = `Total Messages: ${await getTotalMessages(
    summaryData
  )}`;

  summarySection.appendChild(summaryTitle);
  summarySection.appendChild(summaryList);
  summarySection.appendChild(totalElement);

  return summarySection;
};

const createChannelItems = async (summary) => {
  const items = [];
  for (const channel in summary) {
    const listItem = document.createElement("li");
    listItem.classList.add("channel");
    const channelSpan = document.createElement("span");
    channelSpan.classList.add("channelName");
    channelSpan.innerText = channel;
    const countSpan = document.createElement("span");
    countSpan.innerText = summary[channel];
    listItem.appendChild(channelSpan);
    listItem.appendChild(countSpan);
    items.push(listItem);
  }

  return items;
};

const getTotalMessages = async (summary) => {
  let total = 0;
  for (const channel in summary) {
    total += summary[channel];
  }

  return total;
};
