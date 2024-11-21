// controllers/adminController.js

import adminService from "../services/adminService.js";

/**
 * Retrieves a list of users from the database based on the provided filters and
 * options.
 *
 * This method retrieves users based on provided filters and options.
 *
 * @param {Object} req.query - The filters to apply to the query. Each filter
 * should be an object with the column name as the key and the value to filter by
 * as the value.
 * @param {Object} req.query - The options to apply to the query. The
 * following options are supported:
 *
 *   - `limit`: The maximum number of records to return.
 *   - `offset`: The number of records to skip before returning results.
 *
 * @returns {Promise<Object[]>} The list of users retrieved from the database.
 *
 * @example
 * const users = await adminController.getAllUsers({
 *   role: "subscriber",
 * }, {
 *   limit: 10,
 * });
 * console.log(users);
 * [
 *   {
 *     id: 1,
 *     username: "johnDoe",
 *     email: "johndoe@example.com",
 *     role: "subscriber",
 *     ...,
 *   },
 * ]
 */
const getAllUsers = async (req, res, next) => {
  try {
    const filters = req.query;
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    };
    const users = await adminService.getAllUsers(filters, options);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * Assigns a role to a user.
 *
 * This method updates the role of the user with the specified user ID.
 * The role must be one of the valid roles: guest, subscriber, writer, editor, admin.
 *
 * @param {number} userId - The ID of the user to update.
 * @param {string} role - The role to assign to the user.
 * @returns {Promise<Object>} The updated user record.
 * @throws {Error} If the role is not valid.
 * @example
 * const updatedUser = await adminController.assignUserRole(1, "writer");
 * console.log(updatedUser);
 * { id: 1, username: "johnDoe", email: "johndoe@example.com", role: "writer", ... }
 */
const assignUserRole = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { role } = req.body;
    const user = await adminService.assignUserRole(userId, role);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a user from the database.
 *
 * This method removes the user with the specified user ID from the
 * database. The user ID is specified as a route parameter.
 *
 * @param {number} userId - The ID of the user to delete.
 *
 * @returns {Promise<Object>} The response with a success message.
 *
 * @example
 * const response = await adminController.deleteUser(1);
 * console.log(response);
 * { success: true, message: "User deleted successfully" }
 */
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await adminService.deleteUser(userId);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new category in the database.
 *
 * This method creates a new category with the specified `data` and returns the
 * newly created category.
 *
 * @param {Object} data - The data to create the category with. The following
 * properties are required:
 *
 *   - `name`: The name of the category.
 *
 * @returns {Promise<Object>} The newly created category.
 *
 * @example
 * const category = await adminController.createCategory({ name: "React" });
 * console.log(category);
 * { id: 1, name: "React", created_at: "2022-01-01 12:00:00", ... }
 */
const createCategory = async (req, res, next) => {
  try {
    const data = req.body;
    const category = await adminService.createCategory(data);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing category in the database.
 *
 * This method updates the category with the specified ID using the provided data.
 * The category ID is specified as a route parameter and the data comes from the request body.
 *
 * @param {Object} req - The request object, containing the category ID and update data.
 * @param {Object} res - The response object used to send back the updated category.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} Responds with the updated category data.
 *
 * @example
 * const response = await adminController.updateCategory(req, res, next);
 * console.log(response);
 * // { success: true, data: { id: 1, name: "Updated Category", ... } }
 */
const updateCategory = async (req, res, next) => {
  try {
    // Extract update data from the request body
    const data = req.body;

    // Call the admin service to update the category with the given ID and data
    const category = await adminService.updateCategory(
      req.params.categoryId,
      data
    );

    // Send a success response with the updated category data
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
};

/**
 * Deletes a category from the database.
 *
 * This method deletes the category with the specified category ID in the request
 * parameters. The category ID is specified as a route parameter.
 *
 * @param {Object} req - The request object, containing the category ID to delete.
 * @param {Object} res - The response object used to send back a success message.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} Responds with a success message.
 *
 * @example
 * const response = await adminController.deleteCategory(req, res, next);
 * console.log(response);
 * // { success: true, message: "Category deleted successfully" }
 */
const deleteCategory = async (req, res, next) => {
  try {
    // Delete the category with the given ID from the database
    await adminService.deleteCategory(req.params.categoryId);

    // Send a success response with a success message
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
};

/**
 * Assigns categories to an editor.
 *
 * This method assigns the specified categories to an editor with the given
 * editor ID. The editor ID is specified as a route parameter and the category IDs
 * are specified in the request body.
 *
 * @param {Object} req - The request object, containing the editor ID and category IDs.
 * @param {Object} res - The response object used to send back the created assignments.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<Object[]>} The created assignments.
 *
 * @example
 * const response = await adminController.assignCategoriesToEditor(req, res, next);
 * console.log(response);
 * [
 *   { editor_id: 1, category_id: 1 },
 *   { editor_id: 1, category_id: 2 },
 * ]
 */
const assignCategoriesToEditor = async (req, res, next) => {
  try {
    const editorId = req.params.editorId;
    const { categoryIds } = req.body;
    const assignments = await adminService.assignCategoriesToEditor(
      editorId,
      categoryIds
    );
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUsers,
  assignUserRole,
  deleteUser,
  createCategory,
  updateCategory,
  deleteCategory,
  assignCategoriesToEditor,
};
