// services/categoryService.js

import categoryModel from '../models/categoryModel.js'

class CategoryService {
  /**
   * Retrieves all categories from the database.
   *
   * This method will return a list of all categories available in the database.
   * The categories include their parent category names if they exist and are ordered alphabetically.
   *
   * @returns {Promise<Object[]>} The list of all categories retrieved from the database.
   * @example
   * const categories = await categoryService.getAllCategories();
   * console.log(categories);
   * // [
   * //   { id: 1, name: "JavaScript", parent_name: null, created_at: "2022-01-01 12:00:00", ... },
   * //   { id: 2, name: "Node.js", parent_name: "JavaScript", created_at: "2022-01-01 12:00:00", ... },
   * // ]
   */
  async getAllCategories() {
    // Fetch all categories from the category model
    return await categoryModel.getAllCategories()
  }

  /**
   * Retrieves a category by its ID.
   *
   * This method will return a category with the specified `id` if it exists in the
   * database, otherwise it will throw an error.
   *
   * @param {number} id - The ID of the category to retrieve.
   *
   * @returns {Promise<Object>} The category with the specified `id` if it exists.
   * @throws {Error} If the category with the specified `id` does not exist.
   *
   * @example
   * const category = await categoryService.getCategoryById(1);
   * console.log(category);
   * // { id: 1, name: "JavaScript", parent_id: null, created_at: "2022-01-01 12:00:00", ... }
   */
  async getCategoryById(id) {
    const category = await categoryModel.getCategoryById(id)
    if (!category) {
      throw new Error(`Category with ID ${id} not found`)
    }
    return category
  }

  /**
   * Creates a new category in the database.
   *
   * This method will create a new category in the database with the specified `data`.
   * The category will be created with the `name` property set to the `name` property of
   * the `data` object and the `parent_id` property set to the `parent_id` property of
   * the `data` object or `null` if no parent is specified.
   *
   * @param {Object} data - The data to create the category with. The following properties
   * are required:
   *
   *   - `name`: The name of the category.
   *   - `parent_id`: The ID of the parent category, or null if no parent is specified.
   *
   * @returns {Promise<Object>} The created category with its ID.
   *
   * @example
   * const category = await categoryService.createCategory({
   *   name: "Example Category",
   *   parent_id: null,
   * });
   * console.log(category);
   * // { id: 1, name: "Example Category", parent_id: null, created_at: "2022-01-01 12:00:00", ... }
   */
  async createCategory(data) {
    return await categoryModel.createCategory(data)
  }

  /**
   * Updates an existing category in the database.
   *
   * This method will update the category with the specified `id` using the
   * provided `data`.
   *
   * @param {number} id - The ID of the category to update.
   * @param {Object} data - The data to update the category with. The following
   * properties are optional:
   *
   *   - `name`: The name of the category.
   *   - `parent_id`: The ID of the parent category, or null if no parent is
   *     specified.
   *
   * @returns {Promise<Object>} The updated category with its ID.
   *
   * @example
   * const category = await categoryService.updateCategory(1, {
   *   name: "Updated Category Name",
   *   parent_id: null,
   * });
   * console.log(category);
   * // { id: 1, name: "Updated Category Name", parent_id: null, created_at: "2022-01-01 12:00:00", ... }
   */
  async updateCategory(id, data) {
    const category = await categoryModel.findById(id)
    if (!category) {
      throw new Error('Category not found')
    }
    return await categoryModel.updateCategory(id, data)
  }

  /**
   * Deletes a category from the database.
   *
   * This method will delete the category with the specified `id` from the
   * database. If the category does not exist, an error is thrown.
   *
   * @param {number} id - The ID of the category to delete.
   *
   * @returns {Promise<void>} A promise that resolves if the category is deleted
   *                          successfully.
   *
   * @throws {Error} If the category with the specified `id` does not exist.
   *
   * @example
   * await categoryService.deleteCategory(1);
   */
  async deleteCategory(id) {
    const category = await categoryModel.findById(id)
    if (!category) {
      throw new Error(`Category with ID ${id} not found`)
    }
    return await categoryModel.deleteCategory(id)
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
   * const categories = await categoryService.getCategoriesWithArticleCount();
   * console.log(categories);
   * [
   *   { id: 1, name: "JavaScript", parent_id: null, created_at: "2022-01-01 12:00:00", article_count: 5 },
   *   { id: 2, name: "Node.js", parent_id: null, created_at: "2022-01-01 12:00:00", article_count: 3 },
   *   { id: 3, name: "React Hooks", parent_id: 2, created_at: "2022-01-01 12:00:00", article_count: 2 },
   *   ...
   * ]
   */
  async getCategoriesWithArticleCount() {
    return await categoryModel.getCategoriesWithArticleCount()
  }
}
export default new CategoryService()
