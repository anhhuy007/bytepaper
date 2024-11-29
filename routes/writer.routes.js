// routes/writerRoutes.js

import express from "express";
import writerController from "../controllers/writer.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Protected Routes for Writers
router.use(authMiddleware, roleMiddleware("writer"));

// @route   GET /api/v1/writer/articles
// @desc    Get all articles by writer
router.get("/articles", writerController.getMyArticles);

// @route   POST /api/v1/writer/articles
// @desc    Create a new article
router.post("/articles", writerController.createArticle);

// @route   PUT /api/v1/writer/articles/:articleId
// @desc    Update an article
router.put("/articles/:articleId", writerController.updateArticle);
router.delete("/articles/:articleId", writerController.deleteArticle);

// @route   PUT /api/v1/writer/articles/:articleId/submit
// @desc    Submit article for approval
router.put(
  "/articles/:articleId/submit",
  writerController.submitArticleForApproval
);

export default router;
