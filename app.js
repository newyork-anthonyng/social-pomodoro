import { EVENTS } from "./constants.js";

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
    });

    this.socket.on(EVENTS.PLAY, (data) => {
      console.group("EVENTS.PLAY");
      console.log(data);
      console.groupEnd("EVENTS.PLAY");
    });

    this.socket.on(EVENTS.PAUSE, (data) => {
      console.group("EVENTS.PAUSE");
      console.log(data);
      console.groupEnd("EVENTS.PAUSE");
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
}

const myAwesomeSocket = new MyAwesomeSocket();

const $play = document.querySelector('.js-play');
const $pause = document.querySelector('.js-pause');

$play.addEventListener('click', () => {
  myAwesomeSocket.play();
});

$pause.addEventListener('click', () => {
  myAwesomeSocket.pause();
});
