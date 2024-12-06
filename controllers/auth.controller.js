// controllers/auth.controller.js

import userService from '../services/user.service.js'
import passport from 'passport'

const register = async (req, res, next) => {
  try {
    // Extract the user data from the request body
    const { username, email, password, fullname } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (username, email, password)',
      })
    }

    // Register the user with the service
    const user = await userService.registerUser({
      username,
      email,
      password,
      full_name: fullname || username,
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

const login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Server error during login:', err)
      return res
        .status(500)
        .json({ success: false, message: `Invalid username or password. Please try again.` })
    }
    if (!user) {
      console.warn('Invalid login attempt:', info.message)
      return res
        .status(401)
        .json({ success: false, message: info.message || 'Invalid username or password.' })
    }

    req.login(user, (err) => {
      if (err) {
        console.error('Error during login session:', err)
        return res
          .status(500)
          .json({ success: false, message: 'Failed to log in. Please try again.' })
      }

      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err)
          return res
            .status(500)
            .json({ success: false, message: 'Session save failed. Please try again.' })
        }
        res.json({ success: true, redirectUrl: user.role === 'admin' ? '/admin/dashboard' : '/' })
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
    // res.status(200).json({ success: true, message: 'OTP sent to email' })\
    res.redirect('/auth/reset-password')
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error)
  }
}

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
    // res.status(200).json({ success: true, message: 'Password reset successful' })
    res.redirect('/auth/login')
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
