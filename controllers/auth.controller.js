// controllers/authController.js

import userService from '../services/user.service.js'

/**
 * Registers a new user.
 *
 * This method takes a `userData` object which should contain the following
 * properties: `username`, `email`, `password`, and `full_name`. It checks if
 * the username or email already exists in the database, and if not, creates
 * a new user record with the provided information. The password is hashed
 * before it is stored in the database.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @returns {Promise<void>} The promise that resolves when the request is handled.
 */
/**
 * @typedef {Object} userData
 * @property {string} username - The username of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @property {string} full_name - The full name of the user.
 */
const register = async (req, res, next) => {
  try {
    // Extract the user data from the request body
    const { username, email, password, full_name } = req.body

    if (!username || !email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (username, email, password, full_name)',
      })
    }

    // Register the user with the service
    const user = await userService.registerUser({
      username,
      email,
      password,
      full_name,
    })

    // Return a success response with the new user data
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error)
  }
}

/**
 * Logs in a user with the provided credentials.
 *
 * This method authenticates the user using the username and password from the request body.
 * If the credentials are valid, it returns the user object and a JWT token.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @returns {Promise<void>} The promise that resolves when the login is handled.
 */
const login = async (req, res, next) => {
  try {
    // Extract username and password from the request body
    const { username, password } = req.body

    // Authenticate the user with the service
    const { user, token } = await userService.authenticateUser({
      username,
      password,
    })

    // Return a success response with the user data and token
    res.status(200).json({ success: true, data: { user, token } })
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error)
  }
}

/**
 * Sends a password reset OTP to the user with the given email address.
 *
 * This method takes the email address from the request body and sends a
 * password reset OTP to the user. The OTP is stored in the user's OTP
 * record and an email is sent to the user with the OTP code.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @returns {Promise<void>} The promise that resolves when the request is handled.
 */
const forgotPassword = async (req, res, next) => {
  try {
    // Extract the email address from the request body
    const { email } = req.body

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' })
    }

    // Send the OTP to the user
    await userService.sendPasswordResetOtp(email)

    // Return a success response with a message
    res.status(200).json({ success: true, message: 'OTP sent to email' })
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error)
  }
}

/**
 * Resets a user's password using the provided OTP code and new password.
 *
 * This method takes the email address, OTP code, and new password from the
 * request body and resets the user's password if the OTP code is valid and
 * has not expired. If the password is reset successfully, it returns a
 * success response with a message.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @returns {Promise<void>} The promise that resolves when the request is handled.
 */
const resetPassword = async (req, res, next) => {
  try {
    // Extract the email address, OTP code, and new password from the request body
    const { email, otpCode, newPassword } = req.body

    // Check if email, OTP code, and new password are provided
    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP code, and new password are required.',
      })
    }

    // Reset the user's password using the service
    await userService.resetPassword(email, otpCode, newPassword)

    // Return a success response with a message
    res.status(200).json({ success: true, message: 'Password reset successful' })
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error)
  }
}

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
}
