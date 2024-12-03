// routes/user.routes.js

import express from 'express'
import userController from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import viewRenderer from '../utils/viewRenderer.js'

const router = express.Router()

router.use(authMiddleware())

router.get('/', (req, res) => {
  res.redirect('/user/profile')
})

// @route   GET /api/v1/user/profile
// @desc    Get user profile
router.get('/profile', viewRenderer('user/profile', userController.getUserProfile))

// @route   GET /api/v1/user/edit-profile
// @desc    Get edit profile view
router.get('/edit-profile', viewRenderer('user/edit-profile'))

// @route   PUT /api/v1/user/profile
// @desc    Update user profile
router.post('/edit-profile', userController.updateUserProfile)

// @route   GET /api/v1/user/change-password
// @desc    Get change password view
router.get('/change-password', viewRenderer('user/change-password'))

// @route   PUT /api/v1/user/change-password
// @desc    Change user password
router.put('/change-password', userController.changePassword)

// @route   DELETE /api/v1/user/delete
// @desc    Delete user account
router.delete('/delete', userController.deleteUser)

export default router
