// routes/article.routes.js
import express from 'express'
import articleController from '../controllers/article.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import commentController from '../controllers/comment.controller.js'
import {
  cacheHeaderCategories,
  cacheMiddleware,
  deleteCacheMiddleware,
} from '../middlewares/cacheMiddleware.js'
import { articleCacheKeyGenerator } from '../utils/cacheKeyGenerator.js'
import viewRenderer from '../utils/viewRenderer.js'
import checkSubscription from '../middlewares/checkSubscription.js'
import articleService from '../services/article.service.js'

const router = express.Router()

router.use(cacheHeaderCategories)

// Root route: /articles

router.get('/', (req, res, next) => {
  res.redirect('/home')
})

router.get(
  '/filter',
  // cacheMiddleware(articleCacheKeyGenerator.filtered),
  articleController.getArticlesByFilter,
)

router.get(
  '/tags/:tagId',
  // cacheMiddleware(articleCacheKeyGenerator.byTag),
  articleController.getArticlesByTagId,
)

router.get(
  '/categories/:categoryId',
  // cacheMiddleware(articleCacheKeyGenerator.byCategory),
  articleController.getArticlesByCategoryId,
)

router.get(
  '/home',
  // cacheMiddleware(articleCacheKeyGenerator.homepage),
  viewRenderer('home', 'main', articleController.getHomepageArticles),
)


router.get(
  '/:id',
  async (req, res, next) => {
    try {
      const articleId = req.params.id
      const article = await articleService.getArticleById(articleId)
      if (article.is_premium) {
        // If the article is premium, validate the user's subscription
        return checkSubscription(req, res, next)
      }
      // Proceed if the article is not premium
      next()
    } catch (error) {
      next(error)
    }
  },
  // cacheMiddleware(articleCacheKeyGenerator.details),
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
