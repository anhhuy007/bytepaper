// models/categoryModel.js
import BaseModel from "./BaseModel.js";
import db from "../utils/db.js";
// CREATE TABLE categories (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(100) NOT NULL,
//   parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

class CategoryModel extends BaseModel {
  constructor() {
    super("categories");
  }

  /**
   * Retrieves a category from the database by its ID.
   *
   * This method will return a category with the specified `id` if it exists in the
   * database, otherwise it will return `null`.
   *
   * @param {number} id The ID of the category to retrieve.
   * @returns {Promise<Object | null>} The category with the specified `id` or `null`
   * if it does not exist.
   *
   * @example
   * const category = await categoryModel.getCategoryById(1);
   * console.log(category);
   * { id: 1, name: "JavaScript", parent_id: null, created_at: "2022-01-01 12:00:00", ... }
   */
  async getCategoryById(id) {
    return await this.findById(id);
  }

  /**
   * Retrieves all categories from the database.
   *
   * This method fetches all categories, including their parent category names if they exist.
   * The categories are ordered alphabetically by their name.
   *
   * @returns {Promise<Object[]>} A list of all categories, each with an optional parent category name.
   *
   * @example
   * const categories = await categoryModel.getAllCategories();
   * console.log(categories);
   * // [{ id: 1, name: "JavaScript", parent_name: null, ... }, { id: 2, name: "Node.js", parent_name: "JavaScript", ... }]
   */
  async getAllCategories() {
    // SQL query to select all categories with their parent category names
    const query = `
      SELECT c1.*, c2.name AS parent_name
      FROM categories c1
      LEFT JOIN categories c2 ON c1.parent_id = c2.id
      ORDER BY c1.name ASC
    `;
    // Execute the query and retrieve the results
    const { rows } = await db.query(query);
    // Return the list of categories
    return rows;
  }

  /**
   * Creates a new category in the database.
   *
   * This method will insert a new category with the specified `data` into the
   * database and return the newly created category.
   *
   * @param {Object} data - The data to create the category with, must contain the
   * `name` property.
   *
   * @returns {Promise<Object>} The newly created category.
   *
   * @example
   * const category = await categoryModel.createCategory({ name: "React" });
   * console.log(category);
   * // { id: 1, name: "React", created_at: "2022-01-01 12:00:00", ... }
   */
  async createCategory(data) {
    return await this.create(data);
  }

  /**
   * Updates an existing category in the database.
   *
   * This method will update the category with the specified `id` using the
   * provided `data`.
   *
   * @param {number} id - The ID of the category to update.
   * @param {Object} data - The data to update the category with.
   *
   * @returns {Promise<Object>} The updated category.
   *
   * @example
   * const updatedCategory = await categoryModel.updateCategory(1, { name: "React Hooks" });
   * console.log(updatedCategory);
   * // { id: 1, name: "React Hooks", created_at: "2022-01-01 12:00:00", ... }
   */
  async updateCategory(id, data) {
    return await this.update(id, data);
  }

  /**
   * Deletes a category from the database.
   *
   * This method will delete the category with the specified `id` from the
   * database and return the deleted category.
   *
   * @param {number} id - The ID of the category to delete.
   *
   * @returns {Promise<Object>} The deleted category.
   *
   * @example
   * const deletedCategory = await categoryModel.deleteCategory(1);
   * console.log(deletedCategory);
   * // { id: 1, name: "JavaScript", parent_id: null, created_at: "2022-01-01 12:00:00", ... }
   */
  async deleteCategory(id) {
    return await this.delete(id);
  }

  /**
   * Retrieves a list of categories with the number of articles in each category.
   *
   * This method will execute a SQL query to retrieve a list of categories with
   * the number of articles in each category. The result is an array of objects with
   * the keys "id", "name", "parent_id", "created_at", and "article_count".
   *
   * @returns {Promise<Object[]>} The list of categories with article counts.
   *
   * @example
   * const categories = await categoryModel.getCategoriesWithArticleCount();
   * console.log(categories);
   * [
   *   { id: 1, name: "JavaScript", parent_id: null, created_at: "2022-01-01 12:00:00", article_count: 5 },
   *   { id: 2, name: "React", parent_id: null, created_at: "2022-01-01 12:00:00", article_count: 3 },
   *   { id: 3, name: "React Hooks", parent_id: 2, created_at: "2022-01-01 12:00:00", article_count: 2 },
   *   ...
   * ]
   */
  async getCategoriesWithArticleCount() {
    const query = `
      SELECT c.*, COUNT(a.id) AS article_count
      FROM categories c
      LEFT JOIN articles a ON a.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // Add another methods related to categories...
}

const categoryModel = new CategoryModel();
export default categoryModel;
