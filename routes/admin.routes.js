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

// @route   GET /api/v1/admin/users
// @desc    Get all users
// router.get('/users', viewRenderer('admin/users', adminController.getAllUsers))
router.get('/users', adminController.getAllUsers)
// @route   GET /api/v1/admin/users/:userId
// @desc    Get user by ID
router.get('/users/:userId', viewRenderer('admin/users', adminController.getUserById))

// @route   PUT /api/v1/admin/users/:userId/role
// @desc    Assign role to a user
router.put('/users/:userId/role', adminController.assignUserRole)

// @route   DELETE /api/v1/admin/users/:userId
// @desc    Delete a user
router.delete('/users/:userId', adminController.deleteUser)

// Category Management

// @route   GET /api/v1/admin/categories
// @desc    Get all categories

router.get(
  '/categories',
  viewRenderer('admin/manage-categories', categoryController.getAllCategories),
)

// @route   GET /api/v1/admin/categories/:categoryId
// @desc    Get category by ID
router.get(
  '/categories/:categoryId',
  viewRenderer('admin/category', categoryController.getCategoryById),
)

// @route   POST /api/v1/admin/categories
// @desc    Create a new category
router.post('/categories', adminController.createCategory)

// @route   PUT /api/v1/admin/categories/:categoryId
// @desc    Update a category
router.put('/categories/:categoryId', adminController.updateCategory)

// @route   DELETE /api/v1/admin/categories/:categoryId
// @desc    Delete a category
router.delete('/categories/:categoryId', adminController.deleteCategory)

// Tag Management (Similar to categories)

// @route   GET /api/v1/admin/tags
// @desc    Get all tags
router.get('/tags', viewRenderer('admin/manage-tags', tagController.getAllTags))

// @route   GET /api/v1/admin/tags/:tagId
// @desc    Get tag by ID
router.get('/tags/:tagId', viewRenderer('admin/tag', tagController.getTagById))

// @route   POST /api/v1/admin/tags
// @desc    Create a new tag
router.post('/tags', tagController.createTag)

// @route   PUT /api/v1/admin/tags/:tagId
// @desc    Update a tag
router.put('/tags/:tagId', tagController.updateTag)

// @route   DELETE /api/v1/admin/tags/:tagId
// @desc    Delete a tag
router.delete('/tags/:tagId', tagController.deleteTag)

// Editor Management

// @route   GET /api/v1/admin/editors
// @desc    Get all editors

router.get('/editors', viewRenderer('admin/manage-editors', adminController.getAllEditors))

// @route   GET /api/v1/admin/editors/:editorId
// @desc    Get editor by ID

router.get('/editors/:userId', viewRenderer('admin/editor', adminController.getUserById))

// @route   PUT /api/v1/admin/editors/:editorId/categories
// @desc    Assign categories to an editor
router.put('/editors/:editorId/categories', adminController.assignCategoriesToEditor)

export default router
