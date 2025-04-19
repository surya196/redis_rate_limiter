/**
 * Sliding Window Log algorithm using Redis.
 * @param {Object} redisClient - The Redis client instance.
 * @param {string} key - Unique identifier (IP, user ID, etc.)
 * @param {number} limit - Max number of allowed requests
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<boolean>} - True if request allowed, else false
 */
async function slidingWindow(redisClient, key, limit, windowMs) {
  const now = Date.now();

  const pipeline = redisClient.pipeline();
  pipeline.zremrangebyscore(key, 0, now - windowMs); // Remove old entries
  pipeline.zadd(key, now, now); // Add current request
  pipeline.expire(key, Math.ceil(windowMs / 1000)); // Set key expiry
  pipeline.zcard(key); // Get count of current requests

  const [, , , requestCount] = await pipeline.exec();
  return requestCount[1] <= limit;
}

module.exports = slidingWindow;
