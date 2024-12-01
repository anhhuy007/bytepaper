// controllers/article.controller.js

import articleService from "../services/article.service.js";
/**
 * Retrieves a list of articles from the database based on the provided filters and options.
 *
 * @param {Object} req.query - The filters to apply to the query. Each filter should be an object
 * with the column name as the key and the value to filter by as the value.
 *
 * @param {Object} req.query - The options to apply to the query. The following options are supported:
 *
 *   - `limit`: The maximum number of records to return.
 *   - `offset`: The number of records to skip before returning results.
 *   - `orderBy`: The column(s) to order the results by. The default is `published_at DESC`.
 *
 * @returns {Promise<Object[]>} The list of articles retrieved from the database.
 *
 * @example
 * const articles = await articleController.getAllArticles({
 *   status: "published",
 * }, {
 *   limit: 10,
 *   offset: 0,
 *   orderBy: "published_at DESC",
 * });
 * console.log(articles);
 * [
 *   {
 *     id: 1,
 *     title: "Example Article",
 *     abstract: "This is an example article.",
 *     content: "<p>This is the article content.</p>",
 *     thumbnail: null,
 *     author_id: 1,
 *     category_id: null,
 *     status: "published",
 *     published_at: "2021-01-01T00:00:00.000Z",
 *     views: 0,
 *     is_premium: false,
 *     search_vector: null,
 *     created_at: "2021-01-01T00:00:00.000Z",
 *     updated_at: "2021-01-01T00:00:00.000Z",
 *     author_name: "John Doe",
 *     category_name: null,
 *   },
 * ]
 */
const getAllArticles = async (req, res, next) => {
  try {
    const filters = req.query
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
      orderBy: req.query.orderBy || "a.published_at DESC",
    };
    const articles = await articleService.getAllArticles(filters, options);
    // res.status(200).json({ success: true, data: articles });
    return { articles };
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves an article by its ID.
 *
 * @param {Object} req - The Express.js request object containing the article ID
 *   to retrieve.
 * @param {Object} res - The Express.js response object used to send the article
 *   data back to the client.
 * @param {Function} next - The Express.js next middleware function which is used
 *   to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished
 *   executing.
 * @throws {Error} If there is an error retrieving the article.
 * @example
 * const response = await articleController.getArticleById(req, res, next);
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
 *     status: "published",
 *     published_at: "2021-01-01T00:00:00.000Z",
 *     views: 0,
 *     is_premium: false,
 *     search_vector: null,
 *     created_at: "2021-01-01T00:00:00.000Z",
 *     updated_at: "2021-01-01T00:00:00.000Z",
 *     author_name: "John Doe",
 *     category_name: null,
 *   },
 * }
 */
const getArticleById = async (req, res, next) => {
  try {
    // Retrieve the article by its ID
    const article = await articleService.getArticleById(req.params.id)
    // Return the article as JSON response
    // res.status(200).json({ success: true, data: article });
    return { article };
  } catch (error) {
    // If any error occurs, pass it to the next middleware function
    next(error)
  }
}

/**
 * Searches for articles based on a keyword.
 *
 * This method extracts the keyword from the request query parameters and uses
 * the article service to search for articles that match the keyword. The search
 * results are paginated based on the limit and offset query parameters.
 *
 * @param {Object} req - The Express.js request object containing query parameters.
 * @param {Object} res - The Express.js response object used to send the search results.
 * @param {Function} next - The Express.js next middleware function for error handling.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished executing.
 * @throws {Error} If an error occurs during the search process.
 * @example
 * // Request query: { q: "example", limit: 5, offset: 0 }
 * const response = await searchArticles(req, res, next);
 * console.log(response);
 * // { success: true, data: [{ id: 1, title: "Example Article", ... }, ...] }
 */
const searchArticles = async (req, res, next) => {
  try {
    // Extract the search keyword from the query parameters
    const keyword = req.query.q

    console.log('==================> keyword', keyword)

    // Define search options for pagination
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    }

    // Perform the search using the article service
    const articles = await articleService.searchArticles(keyword, options)

    // Send the search results as a JSON response
    // res.status(200).json({ success: true, data: articles });
    return { articles };
  } catch (error) {
    // Pass any errors to the next middleware for handling
    next(error)
  }
}

