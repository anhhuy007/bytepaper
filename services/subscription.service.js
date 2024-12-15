// services/subscription.service.js

import subscriptionModel from '../models/subscription.model.js'
import userModel from '../models/user.model.js'
class SubscriptionService {
  async getSubscriptionByUserId(userId) {
    return await subscriptionModel.findByUserId(userId)
  }

  async createOrUpdateSubscription(userId, days) {
    const existingSubscription = await subscriptionModel.findByUserId(userId)

    const newExpiryDate = existingSubscription
      ? new Date(existingSubscription.expiry_date)
      : new Date()

    // Extend expiry date by the specified days
    newExpiryDate.setDate(newExpiryDate.getDate() + days)

    // Update user role to 'subscriber' if not already set
    if (existingSubscription) {
      await userModel.update(userId, { role: 'subscriber' })
    }

    return await subscriptionModel.upsert(userId, newExpiryDate)
  }

  /**
   * Checks if a user's subscription is valid.
   *
   * This method retrieves a user's subscription record from the database and
   * checks if the expiry date is in the future. If the subscription record does
   * not exist or the expiry date is in the past, the method returns false.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<boolean>} True if the subscription is valid, false otherwise.
   * @example
   * const isValid = await subscriptionService.checkSubscriptionValidity(1);
   * console.log(isValid);
   * // true or false
   */
  async checkSubscriptionValidity(userId) {
    const subscription = await subscriptionModel.findByUserId(userId)
    if (!subscription) {
      return false
    }
    return new Date(subscription.expiry_date) > new Date()
  }

  /**
   * Cancels a subscription for a user.
   *
   * This method will delete the subscription record associated with the
   * specified user ID from the database and return the deleted record.
   *
   * @param {number} userId - The ID of the user whose subscription is to be
   * deleted.
   * @returns {Promise<Object>} The deleted subscription record.
   * @example
   * const deletedSubscription = await subscriptionService.cancelSubscription(1);
   * console.log(deletedSubscription);
   * // { user_id: 1, expiry_date: "...", created_at: "...", updated_at: "..." }
   */
  async cancelSubscription(userId) {
    return await subscriptionModel.deleteSubscription(userId)
  }
}

export default new SubscriptionService()
