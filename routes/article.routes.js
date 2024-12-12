// routes/article.routes.js
import express from 'express'
import articleController from '../controllers/article.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import checkSubscription from '../middlewares/checkSubscription.js'
import commentController from '../controllers/comment.controller.js'
import { cacheMiddleware, deleteCacheMiddleware } from '../middlewares/cacheMiddleware.js'
import { articleCacheKeyGenerator } from '../utils/cacheKeyGenerator.js'
import categoryService from '../services/category.service.js'
import viewRenderer from '../utils/viewRenderer.js'

const router = express.Router()

router.use(async (req, res, next) => {
  try {
    const categories = await categoryService.getRootCategoriesWithChildren() // Fetch categories
    res.locals.header_categories = categories // Pass categories to all views
    res.locals.user = req.user || null // Pass user data if logged in
    next()
  } catch (error) {
    next(error)
  }
})

// Root route: /articles

router.get('/', (req, res, next) => {
  res.redirect('/home')
})

router.get(
  '/filter',
  cacheMiddleware(articleCacheKeyGenerator.filtered),
  articleController.getArticlesByFilter,
)

router.get(
  '/tags/:tagId',
  cacheMiddleware(articleCacheKeyGenerator.byTag),
  articleController.getArticlesByTagId,
)

router.get(
  '/categories/:categoryId',
  cacheMiddleware(articleCacheKeyGenerator.byCategory),
  articleController.getArticlesByCategoryId,
)

router.get(
  '/home',
  cacheMiddleware(articleCacheKeyGenerator.homepage),
  viewRenderer('home', 'main', articleController.getHomepageArticles),
)

// router.get(
//   '/download/:id',
//   // authMiddleware(['subscriber']),
//   // checkSubscription,
//   articleController.downloadArticle,
// )

router.get(
  '/:id',
  cacheMiddleware(articleCacheKeyGenerator.details),
  articleController.getArticleById,
)

router.post('/:id/views', articleController.increaseArticleViewCount)

router.post(
  '/:articleId/comments',
  authMiddleware(),
  deleteCacheMiddleware((req) => [articleCacheKeyGenerator.details(req)]),
  commentController.addCommentToArticle,
)

export default router
