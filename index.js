// LIB
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");

// IMPORT
const userRouter = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRouters");

// SETITNGS
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRoute);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connect succeces");
  })
  .catch((err) => {
    console.log(`loi lot vao ${err}`);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`server started on Port ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
});

io.on("send-msg", (data) => {
  const sendUserSocket = onlineUsers.get(data.to);
  if (sendUserSocket) {
    io.to(sendUserSocket).emit("msg-recieve", data.msg);
  }
});
