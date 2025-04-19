# redis-simple-rate-limiter
This package is designed to go beyond basic rate-limiting. While other package is great for quick Express apps, `redis-simple-rate-limiter` is built for real-world scale, distributed environments, and framework independence.


## Features
A lightweight, production-ready rate limiter for Node.js supporting:
-  Sliding Window Log algorithm
-  Token Bucket algorithm
-  Redis (single instance & cluster)
-  In-memory fallback (Map-based)
-  Middleware support (works with Express, Fastify, etc.)
-  Built with scalability and flexibility in mind. Zero external dependencies (except ioredis).


## Installation
```bash
npm install redis-simple-rate-limiter
```


## Quick Usage
```js
// ---- Redis (Single Instance) ----
const RedisClient = require('redis-simple-rate-limiter/redisClient');
const rateLimiter = require('redis-simple-rate-limiter');

const redis = new RedisClient({ redisUrl: 'redis://localhost:6379' });

const allowed = await rateLimiter(redis.getClient(), 'user-id', 5, 60000);
// → Allow max 5 requests per 60 seconds
if (!allowed) {
    console.log('Too Many Requests - Rate limit exceeded');
    return;
  }

// ---- Redis (Cluster Mode) ----
const RedisClient = require('redis-simple-rate-limiter/redisClient');
const rateLimiter = require('redis-simple-rate-limiter');

const redis = new RedisClient({
  clusterNodes: [
    { host: '127.0.0.1', port: 7000 },
    { host: '127.0.0.1', port: 7001 },
  ],
});

const allowed = await rateLimiter(redis.getClient(), 'user-id', 10, 0, {
  algo: 'token-bucket',
  refillRate: 3000, // 1 token every 3 seconds
  mode: 'redis',
});

if (!allowed) {
    console.log('Too Many Requests - Rate limit exceeded');
    return;
  }


// ---- In-Memory (No Redis Required) ----
const rateLimiter = require('redis-simple-rate-limiter');

const allowed = await rateLimiter(null, 'user-ip', 5, 60000, {
  algo: 'sliding',
  mode: 'memory',
});

if (!allowed) {
    console.log('Too Many Requests - Rate limit exceeded');
    return;
  }

//  ----  Middleware Support (Express Compatible) ----
const middleware = require('redis-simple-rate-limiter/middleware');
const RedisClient = require('redis-simple-rate-limiter/redisClient');

const redis = new RedisClient({ redisUrl: 'redis://localhost:6379' });

app.use(
  middleware(redis.getClient(), 5, 60000, {
    algo: 'token-bucket',
    refillRate: 2000,
    mode: 'redis',
  })
);
```


## Options
- Option	Type	Default	Description
- algo	string	"sliding" or "token-bucket"
- mode	string	"redis" or "memory"
- refillRate	number	windowMs/limit	Only for Token Bucket — 1 token every X ms


## Comparison with express-rate-limit
| Feature                     | express-rate-limit            | redis-simple-rate-limiter              |
|-----------------------------|-------------------------------|----------------------------------------|
| Express-only                | ✅ Yes                         | ❌ No (framework-agnostic)             |
| In-memory support           | ✅ Yes                         | ✅ Yes                                 |
| Redis support (single)      | Optional with adapter          | ✅ Built-in                            |
| Redis Cluster support       | ❌ No                          | ✅ Yes                                 |
| Sliding Window algorithm    | ❌ No                          | ✅ Yes                                 |
| Token Bucket algorithm      | ❌ No                          | ✅ Yes                                 |
| Custom refill rate control  | ❌ No                          | ✅ Yes (`refillRate` option)           |
| Works with Fastify/Native   | ❌ Express-only                | ✅ Yes (any Node.js server)            |
| Works as Middleware         | ✅ Yes                         | ✅ Yes (via `middleware.js`)           |
| Configurable algorithm/mode | ❌ Minimal options             | ✅ Fully configurable (`algo`, `mode`) |
| Lightweight & flexible      | ⚠️ Tightly coupled to Express  | ✅ Modular, scalable design 


## What Big Tech Uses
| Company    | Algorithm      | Purpose                              |
|------------|----------------|--------------------------------------|
| Cloudflare | Token Bucket   | Firewall & edge worker throttling    |
| Stripe     | GCRA (Leaky)   | Precision API burst limiting         |
| GitHub     | Sliding Window | REST API hourly rate limits          |
| AWS        | Token Bucket   | API Gateway, service quotas          |
| NGINX      | Leaky / GCRA   | Built‑in limiter module              |


## Algorithm Summary
- Sliding Window Log
  - Tracks all request timestamps in a time window
  - Fair over time
  - Slightly more memory-heavy

- Token Bucket
  - Allows burst traffic
  - Refill tokens over time
  - More forgiving for uneven loads


## Why Use This?
- Works without Express
- Redis Cluster support
- Token Bucket & Sliding Window
- In-memory fallback
- Framework-agnostic
- Configurable
- Clean, lightweight, tested


## License
MIT