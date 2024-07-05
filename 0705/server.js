// server.js

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("join", (room) => {
    console.log("User joined room: " + room);
    socket.join(room);

    // Roomに入っている人数を取得して全てのクライアントに送信
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    const numClients = clientsInRoom ? clientsInRoom.size : 0;
    io.to(room).emit("UserCount", { count: numClients });
  });

  socket.on("chat message", (data) => {
    console.log(
      "Message received: " + data.message + ", from room: " + data.room
    );
    if (data.message === "usercounters") {
      // Roomに入っている人数を取得して全てのクライアントに送信
      const clientsInRoom = io.sockets.adapter.rooms.get(data.room);
      const numClients = clientsInRoom ? clientsInRoom.size : 0;
      io.to(data.room).emit("UserCount", { count: numClients });
    } else {
      // 同じルームIDに参加しているクライアントだけにメッセージを送信
      io.to(data.room).emit("chat message", {
        message: data.message,
        from: "Server",
      });
    }
  });

  // 配置managerの処理
  socket.on("where", (data) => {
    console.log(
      "Message received: " + data.message + ", from room: " + data.room
    );

    // 同じルームIDに参加しているクライアントだけにメッセージを送信
    io.to(data.room).emit("where", {
      message: data.message,
      from: "Server",
    });
  });

});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// Socket.IOのクライアントライブラリを提供
app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(path.resolve("node_modules/socket.io/client-dist/socket.io.js"));
});
