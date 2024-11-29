// services/userService.js

import userModel from "../models/user.model.js";
import subscriptionModel from "../models/subscription.model.js";
import otpModel from "../models/otp.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/mailer.js";
import { decorateSendMail } from "../utils/mailDecorator.js";
class UserService {
  /**
   * Registers a new user.
   *
   * This method takes a `userData` object which should contain the following
   * properties: `username`, `email`, `password`, and `full_name`. It checks if
   * the username or email already exists in the database, and if not, creates
   * a new user record with the provided information. The password is hashed
   * before it is stored in the database.
   *
   * @param {Object} userData - The data to create the user with. Must contain
   * `username`, `email`, `password`, and `full_name` properties.
   * @returns {Promise<Object>} The newly created user record.
   * @throws {Error} If the username or email already exists in the database.
   * @example
   * const userData = {
   *   username: "johnDoe",
   *   email: "johndoe@example.com",
   *   password: "password123",
   *   full_name: "John Doe",
   * };
   * const user = await userService.registerUser(userData);
   * console.log(user);
   * // {
   * //   id: 1,
   * //   username: "johnDoe",
   * //   email: "
   * //   johndoe@example.com",
   * //   full_name: "John Doe",
   * //   password_hash: "$2b$10$...",
   * //   created_at: "2022-01-01 12:00:00",
   * //   updated_at: "2022-01-01 12:00:00"
   * // }
   */
  async registerUser(userData) {
    const { username, email, password, full_name } = userData;

    // Check if username or email already exists in the database
    const existingUser = await userModel.find({
      $or: [{ username }, { email }],
    });
    if (existingUser.length > 0) {
      throw new Error("Username or email already exists");
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare the new user object with hashed password
    const newUser = {
      username,
      email,
      password_hash: hashedPassword,
      full_name,
    };

    // Create the new user in the database
    const createdUser = await userModel.create(newUser);

    // Return the newly created user record
    return createdUser;
  }

  /**
   * Authenticates a user with the provided username and password.
   *
   * This method checks the user's credentials, and if valid, generates a JWT token
   * for the user. The JWT token is signed with the secret key defined in the
   * `JWT_SECRET` environment variable and expires after 1 hour.
   *
   * @param {Object} credentials - The user's credentials.
   * @param {string} credentials.username - The username of the user.
   * @param {string} credentials.password - The password of the user.
   * @returns {Promise<Object>} The authenticated user object and JWT token.
   * @throws {Error} If the credentials are invalid.
   * @example
   * const credentials = {
   *   username: "johnDoe",
   *   password: "password123",
   * };
   * const { user, token } = await userService.authenticateUser(credentials);
   * console.log(user);
   * // {
   * //   id: 1,
   * //   username: "johnDoe",
   * //   email: "johndoe@example.com",
   * //   full_name: "John Doe",
   * //   password_hash: "$2b$10$...",
   * //   created_at: "2022-01-01 12:00:00",
   * //   updated_at: "2022-01-01 12:00:00"
   * // }
   * console.log(token);
   * // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjQzNzkwNjQwfQ.dlZ
   * // _Uv3TmJhUcXK3eJwC2p3y0Jh5l9rW8x4t5eJd0fghjklmnbvcxz"
   */
  async authenticateUser({ username, password }) {
    // Retrieve the user by username
    const user = await userModel.findByUsername(username);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Validate the password
    const isValidPassword = await userModel.validatePassword(user.id, password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token with user id and role
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: process.env.JWT_EXPIRY || "168h" }
    );

    return { user, token };
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {number} id - The ID of the user.
   * @returns {Promise<Object>} The user record with the specified ID, or null if
   * no matching user was found.
   * @example
   * const user = await userService.getUserById(1);
   * console.log(user);
   * // { id: 1, username: "johnDoe", email: "johndoe@example.com", ... }
   */
  async getUserById(id) {
    return await userModel.findById(id);
  }

  /**
   * Updates a user's profile information.
   *
   * This method updates the profile information of the user with the specified
   * `userId`. The profile information that can be updated is limited to the
   * following fields: `full_name`, `pen_name`, `email`, and `date_of_birth`.
   *
   * @param {number} userId - The ID of the user to update.
   * @param {Object} profileData - The profile information to update.
   * @returns {Promise<Object>} The updated user record.
   * @example
   * const updatedUser = await userService.updateUserProfile(1, {
   *   full_name: "John Doe",
   *   pen_name: "Johny",
   *   email: "john@example.com",
   *   date_of_birth: "1990-01-01",
   * });
   * console.log(updatedUser);
   * // { id: 1, username: "johnDoe", email: "john@example.com", full_name: "John Doe", pen_name: "Johny", date_of_birth: "1990-01-01", ... }
   */
  async updateUserProfile(userId, profileData) {
    return await userModel.updateProfile(userId, profileData);
  }

  /**
   * Changes a user's password.
   *
   * This method retrieves a user by their ID and checks if the provided current
   * password matches the stored password hash. If the passwords match, the
   * method updates the user's password hash with the provided new password.
   *
   * @param {number} userId - The ID of the user to update.
   * @param {string} currentPassword - The current password to validate.
   * @param {string} newPassword - The new password to set.
   * @returns {Promise<Object>} The updated user record.
   * @throws {Error} If the user is not found or if the current password is
   * incorrect.
   * @example
   * const updatedUser = await userService.changePassword(1, "password123", "newPassword123");
   * console.log(updatedUser);
   * // { id: 1, username: "johnDoe", email: "johndoe@example.com", ... }
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    return await userModel.updatePassword(userId, newPassword);
  }

  /**
   * Resets a user's password using the provided OTP code and new password.
   *
   * This method retrieves a user by their email and checks if the provided OTP
   * code matches the stored OTP record for the user. If the OTP code is valid
   * and has not expired, the method updates the user's password hash with the
   * provided new password and deletes the OTP record.
   *
   * @param {string} email - The email address of the user to reset the password
   * for.
   * @param {string} otpCode - The OTP code to validate.
   * @param {string} newPassword - The new password to set.
   * @returns {Promise<boolean>} Whether the password was reset successfully.
   * @throws {Error} If the user is not found or if the OTP code is invalid or
   * has expired.
   * @example
   * const success = await userService.resetPassword(
   *   "john@example.com",
   *   "123456",
   *   "newPassword123"
   * );
   * console.log(success);
   * // true
   */
  async resetPassword(email, otpCode, newPassword) {
    // Retrieve the user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Retrieve the OTP record for the user
    const otpRecord = await otpModel.findByUserId(user.id);
    console.log(otpRecord.otp, otpCode);
    if (!otpRecord || otpRecord.otp !== otpCode) {
      throw new Error("Invalid OTP");
    }

    // Check if the OTP has expired
    if (new Date() > new Date(otpRecord.expiry)) {
      throw new Error("OTP has expired");
    }

    // Update password
    await userModel.updatePassword(user.id, newPassword);
    // Delete OTP
    await otpModel.deleteOtp(user.id);

    return true;
  }

  /**
   * Sends a password reset OTP to the user with the given email address.
   *
   * This method retrieves a user by their email address and generates a random
   * OTP code. The OTP code is stored in the user's OTP record and an email is sent
   * to the user with the OTP code.
   *
   * @param {string} email - The email address of the user to send the OTP code
   * to.
   * @returns {Promise<boolean>} Whether the OTP code was sent successfully.
   * @throws {Error} If the user is not found.
   * @example
   * const success = await userService.sendPasswordResetOtp(
   *   "john@example.com"
   * );
   * console.log(success);
   * // true
   */
  async sendPasswordResetOtp(email) {
    if (!email || typeof email !== "string" || email.trim() === "") {
      throw new Error("Invalid email address.");
    }
    // Retrieve the user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate a random OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP code in the user's OTP record
    await otpModel.createOrUpdate(user.id, otpCode);
    console.log("User email", email);
    // Send the OTP code via email
    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      html: decorateSendMail(otpCode),
    });

