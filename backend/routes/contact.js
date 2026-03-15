const express = require("express");
const router = express.Router();

const messages = [];

router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const entry = {
    id: messages.length + 1,
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  messages.push(entry);
  res.status(201).json({ success: true, message: "Message received!", entry });
});

router.get("/", (_req, res) => {
  res.json(messages);
});

module.exports = router;
