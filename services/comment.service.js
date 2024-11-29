// services/commentService.js

import commentModel from "../models/comment.model.js";

class CommentService {
  /**
   * Retrieves a list of comments associated with the specified article ID.
   *
   * This method wraps the `getCommentsByArticleId` method of the `commentModel`.
   * See the documentation for that method for more information.
   *
   * @param {number} articleId - The ID of the article to retrieve comments for.
   * @param {Object} [options={}] - The options to apply to the query.
   * @param {number} [options.limit=10] - The number of records to return.
   * @param {number} [options.offset=0] - The number of records to skip before
   *   returning results.
   *
   * @returns {Promise<Object[]>} The list of comments associated with the
   *   article ID.
   * @example
   * const comments = await commentService.getCommentsByArticleId(1);
   * console.log(comments);
   * [
   *   {
   *     id: 1,
   *     article_id: 1,
   *     user_id: 1,
   *     content: "This is the first comment.",
   *     created_at: "2021-01-01T00:00:00.000Z",
   *     updated_at: "2021-01-01T00:00:00.000Z",
   *     user_name: "John Doe",
   *   },
   *   {
   *     id: 2,
   *     article_id: 1,
   *     user_id: 2,
   *     content: "This is the second comment.",
   *     created_at: "2021-01-01T00:00:00.000Z",
   *     updated_at: "2021-01-01T00:00:00.000Z",
   *     user_name: "Jane Doe",
   *   },
   * ]
   */
  async getCommentsByArticleId(articleId, options = {}) {
    return await commentModel.getCommentsByArticleId(articleId, options);
  }

  /**
   * Creates a new comment in the database associated with the specified article ID.
   *
   * This method wraps the `createComment` method of the `commentModel` and
   * provides some additional validation.
   *
   * @param {number} articleId - The ID of the article to add the comment to.
   * @param {number} userId - The ID of the user who is adding the comment.
   * @param {string} content - The content of the comment.
   *
   * @returns {Promise<Object>} The newly created comment.
   * @example
   * const newComment = await commentService.addCommentToArticle(1, 1, "This is a comment.");
   * console.log(newComment);
   * // { id: 1, article_id: 1, user_id: 1, content: "This is a comment.", ... }
   */
  async addCommentToArticle(articleId, userId, content) {
    // Validate the article ID, user ID, and content
    if (!articleId || !userId || !content) {
      throw new Error("Article ID, user ID, and content are required");
    }

    // Create the new comment
    const newComment = {
      article_id: articleId,
      user_id: userId,
      content,
    };

    // Call the createComment method of the commentModel
    return await commentModel.createComment(newComment);
  }

  /**
   * Updates an existing comment in the database.
   *
   * This method verifies the existence of the comment, checks if the user is authorized to update it,
   * and updates the comment content.
   *
   * @param {number} commentId - The ID of the comment to update.
   * @param {number} userId - The ID of the user attempting to update the comment.
   * @param {string} content - The new content for the comment.
   * @returns {Promise<Object>} The updated comment.
   * @throws {Error} If the comment is not found or the user is not authorized.
   */
  async updateComment(commentId, userId, content) {
    // Retrieve the existing comment by its ID
    const comment = await commentModel.findById(commentId);

    // Check if the comment exists
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Verify that the user is authorized to update the comment
    if (comment.user_id !== userId) {
      throw new Error("Unauthorized");
    }

    // Update the comment content in the database
    return await commentModel.updateComment(commentId, { content });
  }

  /**
   * Deletes a comment from the database.
   *
   * This method verifies the existence of the comment, checks if the user is authorized to delete it,
   * and deletes the comment from the database.
   *
   * @param {number} commentId - The ID of the comment to delete.
   * @param {number} userId - The ID of the user attempting to delete the comment.
   * @returns {Promise<void>} A promise that resolves if the comment is deleted successfully.
   * @throws {Error} If the comment is not found or the user is not authorized.
   */
  async deleteComment(commentId, userId) {
    // Retrieve the existing comment by its ID
    const comment = await commentModel.findById(commentId);

    // Check if the comment exists
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Verify that the user is authorized to delete the comment
    if (comment.user_id !== userId) {
      throw new Error("Unauthorized");
    }

    // Delete the comment from the database
    await commentModel.deleteComment(commentId);
  }

  /**
   * Deletes comments associated with a given user ID.
   *
   * @param {string|number} user_id - The ID of the user whose comments will be deleted.
   *
   * @returns {Promise<void>} The promise that resolves when the comments are deleted.
   * @throws {Error} If any error occurs while deleting the comments.
   */
  async deleteCommentByUserID(user_id) {
    await commentModel.deleteCommentByUserID(user_id);
  }
}

export default new CommentService();
