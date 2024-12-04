// routes/article.routes.js
import express from 'express'
import articleController from '../controllers/article.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import checkSubscription from '../middlewares/checkSubscription.js'
import cacheMiddleware from '../middlewares/cacheMiddleware.js'
import cacheKeyGenerator from '../utils/cacheKeyGenerator.js'
import viewRenderer from '../utils/viewRenderer.js'

const router = express.Router()

router.get('/filter?', articleController.handleArticles)

router.get('/home', viewRenderer('home', articleController.getHomepageArticles))

router.get('/:id', articleController.getArticleById)

router.get(
  '/:id/download',
  authMiddleware(['subscriber']),
  checkSubscription,
  articleController.downloadArticle,
)

router.post('/:id/views', articleController.increaseArticleViewCount)

export default router
