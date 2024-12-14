// routes/article.routes.js
import express from 'express'
import articleController from '../controllers/article.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import checkSubscription from '../middlewares/checkSubscription.js'
import commentController from '../controllers/comment.controller.js'
import { cacheMiddleware, deleteCacheMiddleware } from '../middlewares/cacheMiddleware.js'
import { articleCacheKeyGenerator } from '../utils/cacheKeyGenerator.js'
import viewRenderer from '../utils/viewRenderer.js'

const router = express.Router()

router.get('/', (req, res, next) => {
  res.redirect('/home')
})

router.get(
  '/filter?',
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

router.get(
  '/:id',
  // cacheMiddleware(articleCacheKeyGenerator.details),
  articleController.getArticleById,
)

router.get(
  '/:id/download',
  authMiddleware(['subscriber']),
  checkSubscription,
  articleController.downloadArticle,
)

router.post('/:id/views', articleController.increaseArticleViewCount)

router.post(
  '/:articleId/comments',
  authMiddleware(),
  deleteCacheMiddleware((req) => [articleCacheKeyGenerator.details(req)]),
  commentController.addCommentToArticle,
)

export default router
