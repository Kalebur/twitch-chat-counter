let settings = {};

const renderSummaries = async (activeTab) => {
  if (activeTab.url.includes("twitch.tv")) {
    const summariesContainer = document.getElementById("summaries");
    const summary = await chrome.tabs.sendMessage(activeTab.id, {
      action: "loadSummary",
    });
    const dailySummary = await createSummary("Today", summary.today);
    summariesContainer.appendChild(dailySummary);
    const yesterdaySummary = await createSummary(
      "Yesterday",
      summary.yesterday
    );
    summariesContainer.appendChild(yesterdaySummary);
    const weeklySummary = await createSummary("This Week", summary.week);
    summariesContainer.appendChild(weeklySummary);
    const lastWeekSummary = await createSummary("Last Week", summary.lastWeek);
    summariesContainer.appendChild(lastWeekSummary);
  } else {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.innerText =
      "Summary unavailable outside of Twitch. Please navigate to a Twitch page and try again.";
  }
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

window.addEventListener("DOMContentLoaded", async () => {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
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

  await renderSummaries(activeTab);
});

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
