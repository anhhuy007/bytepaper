// controllers/categoryController.js

import categoryService from "../services/category.service.js";

/**
 * Retrieves all categories from the database.
 *
 * This method will return a list of all categories available in the database.
 * The categories include their parent category names if they exist and are ordered alphabetically.
 *
 * @returns {Promise<Object[]>} The list of all categories retrieved from the database.
 * @example
 * const categories = await categoryController.getAllCategories();
 * console.log(categories);
 * [
 *   { id: 1, name: "JavaScript", parent_name: null, created_at: "2022-01-01 12:00:00", ... },
 *   { id: 2, name: "Node.js", parent_name: "JavaScript", created_at: "2022-01-01 12:00:00", ... },
 * ]
 */
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a category by its ID.
 *
 * This method will return a category with the specified `id` if it exists in the
 * database, otherwise it will throw an error.
 *
 * @param {Object} req - The Express.js request object containing the category
 *   ID to retrieve.
 * @param {Object} res - The Express.js response object used to send the category
 *   data back to the client.
 * @param {Function} next - The Express.js next middleware function which is used
 *   to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished
 *   executing.
 * @throws {Error} If there is an error retrieving the category.
 * @example
 * const response = await categoryController.getCategoryById(req, res, next);
 * console.log(response);
 * {
 *   success: true,
 *   data: {
 *     id: 1,
 *     name: "JavaScript",
 *     parent_name: null,
 *     created_at: "2022-01-01 12:00:00",
 *     ...,
 *   },
 * }
 */
const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json({ success: true, data: category });
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
 * @param {Object} req - The Express.js request object containing the category
 *   data to create.
 * @param {Object} res - The Express.js response object used to send the created
 *   category data back to the client.
 * @param {Function} next - The Express.js next middleware function which is used
 *   to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished
 *   executing.
 * @throws {Error} If there is an error creating the category.
 * @example
 * const response = await categoryController.createCategory(req, res, next);
 * console.log(response);
 * {
 *   success: true,
 *   data: {
 *     id: 1,
 *     name: "JavaScript",
 *     parent_name: null,
 *     created_at: "2022-01-01 12:00:00",
 *     ...,
 *   },
 * }
 */
const createCategory = async (req, res, next) => {
  try {
    const data = req.body;
    const category = await categoryService.createCategory(data);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing category in the database.
 *
 * This method will update the category with the specified `id` using the
 * provided `data`.
 *
 * @param {Object} req - The Express.js request object containing the category
 *   data to update and the category ID in the URL parameters.
 * @param {Object} res - The Express.js response object used to send the updated
 *   category data back to the client.
 * @param {Function} next - The Express.js next middleware function which is used
 *   to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished
 *   executing.
 * @throws {Error} If there is an error updating the category.
 * @example
 * const response = await categoryController.updateCategory(req, res, next);
 * console.log(response);
 * {
 *   success: true,
 *   data: {
 *     id: 1,
 *     name: "JavaScript",
 *     parent_name: null,
 *     created_at: "2022-01-01 12:00:00",
 *     ...,
 *   },
 * }
 */
const updateCategory = async (req, res, next) => {
  try {
    const data = req.body;
    const category = await categoryService.updateCategory(req.params.id, data);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a category from the database.
 *
 * This method will delete the category with the specified category ID in the
 * request parameters.
 *
 * @param {Object} req - The request object, containing the category ID to delete.
 * @param {Object} res - The response object used to send back a success message.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} Responds with a success message.
 *
 * @example
 * const response = await categoryController.deleteCategory(req, res, next);
 * console.log(response);
 * // { success: true, message: "Category deleted successfully" }
 */
const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
