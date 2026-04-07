import Redis from 'ioredis'

export const redisClient = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
})

redisClient.on('error', err => {
  console.error('[Redis] Connection error:', err)
})

redisClient.on('connect', () => {
  console.log('[Redis] Connected')
})
