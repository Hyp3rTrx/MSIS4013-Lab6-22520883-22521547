const amqp = require("amqplib");
const mongoose = require("mongoose");
const Message = require("../models/message.model");
require("dotenv").config();

async function start() {
  try {
    await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost:27017/lab6"
    );
  } catch (e) {
    console.warn("Mongo connect failed:", e.message);
  }
  const conn = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost"
  );
  const ch = await conn.createChannel();
  const queue = "lab6_queue";
  await ch.assertQueue(queue, { durable: false });
  console.log("Consumer listening...");
  ch.consume(queue, async (msg) => {
    if (!msg) return;
    const content = msg.content.toString();
    console.log("Received", content);
    try {
      await Message.create({ source: "rabbitmq", content });
    } catch (err) {
      console.error("Save failed", err);
    }
    ch.ack(msg);
  });
}

start().catch((err) => {
  console.error("Consumer error", err);
  process.exit(1);
});
