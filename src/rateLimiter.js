/**
 * Rate limiter using Sliding Window Log algorithm.
 * @param {Object} redisClient - The Redis client instance.
 * @param {string} key - Unique identifier for the client (IP, user ID, etc.).
 * @param {number} limit - Max number of allowed requests.
 * @param {number} windowMs - Time window in milliseconds.
 * @returns {boolean} - True if request is allowed, false if rate-limited.
 */

async function rateLimiter(redisClient, key, limit, windowMs) {
  const now = Date.now();

  const pipeline = redisClient.pipeline();
  pipeline.zremrangebyscore(key, 0, now - windowMs);
  pipeline.zadd(key, now, now);
  pipeline.expire(key, Math.ceil(windowMs / 1000));
  pipeline.zcard(key);

  const [, , , requestCount] = await pipeline.exec();
  return requestCount[1] <= limit;
}

module.exports = rateLimiter;
