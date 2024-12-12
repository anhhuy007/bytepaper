// routes/user.routes.js

import express from 'express'
import userController from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import viewRenderer from '../utils/viewRenderer.js'
import { cacheMiddleware, deleteCacheMiddleware } from '../middlewares/cacheMiddleware.js'
import { userCacheKeyGenerator } from '../utils/cacheKeyGenerator.js'
const router = express.Router()

router.use(authMiddleware())

router.get(
  '/profile',
  cacheMiddleware(userCacheKeyGenerator.profile),
  userController.getUserProfile,
)

router.get(
  '/edit-profile',
  cacheMiddleware(userCacheKeyGenerator.editProfile),
  userController.getEditUserProfile,
)

router.post(
  '/edit-profile',
  deleteCacheMiddleware((req) => [
    userCacheKeyGenerator.profile(req),
    userCacheKeyGenerator.editProfile(req),
  ]),
  userController.updateUserProfile,
)

router.get(
  '/change-password',
  cacheMiddleware(userCacheKeyGenerator.changePassword),
  viewRenderer('user/change-password', 'user'),
)

router.post('/change-password', userController.changePassword)

router.get(
  '/extend-subscription',
  cacheMiddleware(userCacheKeyGenerator.subscription),
  viewRenderer('user/extend-subscription', 'user'),
)

router.post(
  '/extend-subscription',
  deleteCacheMiddleware(userCacheKeyGenerator.profile),
  userController.extendSubscription,
)

router.delete('/delete', userController.deleteUser)

export default router
