async function populateFields() {
  const testField = document.getElementById("testField");
  const dailySummary = document.getElementById("dailySummary");
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.url.includes("twitch.tv")) {
        const summary = await chrome.tabs.sendMessage(activeTab.id, {
          action: "loadSummary",
        });
        const channelItems = await createChannelItems(summary);
        for (const channel of channelItems) {
          dailySummary.appendChild(channel);
        }
      } else {
        testField.innerText =
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

window.addEventListener("DOMContentLoaded", async () => {
  await populateFields();
});
