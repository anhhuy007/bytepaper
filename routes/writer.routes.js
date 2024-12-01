// routes/writerRoutes.js

import express from 'express'
import writerController from '../controllers/writer.controller.js'
import articleController from '../controllers/article.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import viewRenderer from '../utils/viewRenderer.js'

const router = express.Router()

// Protected Routes for Writers
router.use(authMiddleware(['writer']))

// @route   GET /api/v1/writer/
// @desc    Get writer's profile

router.get('/', viewRenderer('writer/dashboard', writerController.getMyArticles))

// @route   GET /api/v1/writer/articles?status=(draft|pending|approved|rejected|published)
// @desc    Get all articles by writer
router.get('/articles', viewRenderer('writer/writer-articles'))

// @route   POST /api/v1/writer/articles
// @desc    Create a new article
router.post('/articles', writerController.createArticle)

// @route   GET /api/v1/writer/articles/:articleId
// @desc    Get an article by ID

router.get('/articles/:articleId', viewRenderer('writer/article', articleController.getArticleById))

// @route   PUT /api/v1/writer/articles/:articleId
// @desc    Update an article
router.put('/articles/:articleId', writerController.updateArticle)

// @route   DELETE /api/v1/writer/articles/:articleId
// @desc    Delete an article
router.delete('/articles/:articleId', writerController.deleteArticle)

// @route   PUT /api/v1/writer/articles/:articleId/submit
// @desc    Submit article for approval
router.put('/articles/:articleId/submit', writerController.submitArticleForApproval)

export default router
