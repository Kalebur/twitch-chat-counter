const extensionAudioPlayerId = "extensionAudioPlayer";
const goalMetAudioLink =
  "https://cdn.discordapp.com/attachments/1090349167890669578/1317579809647493221/newthingget.mp3?ex=67783fd2&is=6776ee52&hm=22b3542107511928d646f43e001a61e8d412bd229b8fea7fa38ddc88f229e3c6&";
const goalExceededAudioLink =
  "https://cdn.discordapp.com/attachments/1090349167890669578/1317588656394997903/eq-ding.mp3?ex=6778480f&is=6776f68f&hm=441ba7c6e76cc84f114edf33fd60cdaaf212012b5b9478616a2fa01aedeae848&";

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
