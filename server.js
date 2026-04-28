app.get('/newGame', (req, res) => {
    // Если денег нет, выдаем 500 монет "под честное слово"
    if (balance <= 0) {
        balance = 500;
        return res.json({ 
            playerHand: [createCard(), createCard()], 
            dealerHand: [dealerHand[0]], 
            playerScore: getScore(playerHand), 
            balance, 
            message: "ВАМ ВЫДАН КРЕДИТ 500!",
            gameOver: false 
        });
    }
    
    if (balance < currentBet) return res.json({ error: "Недостаточно средств!" });
    
    balance -= currentBet;
    playerHand = [createCard(), createCard()];
    dealerHand = [createCard(), createCard()];
    gameOver = false;
    res.json({ playerHand, dealerHand: [dealerHand[0]], playerScore: getScore(playerHand), balance, gameOver });
});
