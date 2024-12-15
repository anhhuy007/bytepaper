// middlewares/cacheMiddleware.js
import redisClient from '../utils/redisClient.js'
import categoryService from '../services/category.service.js'
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

      console.log('Deleting cache:', cacheKeys)

      // Add prefix to cache keys
      cacheKeys.forEach((key, index) => {
        cacheKeys[index] = `paperly:${key}`
      })

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

export const cacheHeaderCategories = async (req, res, next) => {
  try {
    const cacheKey = 'header:categories'
    const cachedCategories = await redisClient.get(cacheKey)

    if (cachedCategories) {
      // Use cached categories
      res.locals.header_categories = JSON.parse(cachedCategories)
      console.log('Cache hit for header categories')
    } else {
      // Fetch categories from the database
      const categories = await categoryService.getRootCategoriesWithChildren()
      res.locals.header_categories = categories

      // Cache the categories
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(categories)) // Cache for 1 hour
      console.log('Cache miss for header categories. Categories fetched and cached.')
    }

    res.locals.user = req.user || null // Pass user data if logged in
    next()
  } catch (error) {
    console.error('Error fetching header categories:', error)
    next(error)
  }
}

export default {
  cacheMiddleware,
  deleteCacheMiddleware,
  cacheHeaderCategories,
}
