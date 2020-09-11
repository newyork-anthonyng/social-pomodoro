const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(path.resolve(__dirname)));

const EVENTS = {
  JOINED: 'joined'
};

io.on('connection', socket => {
  console.log('a user connected');

  socket.on(EVENTS.JOINED, (data) => {
    console.log("*************");
    console.log("EVENTS.JOINED");
    console.log(data);

    io.emit(EVENTS.JOINED, data);
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
