// middlewares/cacheMiddleware.js
import redisClient from '../utils/redisClient.js'

export function cacheMiddleware(cacheKeyGenerator, expiration = 600) {
  return async (req, res, next) => {
    try {
      if (!redisClient.isOpen) {
        console.warn('Redis is unavailable, bypassing cache.')
        return next()
      }

      const cacheKey = `paperly:${cacheKeyGenerator(req)}`
      const cachedData = await redisClient.get(cacheKey)

      if (cachedData) {
        console.log('Cache hit:', cacheKey)
        res.send(cachedData)
      } else {
        console.log('Cache miss:', cacheKey)

        const originalRender = res.render.bind(res)
        res.render = (view, options, callback) => {
          originalRender(view, options, async (err, html) => {
            if (!err) {
              try {
                await redisClient.setEx(cacheKey, expiration, html)
                console.log(`Cached HTML for: ${cacheKey}`)
              } catch (cacheErr) {
                console.error('Redis setEx error:', cacheErr)
              }
            }
            if (callback) callback(err, html)
            else res.send(html)
          })
        }

        next()
      }
    } catch (err) {
      console.error('Cache middleware error:', err)
      next() // Fallback to direct rendering on error
    }
  }
}

export const deleteCacheMiddleware = (cacheKeyGenerator) => {
  return async (req, res, next) => {
    try {
      const cacheKeys = [].concat(cacheKeyGenerator(req)) // Ensure array format

      if (!cacheKeys.every((key) => typeof key === 'string')) {
        throw new Error('Invalid cache key(s) generated.')
      }

      const results = await Promise.all(cacheKeys.map((key) => redisClient.del(key)))

      results.forEach((result, index) => {
        if (result) {
          console.log(`Cache deleted: ${cacheKeys[index]}`)
        } else {
          console.log(`No cache found to delete for: ${cacheKeys[index]}`)
        }
      })

      next()
    } catch (err) {
      console.error('Delete cache middleware error:', err)
      next()
    }
  }
}

export default {
  cacheMiddleware,
  deleteCacheMiddleware,
}
