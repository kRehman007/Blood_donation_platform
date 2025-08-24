const amqp = require("amqplib");
const { v4: uuidv4 } = require("uuid");

const rabbitUrl = "amqp://localhost";
let connection = null;
let channel = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

async function connect() {
  if (channel) return channel;

  try {
    console.log("🔄 Connecting to RabbitMQ...");
    connection = await amqp.connect(rabbitUrl, { heartbeat: 10 });
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");

    reconnectAttempts = 0;

    connection.on("close", () => {
      console.warn("⚠️ RabbitMQ connection closed. Reconnecting...");
      channel = null;
      attemptReconnect();
    });

    connection.on("error", (err) => {
      console.error("❌ RabbitMQ error:", err);
      channel = null;
      attemptReconnect();
    });

    return channel;
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ", error);
    attemptReconnect();
  }
}

async function attemptReconnect() {
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.error("❌ Max reconnect attempts reached. Exiting...");
    process.exit(1);
  }

  const delay = Math.min(5000 * (reconnectAttempts + 1), 30000);
  reconnectAttempts++;

  console.warn(`🔄 Reconnecting in ${delay / 1000} seconds...`);
  setTimeout(connect, delay);
}

// 1️⃣ Fire-and-Forget → just send, no response expected
async function publishToQueue(queue, message) {
  const ch = await connect();
  if (!ch) return console.error("❌ Failed to publish: No channel");

  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(message), { persistent: true });

  console.log(`📤 Sent to queue ${queue}`);
}

// 2️⃣ Fire-and-Forget Subscriber
async function subscribeToQueue(queue, callback) {
  const ch = await connect();
  if (!ch) return console.error("❌ Failed to subscribe: No channel");

  await ch.assertQueue(queue, { durable: true });

  ch.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        console.log(`📥 Received from ${queue}:`, msg.content.toString());
        await callback(msg.content.toString());
        ch.ack(msg);
      } catch (error) {
        console.error("❌ Error processing:", error);
      }
    }
  });

  console.log(`✅ Subscribed to queue ${queue}`);
}

// 3️⃣ Request-Response → RPC: send request and wait for reply
async function sendRPCMessage(queue, message) {
  const ch = await connect();
  const correlationId = uuidv4();
  const replyQueue = await ch.assertQueue("", { exclusive: true });

  return new Promise((resolve, reject) => {
    ch.consume(
      replyQueue.queue,
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
          resolve(msg.content.toString());
        }
      },
      { noAck: true }
    );

    ch.sendToQueue(queue, Buffer.from(message), {
      correlationId,
      replyTo: replyQueue.queue,
    });
  });
}

// 4️⃣ Handle RPC Requests (for service that will respond)
async function setupRPCConsumer(queue, handler) {
  const ch = await connect();
  await ch.assertQueue(queue, { durable: false });

  ch.consume(queue, async (msg) => {
    const content = msg.content.toString();
    const result = await handler(content);

    ch.sendToQueue(msg.properties.replyTo, Buffer.from(result), {
      correlationId: msg.properties.correlationId,
    });

    ch.ack(msg);
  });

  console.log(`🔁 Listening for RPC on queue: ${queue}`);
}

connect(); // Initial connect

module.exports = {
  connect,
  publishToQueue,
  subscribeToQueue,
  sendRPCMessage,
  setupRPCConsumer,
};
