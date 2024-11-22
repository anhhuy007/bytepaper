// models/userModel.js
import BaseModel from "./BaseModel.js";
import db from "../utils/Database.js";
import bcrypt from "bcrypt";

// CREATE TYPE user_role AS ENUM ('guest', 'subscriber', 'writer', 'editor', 'admin');
// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   username VARCHAR(50) UNIQUE NOT NULL,
//   password_hash VARCHAR(255) NOT NULL,
//   email VARCHAR(100) UNIQUE NOT NULL,
//   full_name VARCHAR(100) NOT NULL,
//   pen_name VARCHAR(100),
//   date_of_birth DATE,
//   role user_role NOT NULL DEFAULT 'guest',
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

class UserModel extends BaseModel {
  constructor() {
    super("users");
  }

  /**
   * Retrieves a user by their username.
   *
   * @param {string} username - The username to search for.
   *
   * @returns {Promise<Object>} The user found by the username, or null if no
   * matching user was found.
   *
   * @example
   * const user = await userModel.findByUsername("johnDoe");
   * console.log(user);
   * // { id: 1, username: "johnDoe", ... }
   */
  async findByUsername(username) {
    const users = await this.find({ username });
    return users[0];
  }

  /**
   * Retrieves a user by their email address.
   *
   * @param {string} email - The email address to search for.
   *
   * @returns {Promise<Object>} The user found by the email address, or null if no
   * matching user was found.
   *
   * @example
   * const user = await userModel.findByEmail("johndoe@example.com");
   * console.log(user);
   * // { id: 1, email: "johndoe@example.com", ... }
   */
  async findByEmail(email) {
    const users = await this.find({ email });
    return users[0];
  }

  /**
   * Validates a user's password.
   *
   * This method retrieves a user by their ID and compares the provided password
   * with the stored password hash to determine if they match.
   *
   * @param {number} userId - The ID of the user.
   * @param {string} password - The password to validate.
   * @returns {Promise<boolean>} True if the password is valid, false otherwise.
   *
   * @example
   * const isValid = await userModel.validatePassword(1, "password123");
   * console.log(isValid); // true or false
   */
  async validatePassword(userId, password) {
    // Retrieve the user by their ID
    const user = await this.findById(userId);

    // If the user does not exist, return false
    if (!user) return false;

    // Compare the provided password with the stored password hash
    return bcrypt.compare(password, user.password_hash);
  }

  /**
   * Updates a user's password.
   *
   * This method retrieves a user by their ID and updates their password hash
   * with the provided new password.
   *
   * @param {number} userId - The ID of the user.
   * @param {string} newPassword - The new password to set.
   *
   * @returns {Promise<Object>} The updated user record.
   *
   * @example
   * const user = await userModel.updatePassword(1, "newPassword123");
   * console.log(user);
   * // { id: 1, username: "johnDoe", email: "johndoe@example.com", ... }
   */
  async updatePassword(userId, newPassword) {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password hash
    return this.update(userId, { password_hash: hashedPassword });
  }

  /**
   * Retrieves a list of subscribers from the database.
   *
   * This method will return a list of all users with the `role` set to
   * "subscriber".
   *
   * @returns {Promise<Object[]>} The list of subscribers retrieved from the
   * database.
   *
   * @example
   * const subscribers = await userModel.findSubscribers();
   * console.log(subscribers);
   * // [{ id: 1, username: "johnDoe", email: "johndoe@example.com", ... }, ...]
   */
  async findSubscribers() {
    return this.find({ role: "subscriber" });
  }

  /**
   * Extends a user's subscription by a specified number of days.
   *
   * This method retrieves a user by their ID and updates their subscription
   * expiry date by adding the specified number of days.
   *
   * @param {number} userId - The ID of the user whose subscription is to be extended.
   * @param {number} days - The number of days to extend the subscription.
   * @returns {Promise<Object>} The updated user record with the new subscription expiry date.
   * @throws {Error} If the user is not found.
   *
   * @example
   * const updatedUser = await userModel.extendSubscription(1, 30);
   * console.log(updatedUser);
   * // { id: 1, username: "johnDoe", ... subscription_expiry: ... }
   */
  async extendSubscription(userId, days) {
    // Retrieve the user by their ID
    const user = await this.findById(userId);

    // If the user does not exist, throw an error
    if (!user) throw new Error("User not found");

    // Determine the current expiry date or use the current date if none exists
    const newExpiryDate = user.subscription_expiry
      ? new Date(user.subscription_expiry)
      : new Date();

    // Add the specified number of days to the expiry date
    newExpiryDate.setDate(newExpiryDate.getDate() + days);

    // Update the user's subscription expiry date
    return this.update(userId, { subscription_expiry: newExpiryDate });
  }

