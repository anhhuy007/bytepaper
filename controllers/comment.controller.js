// controllers/commentController.js

import commentService from '../services/comment.service.js'

/**
 * Retrieves a list of comments associated with the specified article ID.
 *
 * @param {Object} req - The Express.js request object containing the article ID
 *   to retrieve comments for.
 * @param {Object} res - The Express.js response object used to send the comments
 *   data back to the client.
 * @param {Function} next - The Express.js next middleware function which is used
 *   to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished
 *   executing.
 * @throws {Error} If there is an error retrieving the comments.
 *
 * The options object can be used to limit the number of records returned
 * (default is 10) and to skip a specified number of records before returning
 * the results (default is 0).
 *
 * @example
 * const response = await commentController.getCommentsByArticleId(req, res, next);
 * console.log(response);
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: 1,
 *       article_id: 1,
 *       user_id: 1,
 *       content: "This is the first comment.",
 *       created_at: "2021-01-01T00:00:00.000Z",
 *       updated_at: "2021-01-01T00:00:00.000Z",
 *       user_name: "John Doe",
 *     },
 *     {
 *       id: 2,
 *       article_id: 1,
 *       user_id: 2,
 *       content: "This is the second comment.",
 *       created_at: "2021-01-01T00:00:00.000Z",
 *       updated_at: "2021-01-01T00:00:00.000Z",
 *       user_name: "Jane Doe",
 *     },
 *   ],
 * }
 */
const getCommentsByArticleId = async (req, res, next) => {
  // Retrieve the article ID from the request
  const articleId = req.params.articleId

  // Retrieve the options from the request query
  const options = {
    limit: parseInt(req.query.limit) || 10,
    offset: parseInt(req.query.offset) || 0,
  }

  // Retrieve the comments associated with the given article ID
  try {
    const comments = await commentService.getCommentsByArticleId(articleId, options)
    // Return the comments as JSON response
    res.status(200).json({ success: true, data: comments })
  } catch (error) {
    // If any error occurs, pass it to the next middleware function
    next(error)
  }
}

/**
 * Adds a comment to an article.
 *
 * This middleware will add a comment to an article with the given ID and
 * content. The comment will be associated with the user who is currently
 * logged in.
 *
 * @param {Object} req - The Express.js request object containing the article
 *   ID and comment content in the URL parameters and request body.
 * @param {Object} res - The Express.js response object used to send the newly
 *   created comment back to the client.
 * @param {Function} next - The Express.js next middleware function which is used
 *   to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished
 *   executing.
 * @throws {Error} If there is an error adding the comment.
 *
 * @example
 * const response = await commentController.addCommentToArticle(req, res, next);
 * console.log(response);
 * {
 *   success: true,
 *   data: {
 *     id: 1,
 *     article_id: 1,
 *     user_id: 1,
 *     content: "This is a comment.",
 *     created_at: "2021-01-01T00:00:00.000Z",
 *     updated_at: "2021-01-01T00:00:00.000Z",
 *     user_name: "John Doe",
 *   },
 * }
 */
const addCommentToArticle = async (req, res, next) => {
  // Extract the article ID and comment content from the request
  const articleId = req.params.articleId
  const { content } = req.body

  try {
    // Add the comment to the database
    const comment = await commentService.addCommentToArticle(articleId, req.user.id, content)

    // Send the newly created comment as a JSON response
    res.status(201).json({ success: true, data: comment })
  } catch (error) {
    // If any error occurs, pass it to the next middleware function
    next(error)
  }
}

/**
 * Updates a comment in the database.
 *
 * This method verifies the existence of the comment, checks if the user is authorized to update it,
 * and updates the comment content.
 *
 * @param {Object} req - The Express.js request object containing the comment ID and update data.
 * @param {Object} res - The Express.js response object used to send the updated comment back to the client.
 * @param {Function} next - The Express.js next middleware function which is used to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished executing.
 * @throws {Error} If the comment is not found or the user is not authorized.
 * @example
 * const response = await commentController.updateComment(req, res, next);
 * console.log(response);
 * {
 *   success: true,
 *   data: {
 *     id: 1,
 *     article_id: 1,
 *     user_id: 1,
 *     content: "This is an updated comment.",
 *     created_at: "2021-01-01T00:00:00.000Z",
 *     updated_at: "2021-01-01T00:00:00.000Z",
 *     user_name: "John Doe",
 *   },
 * }
 */
const updateComment = async (req, res, next) => {
  try {
    // Extract the comment ID and update content from the request
    const commentId = req.params.commentId
    const { content } = req.body

    // Update the comment in the database
    const comment = await commentService.updateComment(commentId, req.user.id, content)

    // Send the updated comment as a JSON response
    res.status(200).json({ success: true, data: comment })
  } catch (error) {
    // If any error occurs, pass it to the next middleware function
    next(error)
  }
}

/**
 * Deletes a comment from the database.
 *
 * This method attempts to delete a comment with the given comment ID provided
 * in the request parameters. The ID of the user attempting to delete the comment
 * is also provided in the request object.
 *
 * @param {Object} req - The Express request object containing comment ID in params.
 * @param {Object} res - The Express response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the comment is deleted
 *   and the response is sent.
 *
 * @example
 * // Delete a comment with ID 1
 * await deleteComment(req, res, next);
 * console.log(response);
 * // { success: true, message: "Comment deleted successfully" }
 */
const deleteComment = async (req, res, next) => {
  try {
    // Extract the comment ID from the request parameters
    const commentId = req.params.commentId

    // Extract the user ID from the authenticated request
    const userId = req.user.id

    // Delete the comment using the comment service
    await commentService.deleteComment(commentId, userId)

    // Send a success response indicating the comment was deleted
    res.status(200).json({ success: true, message: 'Comment deleted successfully' })
  } catch (error) {
    // Pass any errors to the next middleware
    next(error)
  }
}

export default {
  getCommentsByArticleId,
  addCommentToArticle,
  updateComment,
  deleteComment,
}
