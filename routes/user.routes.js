// routes/user.routes.js

import express from 'express'
import userController from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import viewRenderer from '../utils/viewRenderer.js'
import cacheMiddleware, { deleteCacheMiddleware } from '../middlewares/cacheMiddleware.js'
import cacheKeyGenerator from '../utils/cacheKeyGenerator.js'
const router = express.Router()

router.use(authMiddleware())

// @route   GET /api/v1/user/profile
// @desc    Get user profile
router.get(
  '/profile',
  cacheMiddleware(cacheKeyGenerator.userProfileCacheKeyGenerator),
  userController.getUserProfile,
)

// @route   GET /api/v1/user/edit-profile
// @desc    Get edit profile view
router.get('/edit-profile', viewRenderer('user/edit-profile'))

// @route   PUT /api/v1/user/profile
// @desc    Update user profile
router.post(
  '/edit-profile',
  deleteCacheMiddleware(cacheKeyGenerator.userProfileCacheKeyGenerator),
  userController.updateUserProfile,
)

// @route   GET /api/v1/user/change-password
// @desc    Get change password view
router.get('/change-password', viewRenderer('user/change-password'))

// @route   PUT /api/v1/user/change-password
// @desc    Change user password
router.post('/change-password', userController.changePassword)

// @route   DELETE /api/v1/user/delete
// @desc    Delete user account
router.delete('/delete', userController.deleteUser)

export default router
