// services/adminService.js

import userModel from "../models/userModel.js";
import categoryModel from "../models/categoryModel.js";
import editorCategoryModel from "../models/editorCategoryModel.js";

class AdminService {
  /**
   * Retrieves a list of users from the database based on the provided filters and
   * options.
   *
   * @param {Object} [filters={}] - The filters to apply to the query. Each filter
   * should be an object with the column name as the key and the value to filter by
   * as the value.
   * @param {Object} [options={}] - The options to apply to the query. The
   * following options are supported:
   *
   *   - `orderBy`: The column(s) to order the results by.
   *   - `limit`: The maximum number of records to return.
   *   - `offset`: The number of records to skip before returning results.
   *
   * @returns {Promise<Object[]>} The list of users retrieved from the database.
   *
   * @example
   * const users = await adminService.getAllUsers({
   *   role: "subscriber",
   * }, {
   *   orderBy: "name ASC",
   *   limit: 10,
   * });
   */
  async getAllUsers(filters = {}, options = {}) {
    return await userModel.find(filters, options);
  }

  /**
   * Assigns a role to a user.
   *
   * This method updates the role of the user with the specified userId.
   * The role must be one of the valid roles: guest, subscriber, writer, editor, admin.
   *
   * @param {number} userId - The ID of the user to update.
   * @param {string} role - The role to assign to the user.
   * @returns {Promise<Object>} The updated user record.
   * @throws {Error} If the role is not valid.
   * @example
   * const updatedUser = await adminService.assignUserRole(1, "writer");
   * console.log(updatedUser);
   * // { id: 1, username: "johnDoe", email: "johndoe@example.com", role: "writer", ... }
   */
  async assignUserRole(userId, role) {
    return await userModel.assignRole(userId, role);
  }

  /**
   * Deletes a user from the database.
   *
   * This method will remove the user with the specified user ID from the database
   * and return the deleted user record.
   *
   * @param {number} userId - The ID of the user to delete.
   * @returns {Promise<Object>} The deleted user record.
   * @example
   * const deletedUser = await adminService.deleteUser(1);
   * console.log(deletedUser);
   * // { id: 1, username: "johnDoe", email: "johndoe@example.com", ... }
   */
  async deleteUser(userId) {
    // Delete the user with the specified ID and return the deleted record
    return await userModel.delete(userId);
  }

  /**
   * Creates a new category in the database.
   *
   * This method will create a new category in the database with the specified `data`.
   * The category will be created with the `name` property set to the `name` property of
   * the `data` object.
   *
   * @param {Object} data - The data to create the category with. The following properties
   * are required:
   *
   *   - `name`: The name of the category.
   *
   * @returns {Promise<Object>} The created category with its ID.
   *
   * @example
   * const category = await adminService.createCategory({ name: "React" });
   * console.log(category);
   * // { id: 1, name: "React", created_at: "2022-01-01 12:00:00", ... }
   */
  async createCategory(data) {
    return await categoryModel.createCategory(data);
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
   * const updatedCategory = await adminService.updateCategory(1, { name: "React" });
   * console.log(updatedCategory);
   * // { id: 1, name: "React", created_at: "2022-01-01 12:00:00", ... }
   */
  async updateCategory(id, data) {
    return await categoryModel.updateCategory(id, data);
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
   * const deletedCategory = await adminService.deleteCategory(1);
   * console.log(deletedCategory);
   * // { id: 1, name: "JavaScript", parent_id: null, created_at: "2022-01-01 12:00:00", ... }
   */
  async deleteCategory(id) {
    return await categoryModel.deleteCategory(id);
  }

  /**
   * Assigns categories to an editor.
   *
   * This method will delete all existing category assignments for the editor
   * and then insert new assignments for the specified category IDs.
   *
   * @param {number} editorId - The ID of the editor to assign categories to.
   * @param {number[]} categoryIds - The IDs of the categories to assign.
   * @returns {Promise<Object[]>} The inserted assignments.
   *
   * @example
   * const assignments = await adminService.assignCategoriesToEditor(1, [1, 2]);
   * console.log(assignments);
   * [
   *   { editor_id: 1, category_id: 1 },
   *   { editor_id: 1, category_id: 2 },
   * ]
   */
  async assignCategoriesToEditor(editorId, categoryIds) {
    return await editorCategoryModel.assignCategories(editorId, categoryIds);
  }

  /**
   * Retrieves the categories assigned to an editor.
   *
   * This method will return a list of categories assigned to the specified
   * editor ID.
   *
   * @param {number} editorId - The ID of the editor to retrieve categories for.
   * @returns {Promise<Object[]>} The list of categories assigned to the editor.
   *
   * @example
   * const categories = await adminService.getCategoriesByEditor(1);
   * console.log(categories);
   * [
   *   { id: 1, name: "JavaScript", parent_id: null, created_at: "2022-01-01 12:00:00", ... },
   *   { id: 2, name: "Node.js", parent_id: null, created_at: "2022-01-01 12:00:00", ... },
   * ]
   */
  async getCategoriesByEditor(editorId) {
    return await editorCategoryModel.getCategoriesByEditor(editorId);
  }

  /**
   * Retrieves the editors assigned to a category.
   *
   * This method will return a list of editors assigned to the specified
   * category ID.
   *
   * @param {number} categoryId - The ID of the category to retrieve editors for.
   * @returns {Promise<Object[]>} The list of editors assigned to the category.
   *
   * @example
   * const editors = await adminService.getEditorsByCategory(1);
   * console.log(editors);
   * [
   *   { id: 1, full_name: "John Doe", email: "johndoe@example.com", role: "editor", ... },
   *   { id: 2, full_name: "Jane Doe", email: "janedoe@example.com", role: "editor", ... },
   * ]
   */
  async getEditorsByCategory(categoryId) {
    return await editorCategoryModel.getEditorsByCategory(categoryId);
  }
}

export default new AdminService();
