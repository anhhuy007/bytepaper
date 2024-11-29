// routes/admin.routes.js

import express from "express";
import adminController from "../controllers/admin.controller.js";
import tagController from "../controllers/tag.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected Routes for Admins
router.use(authMiddleware(["admin"]));

// User Management

// @route   GET /api/v1/admin/users
// @desc    Get all users
router.get("/users", adminController.getAllUsers);

// @route   GET /api/v1/admin/users/:userId
// @desc    Get user by ID
router.get("/users/:userId", adminController.getUserById);

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

// @route   POST /api/v1/admin/tags
// @desc    Create a new tag
router.post("/tags", tagController.createTag);

// @route   PUT /api/v1/admin/tags/:tagId
// @desc    Update a tag
router.put("/tags/:tagId", tagController.updateTag);

// @route   DELETE /api/v1/admin/tags/:tagId
// @desc    Delete a tag
router.delete("/tags/:tagId", tagController.deleteTag);

// Editor Management

// @route   PUT /api/v1/admin/editors/:editorId/categories
// @desc    Assign categories to an editor
router.put(
  "/editors/:editorId/categories",
  adminController.assignCategoriesToEditor
);

export default router;
