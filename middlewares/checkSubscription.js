// middlewares/checkSubscription.js

import subscriptionService from "../services/subscription.service.js";

/**
 * Middleware that checks if a user's subscription is valid.
 *
 * This middleware will check if the user's subscription is valid by
 * calling the checkSubscriptionValidity method of the subscription service.
 * If the subscription is invalid, it will return a 403 response with a
 * message indicating that the subscription has expired. If the subscription
 * is valid, it will call the next middleware.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
const checkSubscription = async (req, res, next) => {
  try {
    // Extract the user ID from the request object
    const userId = req.user.id;

    // Check if the user's subscription is valid
    const isValid = await subscriptionService.checkSubscriptionValidity(userId);

    if (!isValid) {
      // If subscription is invalid, respond with a 403 status code
      return res
        .status(403)
        .json({ success: false, message: "Subscription expired" });
    }

    // Proceed to the next middleware if the subscription is valid
    next();
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
};

export default checkSubscription;
