// routes/authRoutes.js

import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

// @route   POST /api/v1/auth/register
// @desc    Register a new user
router.post("/register", authController.register);

// @route   POST /api/v1/auth/login
// @desc    Login user and return JWT token
router.post("/login", authController.login);

// @route   POST /api/v1/auth/forgot-password
// @desc    Send password reset OTP
router.post("/forgot-password", authController.forgotPassword);

// @route   POST /api/v1/auth/reset-password
// @desc    Reset password using OTP
router.post("/reset-password", authController.resetPassword);

export default router;
