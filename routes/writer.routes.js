// routes/writer.routes.js

import express from 'express'
import writerController from '../controllers/writer.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import upload from '../middlewares/upload.js'
import { writerCacheKeyGenerator } from '../utils/cacheKeyGenerator.js'
import { cacheMiddleware, deleteCacheMiddleware } from '../middlewares/cacheMiddleware.js'
const router = express.Router()

// Protected Routes for Writers
router.use(authMiddleware(['writer']))

router.get('/', (req, res) => {
  res.redirect('/writer/articles')
})

router.get('/dashboard', (req, res) => {
  res.redirect('/writer/articles')
})

router.get(
  '/articles',
  cacheMiddleware(writerCacheKeyGenerator.dashboard),
  writerController.getDashboard,
)

router.get(
  '/articles/create',
  cacheMiddleware(writerCacheKeyGenerator.createArticle),
  writerController.getCreateArticle,
)

router.post(
  '/articles/create',
  deleteCacheMiddleware(writerCacheKeyGenerator.dashboard),
  upload.single('thumbnail'),
  writerController.createArticle,
)

router.get(
  '/articles/edit/:articleId',
  cacheMiddleware(writerCacheKeyGenerator.editArticle),
  writerController.getEditArticle,
)
router.post(
  '/articles/edit/:articleId',
  deleteCacheMiddleware((req) => [
    writerCacheKeyGenerator.dashboard(req),
    writerCacheKeyGenerator.editArticle(req),
  ]),
  writerController.updateArticle,
)

router.get(
  '/articles/:articleId/rejections',
  cacheMiddleware(writerCacheKeyGenerator.articleRejections),
  writerController.getArticleRejections,
)

export default router
