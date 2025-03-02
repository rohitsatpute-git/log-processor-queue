'use client'
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Dashboard() {
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
    <div>
      <h2>Real-Time Log Stats</h2>
    </div>
  );
}
