// routes/tag.routes.js

import express from "express";
import tagController from "../controllers/tag.controller.js";

const router = express.Router();

// @route   GET /api/v1/tags
// @desc    Get all tags
router.get("/", tagController.getAllTags);

// @route   GET /api/v1/tags/:id
// @desc    Get tag by ID
router.get("/:id", tagController.getTagById);

export default router;
