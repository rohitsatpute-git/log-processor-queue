import {  createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"; // Use Next.js cookies
import multer from "multer";
import { Queue } from "bullmq";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto"; // Generate unique file ID

const upload = multer({ dest: "uploads/" });
const logQueue = new Queue("log-processing-queue", { connection: { host: "localhost", port: 6379 } });

export const POST = async (req) => {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, {}, async (err) => {
      if (err) {
        return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      }

      const cookieStore = await cookies(); // ✅ Await cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

      const authHeader = req.headers.get("authorization");
      const token = authHeader?.split(" ")[1];
    
      if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 401 });
      }

      // Get authenticated user from Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      console.log("user", user);
      if (authError || !user) {
        return resolve(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
      }

      const formData = await req.formData();
      const file = formData.get("file");

      if (!file) {
        return resolve(NextResponse.json({ error: "No file uploaded" }, { status: 400 }));
      }

      // Save file locally
      const fileId = randomUUID(); // Generate unique file ID
      const filePath = `uploads/${fileId}-${file.name}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      require("fs").writeFileSync(filePath, buffer);

      // Add job to BullMQ queue
      const job = await logQueue.add("process-log", { fileId, filePath }, { priority: getPriority(file.size) });

      // Store file details in Supabase (log_stats table)
      const { data, error } = await supabase
        .from("log_stats")
        .insert([{ 
          id: fileId, // Unique file ID
          user_id: user.id, // ✅ Store user_id correctly
          file_name: file.name, 
          status: "pending",
          job_id: job.id
        }]);

      if (error) {
        return resolve(NextResponse.json({ error: error.message }, { status: 500 }));
      }

      resolve(NextResponse.json({ jobId: job.id, fileId }, { status: 200 }));
    });
  });
};

// Determine priority based on file size
function getPriority(fileSize) {
  console.log("fileSize", fileSize);
  if (fileSize < 100) return 1;  
  if (fileSize < 500) return 3;  
  if (fileSize < 1000) return 5;  
  return 8;  
}
