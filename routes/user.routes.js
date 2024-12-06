// routes/user.routes.js

import express from 'express'
import userController from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import viewRenderer from '../utils/viewRenderer.js'
import cacheMiddleware, { deleteCacheMiddleware } from '../middlewares/cacheMiddleware.js'
import cacheKeyGenerator from '../utils/cacheKeyGenerator.js'
const router = express.Router()

router.use(authMiddleware())


router.get('/profile', userController.getUserProfile)

router.get('/edit-profile', viewRenderer('user/edit-profile'))

router.post('/edit-profile', userController.updateUserProfile)

router.get('/change-password', viewRenderer('user/change-password'))

router.post('/change-password', userController.changePassword)

router.get('/extend-subscription', viewRenderer('user/extend-subscription'))

router.post(
  '/extend-subscription',
  deleteCacheMiddleware(cacheKeyGenerator.userProfileCacheKeyGenerator),
  userController.extendSubscription,
)

router.delete('/delete', userController.deleteUser)

export default router
