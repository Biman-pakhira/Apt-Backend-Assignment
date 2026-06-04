require("dotenv").config();
const path = require("path");
const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const http = require("http");

const { Server } = require("socket.io");
const connectDB = require("./config/db");
const orderRoutes = require('./routes/orderRoutes');
const startOrderWatcher = require("./sockets/orderWatcher");
connectDB();

app.use("/orders", orderRoutes);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`client connected : ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`client disconnected : ${socket.id}`);
  });
});

startOrderWatcher(io);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "client")));
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
