import multer from "multer";
import { Queue } from "bullmq";
import { NextResponse } from "next/server";

const upload = multer({ dest: "uploads/" });
const logQueue = new Queue("log-processing-queue", { connection: { host: "localhost", port: 6379 } });

export const POST = async (req) => {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, {}, async (err) => {
      if (err) {
        return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      }

      const formData = await req.formData();
      const file = formData.get("file");

      if (!file) {
        return resolve(NextResponse.json({ error: "No file uploaded" }, { status: 400 }));
      }

      const filePath = `uploads/${file.name}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      require("fs").writeFileSync(filePath, buffer);

      const job = await logQueue.add("process-log", { filePath }, { priority: getPriority(file.size) });

      resolve(NextResponse.json({ jobId: job.id }, { status: 200 }));
    });
  });
};


function getPriority(fileSize) {
  console.log("fileSize", fileSize);
  if (fileSize < 100) return 1;  
  if (fileSize < 500) return 3;  
  if (fileSize < 1000) return 5;  
  return 8;  
}