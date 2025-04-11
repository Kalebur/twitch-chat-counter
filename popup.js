async function populateFields() {
  const testField = document.getElementById("testField");
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.url.includes("twitch.tv")) {
        const response = await chrome.tabs.sendMessage(activeTab.id, {
          action: "loadSummary",
        });
        testField.innerText += response;
      } else {
        testField.innerText =
          "Summary unavailable outside of Twitch. Please navigate to a Twitch page and try again.";
      }
    }
  );
}

window.addEventListener("DOMContentLoaded", async () => {
  await populateFields();
});
