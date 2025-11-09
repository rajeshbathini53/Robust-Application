import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import Queue from "bull";
import Redis from "ioredis";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet()); // ✅ adds security headers

// Redis setup
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
redis.on("error", (err) => console.error("Redis connection error:", err));

// Bull queue setup
const jobQueue = new Queue("jobQueue", process.env.REDIS_URL || "redis://127.0.0.1:6379");

// Routes
app.get("/", (req, res) => {
  res.json({ message: "🚀 Expert server running successfully with advanced server-side features!" });
});

app.post("/job", async (req, res) => {
  const job = await jobQueue.add({ task: "example", timestamp: new Date() });
  res.json({ message: "Job added", jobId: job.id });
});

app.listen(PORT, () => {
  console.log(`🚀 Expert server running on http://localhost:${PORT}`);
});