  /**
   * Retrieves a list of writers from the database.
   *
   * This method will return a list of all users with the `role` set to
   * "writer".
   *
   * @returns {Promise<Object[]>} The list of writers retrieved from the
   * database.
   *
   * @example
   * const writers = await userModel.findWriters();
   * console.log(writers);
   * // [{ id: 1, username: "johnDoe", email: "johndoe@example.com", ... }, ...]
   */
  async findWriters() {
    return this.find({ role: "writer" });
  }

  /**
   * Retrieves a list of editors from the database.
   *
   * This method will return a list of all users with the `role` set to
   * "editor".
   *
   * @returns {Promise<Object[]>} The list of editors retrieved from the
   * database.
   *
   * @example
   * const editors = await userModel.findEditors();
   * console.log(editors);
   * // [{ id: 1, username: "johnDoe", email: "johndoe@example.com", ... }, ...]
   */
  async findEditors() {
    return this.find({ role: "editor" });
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
   * const updatedUser = await userModel.assignRole(1, "writer");
   * console.log(updatedUser);
   * // { id: 1, username: "johnDoe", email: "johndoe@example.com", role: "writer", ... }
   */
  async assignRole(userId, role) {
    // Define the list of valid roles
    const validRoles = ["guest", "subscriber", "writer", "editor", "admin"];

    // Check if the provided role is valid
    if (!validRoles.includes(role)) {
      // Throw an error if the role is invalid
      throw new Error(
        `Invalid role: "${role}". Must be one of: ${validRoles.join(", ")}`
      );
    }

    // Update the user's role in the database and return the updated record
    return this.update(userId, { role });
  }

  /**
   * Updates a user's profile information.
   *
   * This method updates the profile information of the user with the specified userId.
   * The profile information that can be updated is limited to the following fields:
   * full_name, pen_name, email, date_of_birth.
   *
   * @param {number} userId - The ID of the user to update.
   * @param {Object} profileData - The profile information to update.
   * @returns {Promise<Object>} The updated user record.
   * @example
   * const updatedUser = await userModel.updateProfile(1, {
   *   full_name: "John Doe",
   *   pen_name: "Johny",
   *   email: "john@example.com",
   *   date_of_birth: "1990-01-01",
   * });
   * console.log(updatedUser);
   * // { id: 1, username: "johnDoe", email: "john@example.com", full_name: "John Doe", pen_name: "Johny", date_of_birth: "1990-01-01", ... }
   */
  async updateProfile(userId, profileData) {
    // List of fields that are allowed to be updated
    const allowedFields = ["full_name", "pen_name", "email", "date_of_birth"];
    // Object to store the data to update
    const dataToUpdate = {};

    // Iterate over the provided profile data and check if the key is in the allowed fields list
    for (const key of Object.keys(profileData)) {
      if (allowedFields.includes(key)) {
        // If the key is allowed, add it to the dataToUpdate object
        dataToUpdate[key] = profileData[key];
      }
    }

    // Update the user's profile in the database and return the updated record
    return this.update(userId, dataToUpdate);
  }

  /**
   * Counts the number of users by role.
   *
   * This method counts the number of users in the database grouped by role.
   * The result is an array of objects with the keys "role" and "count".
   * @returns {Promise<Object[]>} The count of users by role.
   * @example
   * const countByRole = await userModel.countByRole();
   * console.log(countByRole);
   * // [
   * //   { role: "guest", count: 10 },
   * //   { role: "subscriber", count: 5 },
   * //   { role: "writer", count: 3 },
   * //   { role: "editor", count: 2 },
   * //   { role: "admin", count: 1 }
   * // ]
   */
  async countByRole() {
    const query = `
        SELECT role, COUNT(*) AS count
        FROM ${this.table}
        GROUP BY role
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  /**
   * Retrieves a list of users with the number of articles they have written.
   *
   * This method executes a SQL query to retrieve a list of users with the number
   * of articles they have written. The result is an array of objects with the keys
   * "id", "full_name", "role", and "article_count".
   *
   * @returns {Promise<Object[]>} The list of users with article counts.
   * @example
   * const usersWithArticles = await userModel.listUsersWithArticles();
   * console.log(usersWithArticles);
   * // [
   * //   { id: 1, full_name: "John Doe", role: "writer", article_count: 10 },
   * //   { id: 2, full_name: "Jane Doe", role: "writer", article_count: 5 },
   * //   { id: 3, full_name: "John Smith", role: "writer", article_count: 3 },
   * //   ...
   * // ]
   */
  async listUsersWithArticles() {
    const query = `
        SELECT u.id, u.full_name, u.role, COUNT(a.id) AS article_count
        FROM ${this.table} u
        LEFT JOIN articles a ON a.writer_id = u.id
        GROUP BY u.id, u.full_name, u.role
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  /**
   * Generates a reset token for the user with the given ID.
   *
   * This method generates a random token and stores it in the user's
   * record, along with a timestamp for when the token expires.
   *
   * @param {number} userId The ID of the user to generate a reset token for.
   * @returns {Promise<Object>} The updated user record with the reset token.
   * @example
   * const user = await userModel.generateResetToken(1);
   * console.log(user);
   * // {
   * //   id: 1,
   * //   full_name: "John Doe",
   * //   role: "writer",
   * //   reset_token: "a1b2c3d4e5f6g7h8",
   * //   reset_token_expiry: 2022-01-01T00:00:00.000Z
   * // }
   */
  async generateResetToken(userId) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600 * 1000); // 1 giờ
    return this.update(userId, {
      reset_token: token,
      reset_token_expiry: expiry,
    });
  }

