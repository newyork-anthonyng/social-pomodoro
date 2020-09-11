const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const stateMachine = require('./state-machine.js');

app.use(express.static(path.resolve(__dirname)));

// TODO: use webpack to avoid duplication of EVENTS object.
const EVENTS = {
  JOINED: 'joined',
  PLAY: 'play',
  PAUSE: 'pause',
  RESTART: 'restart',
  TICK: 'tick'
};

stateMachine.subscribe((time) => {
  io.emit(EVENTS.TICK, { time });
  console.log("😀");
  console.log(time);
  console.log("😀");
});

io.on('connection', socket => {
  console.log('a user connected');

  socket.on(EVENTS.JOINED, (data) => {
    console.log("*************");
    console.log("EVENTS.JOINED");
    console.log(data);

    io.emit(EVENTS.JOINED, data);
  });

  socket.on(EVENTS.PLAY, (data) => {
    console.log("*************");
    console.log("EVENTS.PLAY");
    console.log(data);
    stateMachine.send('PLAY');

    io.emit(EVENTS.PLAY, data);
  });

  socket.on(EVENTS.PAUSE, (data) => {
    console.log("*************");
    console.log("EVENTS.PAUSE");
    console.log(data);
    stateMachine.send('PAUSE');

    io.emit(EVENTS.PAUSE, data);
  });

  socket.on(EVENTS.RESET, (data) => {
    console.log("*************");
    console.log("EVENTS.RESET");
    console.log(data);
    stateMachine.send('RESET');

    io.emit(EVENTS.PAUSE, data);
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
