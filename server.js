const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Этот блок ОБЯЗАТЕЛЕН для Render, чтобы не было ошибки 500
app.get('/', (req, res) => {
  res.send('Сервер Блэкджека запущен и готов!');
});

io.on('connection', (socket) => {
  console.log('Игрок подключился:', socket.id);
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log('Сервер работает на порту:', PORT);
});
