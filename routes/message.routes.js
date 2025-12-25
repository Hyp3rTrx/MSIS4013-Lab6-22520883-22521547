const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../models/message.model");

// POST /send - simulate producer sending a message (saves to Mongo)
router.post("/send", async (req, res) => {
  const { content, source } = req.body || {};
  if (!content) return res.status(400).json({ message: "content required" });
  try {
    const doc = await Message.create({ source: source || "api", content });
    res.json({ ok: true, id: doc._id, doc });
  } catch (err) {
    console.error("Save failed", err);
    res.status(500).json({ message: "Save failed" });
  }
});

// GET /messages - list saved messages
router.get("/messages", async (req, res) => {
  try {
    const items = await Message.find().sort({ receivedAt: -1 }).limit(100);
    res.json({ items });
  } catch (err) {
    console.error("Query failed", err);
    res.status(500).json({ message: "Query failed" });
  }
});

module.exports = router;
