const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

// Состояние игры
let playerHand = [];

function createCard() {
    const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    const suits = ['♠', '♣', '♥', '♦'];
    return {
        value: values[Math.floor(Math.random() * values.length)],
        suit: suits[Math.floor(Math.random() * suits.length)]
    };
}

// Вычисление суммы очков
function getScore(hand) {
    let score = 0;
    let aces = 0;
    hand.forEach(card => {
        if (['J', 'Q', 'K'].includes(card.value)) score += 10;
        else if (card.value === 'A') { score += 11; aces += 1; }
        else score += parseInt(card.value);
    });
    while (score > 21 && aces > 0) { score -= 10; aces -= 1; }
    return score;
}

// Новая игра (очистка руки)
app.get('/newGame', (req, res) => {
    playerHand = [createCard(), createCard()]; // Сразу две карты
    res.json({ hand: playerHand, score: getScore(playerHand) });
});

// Добор карты
app.get('/hit', (req, res) => {
    playerHand.push(createCard());
    res.json({ hand: playerHand, score: getScore(playerHand) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Крупье готов на порту ' + PORT));