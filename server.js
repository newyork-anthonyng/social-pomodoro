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
  RESET: 'reset',
  TICK: 'tick'
};

stateMachine.subscribe((data) => {
  // TODO: the subscribe event should be called whenever anything from state machine updates
  io.emit(data.type, data.data);
  console.log(data);
});

io.on('connection', socket => {
  console.log('a user connected');

  socket.on(EVENTS.JOINED, (data) => {
    io.emit(EVENTS.JOINED, data);
  });

  socket.on(EVENTS.PLAY, (data) => {
    stateMachine.send('PLAY');
  });

  socket.on(EVENTS.PAUSE, (data) => {
    stateMachine.send('PAUSE');
  });

  socket.on(EVENTS.RESET, (data) => {
    stateMachine.send('RESET');
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
