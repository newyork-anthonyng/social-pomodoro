console.log('app.js loaded');

const socket = io();

const EVENTS = {
  JOINED: 'joined'
};

socket.on('connect', () => {
  socket.emit(EVENTS.JOINED, { name: 'Anthony' });
});

socket.on(EVENTS.JOINED, (data) => {
  console.group("EVENTS.JOINED");
  console.log(data);
  console.groupEnd("EVENTS.JOINED");
});
