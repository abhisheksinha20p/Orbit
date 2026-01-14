const redis = require('redis');
const logger = require('../utils/logger');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD || undefined
});

client.on('error', (err) => logger.error('Redis Client Error', err));
client.on('connect', () => logger.info('Redis connected'));

(async () => {
  await client.connect();
})();

module.exports = client;
