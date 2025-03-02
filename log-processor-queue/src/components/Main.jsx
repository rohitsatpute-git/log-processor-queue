'use client';
import { useEffect, useState } from "react";
import io from "socket.io-client";
export default function MainPage({stats}) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:9000", { transports: ["websocket"] });

    socket.on("log-update", (newData) => {
      console.log("Received log update:", newData);
      setLogs((prev) => [newData, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  
  return (
      <div className="w-full">
        {/* Header Row */}
        <div className="grid grid-cols-5 gap-x-4 font-bold border-b pb-2">
          <span>Sr. No.</span>
          <span>Job Id</span>
          <span>File Name</span>
          <span>Status</span>
          <span>Created at</span>
        </div>

        {/* Data Rows */}
        {stats && stats.map((job, index) => (
          <div key={index} className="grid grid-cols-5 gap-x-4 py-2 border-b">
            <span>{index + 1}</span>
            <span>{job.job_id}</span>
            <span>{job.file_name}</span>
            <span>{job.status}</span>
            <span>{new Date(job.created_at).toLocaleString('en-US', {hour12: true})}</span>
          </div>
        ))}

        {logs && logs.map((log, index) => (
          <div key={index} className="grid grid-cols-5 gap-x-4 py-2 border-b">
            <span>{index + 1}</span>
            <span>{log.job_id}</span>
            <span>{log.file_name}</span>
            <span>{log.status}</span>
            <span>{new Date(log.created_at).toLocaleString('en-US', {hour12: true})}</span>
          </div>
        ))}

      </div>

  );
  }
  