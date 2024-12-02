// controllers/user.controller.js
import userService from '../services/user.service.js'

/**
 * Retrieves the profile of the authenticated user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @return {Promise<void>} The promise that resolves when the request is handled.
 */
const getUserProfile = async (req, res, next) => {
  try {
    // Get the ID of the authenticated user
    const userId = req.user.id

    // Retrieve the user record from the database
    const user = await userService.getUserById(userId)

    // Return the user profile as JSON
    // res.status(200).json({ success: true, data: user });
    return { user }
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error)
  }
}

/**
 * Updates the profile of the authenticated user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @return {Promise<void>} The promise that resolves when the request is handled.
 */
const updateUserProfile = async (req, res, next) => {
  try {
    // Get the ID of the authenticated user
    const userId = req.user.id

    // Retrieve the profile data from the request body
    const profileData = req.body

    // Update the user profile in the database
    const user = await userService.updateUserProfile(userId, profileData)

    // Return the updated user profile as JSON
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error)
  }
}

/**
 * Changes the password of the authenticated user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @return {Promise<void>} The promise that resolves when the request is handled.
 */
const changePassword = async (req, res, next) => {
  try {
    // Get the ID of the authenticated user
    const userId = req.user.id

    // Retrieve the current password and new password from the request body
    const { currentPassword, newPassword } = req.body

    // Change the user's password in the database
    await userService.changePassword(userId, currentPassword, newPassword)

    // Return a success message as JSON
    res.status(200).json({ success: true, message: 'Password changed successfully' })
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

export default {
  deleteUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
}
