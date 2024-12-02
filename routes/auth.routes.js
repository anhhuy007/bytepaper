// routes/auth.routes.js

import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import authController from '../controllers/auth.controller.js'
import viewRenderer from '../utils/viewRenderer.js'
import { config } from 'dotenv'

config()

const router = express.Router()

// @route   POST /api/v1/auth/register
// @desc    Register a new user
router.post('/register', authController.register)

// @route   POST /api/v1/auth/login
// @desc    Login user and return JWT token
router.post('/login', authController.login)

// @route   POST /api/v1/auth/forgot-password
// @desc    Send password reset OTP
router.post('/forgot-password', authController.forgotPassword)

// @route   POST /api/v1/auth/reset-password
// @desc    Reset password using OTP
router.post('/reset-password', authController.resetPassword)

// @route   GET /api/v1/auth/google
// @desc    Initiate Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
)

// @route   GET /api/v1/auth/google/callback
// @desc    Handle Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // Generate JWT for the authenticated user
  const token = jwt.sign(
    { id: req.user.id, role: req.user.role },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: process.env.JWT_EXPIRY || '168h' },
  )

  // Redirect to a frontend URL with the token or respond with JSON
  res.json({ token })
})

router.get('/login', viewRenderer('auth/login'))
router.get('/register', viewRenderer('auth/register'))
router.get('/forgot-password', viewRenderer('auth/forgot-password'))
router.get('/reset-password', viewRenderer('auth/reset-password'))

export default router
