// Simple in-memory rate limiter (resets on cold start, good enough for serverless)
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number = 20,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = hits.get(key);

  if (!record || now > record.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  record.count++;
  const remaining = Math.max(0, limit - record.count);
  return { allowed: record.count <= limit, remaining };
}
