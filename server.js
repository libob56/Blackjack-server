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
    const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    const suits = ['♠', '♣', '♥', '♦']; // Масти
    return {
        value: values[Math.floor(Math.random() * values.length)],
        suit: suits[Math.floor(Math.random() * suits.length)]
    };
}

app.get('/newGame', (req, res) => {
    const card = createCard();
    res.json({ 
        balance: 1000, 
        card: card, // Теперь это объект {value: "10", suit: "♠"}
        message: "Карта сдана!" 
    });
});

// Запуск сервера на порту Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Сервер работает на порту ' + PORT);
});