// routes/editor.routes.js

import express from 'express'
import editorController from '../controllers/editor.controller.js'
import articleController from '../controllers/article.controller.js'
// import authMiddleware from '../middlewares/authMiddleware.js'
import viewRenderer from '../utils/viewRenderer.js'

const router = express.Router()

// Protected Routes for Editors
// router.use(authMiddleware(['editor']))

// @route   GET /api/v1/editor/
// @desc    Get editor's profile
router.get('/', viewRenderer('editor/dashboard', 'editor'))

// @route   GET /api/v1/editor/articles?status=pending
// @desc    Get pending articles for editor's categories
router.get('/articles/', viewRenderer('editor/articles', editorController.getMyArticles))

// @route   GET /api/v1/editor/articles/:articleId
// @desc    Get article by ID
router.get(
  '/articles/:articleId',
  viewRenderer('editor/article-detail', articleController.getArticleById),
)

// @route   PUT /api/v1/editor/articles/:articleId/approve
// @desc    Approve an article
router.put('/articles/:articleId/approve', editorController.approveArticle)

// @route   PUT /api/v1/editor/articles/:articleId/reject
// @desc    Reject an article
router.put('/articles/:articleId/reject', editorController.rejectArticle)

export default router
