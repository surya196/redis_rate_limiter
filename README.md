# redis-rate-limiter

A simple, flexible, and production-ready Redis-based rate limiter supporting:
- Single Redis Instance
- Redis Cluster

---

## Features
- Dynamic Redis support (single & cluster)
- Configurable limits
- Lightweight, no framework dependency
- Works with any Node.js HTTP server (Express, Fastify, Native HTTP, etc.)

---

## Usage

> Simple example using `redis-rate-limiter` with a Redis instance.

```js
const rateLimiter = require('redis-rate-limiter');
const RedisClient = require('redis-rate-limiter/redisClient');

const redis = new RedisClient({
  redisUrl: 'redis://localhost:6379',
});

async function handleRequest(ipAddress) {
  const allowed = await rateLimiter(redis.getClient(), ipAddress, 5, 60000); // 5 requests per 1 minute

  if (!allowed) {
    console.log('Too Many Requests - Rate limit exceeded');
    return;
  }

  console.log('Request Allowed');
}

// Example usage
handleRequest('192.168.0.1');

## Usage as Middleware (Express Example)

```js
const express = require('express');
const rateLimiterMiddleware = require('redis-simple-rate-limiter/middleware');
const RedisClient = require('redis-simple-rate-limiter/redisClient');

const app = express();
const redis = new RedisClient({ redisUrl: 'redis://localhost:6379' });

app.use(rateLimiterMiddleware(redis.getClient(), 5, 60000)); // 5 reqs / minute

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => console.log('Server running...'));
```

## Installation

```bash
npm install redis-rate-limiter