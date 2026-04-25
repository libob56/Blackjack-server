const io = require("socket.io")(process.env.PORT || 3000, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("Игрок подключился:", socket.id);

  socket.on("action", (data) => {
    // Тут будет логика ходов
    console.log("Действие от игрока:", data);
  });
});

console.log("Сервер запущен!");
