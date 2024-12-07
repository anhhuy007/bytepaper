// routes/article.routes.js
import express from 'express'
import articleController from '../controllers/article.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import checkSubscription from '../middlewares/checkSubscription.js'
import commentController from '../controllers/comment.controller.js'
import cacheMiddleware from '../middlewares/cacheMiddleware.js'
import cacheKeyGenerator from '../utils/cacheKeyGenerator.js'
import viewRenderer from '../utils/viewRenderer.js'

const router = express.Router()

router.get('/', (req, res, next) => {
  res.redirect('/home')
})

router.get('/filter?', articleController.getArticlesByFilter)

router.get('/tags/:tagId', articleController.getArticlesByTagId)

router.get('/categories/:categoryId', articleController.getArticlesByCategoryId)

router.get('/home', viewRenderer('home', 'main', articleController.getHomepageArticles))

router.get('/:id', articleController.getArticleById)

router.get(
  '/:id/download',
  authMiddleware(['subscriber']),
  checkSubscription,
  articleController.downloadArticle,
)

router.post('/:id/views', articleController.increaseArticleViewCount)

router.post('/:articleId/comments', authMiddleware(), commentController.addCommentToArticle)

export default router
