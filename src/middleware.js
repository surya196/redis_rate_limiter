const rateLimiter = require("./rateLimiter");

/**
 * Redis Rate Limiter Middleware
 * @param {Redis} redisClient - ioredis client
 * @param {Number} limit - Max allowed requests
 * @param {Number} duration - Time window in ms
 * @returns Express Middleware
 */
const rateLimiterMiddleware = (redisClient, limit, duration, options) => {
  return async (req, res, next) => {
    const identifier = req.ip || req.headers["x-forwarded-for"] || "anonymous";

    const allowed = await rateLimiter(
      redisClient,
      identifier,
      limit,
      duration,
      options
    );

    if (!allowed) {
      return res.status(429).json({ error: "Too Many Requests" });
    }

    next();
  };
};

module.exports = rateLimiterMiddleware;
