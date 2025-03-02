import { NextResponse } from "next/server";
import LRU from "lru-cache";

// ⚡ Configure Rate Limiting (e.g., 10 requests per minute)
const rateLimiter = new LRU({
  max: 10, // Allow max 10 requests
  ttl: 60 * 1000, // Reset every 60 seconds
});

// 🚀 Middleware to apply rate limiting on all API routes
export function middleware(req) {
  // Get client IP (for Vercel or local development)
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";

  const requestCount = rateLimiter.get(ip) || 0;

  if (requestCount >= 10) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  rateLimiter.set(ip, requestCount + 1);
  return NextResponse.next(); // Continue to the API route
}

// ✅ Apply Middleware to API Routes Only
export const config = {
  matcher: "/api/:path*", // Matches all API routes
};
