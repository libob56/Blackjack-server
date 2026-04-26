const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let users = {};

function createCard() {
    const cards = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    return cards[Math.floor(Math.random() * cards.length)];
}

function getScore(hand) {
    let score = 0;
    let aces = 0;
    hand.forEach(card => {
        if (card === 'A') { aces++; score += 11; }
        else if (['J','Q','K'].includes(card)) { score += 10; }
        else { score += parseInt(card); }
    });
    while (score > 21 && aces > 0) { score -= 10; aces--; }
    return score;
}

io.on('connection', (socket) => {
    users[socket.id] = { balance: 1000, bet: 0, playerCards: [], dealerCards: [], gameOver: false };
    
    socket.on('makeBet', (amount) => {
        if (amount <= users[socket.id].balance) {
            users[socket.id].bet = amount;
            users[socket.id].balance -= amount;
            socket.emit('updateBalance', users[socket.id].balance);
        }
    });

    socket.on('newGame', () => {
        let user = users[socket.id];
        if (user.bet === 0) return socket.emit('msg', 'Сначала сделайте ставку!');
        
        user.playerCards = [createCard(), createCard()];
        user.dealerCards = [createCard()];
        user.gameOver = false;
        
        io.to(socket.id).emit('gameUpdate', {
            playerCards: user.playerCards,
            dealerCards: user.dealerCards,
            playerScore: getScore(user.playerCards),
            gameOver: false
        });
    });

    socket.on('hit', () => {
        let user = users[socket.id];
        if (user.gameOver) return;
        user.playerCards.push(createCard());
        let score = getScore(user.playerCards);
        
        if (score > 21) {
            user.gameOver = true;
            io.to(socket.id).emit('gameUpdate', {
                playerCards: user.playerCards,
                dealerCards: user.dealerCards,
                gameOver: true,
                message: "ПЕРЕБОР! Вы проиграли."
            });
            user.bet = 0;
        } else {
            io.to(socket.id).emit('gameUpdate', {
                playerCards: user.playerCards,
                dealerCards: user.dealerCards,
                playerScore: score,
                gameOver: false
            });
        }
    });

    socket.on('stand', () => {
        let user = users[socket.id];
        if (user.gameOver) return;
        
        while (getScore(user.dealerCards) < 17) {
            user.dealerCards.push(createCard());
        }
        
        let pScore = getScore(user.playerCards);
        let dScore = getScore(user.dealerCards);
        let msg = "";
        
        if (dScore > 21 || pScore > dScore) {
            msg = `ВЫ ВЫИГРАЛИ! (${pScore} vs ${dScore})`;
            user.balance += user.bet * 2;
        } else if (pScore === dScore) {
            msg = "НИЧЬЯ!";
            user.balance += user.bet;
        } else {
            msg = `ДИЛЕР ВЫИГРАЛ! (${dScore} vs ${pScore})`;
        }
        
        user.gameOver = true;
        user.bet = 0;
        socket.emit('updateBalance', user.balance);
        io.to(socket.id).emit('gameUpdate', {
            playerCards: user.playerCards,
            dealerCards: user.dealerCards,
            gameOver: true,
            message: msg
        });
    });
});

server.listen(process.env.PORT || 10000);
