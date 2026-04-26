const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Это чтобы при заходе по ссылке не было ошибки 500
app.get('/', (req, res) => {
  res.send('Сервер Блэкджека запущен и готов!');
});

io.on('connection', (socket) => {
  console.log('Игрок вошел:', socket.id);
  socket.on('action', (data) => {
    console.log('Ход игрока:', data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Работаем на порту:', PORT);
});