    return true;
  }

  /**
   * Retrieves a user's subscription record.
   *
   * This method retrieves a user's subscription record from the database.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Object>} The subscription record for the user, or null if no
   * record exists.
   * @example
   * const subscription = await userService.getUserSubscription(1);
   * console.log(subscription);
   * // { user_id: 1, expiry_date: "...", created_at: "...", updated_at: "..." }
   */
  async getUserSubscription(userId) {
    return await subscriptionModel.findByUserId(userId);
  }

  /**
   * Checks if a user's subscription is valid.
   *
   * This method retrieves a user's subscription record from the database and
   * checks if the expiry date is in the future. If the subscription record does
   * not exist or the expiry date is in the past, the method returns false.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<boolean>} True if the subscription is valid, false otherwise.
   * @example
   * const isValid = await userService.isSubscriptionValid(1);
   * console.log(isValid);
   * // true or false
   */
  async isSubscriptionValid(userId) {
    const subscription = await subscriptionModel.findByUserId(userId);
    if (!subscription) {
      return false;
    }

    // Check if the subscription expiry date is in the future
    return new Date(subscription.expiry_date) > new Date();
  }

  /**
   * Extends a user's subscription by a specified number of days.
   *
   * This method retrieves a user's subscription record from the database and
   * updates the expiry date by adding the specified number of days.
   *
   * @param {number} userId - The ID of the user whose subscription is to be extended.
   * @param {number} days - The number of days to extend the subscription.
   * @returns {Promise<Object>} The updated user record with the new subscription expiry date.
   * @throws {Error} If the user is not found.
   *
   * @example
   * const updatedUser = await userService.extendSubscription(1, 30);
   * console.log(updatedUser);
   * // { id: 1, username: "johnDoe", ... subscription_expiry: ... }
   */
  async extendSubscription(userId, days) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return await subscriptionModel.upsert(userId, expiryDate);
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
   * const updatedUser = await userService.assignUserRole(1, "writer");
   * console.log(updatedUser);
   * // { id: 1, username: "johnDoe", email: "johndoe@example.com", role: "writer", ... }
   */
  async assignUserRole(userId, role) {
    return await userModel.assignRole(userId, role);
  }

  /**
   * Retrieves a list of users with their roles from the database.
   *
   * This method retrieves users based on provided filters and options.
   *
   * @param {Object} [filters={}] - The filters to apply to the query.
   * @param {Object} [options={}] - The options to apply to the query.
   * @returns {Promise<Object[]>} The list of users with their roles.
   * @example
   * const users = await userService.listUsersWithRoles({ role: "editor" }, { limit: 10 });
   * console.log(users);
   * // [{ id: 1, username: "editorUser", role: "editor", ... }, ...]
   */
  async listUsersWithRoles(filters = {}, options = {}) {
    // Retrieve users with the specified filters and options
    return await userModel.find(filters, options);
  }

  async deleteUser(user_id) {
    return await userModel.delete(user_id);
  }
}

export default new UserService();
