// controllers/user.controller.js
import userService from '../services/user.service.js'
import subscriptionService from '../services/subscription.service.js'

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id
    const profileData = await userService.getUserProfile(userId)

    if (!profileData) {
      return res.status(404).render('error/404', { message: 'User not found' })
    }

    const { subscription_expiry_date, ...user } = profileData
    const subscription = subscription_expiry_date ? { expiry_date: subscription_expiry_date } : null

    // Define dashboard URLs for specific roles
    const dashboardUrls = {
      admin: '/admin/dashboard',
      editor: '/editor/dashboard',
      writer: '/writer/dashboard',
    }
    const dashboardUrl = dashboardUrls[user.role] || null

    res.render('user/profile', {
      title: 'User Profile',
      layout: 'user',
      user,
      subscription,
      dashboardUrl, // Pass dashboard URL to the view
    })
  } catch (error) {
    next(error)
  }
}


const getEditUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id
    const profileData = await userService.getUserProfile(userId)

    if (!profileData) {
      return res.status(404).render('error/404', { message: 'User not found' })
    }

    const { subscription_expiry_date, ...user } = profileData
    const subscription = subscription_expiry_date ? { expiry_date: subscription_expiry_date } : null

    res.render('user/edit-profile', {
      title: 'Edit Profile',
      layout: 'user',
      user,
      subscription,
    })
  } catch (error) {
    next(error)
  }
}

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id
    const profileData = req.body

    const updatedUser = await userService.updateUserProfile(userId, profileData)

    res.status(200).json({ success: true, data: updatedUser })
  } catch (error) {
    console.error('Error updating profile:', error)

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    })
  }
}

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { currentPassword, newPassword } = req.body

    await userService.changePassword(userId, currentPassword, newPassword)

    res.status(200).json({
      success: true,
      message: 'Password changed successfully!',
    })
  } catch (error) {
    console.error('Error changing password:', error)

    // Phản hồi JSON lỗi
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to change password.',
    })
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const user_id = req.params.id

    const userData = await userService.deleteUser(user_id)

    res.status(200).json({ success: true, data: userData })
  } catch (error) {
    next(error)
  }
}

const extendSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id
    const days = parseInt(req.body.days, 10)

    // Validate subscription days
    if (![7, 30, 90].includes(days)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan. Please select a valid plan.',
      })
    }

    // Call service to update subscription
    await subscriptionService.createOrUpdateSubscription(userId, days)

    res.status(200).json({
      success: true,
      message: `Subscription extended by ${days} days successfully!`,
    })
  } catch (error) {
    next(error)
  }
}

export default {
  deleteUser,
  getUserProfile,
  getEditUserProfile,
  updateUserProfile,
  changePassword,
  extendSubscription,
}
