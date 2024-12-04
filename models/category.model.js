// models/categoryModel.js
import BaseModel from './Base.model.js'
import db from '../utils/Database.js'
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

  async getAllCategories() {
    // SQL query to select all categories with their parent category names
    const query = `
        SELECT c1.*, c2.name AS parent_name
        FROM categories c1
        LEFT JOIN categories c2 ON c1.parent_id = c2.id
        ORDER BY c1.name ASC
      `
    // Execute the query and retrieve the results
    const { rows } = await db.query(query)
    // Return the list of categories
    return rows
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
}

const categoryModel = new CategoryModel()
export default categoryModel
