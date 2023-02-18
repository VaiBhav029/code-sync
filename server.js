const express = require("express");

const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);

app.use(express.static('build'))

app.use((req,res,nex)=>{
  res.sendFile(path.join(__dirname,'build','index.html'))
})

const { Server } = require("socket.io");
const ACTIONS = require("./src/Action");
const io = new Server(server);

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log(`Soket connnected : ${socket.id}`);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const client = getAllConnectedClients(roomId);
    client.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        client,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });
  socket.on("disconnecting", () => {
    const room = [...socket.rooms];
    room.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Listinng at port", { PORT });
});
