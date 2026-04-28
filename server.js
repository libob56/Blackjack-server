const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

let balance = 1000;
let playerHand = [];
let dealerHand = [];

function createCard() {
    const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    const suits = ['♠', '♣', '♥', '♦'];
    return { 
        value: values[Math.floor(Math.random() * values.length)], 
        suit: suits[Math.floor(Math.random() * suits.length)] 
    };
}

app.get('/newGame', (req, res) => {
    if (balance <= 0) balance = 500;
    balance -= 10;
    playerHand = [createCard(), createCard()];
    dealerHand = [createCard(), createCard()];
    res.json({ 
        playerHand, 
        dealerHand: [dealerHand[0]], 
        playerScore: 0, // Пока упростим
        balance, 
        gameOver: false 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running'));
