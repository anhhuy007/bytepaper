// controllers/tagController.js

import tagService from "../services/tag.service.js";

/**
 * Retrieves all tags from the database.
 *
 * Sends a JSON response containing the list of all tags if successful,
 * or passes an error to the next middleware if an error occurs.
 *
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object used to send the response.
 * @param {Function} next - The Express.js next middleware function which is used to pass any errors to the next middleware in the stack.
 * @returns {Promise<void>} A promise that resolves when the middleware has finished executing.
 *
 * @example
 * // Example usage in an Express route
 * app.get('/tags', tagController.getAllTags);
 */
const getAllTags = async (req, res, next) => {
  try {
    // Fetch all tags using the tag service
    const tags = await tagService.getAllTags();
    // Send the retrieved tags in the response with status 200
    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
};

/**
 * Retrieves a tag by its ID.
 *
 * This method will return a tag with the specified `id` if it exists in the
 * database, otherwise it will throw an error.
 *
 * @param {Object} req - The Express.js request object containing the tag ID to retrieve.
 * @param {Object} res - The Express.js response object used to send the tag data back to the client.
 * @param {Function} next - The Express.js next middleware function which is used to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished executing.
 * @throws {Error} If there is an error retrieving the tag.
 * @example
 * const response = await tagController.getTagById(req, res, next);
 * console.log(response);
 * // { success: true, data: { id: 1, name: "JavaScript", ... } }
 */
const getTagById = async (req, res, next) => {
  try {
    // Retrieve the tag by its ID from the request parameters
    const tag = await tagService.getTagById(req.params.id);

    // Send a success response with the retrieved tag data
    res.status(200).json({ success: true, data: tag });
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
};

/**
 * Creates a new tag in the database.
 *
 * This method will create a new tag with the specified `data` in the database.
 *
 * @param {Object} req - The Express.js request object containing the tag data to create.
 * @param {Object} res - The Express.js response object used to send the created tag data back to the client.
 * @param {Function} next - The Express.js next middleware function which is used to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished executing.
 * @throws {Error} If there is an error creating the tag.
 *
 * Example response:
 * {
 *   success: true,
 *   data: {
 *     id: 1,
 *     name: "React",
 *     created_at: "2022-01-01 12:00:00",
 *     ...,
 *   },
 * }
 */
const createTag = async (req, res, next) => {
  try {
    const data = req.body;
    const tag = await tagService.createTag(data);
    res.status(201).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing tag in the database.
 *
 * This method will update the tag with the specified `id` using the
 * provided `data`.
 *
 * @param {Object} req - The Express.js request object containing the tag data to update.
 * @param {Object} res - The Express.js response object used to send the updated tag data back to the client.
 * @param {Function} next - The Express.js next middleware function which is used to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished executing.
 * @throws {Error} If there is an error updating the tag.
 * @example
 * const response = await tagController.updateTag(req, res, next);
 * console.log(response);
 * // { success: true, data: { id: 1, name: "React Hooks", ... } }
 */
const updateTag = async (req, res, next) => {
  try {
    const data = req.body;
    const { tagId: id } = req.params;
    const tag = await tagService.updateTag(id, data);
    res.status(200).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a tag from the database by its ID.
 *
 * This method will delete the tag with the specified `id` from the
 * database and return a success message.
 *
 * @param {Object} req - The Express.js request object containing the tag ID to delete.
 * @param {Object} res - The Express.js response object used to send the success message back to the client.
 * @param {Function} next - The Express.js next middleware function which is used to pass any errors to the next middleware in the stack.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has finished executing.
 * @throws {Error} If there is an error deleting the tag.
 *
 * Example response:
 * {
 *   success: true,
 *   message: "Tag deleted successfully",
 * }
 */
const deleteTag = async (req, res, next) => {
  try {
    const { tagId: id } = req.params;
    await tagService.deleteTag(id);
    res
      .status(200)
      .json({ success: true, message: "Tag deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
