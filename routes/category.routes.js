// routes/category.routes.js

import express from "express";
import categoryController from "../controllers/category.controller.js";

const router = express.Router();

// @route   GET /api/v1/categories
// @desc    Get all categories
router.get("/", categoryController.getAllCategories);

// @route   GET /api/v1/categories/:id
// @desc    Get category by ID
router.get("/:id", categoryController.getCategoryById);

export default router;
