import { EVENTS } from "./constants.js";

const $actionList = document.querySelector('.js-action-list');
const template = document.querySelector('.js-action-item-template');
function addActionItem(data) {
  const clone = template.content.cloneNode(true);
  const $li = clone.querySelector('li');
  $li.textContent = data;

  $actionList.insertBefore(clone, $actionList.firstChild);
}

const $time = document.querySelector('.js-time');
function renderTime(data) {
  $time.textContent = data;
}

class MyAwesomeSocket {
  constructor(socket) {
    this.socket = io();

    this.setupSocket();
  }

  setupSocket() {
    this.socket.on('connect', () => {
      this.join();
    });

    this.socket.on(EVENTS.JOINED, (data) => {
      console.group("EVENTS.JOINED");
      console.log(data);
      console.groupEnd("EVENTS.JOINED");
      addActionItem(`${data.name} joined`);
    });

    this.socket.on(EVENTS.PLAY, (data) => {
      console.group("EVENTS.PLAY");
      console.log(data);
      console.groupEnd("EVENTS.PLAY");
      addActionItem(`Timer was started`);
    });

    this.socket.on(EVENTS.PAUSE, (data) => {
      console.group("EVENTS.PAUSE");
      console.log(data);
      console.groupEnd("EVENTS.PAUSE");
      addActionItem(`Timer was paused`);
    });

    this.socket.on(EVENTS.RESET, (data) => {
      console.group("EVENTS.RESET");
      console.log(data);
      console.groupEnd("EVENTS.RESET");
      addActionItem(`Timer was reset`);
      renderTime(data.time);
    });

    this.socket.on(EVENTS.TICK, (data) => {
      console.group("EVENTS.TICK");
      console.log(data);
      console.groupEnd("EVENTS.TICK");
      renderTime(data.time);
    });
  }

  join() {
    // TODO: save username somewhere
    this.socket.emit(
      EVENTS.JOINED,
      { name: 'Anthony' }
    );
  }

  play() {
    this.socket.emit(
      EVENTS.PLAY,
      { name: 'Anthony' }
    );
  }

  pause() {
    this.socket.emit(
      EVENTS.PAUSE,
      { name: 'Anthony' }
    );
  }

  reset() {
    this.socket.emit(
      EVENTS.RESET,
      { name: 'Anthony' }
    );
  }
}

const myAwesomeSocket = new MyAwesomeSocket();

const $play = document.querySelector('.js-play');
const $pause = document.querySelector('.js-pause');
const $reset = document.querySelector('.js-reset');

$play.addEventListener('click', () => {
  console.log("%cplay", 'background-color: green; color: white; font-size: 24px;');
  myAwesomeSocket.play();
});

$pause.addEventListener('click', () => {
  myAwesomeSocket.pause();
});

$reset.addEventListener('click', () => {
  myAwesomeSocket.reset();
});

