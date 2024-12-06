// controllers/user.controller.js
import userService from '../services/user.service.js'
import subscriptionService from '../services/subscription.service.js'

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id
    const profileData = await userService.getUserProfile(userId)
    console.log(profileData)
    if (!profileData) {
      return res.status(404).render('error/404', { message: 'User not found' })
    }

    const { subscription_expiry_date, ...user } = profileData
    const subscription = subscription_expiry_date ? { expiry_date: subscription_expiry_date } : null

    res.render('user/profile', { user, subscription })
  } catch (error) {
    next(error)
  }
}

const updateUserProfile = async (req, res, next) => {
  try {
    // Get the ID of the authenticated user
    const userId = req.user.id

    // Retrieve the profile data from the request body
    const profileData = req.body

    console.log(profileData)

    // Update the user profile in the database
    await userService.updateUserProfile(userId, profileData)

    // Return the updated user profile as JSON
    // res.status(200).json({ success: true, data: user })\
    res.redirect('/user/profile')
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error)
  }
}

const changePassword = async (req, res, next) => {
  try {
    // Get the ID of the authenticated user
    const userId = req.user.id

    // Retrieve the current password and new password from the request body
    const { currentPassword, newPassword } = req.body

    // Change the user's password in the database
    await userService.changePassword(userId, currentPassword, newPassword)

    // Return a success message as JSON
    // res.status(200).json({ success: true, message: 'Password changed successfully' })
    res.redirect('/user/profile')
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error)
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

    // Number of days to renew, default to 7 if not provided
    const days = parseInt(req.body.days) || 7

    await subscriptionService.createOrUpdateSubscription(userId, days)

    res.redirect('/user/profile')
  } catch (error) {
    next(error)
  }
}

export default {
  deleteUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  extendSubscription,
}
