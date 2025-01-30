const extensionAudioPlayerId = "extensionAudioPlayer";
const goalMetAudioLink =
  "https://github.com/Kalebur/twitch-chat-counter/raw/refs/heads/main/assets/ding1.mp3";
const goalExceededAudioLink =
  "https://github.com/Kalebur/twitch-chat-counter/raw/refs/heads/main/assets/ding2.mp3";

function injectAudioPlayer() {
  const player = document.createElement("audio");
  player.id = extensionAudioPlayerId;
  player.src = goalMetAudioLink;
  player.classList.add("extension-audio-player");
  document.querySelector("body").appendChild(player);
}

function playSound() {
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
