// models/tag.model.js
import BaseModel from './Base.model.js'
import db from '../utils/Database.js'
import { buildSelectQuery, buildWhereClause } from '../utils/QueryBuilder.js'
// CREATE TABLE tags (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(50) UNIQUE NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

class TagModel extends BaseModel {
  constructor() {
    super('tags')
  }

  async getTagById(id) {
    return await this.findById(id)
  }

  async getAllTags(filters = {}, options = {}) {
    const { whereClause, values } = buildWhereClause(filters)

    // Build the SQL query for fetching tags with filters and pagination
    const query = buildSelectQuery({
      table: 'tags',
      columns: ['id', 'name', 'created_at'],
      where: whereClause,
      orderBy: options.orderBy,
      limit: options.limit,
      offset: options.offset,
    })

    const totalCountQuery = `
      SELECT COUNT(*) 
      FROM tags 
      ${whereClause ? `WHERE ${whereClause}` : ''}
    `

    // Execute both queries in parallel
    const [tagsResult, countResult] = await Promise.all([
      db.query(query, values),
      db.query(totalCountQuery, values),
    ])

    return {
      tags: tagsResult.rows,
      totalTags: parseInt(countResult.rows[0].count, 10),
    }
  }

  async createTag(data) {
    // Create the tag using the create method
    return await this.create(data)
  }

  async updateTag(id, data) {
    // Update the tag using the update method
    return await this.update(id, data)
  }

  async deleteTag(id) {
    return await this.delete(id)
  }

  async getTagsByArticleId(articleId) {
    // Construct the SQL query to retrieve tags associated with the given article ID
    const query = `
      SELECT t.*
      FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = $1
      ORDER BY t.name ASC
    `

    // Execute the query with the article ID as a parameter
    const { rows } = await db.query(query, [articleId])

    // Return the list of retrieved tags
    return rows
  }
}

const tagModel = new TagModel()
export default tagModel
