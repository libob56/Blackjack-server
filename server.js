const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

let count = 0;

io.on('connection', (socket) => {
  count++;
  console.log('Игрок вошел. Всего:', count);
  
  // Отправляем всем количество людей в комнате
  io.emit('playerCount', count);

  socket.on('disconnect', () => {
    count--;
    io.emit('playerCount', count);
  });
});

httpServer.listen(process.env.PORT || 3000);
