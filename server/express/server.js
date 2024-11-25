import express from "express";
import { GetHelloRouter } from "./api/get-hello.js";
import "dotenv/config";
const app = express();
const PORT = 8080;
app.use("/", GetHelloRouter);
app.listen(PORT, () => {
  console.log(`App Listening on port ${PORT}`);
});