/**
 * Retrieves a list of articles that belong to a specific category.
 *
 * This method will execute a SQL query to retrieve a list of articles that
 * belong to the specified category. The result is an array of objects with
 * the keys "id", "title", "abstract", "content", "thumbnail", "author_id",
 * "category_id", "status", "published_at", "views", "is_premium",
 * "search_vector", "created_at", "updated_at", "author_name", and
 * "category_name".
 *
 * @param {Object} req - The Express.js request object containing the category
 *   ID to retrieve articles for.
 * @param {Object} res - The Express.js response object used to send the article
 *   data back to the client.
 * @param {Function} next - The Express.js next middleware function for error
 *   handling.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has
 *   finished executing.
 * @throws {Error} If there is an error retrieving the articles.
 * @example
 * const response = await articleController.getArticlesByCategory(
 *   req,
 *   res,
 *   next
 * );
 * console.log(response);
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: 1,
 *       title: "Example Article",
 *       abstract: "This is an example article.",
 *       content: "<p>This is the article content.</p>",
 *       thumbnail: null,
 *       author_id: 1,
 *       category_id: null,
 *       status: "published",
 *       published_at: "2021-01-01T00:00:00.000Z",
 *       views: 0,
 *       is_premium: false,
 *       search_vector: null,
 *       created_at: "2021-01-01T00:00:00.000Z",
 *       updated_at: "2021-01-01T00:00:00.000Z",
 *       author_name: "John Doe",
 *       category_name: null,
 *     },
 *     {
 *       id: 2,
 *       title: "Example Article 2",
 *       abstract: "This is another example article.",
 *       content: "<p>This is the article content.</p>",
 *       thumbnail: null,
 *       author_id: 1,
 *       category_id: null,
 *       status: "published",
 *       published_at: "2021-01-01T00:00:00.000Z",
 *       views: 0,
 *       is_premium: false,
 *       search_vector: null,
 *       created_at: "2021-01-01T00:00:00.000Z",
 *       updated_at: "2021-01-01T00:00:00.000Z",
 *       author_name: "John Doe",
 *       category_name: null,
 *     },
 *   ],
 * }
 */
const getArticlesByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    };
    const articles = await articleService.getArticlesByCategory(
      categoryId,
      options
    );
    // res.status(200).json({ success: true, data: articles });
    return { articles };
  } catch (error) {
    next(error);
  }
};

const getArticlesByTag = async (req, res, next) => {
  try {
    const { tagId } = req.params;
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    };
    const articles = await tagService.getArticlesByTagId(tagId, options);
    // res.status(200).json({ success: true, data: articles });
    return { articles };
  } catch (error) {
    next(error)
  }
}

/**
 * Increases the view count of an article by 1.
 *
 * This function handles the request to increment the view count of the
 * specified article. It uses the article service to perform the update and
 * sends the updated view count in the response.
 *
 * @param {Object} req - The Express request object containing article ID in params.
 * @param {Object} res - The Express response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the view count has been
 *   incremented and the response is sent.
 *
 * @example
 * // Increment the view count of an article with ID 1
 * await articleController.increaseArticleViewCount({ params: { id: 1 } }, {}, () => {});
 */
const increaseArticleViewCount = async (req, res, next) => {
  try {
    // Extract the article ID from the request parameters
    const { id } = req.params

    // Increase the article's view count using the article service
    const views = await articleService.increaseArticleViewCount(id)

    // Send a success response with the updated view count
    res.status(200).json({
      success: true,
      data: views,
    })
  } catch (error) {
    // Pass any errors to the next middleware
    next(error)
  }
}

/**
 * Downloads an article as a file.
 *
 * This function handles the request to download an article by its ID. It uses
 * the article service to retrieve the article and check if it is published and
 * not premium. If the article is found and meets the criteria, it downloads the
 * file associated with the article.
 *
 * @param {Object} req - The Express request object containing the article ID in
 *   params.
 * @param {Object} res - The Express response object used to send the file.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the file has been
 *   downloaded and the response is sent.
 *
 * @throws {Error} If there is an error retrieving the article or downloading
 *   the file.
 *
 * @example
 * // Download an article with ID 1
 * await articleController.downloadArticle({ params: { id: 1 } }, {}, () => {});
 */
const downloadArticle = async (req, res, next) => {
  try {
    // Retrieve the article ID from the request parameters
    const { id } = req.params

    // Retrieve the article from the database
    const article = await articleService.getArticleById(id)

    // Check if the article is found
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' })
    }

    // Check if the article is premium
    if (article.is_premium) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    // Check if the article is published
    if (article.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Article not published' })
    }

    // Download the file associated with the article
    const file = await articleService.downloadArticle(id)

    // Check if the file is found
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' })
    }

    // Send the file as a response
    res.download(file.path)
  } catch (error) {
    // Pass any errors to the next middleware
    next(error)
  }
}

// GET /api/v1/articles/home?type=(featured|most-viewed|newest|top-categories)
const getHomepageArticles = async (req, res, next) => {
  try {
    const type = req.query.type;
    const homepageData = await articleService.getHomepageArticles(type);
    // res.status(200).json({
    //   success: true,
    //   data: homepageData,
    // });
    return { homepageData };
  } catch (error) {
    next(error);
  }
};

export default {
  getAllArticles,
  getArticleById,
  searchArticles,
  getArticlesByCategory,
  getArticlesByTag,
  increaseArticleViewCount,
  downloadArticle,
  getHomepageArticles,
};
