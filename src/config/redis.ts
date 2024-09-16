import { logger } from '@/utils/logger';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST, // Default Redis host (localhost)
  port: parseInt(process.env.REDIS_PORT || '6379', 10), // Default Redis port
  password: process.env.REDIS_PASSWORD, // Optional: Redis password if authentication is required
  db: 0,
});

redis.on('connect', () => {
  logger.info(`🔥 Connected to Redis on port ${process.env.REDIS_PORT}`);
});

redis.on('error', err => {
  console.error('❌ Redis Error:', err);
});

export default redis;
