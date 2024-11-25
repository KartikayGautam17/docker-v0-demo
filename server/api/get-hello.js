import express from "express";

const router = express.Router();

router.get("/", (request, response) => {
  response.json({
    message: "This is the express router",
  });
});

export { router as GetHelloRouter };
