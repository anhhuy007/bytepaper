// middlewares/checkSubscription.js

import subscriptionService from '../services/subscription.service.js'

const checkSubscription = async (req, res, next) => {
  try {
    if (!req.user) {
      // If user ID is not found, respond with a 401 status code
      throw new Error('Please log in to continue')
    }
    // Extract the user ID from the request object
    const userId = req.user.id

    // Check if the user's subscription is valid
    const isValid = await subscriptionService.checkSubscriptionValidity(userId)

    if (!isValid) {
      // If subscription is invalid, respond with a 403 status code
      throw new Error('This content is only available to subscribers. Please subscribe to access.')
    }

    // Proceed to the next middleware if the subscription is valid
    next()
  } catch (error) {
    // Pass any errors to the next middleware
    next(error)
  }
}

export default checkSubscription
