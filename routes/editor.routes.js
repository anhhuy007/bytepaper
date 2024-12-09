// routes/editor.routes.js

import express from 'express'
import editorController from '../controllers/editor.controller.js'
import articleController from '../controllers/article.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import viewRenderer from '../utils/viewRenderer.js'

const router = express.Router()

router.use(authMiddleware(['editor']))

router.get('/', (req, res) => {
  res.redirect('/editor/dashboard')
})

router.get('/dashboard', editorController.renderDashboard)

router.get('/articles/', editorController.getMyArticles)

router.get(
  '/articles/:articleId',
  viewRenderer('editor/article-detail', articleController.getArticleById),
)

router.put('/articles/:articleId/approve', editorController.approveArticle)

router.put('/articles/:articleId/reject', editorController.rejectArticle)

export default router
