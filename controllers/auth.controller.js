// controllers/auth.controller.js

import userService from '../services/user.service.js'
import passport from 'passport'
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

    if (!user) {
      return res.status(400).json({ success: false, message: 'User already exists' })
    }
    res.redirect('/auth/login')
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
const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err)
      return next(err)
    }
    if (!user) {
      return res.status(401).render('auth/login', { error: 'Invalid credentials' })
    }

    req.login(user, (err) => {
      if (err) {
        console.error('Error during login session:', err)
        return next(err)
      }

      // Explicitly save the session
      req.session.save((err) => {
        if (err) {
          console.error('Error explicitly saving session:', err)
          return next(err)
        } else {
          console.log('Session saved successfully')
        }

        const redirectUrl = user.role === 'admin' ? '/admin/users' : '/'
        res.redirect(redirectUrl)
      })
    })
  })(req, res, next)
}

const googleLogin = (req, res, next) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next)
}

const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err) {
      console.error('Error during Google OAuth:', err)
      return next(err)
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication failed' })
    }

    req.login(user, (err) => {
      if (err) {
        console.error('Error during login session:', err)
        return next(err)
      }

      // Explicitly save the session
      req.session.save((err) => {
        if (err) {
          console.error('Error explicitly saving session:', err)
          return next(err)
        } else {
          console.log('Session saved successfully')
        }
        res.redirect('/')
      })
    })
  })(req, res, next)
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

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err)
      return next(err)
    }
    // Explicitly destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err)
        return next(err)
      }
      // Redirect to login page after successful logout
      res.redirect('/auth/login')
    })
  })
}

export default {
  register,
  login,
  googleLogin,
  googleCallback,
  forgotPassword,
  resetPassword,
  logout,
}
