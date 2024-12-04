// models/articleTag.model.js

import BaseModel from './Base.model.js'
import db from '../utils/Database.js'
// CREATE TABLE article_tags (
//   article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
//   tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
//   PRIMARY KEY (article_id, tag_id)
// );

class ArticleTagModel extends BaseModel {
  constructor() {
    super('article_tags')
  }
  async addTagsToArticle(articleId, tagIds) {
    // Create the insert values as a string, with each tag ID as a separate
    // parameter
    const insertValues = tagIds.map((tagId, idx) => `($1, $${idx + 2})`).join(', ')

    // Build the INSERT query with the ON CONFLICT DO NOTHING clause to
    // prevent duplicate tags from being inserted
    const query = `
      INSERT INTO article_tags (article_id, tag_id)
      VALUES ${insertValues}
      ON CONFLICT DO NOTHING
      RETURNING *
    `

    // Execute the query with the article ID and tag IDs as parameters
    const values = [articleId, ...tagIds]
    const { rows } = await db.query(query, values)

    // Return the inserted tags, or an empty array if no tags were inserted
    return rows
  }

  async removeTagsFromArticle(articleId, tagIds) {
    // Create a string of placeholders for the tag IDs
    const deleteValues = tagIds.map((tagId, idx) => `$${idx + 2}`).join(', ')

    // Build the DELETE query to remove the specified tags from the article
    const query = `
      DELETE FROM article_tags
      WHERE article_id = $1 AND tag_id IN (${deleteValues})
    `

    // Execute the query with the article ID and tag IDs as parameters
    const values = [articleId, ...tagIds]
    await db.query(query, values)
  }

  async getArticlesByTagId(tagId, options = {}) {
    const query = `
      SELECT a.*
      FROM articles a
      INNER JOIN article_tags at ON a.id = at.article_id
      WHERE at.tag_id = $1
      ORDER BY a.published_at DESC
      LIMIT $2 OFFSET $3
    `
    const values = [tagId, options.limit || 10, options.offset || 0]
    const { rows } = await db.query(query, values)
    return rows
  }

  async getTagsByArticleId(articleId, options = {}) {
    // Construct the SQL query to retrieve tags associated with the given article ID
    const query = `
      SELECT t.*
      FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = $1
      ORDER BY t.name ASC
      LIMIT $2 OFFSET $3
    `

    // Define query parameter values, using defaults for limit and offset if not provided
    const values = [articleId, options.limit || 10, options.offset || 0]

    // Execute the query with the provided values and retrieve the rows
    const { rows } = await db.query(query, values)

    // Return the list of retrieved tags
    return rows
  }
  // Add another methods related to article_tags...
}

const articleTagModel = new ArticleTagModel()
export default articleTagModel
