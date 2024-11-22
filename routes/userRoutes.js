// routes/userRoutes.js

import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected Routes
router.use(authMiddleware);

// @route   GET /api/v1/user/profile
// @desc    Get user profile
router.get("/profile", userController.getUserProfile);

// @route   PUT /api/v1/user/profile
// @desc    Update user profile
router.put("/profile", userController.updateUserProfile);

// @route   PUT /api/v1/user/change-password
// @desc    Change user password
router.put("/change-password", userController.changePassword);

// route CRUD user
router.get("/user/:id", userController.getUser);
router.post("/user", userController.createUser);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

export default router;
