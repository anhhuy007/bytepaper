// utils/redisClient.js
import { createClient } from 'redis'
import { config } from 'dotenv'
config()

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500), // Retry logic
  },
})

redisClient.on('connect', () => console.log('Redis connected successfully'))
redisClient.on('ready', () => console.log('Redis ready to use'))
redisClient.on('error', (err) => console.error('Redis Error:', err))
redisClient.on('end', () => console.log('Redis connection closed'))

const connectRedis = async () => {
  try {
    await redisClient.connect()
    console.log(`Connected to Redis at ${redisClient.options.url}`)
  } catch (err) {
    console.error('Failed to connect to Redis:', err)
    process.exit(1) // Exit process if Redis connection fails
  }
}

connectRedis()

export default redisClient
