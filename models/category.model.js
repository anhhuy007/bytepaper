// models/categoryModel.js
import BaseModel from './Base.model.js'
import db from '../utils/Database.js'
import { buildSelectQuery, buildWhereClause } from '../utils/queryBuilder.js'
// CREATE TABLE categories (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(100) NOT NULL,
//   parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

class CategoryModel extends BaseModel {
  constructor() {
    super('categories')
  }

  async getCategoryById(id) {
    return await this.findById(id)
  }

  async getAllCategories(filters = {}, options = {}) {
    const { whereClause, values } = buildWhereClause(filters)

    // Set defaults for limit and offset if not provided
    const limit = options.limit || 10 // Default limit to 10
    const offset = options.offset || 0 // Default offset to 0

    const query = `
    SELECT c1.id, c1.name, c1.parent_id, c1.created_at, c2.name AS parent_name
    FROM categories c1
    LEFT JOIN categories c2 ON c1.parent_id = c2.id
    ${whereClause ? `WHERE ${whereClause}` : ''}
    ORDER BY ${options.orderBy || 'c1.name ASC'}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `

    const totalCountQuery = `
    SELECT COUNT(*)
    FROM categories c1
    ${whereClause ? `WHERE ${whereClause}` : ''}
  `

    const [categoriesResult, countResult] = await Promise.all([
      db.query(query, [...values, limit, offset]),
      db.query(totalCountQuery, values),
    ])

    return {
      categories: categoriesResult.rows,
      totalCategories: parseInt(countResult.rows[0].count, 10),
    }
  }

  async createCategory(data) {
    return await this.create(data)
  }

  async updateCategory(id, data) {
    return await this.update(id, data)
  }

  async deleteCategory(id) {
    return await this.delete(id)
  }

  async getCategoriesWithArticleCount() {
    const query = `
        SELECT c.*, COUNT(a.id) AS article_count
        FROM categories c
        LEFT JOIN articles a ON a.category_id = c.id
        GROUP BY c.id
        ORDER BY c.name ASC
      `
    const { rows } = await db.query(query)
    return rows
  }

  async getParentCategories(id) {
    const query = `
        SELECT c1.*, c2.name AS parent_name
        FROM categories c1
        LEFT JOIN categories c2 ON c1.parent_id = c2.id
        WHERE c1.id = $1
      `
    const { rows } = await db.query(query, [id])
    return rows
  }

  // Add another methods related to categories...
  async getAvailableCategories(filters = {}, options = {}) {
    const queryParams = []
    let query = `
      SELECT *
      FROM categories
      WHERE 1=1
    `

    if (filters.exclude && filters.exclude.length > 0) {
      query += ` AND id NOT IN (${filters.exclude.map((_, idx) => `$${queryParams.length + idx + 1}`).join(', ')})`
      queryParams.push(...filters.exclude)
    }

    query += `
      ORDER BY ${options.orderBy || 'name ASC'}
      LIMIT $${queryParams.length + 1}
      OFFSET $${queryParams.length + 2}
    `
    queryParams.push(options.limit || 10, options.offset || 0)

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM categories 
      WHERE 1=1
      ${filters.exclude && filters.exclude.length > 0 ? ` AND id NOT IN (${filters.exclude.map((_, idx) => `$${idx + 1}`).join(', ')})` : ''}
    `

    const totalCategories = await db.query(countQuery, filters.exclude || [])
    const { rows: categories } = await db.query(query, queryParams)

    return { categories, totalCategories: totalCategories.rows[0].total }
  }
}

const categoryModel = new CategoryModel()
export default categoryModel
