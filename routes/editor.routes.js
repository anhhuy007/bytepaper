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

router.get('/dashboard', editorController.getDashboard)

router.get('/articles/', editorController.getArticles)

router.get('/articles/:articleId', articleController.getArticleById)

router.post('/articles/:articleId/approve', editorController.approveArticle)

router.post('/articles/:articleId/reject', editorController.rejectArticle)

router.post('/articles/:articleId/publish', editorController.publishArticle)

router.post('/articles/:articleId/unpublish', editorController.unpublishArticle)

router.post('/articles/:articleId/tags/add', editorController.addTag)

router.post('/articles/:articleId/tags/remove', editorController.removeTag)

export default router
