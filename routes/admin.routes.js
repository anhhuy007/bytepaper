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

router.get('/users/edit/:userId', adminController.getUserById)

router.post('/users/edit/:userId', adminController.assignUserRole)

router.post('/users/delete/:userId', adminController.deleteUser)

// Category Management

router.get(
  '/categories',
  viewRenderer('admin/categories', 'admin', categoryController.getAllCategories),
)

router.get(
  '/categories/add',
  viewRenderer('admin/add-category', 'admin', categoryController.getAllCategories),
)

router.post('/categories/add', adminController.createCategory)

router.get('/categories/edit/:categoryId', adminController.getEditCategory)

router.post('/categories/edit/:categoryId', adminController.updateCategory)

router.post('/categories/delete/:categoryId', adminController.deleteCategory)

// Tag Management (Similar to categories)

router.get('/tags', viewRenderer('admin/tags', tagController.getAllTags))

router.get('/tags/:tagId', viewRenderer('admin/tag', tagController.getTagById))

router.post('/tags', tagController.createTag)

router.put('/tags/:tagId', tagController.updateTag)

router.delete('/tags/:tagId', tagController.deleteTag)

// Editor Management

router.get('/editors', viewRenderer('admin/assign-categories', adminController.getAllEditors))

router.get('/editors/:userId', viewRenderer('admin/editor', adminController.getUserById))

router.put('/editors/:editorId/categories', adminController.assignCategoriesToEditor)

export default router
