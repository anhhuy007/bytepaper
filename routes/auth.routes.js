// routes/auth.routes.js

import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import authController from '../controllers/auth.controller.js'
import viewRenderer from '../utils/viewRenderer.js'
import { config } from 'dotenv'
import redirectIfAuthenticated from '../middlewares/redirectIfAuthenticated.js'
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
router.get('/google', authController.googleLogin)

// @route   GET /api/v1/auth/google/callback
// @desc    Handle Google OAuth callback
router.get('/google/callback', authController.googleCallback)

router.get('/login', redirectIfAuthenticated(), viewRenderer('auth/login'))
router.get('/register', redirectIfAuthenticated(), viewRenderer('auth/register'))
router.get('/forgot-password', viewRenderer('auth/forgot-password'))
router.get('/reset-password', viewRenderer('auth/reset-password'))
router.get('/logout', authController.logout)

export default router