  /**
   * Validates the reset token for the user with the given ID.
   *
   * This method checks the following conditions to validate the reset token:
   * - The user exists with the given ID.
   * - The user's reset token matches the one provided.
   * - The user's reset token has not expired.
   *
   * @param {number} userId The ID of the user to validate the reset token for.
   * @param {string} token The reset token to validate.
   * @returns {Promise<boolean>} Whether the reset token is valid.
   * @example
   * const isValid = await userModel.validateResetToken(1, "a1b2c3d4e5f6g7h8");
   * console.log(isValid);
   * // true
   */
  async validateResetToken(userId, token) {
    const user = await this.findById(userId);
    if (
      !user ||
      user.reset_token !== token ||
      new Date() > user.reset_token_expiry
    ) {
      return false;
    }
    return true;
  }

  /**
   * Retrieves user details by their user ID.
   *
   * @param {string|number} user_id - The ID of the user to retrieve.
   *
   * @returns {Promise<Object|null>} The user object if found, or null if no user exists with the provided ID.
   * @throws {Error} If an error occurs during the database query.
   */
  async getUser(user_id) {
    const text = "SELECT * FROM user WHERE user_id = $1";
    const values = [user_id];

    const res = await db.query(text, values);
    return res.rows[0];
  }

  /**
   * Creates a new user in the database.
   *
   * @param {string} username - The username of the new user.
   * @param {string} password - The password of the new user.
   * @param {string} full_name - The full name of the new user.
   * @param {string} pen_name - The pen name of the new user.
   * @param {string} email - The email address of the new user.
   * @param {string} dob - The date of birth of the new user.
   * @param {string} role - The role of the new user (e.g., "admin", "writer").
   * @param {string} subscription_expiration - The expiration date of the user's subscription.
   *
   * @returns {Promise<Object>} The newly created user object.
   * @throws {Error} If an error occurs during the database query.
   */
  async createUser(
    username,
    password,
    full_name,
    pen_name,
    email,
    dob,
    role,
    subscription_expiration
  ) {
    const text = `
    INSERT INTO user (username, password, full_name, pen_name, email, dob, role, subscription_expiration)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
    const values = [
      username,
      password,
      full_name,
      pen_name,
      email,
      dob,
      role,
      subscription_expiration,
    ].map((value) => (value === undefined ? null : value));

    const res = await db.query(text, values);
    return res.rows[0];
  }

  /**
   * Updates an existing user's details.
   *
   * @param {string|number} user_id - The ID of the user to update.
   * @param {string} username - The new username of the user.
   * @param {string} password - The new password of the user.
   * @param {string} full_name - The new full name of the user.
   * @param {string} pen_name - The new pen name of the user.
   * @param {string} email - The new email address of the user.
   * @param {string} dob - The new date of birth of the user.
   * @param {string} role - The new role of the user.
   * @param {string} subscription_expiration - The new subscription expiration date of the user.
   *
   * @returns {Promise<Object>} The updated user object.
   * @throws {Error} If an error occurs during the database query.
   */
  async updateUser(
    user_id,
    username,
    password,
    full_name,
    pen_name,
    email,
    dob,
    role,
    subscription_expiration
  ) {
    const text = `
    UPDATE user
    SET username = $1, password = $2, full_name = $3, pen_name = $4, email = $5, dob = $6, role = $7, subscription_expiration = $8
    WHERE user_id = $9
    RETURNING *;
  `;
    const values = [
      username,
      password,
      full_name,
      pen_name,
      email,
      dob,
      role,
      subscription_expiration,
      user_id,
    ].map((value) => (value === undefined ? null : value));

    const res = await db.query(text, values);
    return res.rows[0];
  }

  /**
   * Deletes a user from the database by their user ID.
   *
   * @param {string|number} user_id - The ID of the user to delete.
   *
   * @returns {Promise<Object>} The deleted user object.
   * @throws {Error} If an error occurs during the database query.
   */
  async deleteUser(user_id) {
    const text = "DELETE FROM user WHERE userId = $1 RETURNING *;";
    const values = [user_id];

    const res = await db.query(text, values);
    return res.rows[0];
  }
}

const userModel = new UserModel();
export default userModel;
