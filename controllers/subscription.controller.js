import subscriptionService from "../services/subscription.service.js";

/**
 * Retrieves the subscription status for the authenticated user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
const getSubscriptionStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const subscription =
      await subscriptionService.getSubscriptionByUserId(userId);

    if (!subscription) {
      return res.status(200).json({
        success: true,
        data: { isActive: false, message: "No active subscription" },
      });
    }

    const isActive = new Date(subscription.expiry_date) > new Date();

    res.status(200).json({
      success: true,
      data: {
        isActive,
        expiryDate: subscription.expiry_date,
        message: isActive
          ? "Subscription is active"
          : "Subscription has expired",
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Renews the subscription for the authenticated user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
const renewSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Number of days to renew, default to 7 if not provided
    const days = parseInt(req.body.days) || 7;

    const updatedSubscription =
      await subscriptionService.createOrUpdateSubscription(userId, days);

    res.status(200).json({
      success: true,
      data: {
        expiryDate: updatedSubscription.expiry_date,
        message: `Subscription renewed for ${days} days.`,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default { getSubscriptionStatus, renewSubscription };
