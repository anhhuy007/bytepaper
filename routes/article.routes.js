// routes/article.routes.js
import express from "express";
import articleController from "../controllers/article.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkSubscription from "../middlewares/checkSubscription.js";
import cacheMiddleware from "../middlewares/cacheMiddleware.js";
import cacheKeyGenerator from "../utils/cacheKeyGenerator.js";

const router = express.Router();

// @route   GET /api/v1/articles
// @desc    Get all published articles
router.get("/", articleController.getAllArticles);

// @route   GET /api/v1/articles/home
// @desc    Fetch homepage articles (featured, most-viewed, newest, top-categories)
router.get(
  "/home",
  cacheMiddleware(cacheKeyGenerator.homeCacheKeyGenerator),
  articleController.getHomepageArticles
);

// @route   GET /api/v1/articles/search?q=<query>
// @desc    Search articles
router.get(
  "/search",
  cacheMiddleware(cacheKeyGenerator.searchCacheKeyGenerator),
  articleController.searchArticles
);

// @route   GET /api/v1/articles/:id
// @desc    Get article by ID
router.get(
  "/:id",
  cacheMiddleware(cacheKeyGenerator.articleDetailCacheKeyGenerator),
  articleController.getArticleById
);

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
router.get(
  "/category/:categoryId",
  cacheMiddleware(cacheKeyGenerator.articlesByCategoryCacheKeyGenerator),
  articleController.getArticlesByCategory
);

// @route   GET /api/v1/articles/tag/:tagId
// @desc    Get articles by tag
router.get(
  "/tag/:tagId",
  cacheMiddleware(cacheKeyGenerator.articlesByTagCacheKeyGenerator),
  articleController.getArticlesByTag
);

// @route   POST /api/v1/articles/:id/views
// @desc    Increase article view count
router.post("/:id/views", articleController.increaseArticleViewCount);

export default router;
