// controllers/editor.controller.js

import articleService from '../services/article.service.js'
import adminService from '../services/admin.service.js'

/**
 * Retrieves a list of pending articles assigned to the current editor, based on
 * the categories they are assigned to.
 *
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @param {Function} next - The Express.js next middleware function for error
 *   handling.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has
 *   finished executing.
 * @throws {Error} If there is an error retrieving the articles.
 * @example
 * const response = await editorController.getPendingArticles(
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
 *       status: "pending",
 *       published_at: null,
 *       views: 0,
 *       is_premium: false,
 *       search_vector: null,
 *       created_at: "2021-01-01T00:00:00.000Z",
 *       updated_at: "2021-01-01T00:00:00.000Z",
 *       author_name: "John Doe",
 *       category_name: null,
 *     },
 *   ]
 * }
 */
const getPendingArticles = async (req, res, next) => {
  try {
    // Extract the editor ID from the request object
    const editorId = req.user.id

    // Retrieve categories assigned to the current editor
    const categories = await adminService.getCategoriesByEditor(editorId)

    // Map category IDs for filtering articles
    const categoryIds = categories.map((category) => category.id)

    // Define filters for pending articles within assigned categories
    const filters = {
      status: 'pending',
      category_id: categoryIds,
    }

    // Define options for pagination
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    }

    // Retrieve pending articles using the defined filters and options
    const articles = await articleService.getAllArticles(filters, options)

    // Send the retrieved articles as a JSON response
    res.status(200).json({ success: true, data: articles })
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error)
  }
}

const getMyArticles = async (req, res, next) => {
  try {
    const editorId = req.user.id
    const categories = await adminService.getCategoriesByEditor(editorId)
    const categoryIds = categories.map((category) => parseInt(category.id, 10))
    if (!categoryIds.length) {
      return []
    }
    const filters = {
      category_id: categoryIds,
    }

    const status = req.query.status

    if (!status) {
      filters.status = 'pending'
    }

    if (!['draft', 'pending', 'published', 'rejected', 'approved'].includes(status)) {
      throw new Error('Invalid status')
    }

    filters.status = status

    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    }
    const articles = await articleService.getAllArticles(filters, options)
    // res.status(200).json({ success: true, data: articles });
    return { articles }
  } catch (error) {
    next(error)
  }
}

/**
 * Approves an article for publication.
 *
 * This function handles the request to approve an article. It uses the article
 * service to perform the approval and sends a confirmation response back to the client.
 *
 * @param {Object} req - The Express.js request object containing the editor's ID in the user property and the article ID in the URL parameters.
 * @param {Object} res - The Express.js response object used to send the confirmation response.
 * @param {Function} next - The Express.js next middleware function for error handling.
 *
 * @returns {Promise<void>} A promise that resolves when the article has been approved and the response is sent.
 *
 * @throws {Error} If there is an error approving the article.
 */
const approveArticle = async (req, res, next) => {
  try {
    // Extract the editor ID from the request object
    const editorId = req.user.id

    const { categoryId, tagIds = [] } = req.body

    // Approve the article using the article service
    await articleService.approveArticle(req.params.articleId, editorId, categoryId, tagIds)

    // Send a success response
    res.status(200).json({ success: true, message: 'Article approved' })
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error)
  }
}

/**
 * Rejects an article for publication.
 *
 * This function handles the request to reject an article. It uses the article
 * service to perform the rejection and sends a confirmation response back to the client.
 *
 * @param {Object} req - The Express.js request object containing the editor's ID in the user property and the article ID in the URL parameters, and the rejection reason in the request body.
 * @param {Object} res - The Express.js response object used to send the confirmation response.
 * @param {Function} next - The Express.js next middleware function for error handling.
 *
 * @returns {Promise<void>} A promise that resolves when the article has been rejected and the response is sent.
 *
 * @throws {Error} If there is an error rejecting the article.
 */
const rejectArticle = async (req, res, next) => {
  try {
    // Extract the editor ID from the request object
    const editorId = req.user.id

    // Extract the rejection reason from the request body
    const { rejectionReason } = req.body

    // Reject the article using the article service
    await articleService.rejectArticle(req.params.articleId, editorId, rejectionReason)

    // Send a success response
    res.status(200).json({ success: true, message: 'Article rejected' })
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error)
  }
}

export default {
  getPendingArticles,
  getMyArticles,
  approveArticle,
  rejectArticle,
}
