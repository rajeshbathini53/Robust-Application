// worker.js
import Queue from "bull";
import dotenv from "dotenv";
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const QUEUE_NAME = process.env.QUEUE_NAME || "tasks";

const workQueue = new Queue(QUEUE_NAME, REDIS_URL);

console.log("Worker started, waiting for jobs...");

workQueue.process(async (job) => {
  console.log(`Processing job id=${job.id} type=${job.name} data=`, job.data);

  // simulate heavy work (replace with real logic: e.g. PDF generation, emailing, image processing)
  if (job.data.type === "generateReport") {
    // simulate long task
    await new Promise((r) => setTimeout(r, 5000));
    const report = {
      id: Date.now(),
      title: `Report for ${job.data.user || "unknown"}`,
      createdAt: new Date().toISOString(),
      summary: `Processed items: ${job.data.items?.length || 0}`
    };
    // job result returned to caller (if they want to wait for it)
    return report;
  }

  // fallback
  await new Promise((r) => setTimeout(r, 1000));
  return { ok: true };
});

workQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed`, result);
});

workQueue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed`, err);
});
