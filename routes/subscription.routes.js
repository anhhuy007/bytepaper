import express from 'express'
import subscriptionController from '../controllers/subscription.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import viewRenderer from '../utils/viewRenderer.js'

const router = express.Router()

// Protected Routes
router.use(authMiddleware(['guest', 'subscriber', 'admin']))

// @route   GET /api/v1/subscription/status
// @desc    Check subscription status
router.get(
  '/status',
  viewRenderer('subscriber/subscription'),
  subscriptionController.getSubscriptionStatus,
)

// @route   POST /api/v1/subscription/renew
// @desc    Renew subscription
router.post('/renew', subscriptionController.renewSubscription)

export default router
