// routes/adminRoutes.js

import express from "express";
import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Protected Routes for Admins
router.use(authMiddleware(["admin"]), roleMiddleware("admin"));

// User Management

// @route   GET /api/v1/admin/users
// @desc    Get all users
router.get("/users", adminController.getAllUsers);

// @route   PUT /api/v1/admin/users/:userId/role
// @desc    Assign role to a user
router.put("/users/:userId/role", adminController.assignUserRole);

// @route   DELETE /api/v1/admin/users/:userId
// @desc    Delete a user
router.delete("/users/:userId", adminController.deleteUser);

// Category Management

// @route   POST /api/v1/admin/categories
// @desc    Create a new category
router.post("/categories", adminController.createCategory);

// @route   PUT /api/v1/admin/categories/:categoryId
// @desc    Update a category
router.put("/categories/:categoryId", adminController.updateCategory);

// @route   DELETE /api/v1/admin/categories/:categoryId
// @desc    Delete a category
router.delete("/categories/:categoryId", adminController.deleteCategory);

// Tag Management (Similar to categories)

// Editor Management

// @route   PUT /api/v1/admin/editors/:editorId/categories
// @desc    Assign categories to an editor
router.put(
  "/editors/:editorId/categories",
  adminController.assignCategoriesToEditor
);

export default router;
