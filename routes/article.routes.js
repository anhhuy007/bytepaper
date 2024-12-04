// routes/article.routes.js
import express from 'express'
import articleController from '../controllers/article.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import checkSubscription from '../middlewares/checkSubscription.js'
import cacheMiddleware from '../middlewares/cacheMiddleware.js'
import cacheKeyGenerator from '../utils/cacheKeyGenerator.js'
import viewRenderer from '../utils/viewRenderer.js'

const router = express.Router()

// @route   GET /api/v1/articles
// @desc    Get all published articles
router.get('/', articleController.getAllArticles)

// @route   GET /api/v1/articles/home
// @desc    Fetch homepage articles (featured, most-viewed, newest, top-categories)
router.get('/home', viewRenderer('home', articleController.getHomepageArticles))

// @route   GET /api/v1/articles/search?q=<query>
// @desc    Search articles
router.get('/search', articleController.searchArticles)

router.get('/filter?', articleController.getFilteredArticles)

// @route   GET /api/v1/articles/:id
// @desc    Get article by ID
router.get('/:id', articleController.getArticleById)

// @route   GET /api/v1/articles/:id/download
// @desc    Download article PDF (Protected for subscribers)
router.get(
  '/:id/download',
  authMiddleware(['subscriber']),
  checkSubscription,
  articleController.downloadArticle,
)

// @route   POST /api/v1/articles/:id/views
// @desc    Increase article view count
router.post('/:id/views', articleController.increaseArticleViewCount)

export default router
