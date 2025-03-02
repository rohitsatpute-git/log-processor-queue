'use server';

import { getStats } from "@/lib/utils"; // ✅ Import server-side function

export async function fetchStats() {
  return await getStats(); // ✅ Server-side function stays on the server
}
