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

// User Management

router.get(
  '/dashboard',
  cacheMiddleware(adminCacheKeyGenerator.adminDashboard),
  adminController.getDashboard,
)

router.get('/users', cacheMiddleware(adminCacheKeyGenerator.userList), adminController.getAllUsers)

router.get(
  '/users/add',
  deleteCacheMiddleware(adminCacheKeyGenerator.addUser),
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

router.get('/categories', adminController.getAllCategories)

router.get('/categories/add', adminController.getAddCategory)

router.post('/categories/add', adminController.createCategory)

router.get('/categories/edit/:categoryId', adminController.getEditCategory)

router.post('/categories/edit/:categoryId', adminController.updateCategory)

router.post('/categories/delete/:categoryId', adminController.deleteCategory)

// Tag Management

router.get('/tags', tagController.getAllTags)

router.post('/tags/save', tagController.createOrUpdateTag)

router.post('/tags/delete/:tagId', tagController.deleteTag)

// Article Management

router.get('/articles', adminController.getAllArticles)

router.post('/articles/status/:articleId', adminController.updateArticleStatus)

// Editor Management

router.get('/editors', adminController.getEditors)
router.get('/editors/:editorId/categories', adminController.getEditorCategories)
router.post('/editors/:editorId/categories/assign', adminController.assignCategory)
router.post('/editors/:editorId/categories/unassign', adminController.unassignCategory)

export default router
