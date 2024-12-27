import { createServer } from "node:http";
import { Server } from "socket.io";
import express from "express";
import { GetHelloRouter } from "./api/get-hello.js";
import cors from "cors";
import { createClient } from "@redis/client";

const client = createClient({ url: process.env.REDIS_SERVER_URL });

client.on("error", (err) => {
  console.log("Redis Client Error", err);
});
await client.connect();
const corsOption = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
};
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsOption });
const PORT = 8080;

app.use(cors(corsOption));
app.use("/", GetHelloRouter);

io.on("connection", (socket) => {
  console.log(socket.id + " connected");
  socket.on("username", (username) => {
    if (socket.username) {
      console.log(socket.username + " changed username to " + username);
    } else {
      console.log(socket.id + " set username to " + username);
    }
    socket.username = username;
  });
  socket.emit("welcome", "Welcome to the server");
  socket.on("message", (data) => {
    console.log(socket.username + " : " + data);
    socket.broadcast.emit("message", { username: socket.username, data });
  });
});

server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});

export { client as redis_client };
