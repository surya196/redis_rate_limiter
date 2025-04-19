const memory = new Map();

function now() {
  return Date.now();
}
const EXPIRY_MS = 2 * 60 * 1000; // 5 mins TTL for inactive keys

// Auto cleanup every 5 mins
setInterval(() => {
  const currentTime = now();
  for (const [key, entry] of memory.entries()) {
    if (currentTime - entry.lastAccessed > EXPIRY_MS) {
      memory.delete(key);
    }
  }
}, EXPIRY_MS);

// Sliding Window
function memorySlidingWindow(key, limit, windowMs) {
  const currentTime = now();
  const entry = memory.get(key) || { logs: [], lastAccessed: currentTime };
  const validLogs = entry.logs.filter((ts) => ts > currentTime - windowMs);

  if (validLogs.length >= limit) return false;

  validLogs.push(currentTime);
  memory.set(key, { logs: validLogs, lastAccessed: currentTime });
  return true;
}

function memoryTokenBucket(key, capacity, refillMs) {
  const currentTime = now();

  // The bucket starts full  tokens
  const entry = memory.get(key) || {
    tokens: capacity,
    lastRefill: currentTime,
    lastAccessed: currentTime,
  };

  // It calculates how much time has passed since lastRefill
  const timePassed = currentTime - entry.lastRefill;
  // It refills tokens based on elapsed time.
  const tokensToAdd = Math.floor(timePassed / refillMs);
  // It allows the request only if at least 1 token is available
  if (tokensToAdd > 0) {
    entry.tokens = Math.min(capacity, entry.tokens + tokensToAdd);
    entry.lastRefill = currentTime;
  }

  // Deny if no tokens
  if (entry.tokens <= 0) {
    entry.lastAccessed = currentTime;
    memory.set(key, entry);
    return false;
  }

  // Consume 1 token
  entry.tokens -= 1;
  entry.lastAccessed = currentTime;
  memory.set(key, entry);

  return true;
}

module.exports = {
  memorySlidingWindow,
  memoryTokenBucket,
};
