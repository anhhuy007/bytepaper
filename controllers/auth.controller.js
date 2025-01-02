// controllers/auth.controller.js

import userService from '../services/user.service.js'
import passport from 'passport'
import axios from 'axios'
import { config } from 'dotenv'

config()

const getSignup = (req, res, next) => {
  const siteKey = process.env.GOOGLE_RECAPTCHA_SITE_KEY

  if (!siteKey) {
    return res.status(500).json({ success: false, message: 'Google reCAPTCHA site key not found.' })
  }

  res.render('auth/signup', {
    title: 'Sign Up',
    layout: 'auth',
    siteKey,
  })
}

const register = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      fullname,
      'g-recaptcha-response': captchaResponse,
    } = req.body

    // Validate CAPTCHA
    if (!captchaResponse) {
      return res.status(400).json({ success: false, message: 'CAPTCHA is required.' })
    }

    const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      return res
        .status(500)
        .json({ success: false, message: 'Google reCAPTCHA secret key not found.' })
    }

    const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`

    const captchaVerifyResponse = await axios.post(captchaVerifyUrl)
    if (!captchaVerifyResponse.data.success) {
      return res
        .status(400)
        .json({ success: false, message: 'CAPTCHA verification failed. Please try again.' })
    }
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (username, email, password).',
      })
    }

    // Register user
    const user = await userService.registerUser({
      username,
      email,
      password,
      full_name: fullname || username,
    })

    if (!user) {
      return res.status(400).json({ success: false, message: 'User already exists.' })
    }

    res.status(200).json({ success: true, redirectUrl: '/auth/login' })
  } catch (error) {
    if (error.message === 'Username or email already exists') {
      return res.status(400).json({ success: false, message: error.message })
    }
    console.error('Error during user registration:', error)
    next(error)
  }
}

const login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Server error during login:', err)
      return res.status(500).json({
        success: false,
        message: `${err.message}. Please try again.`,
      })
    }

    if (!user) {
      console.warn('Invalid login attempt:', info.message)
      return res.status(401).json({
        success: false,
        message: info.message || 'Invalid username or password.',
      })
    }

    req.login(user, (err) => {
      if (err) {
        console.error('Error during login session:', err)
        return res.status(500).json({
          success: false,
          message: 'Failed to log in. Please try again.',
        })
      }

      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err)
          return res.status(500).json({
            success: false,
            message: 'Session save failed. Please try again.',
          })
        }

        // Determine redirect URL based on user role
        const redirectUrl = ['guest', 'subscriber'].includes(user.role)
          ? '/'
          : `/${user.role}/dashboard`

        console.info(
          `User ${user.username} logged in as ${user.role}, redirecting to ${redirectUrl}`,
        )

        // Redirect the user based on role
        res.json({
          success: true,
          redirectUrl: redirectUrl,
        })
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
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' })
    }

    const user = await userService.findUserByEmail(email)
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'No user found with that email address.' })
    }

    // Call the user service to send the reset OTP/email
    await userService.sendPasswordResetOtp(req, email)

    return res
      .status(200)
      .json({ success: true, message: 'Password reset link sent to your email.' })
  } catch (error) {
    if (error.message === 'User not found') {
      return res
        .status(404)
        .json({ success: false, message: 'No user found with that email address.' })
    }
    console.error('Error in forgotPassword controller:', error)
    next(error)
  }
}

const getResetPassword = (req, res, next) => {
  try {
    const { token } = req.query
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required.' })
    }
    res.render('auth/reset-password', {
      token: token,
      title: 'Reset Password',
      layout: 'auth',
    })
  } catch (error) {
    console.error('Error in getResetPassword controller:', error)
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    // Extract the email address, OTP code, and new password from the request body
    const { resetToken, newPassword } = req.body

    // Check if email, OTP code, and new password are provided
    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' })
    }

    // Reset the user's password using the service
    await userService.resetPassword(resetToken, newPassword)

    // Return a success response with a message
    // res.status(200).json({ success: true, message: 'Password reset successful' })
    res.status(200).json({ success: true, message: 'Password reset successful' })
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    if (error.message === 'User not found or token expired') {
      return res.status(400).json({ success: false, message: error.message })
    }
    console.error('Error in resetPassword:', error)
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
  getResetPassword,
  getSignup,
}
