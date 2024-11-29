// routes/articleRoutes.js
import express from "express";
import articleController from "../controllers/article.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkSubscription from "../middlewares/checkSubscription.js";

const router = express.Router();

// @route   GET /api/v1/articles
// @desc    Get all published articles
router.get("/", articleController.getAllArticles);

// @route   GET /api/v1/articles/search?q=<query>
// @desc    Search articles
router.get("/search", articleController.searchArticles);

// @route   GET /api/v1/articles/:id
// @desc    Get article by ID
router.get("/:id", articleController.getArticleById);

// @route   GET /api/v1/articles/:id/download
// @desc    Download article PDF (Protected for subscribers)
router.get(
  "/:id/download",
  authMiddleware(["subscriber"]),
  checkSubscription,
  articleController.downloadArticle
);

// @route   GET /api/v1/articles/category/:categoryId
// @desc    Get articles by category
router.get("/category/:categoryId", articleController.getArticlesByCategory);

// @route   POST /api/v1/articles/:id/views
// @desc    Increase article view count
router.post("/:id/views", articleController.increaseArticleViewCount);

export default router;
