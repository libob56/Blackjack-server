const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Твоя функция создания карты
function createCard() {
    const cards = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    return cards[Math.floor(Math.random() * cards.length)];
}

// ТОТ САМЫЙ ЗАПРОС, который ждет игра
app.get('/newGame', (req, res) => {
    res.json({ 
        balance: 1000, 
        card: createCard(), 
        message: "Карта выдана!" 
    });
});

// Запуск сервера на порту Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Сервер работает на порту ' + PORT);
});