import { Queue } from "bullmq";

const logQueue = new Queue("log-processing-queue", { connection: { host: "localhost", port: 6379 } });

export default async function handler(req, res) {
  const count = await logQueue.getActiveCount();
  res.json({ activeJobs: count });
}
