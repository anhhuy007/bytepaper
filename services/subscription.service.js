// services/subscription.service.js

import subscriptionModel from '../models/subscription.model.js'
import subscriptionRequestModel from '../models/subscriptionRequest.model.js'
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

  async checkSubscriptionValidity(userId) {
    const subscription = await subscriptionModel.findByUserId(userId)
    if (!subscription) {
      return false
    }
    return new Date(subscription.expiry_date) > new Date()
  }

  async cancelSubscription(userId) {
    return await subscriptionModel.deleteSubscription(userId)
  }

  async createSubscriptionRequest(userId, days) {
    await subscriptionRequestModel.createOne(userId, days)
  }

  async getAllSubscriptionRequests() {
    return await subscriptionRequestModel.getAll()
  }

  async approveSubscriptionRequest(requestId) {
    const request = await subscriptionRequestModel.findById(requestId)
    if (!request || request.status !== 'pending') {
      throw new Error('Invalid or already processed request.')
    }

    // Update the user's subscription
    const newExpiryDate = await this.calculateNewExpiryDate(request.user_id, request.days)
    await subscriptionModel.upsert(request.user_id, newExpiryDate)

    // Mark request as approved
    await subscriptionRequestModel.updateStatus(requestId, 'approved')

    await userModel.update(request.user_id, { role: 'subscriber' })
  }

  async rejectSubscriptionRequest(requestId) {
    const request = await subscriptionRequestModel.findById(requestId)
    if (!request || request.status !== 'pending') {
      throw new Error('Invalid or already processed request.')
    }

    // Mark request as rejected
    await subscriptionRequestModel.updateStatus(requestId, 'rejected')
  }

  async calculateNewExpiryDate(userId, days) {
    const currentSubscription = await subscriptionModel.findByUserId(userId)
    const currentExpiryDate = currentSubscription?.expiry_date || new Date()
    return new Date(currentExpiryDate.getTime() + days * 24 * 60 * 60 * 1000)
  }
}

export default new SubscriptionService()
