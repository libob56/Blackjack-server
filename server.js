const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

let players = {}; // Список игроков онлайн

function createCard() {
    const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    const suits = ['♠', '♣', '♥', '♦'];
    return { value: values[Math.floor(Math.random() * values.length)], suit: suits[Math.floor(Math.random() * suits.length)] };
}

io.on('connection', (socket) => {
    console.log('Новый игрок:', socket.id);

    // Создаем игрока при входе
    players[socket.id] = { id: socket.id, hand: [], score: 0, balance: 1000 };

    // Сообщаем всем, что игроков стало больше
    io.emit('updateRoom', players);

    // Когда КТО-ТО нажимает "Новая игра"
    socket.on('startBroadcast', () => {
        Object.keys(players).forEach(id => {
            players[id].hand = [createCard(), createCard()];
            // Здесь можно добавить расчет очков
        });
        io.emit('updateRoom', players); // Рассылаем новые карты ВСЕМ
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updateRoom', players);
    });
});

httpServer.listen(process.env.PORT || 3000);
