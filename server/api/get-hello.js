import express from "express";
import { redis_client } from "../server.js";
import { db } from "../lib/db.js";
const router = express.Router();
const count = { count: 0 };
router.get("/", async (request, response) => {
  count.count += 1;
  const cache_res = await redis_client.GET("getHello");
  if (cache_res === null) {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
    await redis_client.SETEX("getHello", 5, "redis-cache");
    response.json({ message: "500ms response" });
    await db.temp.create({
      data: {
        data: count.count,
      },
    });
  } else {
    const value = await redis_client.get("getHello");
    response.json({ message: value });
  }
  return;
});

export { router as GetHelloRouter };
