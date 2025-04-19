/**
 * Token Bucket algorithm using Redis
 */
async function tokenBucket(redis, key, capacity, refillRateMs) {
  const now = Date.now();
  const bucketKey = `bucket:${key}`;

  const [bucketData] = await redis
    .pipeline()
    .hgetall(bucketKey)
    .expire(bucketKey, Math.ceil(refillRateMs / 1000) * 2)
    .exec();

  const data = bucketData[1] || {};
  let tokens = data.tokens !== undefined ? parseInt(data.tokens) : capacity;
  const lastRefill =
    data.lastRefill !== undefined ? parseInt(data.lastRefill) : now;

  const timePassed = now - lastRefill;
  const tokensToAdd = Math.floor(timePassed / refillRateMs);

  if (tokensToAdd > 0) {
    tokens = Math.min(capacity, tokens + tokensToAdd);
  }

  if (tokens <= 0) {
    await redis.hmset(bucketKey, {
      tokens,
      lastRefill: tokensToAdd > 0 ? now : lastRefill,
    });
    return false;
  }

  tokens -= 1;

  await redis.hmset(bucketKey, {
    tokens,
    lastRefill: tokensToAdd > 0 ? now : lastRefill,
  });

  return true;
}

module.exports = tokenBucket;
