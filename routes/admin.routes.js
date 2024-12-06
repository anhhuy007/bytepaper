// routes/admin.routes.js
import express from 'express'
import adminController from '../controllers/admin.controller.js'
import tagController from '../controllers/tag.controller.js'
import categoryController from '../controllers/category.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import viewRenderer from '../utils/viewRenderer.js'

const router = express.Router()

// Protected Routes for Admins
router.use(authMiddleware(['admin']))

// User Management

router.get('/dashboard', adminController.getDashboard)

router.get('/users', adminController.getAllUsers)

router.get('/users/add', adminController.getAddUser)

router.post('/users/add', adminController.createUser)

router.get('/users/edit/:userId', adminController.getUserById)

router.post('/users/edit/:userId', adminController.assignUserRole)

router.post('/users/delete/:userId', adminController.deleteUser)

// Category Management

router.get('/categories', adminController.getAllCategories)

router.get('/categories/add', adminController.getAddCategory)

router.post('/categories/add', adminController.createCategory)

router.get('/categories/edit/:categoryId', adminController.getEditCategory)

router.post('/categories/edit/:categoryId', adminController.updateCategory)

router.post('/categories/delete/:categoryId', adminController.deleteCategory)

// Tag Management (Similar to categories)

router.get('/tags', tagController.getAllTags)

router.get('/tags/add', tagController.getAddTag)

router.post('/tags/add', tagController.createTag)

router.get('/tags/edit/:tagId', adminController.getEditTag)

router.post('/tags/edit/:tagId', tagController.updateTag)

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
