// routes/user.routes.js

import express from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import viewRenderer from "../utils/viewRenderer.js";

const router = express.Router();

router.use(authMiddleware());

// @route   GET /api/v1/user/profile
// @desc    Get user profile
router.get(
  "/profile",
  viewRenderer("user/profile", userController.getUserProfile)
);

// @route   PUT /api/v1/user/profile
// @desc    Update user profile
router.put("/profile", userController.updateUserProfile);

// @route   GET /api/v1/user/change-password
// @desc    Get change password view
router.get("/change-password", viewRenderer("user/change-password"));

// @route   PUT /api/v1/user/change-password
// @desc    Change user password
router.put("/change-password", userController.changePassword);

// @route   DELETE /api/v1/user/delete
// @desc    Delete user account
router.delete("/delete", userController.deleteUser);

export default router;
