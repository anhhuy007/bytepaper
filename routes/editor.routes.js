// routes/editor.routes.js

import express from 'express'
import editorController from '../controllers/editor.controller.js'
import articleController from '../controllers/article.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware(['editor']))

router.get('/', (req, res) => {
  res.redirect('/editor/dashboard')
})

router.get('/dashboard', editorController.getDashboard)

router.get('/articles', editorController.getArticles)

router.get('/articles/:articleId', editorController.getArticleById)

router.get('/articles/:articleId/approve', editorController.getApproveArticle)

router.post('/articles/:articleId/approve', editorController.approveArticle)

router.get('/articles/:articleId/reject', editorController.getRejectArticle)

router.post('/articles/:articleId/reject', editorController.rejectArticle)

router.post('/articles/:articleId/publish', editorController.publishArticle)

router.post('/articles/:articleId/unpublish', editorController.unpublishArticle)



export default router
