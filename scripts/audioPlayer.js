class AudioPlayer {
  constructor() {
    this.extensionAudioPlayerId = "extensionAudioPlayer";
    this.goalMetAudioLink =
      "https://github.com/Kalebur/twitch-chat-counter/raw/refs/heads/main/assets/ding1.mp3";
    this.goalExceededAudioLink =
      "https://github.com/Kalebur/twitch-chat-counter/raw/refs/heads/main/assets/ding2.mp3";
    this.injectAudioPlayer();
  }

  playSound() {
    const player = document.querySelector(`#${this.extensionAudioPlayerId}`);

    if (player === null) {
      return;
    }
    if (messagesSent === 0) {
      player.src = this.goalMetAudioLink;
    } else if (messagesSent >= 25) {
      player.src = this.goalExceededAudioLink;
    }

    if (messageMilestones.includes(messagesSent)) {
      player.play();
    }
  }

  injectAudioPlayer() {
    const player = document.createElement("audio");
    player.id = this.extensionAudioPlayerId;
    player.src = this.goalMetAudioLink;
    player.classList.add("extension-audio-player");
    document.querySelector("body").appendChild(player);
  }
}
