
export async function getStats() {
    const res = await fetch("http://localhost:3001/api/stats", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  }
  