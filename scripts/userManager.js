const userToMonitorLocalStorageKey = "userToMonitor";
let userToMonitor = "";

function setMonitoredUser() {
  userToMonitor = localStorage.getItem(userToMonitorLocalStorageKey);
  if (userToMonitor === null) {
    userToMonitor = prompt("What is your twitch handle?");
    localStorage.setItem(userToMonitorLocalStorageKey, userToMonitor);
  }
}
