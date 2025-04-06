const Redis = require("ioredis");

class RedisClient {
  constructor(options) {
    if (options.clusterNodes) {
      this.redis = new Redis.Cluster(options.clusterNodes);
      console.log("Using Redis Cluster Mode");
    } else {
      this.redis = new Redis(options.redisUrl || "redis://localhost:6379");
      console.log("Using Single Redis Instance");
    }
  }

  getClient() {
    return this.redis;
  }
}

module.exports = RedisClient;