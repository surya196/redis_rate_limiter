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
const rateLimiter = require('redis-rate-limiter');
const RedisClient = require('redis-rate-limiter/redisClient');

const redis = new RedisClient({ redisUrl: 'redis://localhost:6379' });

const allowed = await rateLimiter(redis.getClient(), 'user-ip-or-id', 5, 60000);

if (!allowed) {
  console.log('Rate limit exceeded!');
}

## Installation

```bash
npm install redis-rate-limiter