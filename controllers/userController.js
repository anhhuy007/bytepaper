// controllers/userController.js

import articleService from "../services/articleService.js";
import commentService from "../services/commentService.js";
import subscriptionService from "../services/subscriptionService.js";
import userService from "../services/userService.js";

/**
 * Retrieves the profile of the authenticated user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @return {Promise<void>} The promise that resolves when the request is handled.
 */
const getUserProfile = async (req, res, next) => {
  try {
    // Get the ID of the authenticated user
    const userId = req.user.id;

    // Retrieve the user record from the database
    const user = await userService.getUserById(userId);

    // Return the user profile as JSON
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error);
  }
};

/**
 * Updates the profile of the authenticated user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @return {Promise<void>} The promise that resolves when the request is handled.
 */
const updateUserProfile = async (req, res, next) => {
  try {
    // Get the ID of the authenticated user
    const userId = req.user.id;

    // Retrieve the profile data from the request body
    const profileData = req.body;

    // Update the user profile in the database
    const user = await userService.updateUserProfile(userId, profileData);

    // Return the updated user profile as JSON
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error);
  }
};

/**
 * Changes the password of the authenticated user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @return {Promise<void>} The promise that resolves when the request is handled.
 */
const changePassword = async (req, res, next) => {
  try {
    // Get the ID of the authenticated user
    const userId = req.user.id;

    // Retrieve the current password and new password from the request body
    const { currentPassword, newPassword } = req.body;

    // Change the user's password in the database
    await userService.changePassword(userId, currentPassword, newPassword);

    // Return a success message as JSON
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error);
  }
};

/**
 * Retrieves the user data based on the provided user ID.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @returns {Promise<void>} The promise that resolves when the user data is returned.
 * @throws {Error} If any error occurs while retrieving the user data.
 */
const getUser = async (req, res, next) => {
  try {
    const user_id = req.params.id;

    const userData = await userService.getUser(user_id);

    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new user based on the provided information.
 *
 * @param {Object} req - The Express request object containing user data.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @returns {Promise<void>} The promise that resolves when the user is created successfully.
 * @throws {Error} If any error occurs while creating the user.
 *
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @param {string} req.body.full_name - The full name of the new user.
 * @param {string} req.body.pen_name - The pen name of the new user.
 * @param {string} req.body.email - The email of the new user.
 * @param {string} req.body.dob - The date of birth of the new user.
 * @param {string} req.body.role - The role of the new user (e.g., 'user', 'admin').
 * @param {string} req.body.subscription_expiration - The subscription expiration date of the new user.
 */
const createUser = async (req, res, next) => {
  try {
    const {
      username,
      password,
      full_name,
      pen_name,
      email,
      dob,
      role,
      subscription_expiration,
    } = req.body;

    const userData = await userService.createUser(
      username,
      password,
      full_name,
      pen_name,
      email,
      dob,
      role,
      subscription_expiration
    );

    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the existing user information based on the provided user ID.
 *
 * @param {Object} req - The Express request object containing user data.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @returns {Promise<void>} The promise that resolves when the user data is updated successfully.
 * @throws {Error} If any error occurs while updating the user data.
 *
 * @param {string} req.params.id - The ID of the user to be updated.
 * @param {string} req.body.username - The updated username of the user.
 * @param {string} req.body.password - The updated password of the user.
 * @param {string} req.body.full_name - The updated full name of the user.
 * @param {string} req.body.pen_name - The updated pen name of the user.
 * @param {string} req.body.email - The updated email of the user.
 * @param {string} req.body.dob - The updated date of birth of the user.
 * @param {string} req.body.role - The updated role of the user.
 * @param {string} req.body.subscription_expiration - The updated subscription expiration date of the user.
 */
const updateUser = async (req, res, next) => {
  try {
    const user_id = req.params.id;

    const {
      username,
      password,
      full_name,
      pen_name,
      email,
      dob,
      role,
      subscription_expiration,
    } = req.body;

    const userData = await userService.updateUser(
      user_id,
      username,
      password,
      full_name,
      pen_name,
      email,
      dob,
      role,
      subscription_expiration
    );

    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes the user and related data (subscriptions, comments, articles) based on the provided user ID.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @returns {Promise<void>} The promise that resolves when the user and associated data are deleted.
 * @throws {Error} If any error occurs while deleting the user or related data.
 *
 * @param {string} req.params.id - The ID of the user to be deleted.
 */
const deleteUser = async (req, res, next) => {
  try {
    const user_id = req.params.id;

    const userData = await userService.deleteUser(user_id);
    await subscriptionService.deleteSubscriptionsByUserID(user_id);
    await commentService.deleteCommentByUserID(user_id);
    if (userData.role == "writer") {
      await articleService.deleteArticleByUserID(user_id);
    }

    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    next(error);
  }
};

export default {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
};
