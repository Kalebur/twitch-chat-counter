const animationDuration = 5;

const appStyles = {
  highlightedMsg: `
        .msg-highlighted {
            font-weight: 600;
            background-color: darkred;
        }
    `,
  extensionAudioPlayer: `
        .extension-audio-player {
            width: 1px;
            height: 1px;
            position: absolute;
            top: 0;
            left: -1px;
        }
    `,
  extensionBadge: `
        .extension-badge {
            padding: 3px 6px;
            border-radius: 8px;
            text-align: center;
            font-weight: bold;
        }
    `,
  defaultCursor: `
        .default-cursor {
            cursor: default;
        }
    `,
  quotaExceeded: `
        .quota-exceeded {
            background-color: gold;
            color: black;
        }
    `,
  quotaMet: `
        .quota-met {
            background-color: #00DC85;
            color: black;
        }
    `,
  quotaNotMet: `
        .quota-not-met {
            background-color: darkred;
            color: white;
        }
    `,
  displayed: `
        .displayed {
            display: block !important;
        }
    `,
  achievementDisplay: `
    .achievement-display {
        position: absolute;
        bottom: -100px;
        left: 50%;
        transform: translate(-50%, 0);
        border-radius: 1rem;
        width: 50%;
        height: 100px;
        min-width: 600px;
        color: white;
        background-color: #9147ff;
        z-index: 1001;
        display: flex;
        flex-direction: column;
        padding: 1rem;
    }`,
  achievementTitle: `
    .achievement-title {
        text-align: center;
        font-weight: 800;
        font-size: 2rem;
    }`,
  achievementBody: `
    .achievement-body {
        text-align: center;
        font-size: 1.4rem;
    }`,
  animate: `
    .animate {
        animation: achievement ${animationDuration}s linear infinite;
    }`,
  animationKeyframes: `
    @keyframes achievement {
        0% {
        bottom: -100px;
        }

        10% {
        bottom: 25px;
        }

        90% {
        bottom: 25px;
        }

        100% {
        bottom: -100px;
        }
    }`,
  dmBadge: `
    .dm-badge {
        padding: 3px 6px;
        border-radius: 3px;
        width: 25px;
        height: 25px;
        text-align: center;
        margin-right: 3px;
        cursor: pointer;
        background-color: red;
        color: white;
        font-weight: 600;
        display: none;
    }`,
  dmList: `
    .dm-list {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        margin: 0;
        border: none;
        padding: 0;
        position: absolute;
        left: 0;
        top: 0;
        background-color: transparent;
        box-sizing: border-box;
    }

    dialog:not([open]) {
        display: none;
    }

    ::backdrop {
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.8);
    }`,
  dmContainer: `
    .dm-container {
        width: 75vw;
        height: 80vh;
        max-width: 90%;
        padding: 1rem;
        background-color: rgba(88, 22, 88, 0.6);
        border-radius: 8px;
        overflow-y: auto;
    }`,
  btnCloseDmList: `
    .btn-close-dm-list {
        position: absolute;
        top: 25px;
        right: 25px;
        border-radius: 50%;
        background-color: darkred;
        color: white;
        font-size: 1.2rem;
        width: 50px;
        height: 50px;
        padding: 10px;
        text-align: center;
        vertical-align: middle;
        background-color:
    }`,
  btnDeleteMessage: `
    .btn-delete-msg {
        background-color: darkred;
        color: white;
        font-weight: 900;
        font-size: 1.25rem;
        position: absolute;
        top: 0;
        right: 5px;
        width: 25px;
        height: 25px;
        border-radius: 25%;
        text-align: center;
    }`,
  directChat: `
    .direct-chat {
        position: relative;
        display: flex;
        flex-direction: column;
        color: white;
        border-radius: 8px;
        padding: 4px 8px;
        min-height: 50px;
        min-width: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        margin-bottom: 0.5rem;
    }

    .direct-chat:hover {
        background-color: rgba(128, 128, 128, 0.5);
    }`,
  replyText: `
    .reply-text {
        font-style: italic;
    }`,
  newMessage: `
    .new-message {
        font-weight: 800;
    }

    .new-message span:first-of-type {
        display: inline-block;
        margin-right: 6px;
    }`,
};
