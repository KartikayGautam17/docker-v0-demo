import express from "express";
import { GetHelloRouter } from "./api/get-hello.js";
import "dotenv/config";
const app = express();
const PORT = 8080;
const baseUrl = process.env.EXPRESS_SERVER_URL;
console.log(baseUrl);
app.use("/", GetHelloRouter);
//Use absolute path over here
app.listen(PORT, () => {
  console.log(`App Listening on port ${PORT}`);
});
