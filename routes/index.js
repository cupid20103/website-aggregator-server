import express from "express";

import ChatGPTController from "../controller/ChatGPTController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

router.post("/url", ChatGPTController.getData);

export default router;
