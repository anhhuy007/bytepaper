// routes/editorRoutes.js

import express from "express";
import editorController from "../controllers/editorController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Protected Routes for Editors
router.use(authMiddleware, roleMiddleware("editor"));

// @route   GET /api/v1/editor/articles
// @desc    Get pending articles for editor's categories
router.get("/articles/rejected", editorController.getRejectedArticles);
router.get("/articles/published", editorController.getPublishedArticles);
router.get("/articles/approved", editorController.getApprovedArticles);
router.get("/articles/pending", editorController.getPendingArticles);
router.get("/articles/draft", editorController.getDraftArticles);
router.get("/articles/all", editorController.getAllArticles);

// @route   PUT /api/v1/editor/articles/:articleId/approve
// @desc    Approve an article
router.put("/articles/:articleId/approve", editorController.approveArticle);

// @route   PUT /api/v1/editor/articles/:articleId/reject
// @desc    Reject an article
router.put("/articles/:articleId/reject", editorController.rejectArticle);

export default router;
