// routes/writer.routes.js

import express from 'express'
import writerController from '../controllers/writer.controller.js'
import articleController from '../controllers/article.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import upload from '../middlewares/upload.js'
const router = express.Router()

// Protected Routes for Writers
router.use(authMiddleware(['writer']))

router.get('/', (req, res) => {
  res.redirect('/writer/articles')
})

router.get('/articles', writerController.getDashboard)
router.get('/articles/create', writerController.getCreateArticle)
router.post('/articles/create', upload.single('thumbnail'), writerController.createArticle)

router.get('/articles/edit/:articleId', writerController.getEditArticle)
router.post('/articles/edit/:articleId', writerController.updateArticle)

router.get('/articles/rejected', writerController.getRejectedArticles)

export default router
