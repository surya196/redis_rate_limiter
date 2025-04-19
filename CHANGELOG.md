# Changelog

## 1.0.0 - 2025-04-06
### Added
- Initial release of `redis-rate-limiter` NPM package.
- Support for Single Redis Instance.
- Support for Redis Cluster.
- Simple rate limiting logic with sliding window approach.
- Easy Redis Client wrapper class.

### Updated
- Documentation with installation instructions and examples.

---

## 1.1.0 - 2025-04-19
### Added
- Token Bucket algorithm support.
- Configurable refill rate (refillRate option).
- In-memory rate limiting mode (fallback for Redis).
- Middleware support for Express, Fastify, and other Node.js HTTP servers.

### Updated
- `rateLimiter.js` refactored to support both Sliding Window and Token Bucket.
- Detailed README with setup, configuration, and examples for Redis, Redis Cluster, and Memory.
- Comparison with `express-rate-limit` added.
- Detailed information on algorithms used by big tech companies.

### Fixed
- Key expiration and cleanup for memory mode.
- Improved Redis Cluster support.