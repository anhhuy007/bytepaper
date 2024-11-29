// routes/comment.routes.js

import express from "express";
import commentController from "../controllers/comment.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// @route   GET /api/v1/comments/article/:articleId
// @desc    Get comments for an article
router.get("/article/:articleId", commentController.getCommentsByArticleId);

// Protected Routes
router.use(authMiddleware(["guest", "subscriber", "admin"]));

// @route   POST /api/v1/comments/article/:articleId
// @desc    Add a comment to an article
router.post("/article/:articleId", commentController.addCommentToArticle);

// @route   PUT /api/v1/comments/:commentId
// @desc    Update a comment
router.put("/:commentId", commentController.updateComment);

// @route   DELETE /api/v1/comments/:commentId
// @desc    Delete a comment
router.delete("/:commentId", commentController.deleteComment);

export default router;
