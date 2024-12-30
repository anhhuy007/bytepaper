// routes/admin.routes.js
import express from 'express'
import adminController from '../controllers/admin.controller.js'
import tagController from '../controllers/tag.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import { cacheMiddleware, deleteCacheMiddleware } from '../middlewares/cacheMiddleware.js'
import { adminCacheKeyGenerator } from '../utils/cacheKeyGenerator.js'
const router = express.Router()

// Protected Routes for Admins
router.use(authMiddleware(['admin']))

router.get('/', (req, res) => {
  res.redirect('/admin/dashboard')
})

// User Management

router.get(
  '/dashboard',
  cacheMiddleware(adminCacheKeyGenerator.adminDashboard),
  adminController.getDashboard,
)

router.get('/users', cacheMiddleware(adminCacheKeyGenerator.userList), adminController.getAllUsers)

router.get(
  '/users/add',
  cacheMiddleware(adminCacheKeyGenerator.addUser),
  adminController.getAddUser,
)

router.get(
  '/users/edit/:userId',
  cacheMiddleware(adminCacheKeyGenerator.userDetails),
  adminController.getUserById,
)

router.post(
  '/users/add',
  deleteCacheMiddleware(adminCacheKeyGenerator.userList),
  adminController.createUser,
)

router.post(
  '/users/edit/:userId',
  deleteCacheMiddleware((req) => [
    adminCacheKeyGenerator.userDetails(req),
    adminCacheKeyGenerator.userList(req),
  ]),
  adminController.assignUserRole,
)

router.post(
  '/users/delete/:userId',
  deleteCacheMiddleware((req) => [
    adminCacheKeyGenerator.userDetails(req),
    adminCacheKeyGenerator.userList(req),
  ]),
  adminController.deleteUser,
)

// Category Management

router.get(
  '/categories',
  cacheMiddleware(adminCacheKeyGenerator.categoryList),
  adminController.getAllCategories,
)

router.get(
  '/categories/add',
  cacheMiddleware(adminCacheKeyGenerator.addCategoryPage),
  adminController.getAddCategory,
)

router.post(
  '/categories/add',
  deleteCacheMiddleware(adminCacheKeyGenerator.categoryList),
  adminController.createCategory,
)

router.get(
  '/categories/edit/:categoryId',
  cacheMiddleware(adminCacheKeyGenerator.editCategoryPage),
  adminController.getEditCategory,
)

router.post(
  '/categories/edit/:categoryId',
  deleteCacheMiddleware((req) => [
    adminCacheKeyGenerator.categoryDetails(req),
    adminCacheKeyGenerator.categoryList(req),
  ]),
  adminController.updateCategory,
)

router.post(
  '/categories/delete/:categoryId',
  deleteCacheMiddleware((req) => [
    adminCacheKeyGenerator.categoryDetails(req),
    adminCacheKeyGenerator.categoryList(req),
  ]),
  adminController.deleteCategory,
)

// Tag Management

router.get('/tags', cacheMiddleware(adminCacheKeyGenerator.tagList), tagController.getAllTags)

router.post(
  '/tags/save',
  deleteCacheMiddleware(adminCacheKeyGenerator.tagList),
  tagController.createOrUpdateTag,
)

router.post(
  '/tags/delete/:tagId',
  deleteCacheMiddleware(adminCacheKeyGenerator.tagList),
  tagController.deleteTag,
)

// Article Management

router.get(
  '/articles',
  // cacheMiddleware(adminCacheKeyGenerator.articleList),
  adminController.getAllArticles,
)

router.post(
  '/articles/status/:articleId',
  deleteCacheMiddleware(adminCacheKeyGenerator.articleList),
  adminController.updateArticleStatus,
)

// Editor Management

router.get(
  '/editors',
  cacheMiddleware(adminCacheKeyGenerator.editorList),
  adminController.getEditors,
)

router.get(
  '/editors/:editorId/categories',
  cacheMiddleware(adminCacheKeyGenerator.editorCategories),
  adminController.getEditorCategories,
)

router.post(
  '/editors/:editorId/categories/assign',
  deleteCacheMiddleware((req) => [
    adminCacheKeyGenerator.editorCategories(req),
    adminCacheKeyGenerator.editorList(req),
  ]),
  adminController.assignCategory,
)

router.post(
  '/editors/:editorId/categories/unassign',
  deleteCacheMiddleware((req) => [
    adminCacheKeyGenerator.editorCategories(req),
    adminCacheKeyGenerator.editorList(req),
  ]),
  adminController.unassignCategory,
)

export default router
