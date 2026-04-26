const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get('/', (req, res) => res.send('Сервер Блэкджека с экономикой активен!'));

// База данных в памяти (в идеале потом прикрутим настоящую БД)
let users = {};

io.on('connection', (socket) => {
    console.log('Игрок вошел:', socket.id);
    
    // Начальные данные игрока
    users[socket.id] = { balance: 1000, inventory: [], bet: 0 };

    socket.on('makeBet', (amount) => {
        if (amount <= users[socket.id].balance && amount > 0) {
            users[socket.id].bet = amount;
            users[socket.id].balance -= amount;
            socket.emit('updateBalance', users[socket.id].balance);
            socket.emit('msg', `Ставка ${amount}$ принята!`);
        }
    });

    socket.on('win', () => {
        const prize = users[socket.id].bet * 2;
        users[socket.id].balance += prize;
        users[socket.id].bet = 0;
        socket.emit('updateBalance', users[socket.id].balance);
    });

    socket.on('buyItem', (item) => {
        const prices = { "GoldCard": 500, "LuckyCharm": 1000 };
        if (users[socket.id].balance >= prices[item]) {
            users[socket.id].balance -= prices[item];
            users[socket.id].inventory.push(item);
            socket.emit('updateBalance', users[socket.id].balance);
            socket.emit('msg', `Куплено: ${item}`);
        }
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log('Экономика работает на порту:', PORT));
