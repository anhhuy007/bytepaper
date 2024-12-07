// models/commentModel.js

import BaseModel from './Base.model.js'
import db from '../utils/Database.js'
// CREATE TABLE comments (
//   id SERIAL PRIMARY KEY,
//   article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
//   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   content TEXT NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

class CommentModel extends BaseModel {
  constructor() {
    super('comments')
  }

  async getCommentsByArticleId(articleId, { limit = 10, offset = 0 } = {}) {
    // Construct the SQL query to retrieve comments associated with the given article ID
    const query = `
      SELECT c.*, u.full_name AS user_name
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.article_id = $1
      ORDER BY c.created_at ASC
      LIMIT $2 OFFSET $3
    `

    // Define query parameter values, using defaults for limit and offset if not provided
    const values = [articleId, limit, offset]

    // Execute the query with the provided values and retrieve the rows
    const { rows } = await db.query(query, values)

    // Return the list of retrieved comments
    return rows
  }

  /**
   * Creates a new comment in the database.
   *
   * @param {Object} data - The data to create the comment with.
   * @param {number} data.article_id - The ID of the article the comment belongs to.
   * @param {number} data.user_id - The ID of the user who made the comment.
   * @param {string} data.content - The content of the comment.
   *
   * @returns {Promise<Object>} The newly created comment.
   *
   * @example
   * const comment = await commentModel.createComment({
   *   article_id: 1,
   *   user_id: 1,
   *   content: "This is a comment.",
   * });
   * console.log(comment);
   * // { id: 1, article_id: 1, user_id: 1, content: "This is a comment.", ... }
   */
  async createComment(data) {
    // Use the create method to insert a new comment into the database
    return await this.create(data)
  }

  /**
   * Updates an existing comment in the database.
   *
   * This method will update the comment with the specified `id` using the provided `data`.
   *
   * @param {number} id - The ID of the comment to update.
   * @param {Object} data - The data to update the comment with.
   * @returns {Promise<Object>} The updated comment.
   *
   * @example
   * const updatedComment = await commentModel.updateComment(1, { content: "Updated comment content" });
   * console.log(updatedComment);
   * // { id: 1, article_id: 1, user_id: 1, content: "Updated comment content", ... }
   */
  async updateComment(id, data) {
    // Call the update method to update the comment in the database
    return await this.update(id, data)
  }

  /**
   * Deletes a comment from the database.
   *
   * This method will delete the comment with the specified `id` from the database.
   *
   * @param {number} id - The ID of the comment to delete.
   *
   * @returns {Promise<void>} A promise that resolves if the comment is deleted
   *                          successfully.
   *
   * @example
   * await commentModel.deleteComment(1);
   */
  async deleteComment(id) {
    return await this.delete(id)
  }
  // Another methods related to comments...

  /**
   * Deletes comments associated with a given user ID from the database.
   *
   * @param {string|number} user_id - The ID of the user whose comments will be deleted.
   *
   * @returns {Promise<void>} The promise that resolves when the comments are deleted.
   * @throws {Error} If any error occurs while deleting the comments.
   */
  async deleteCommentByUserID(user_id) {
    const text = 'DELETE FROM comments WHERE user_id = $1 RETURNING *;'
    const values = [user_id]

    await db.query(text, values)
  }
}

const commentModel = new CommentModel()
export default commentModel
