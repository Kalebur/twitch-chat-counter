async function populateFields() {
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.url.includes("twitch.tv")) {
        const dailySummaryElement = document.getElementById("dailySummary");
        const totalElement = document.getElementById("total");
        const summary = await chrome.tabs.sendMessage(activeTab.id, {
          action: "loadSummary",
        });
        const channelItems = await createChannelItems(summary);
        for (const channel of channelItems) {
          dailySummaryElement.appendChild(channel);
        }
        totalElement.innerText = `Total Messages: ${await getDailyTotal(
          summary
        )}`;
      } else {
        const statusMessage = document.getElementById("statusMessage");
        statusMessage.innerText =
          "Summary unavailable outside of Twitch. Please navigate to a Twitch page and try again.";
      }
    }
  );
}

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

const getDailyTotal = async (summary) => {
  let total = 0;
  for (const channel in summary) {
    total += summary[channel];
  }

  return total;
};

window.addEventListener("DOMContentLoaded", async () => {
  await populateFields();
});
