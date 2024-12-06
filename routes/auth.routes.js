// routes/auth.routes.js

import express from 'express'
import authController from '../controllers/auth.controller.js'
import viewRenderer from '../utils/viewRenderer.js'
import { config } from 'dotenv'
import redirectIfAuthenticated from '../middlewares/redirectIfAuthenticated.js'
config()

const router = express.Router()

router.use(redirectIfAuthenticated())

// Root route: /auth

router.get('/signup', viewRenderer('auth/signup', 'auth'))
router.post('/signup', authController.register)

router.get('/login', viewRenderer('auth/login', 'auth'))
router.post('/login', authController.login)

router.get('/forgot-password', viewRenderer('auth/forgot-password', 'auth'))
router.post('/forgot-password', authController.forgotPassword)

router.get('/reset-password', viewRenderer('auth/reset-password', 'auth'))
router.post('/reset-password', authController.resetPassword)

router.get('/google', authController.googleLogin)

router.get('/google/callback', authController.googleCallback)

router.get('/logout', authController.logout)

export default router
