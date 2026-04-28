const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

let playerHand = [], dealerHand = [], gameOver = false;

function createCard() {
    const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    const suits = ['♠', '♣', '♥', '♦'];
    return { value: values[Math.floor(Math.random() * values.length)], suit: suits[Math.floor(Math.random() * suits.length)] };
}

function getScore(hand) {
    let score = 0, aces = 0;
    hand.forEach(c => {
        if (['J', 'Q', 'K'].includes(c.value)) score += 10;
        else if (c.value === 'A') { score += 11; aces += 1; }
        else score += parseInt(c.value);
    });
    while (score > 21 && aces > 0) { score -= 10; aces -= 1; }
    return score;
}

app.get('/newGame', (req, res) => {
    playerHand = [createCard(), createCard()];
    dealerHand = [createCard(), createCard()]; // Дилер тоже берет две
    gameOver = false;
    res.json({ playerHand, dealerHand: [dealerHand[0]], playerScore: getScore(playerHand), gameOver }); 
});

app.get('/hit', (req, res) => {
    if (!gameOver) playerHand.push(createCard());
    const score = getScore(playerHand);
    if (score >= 21) gameOver = true;
    res.json({ playerHand, playerScore: score, gameOver });
});

app.get('/stand', (req, res) => {
    gameOver = true;
    while (getScore(dealerHand) < 17) dealerHand.push(createCard());
    const pScore = getScore(playerHand), dScore = getScore(dealerHand);
    let result = pScore > 21 ? 'Проигрыш' : dScore > 21 || pScore > dScore ? 'ПОБЕДА!' : pScore === dScore ? 'Ничья' : 'Дилер выиграл';
    res.json({ playerHand, dealerHand, playerScore: pScore, dealerScore: dScore, result, gameOver });
});

app.listen(process.env.PORT || 3000);