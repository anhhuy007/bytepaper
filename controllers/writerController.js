// controllers/writerController.js

import articleService from "../services/articleService.js";

/**
 * Retrieves a list of articles authored by the current user.
 *
 * @param {Object} req - The Express.js request object containing the user info and query parameters.
 * @param {Object} res - The Express.js response object used to send the articles data back to the client.
 * @param {Function} next - The Express.js next middleware function for error handling.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished executing.
 */
const getMyArticles = async (req, res, next) => {
  try {
    // Extract the author ID from the request object
    const authorId = req.user.id;

    // Define filters to retrieve articles by author ID
    let filters = {
      author_id: authorId,
    };

    if (req.query.status !== "all") {
      filters = {
        author_id: authorId,
        status: req.query.status,
      };
    }

    // Define pagination options from the request query
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    };

    // Retrieve the articles using the article service
    const articles = await articleService.getAllArticles(filters, options);

    // Send the retrieved articles as a JSON response
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error);
  }
};

/**
 * Creates a new article in the database.
 *
 * This method will throw an error if the article is not created successfully.
 *
 * @param {Object} req - The Express.js request object containing the article
 *   data to create.
 * @param {Object} res - The Express.js response object used to send the created
 *   article data back to the client.
 * @param {Function} next - The Express.js next middleware function which is used
 *   to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished
 *   executing.
 * @throws {Error} If there is an error creating the article.
 * @example
 * const response = await writerController.createArticle(req, res, next);
 * console.log(response);
 * {
 *   success: true,
 *   data: {
 *     id: 1,
 *     title: "Example Article",
 *     abstract: "This is an example article.",
 *     content: "<p>This is the article content.</p>",
 *     thumbnail: null,
 *     author_id: 1,
 *     category_id: null,
 *     status: "draft",
 *     published_at: null,
 *     views: 0,
 *     is_premium: false,
 *     search_vector: null,
 *     created_at: "2021-01-01 12:00:00",
 *     updated_at: "2021-01-01 12:00:00",
 *   },
 * }
 */
const createArticle = async (req, res, next) => {
  try {
    const authorId = req.user.id;
    const articleData = req.body;
    const article = await articleService.createArticle(articleData, authorId);
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing article.
 *
 * This method verifies the existence of the article, checks if the user is
 * authorized to update it, and updates the article content.
 *
 * @param {Object} req - The Express.js request object containing the article ID
 *   and update data.
 * @param {Object} res - The Express.js response object used to send the updated
 *   article back to the client.
 * @param {Function} next - The Express.js next middleware function which is used
 *   to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished
 *   executing.
 * @throws {Error} If the article is not found or the user is not authorized.
 * @example
 * const response = await writerController.updateArticle(req, res, next);
 * console.log(response);
 * {
 *   success: true,
 *   data: {
 *     id: 1,
 *     title: "Example Article",
 *     abstract: "This is an example article.",
 *     content: "<p>This is the article content.</p>",
 *     thumbnail: null,
 *     author_id: 1,
 *     category_id: null,
 *     status: "draft",
 *     published_at: null,
 *     views: 0,
 *     is_premium: false,
 *     search_vector: null,
 *     created_at: "2021-01-01 12:00:00",
 *     updated_at: "2021-01-01 12:00:00",
 *   },
 * }
 */
const updateArticle = async (req, res, next) => {
  try {
    const authorId = req.user.id;
    const articleData = req.body;
    const article = await articleService.updateArticle(
      req.params.articleId,
      articleData,
      authorId
    );
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

/**
 * Submits an article for approval.
 *
 * This middleware function handles the request to submit an article for approval.
 * It uses the article service to change the article status to "pending" and
 * sends a confirmation response back to the client.
 *
 * @param {Object} req - The Express.js request object containing the article ID
 *   in the URL parameters and the author ID in the user property.
 * @param {Object} res - The Express.js response object used to send the confirmation response.
 * @param {Function} next - The Express.js next middleware function for error handling.
 *
 * @returns {Promise<void>} A promise that resolves when the article has been submitted for approval and the response is sent.
 *
 * @throws {Error} If there is an error submitting the article for approval.
 */
const submitArticleForApproval = async (req, res, next) => {
  try {
    // Extract the author ID from the request object
    const authorId = req.user.id;

    // Submit the article for approval using the article service
    await articleService.submitArticleForApproval(
      req.params.articleId,
      authorId
    );

    // Send a success response
    res
      .status(200)
      .json({ success: true, message: "Article submitted for approval" });
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const authorId = req.user.id;
    const articleID = req.params.articleId;
    const article = await articleService.deleteArticle(authorId, articleID);
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

export default {
  getMyArticles,
  createArticle,
  deleteArticle,
  updateArticle,
  submitArticleForApproval,
};
