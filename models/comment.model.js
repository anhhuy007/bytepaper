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

  async createComment(data) {
    // Use the create method to insert a new comment into the database
    return await this.create(data)
  }

  async updateComment(id, data) {
    // Call the update method to update the comment in the database
    return await this.update(id, data)
  }

  async deleteComment(id) {
    return await this.delete(id)
  }

  async deleteCommentByUserID(user_id) {
    const text = 'DELETE FROM comments WHERE user_id = $1 RETURNING *;'
    const values = [user_id]

    await db.query(text, values)
  }
}

const commentModel = new CommentModel()
export default commentModel
