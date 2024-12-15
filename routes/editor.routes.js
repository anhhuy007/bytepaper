// routes/editor.routes.js

import express from 'express'
import editorController from '../controllers/editor.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import { editorCacheKeyGenerator } from '../utils/cacheKeyGenerator.js'
import { cacheMiddleware, deleteCacheMiddleware } from '../middlewares/cacheMiddleware.js'

const router = express.Router()

router.use(authMiddleware(['editor']))

router.get('/', (req, res) => {
  res.redirect('/editor/dashboard')
})

router.get(
  '/dashboard',
  cacheMiddleware(editorCacheKeyGenerator.dashboard),
  editorController.getDashboard,
)

router.get(
  '/articles',
  cacheMiddleware(editorCacheKeyGenerator.articles),
  editorController.getArticles,
)

router.get(
  '/articles/:articleId',
  cacheMiddleware(editorCacheKeyGenerator.articleDetails),
  editorController.getArticleById,
)

router.get(
  '/articles/:articleId/approve',
  deleteCacheMiddleware(editorCacheKeyGenerator.approveForm),
  editorController.getApproveArticle,
)

router.get(
  '/articles/:articleId/reject',
  cacheMiddleware(editorCacheKeyGenerator.rejectForm),
  editorController.getRejectArticle,
)

router.post(
  '/articles/:articleId/approve',
  deleteCacheMiddleware((req) => [
    editorCacheKeyGenerator.dashboard(req),
    editorCacheKeyGenerator.articles(req),
    editorCacheKeyGenerator.articleDetails(req),
  ]),
  editorController.approveArticle,
)

router.post(
  '/articles/:articleId/reject',
  deleteCacheMiddleware((req) => [
    editorCacheKeyGenerator.dashboard(req),
    editorCacheKeyGenerator.articles(req),
    editorCacheKeyGenerator.articleDetails(req),
  ]),
  editorController.rejectArticle,
)

router.post(
  '/articles/:articleId/publish',
  deleteCacheMiddleware((req) => [
    editorCacheKeyGenerator.dashboard(req),
    editorCacheKeyGenerator.articles(req),
    editorCacheKeyGenerator.articleDetails(req),
  ]),
  editorController.publishArticle,
)

router.post(
  '/articles/:articleId/unpublish',
  deleteCacheMiddleware((req) => [
    editorCacheKeyGenerator.dashboard(req),
    editorCacheKeyGenerator.articles(req),
    editorCacheKeyGenerator.articleDetails(req),
  ]),
  editorController.unpublishArticle,
)

export default router
