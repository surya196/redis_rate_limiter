const slidingWindow = require("./slidingWindow");
const tokenBucket = require("./tokenBucket");
const { memorySlidingWindow, memoryTokenBucket } = require("./memoryStore");

async function rateLimiter(redisClient, key, limit, windowMs, options = {}) {
  const algo = options.algo || "sliding";
  const mode = options.mode || "redis";
  const refillRate = options.refillRate || (windowMs / limit);

  if (mode === "memory") {
    return algo === "token-bucket"
      ? memoryTokenBucket(key, limit, refillRate)
      : memorySlidingWindow(key, limit, windowMs);
  }

  return algo === "token-bucket"
    ? await tokenBucket(redisClient, key, limit, windowMs)
    : await slidingWindow(redisClient, key, limit, windowMs);
}

module.exports = rateLimiter;
