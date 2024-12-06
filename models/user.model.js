// models/user.model.js
import BaseModel from './Base.model.js'
import db from '../utils/Database.js'
import bcrypt from 'bcrypt'

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

// CREATE INDEX idx_users_username ON users (username);
// CREATE INDEX idx_users_email ON users (email);

class UserModel extends BaseModel {
  constructor() {
    super('users')
  }

  async findByUsername(username) {
    const users = await this.find({ username })
    return users[0]
  }

  async findByEmail(email) {
    const users = await this.find({ email })
    return users[0]
  }

  async validatePassword(userId, password) {
    // Retrieve the user by their ID
    const user = await this.findById(userId)

    // If the user does not exist, return false
    if (!user) return false

    // Compare the provided password with the stored password hash
    return bcrypt.compare(password, user.password_hash)
  }

  async updatePassword(userId, newPassword) {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the user's password hash
    return this.update(userId, { password_hash: hashedPassword })
  }

  async findSubscribers() {
    return this.find({ role: 'subscriber' })
  }

  async extendSubscription(userId, days) {
    // Retrieve the user by their ID
    const user = await this.findById(userId)

    // If the user does not exist, throw an error
    if (!user) throw new Error('User not found')

    // Determine the current expiry date or use the current date if none exists
    const newExpiryDate = user.subscription_expiry ? new Date(user.subscription_expiry) : new Date()

    // Add the specified number of days to the expiry date
    newExpiryDate.setDate(newExpiryDate.getDate() + days)

    // Update the user's subscription expiry date
    return this.update(userId, { subscription_expiry: newExpiryDate })
  }

  async findWriters() {
    return this.find({ role: 'writer' })
  }

  async findEditors() {
    return this.find({ role: 'editor' })
  }

  async assignRole(userId, role) {
    // Define the list of valid roles
    const validRoles = ['guest', 'subscriber', 'writer', 'editor', 'admin']

    // Check if the provided role is valid
    if (!validRoles.includes(role)) {
      // Throw an error if the role is invalid
      throw new Error(`Invalid role: "${role}". Must be one of: ${validRoles.join(', ')}`)
    }

    // Update the user's role in the database and return the updated record
    return this.update(userId, { role })
  }

  async updateProfile(userId, profileData) {
    // List of fields that are allowed to be updated
    const allowedFields = ['full_name', 'pen_name', 'email', 'date_of_birth']
    // Object to store the data to update
    const dataToUpdate = {}

    // Iterate over the provided profile data and check if the key is in the allowed fields list
    for (const key of Object.keys(profileData)) {
      if (allowedFields.includes(key)) {
        // If the key is allowed, add it to the dataToUpdate object
        dataToUpdate[key] = profileData[key]
      }
    }

    // Update the user's profile in the database and return the updated record
    return this.update(userId, dataToUpdate)
  }

  async countByRole() {
    const query = `
        SELECT role, COUNT(*) AS count
        FROM ${this.table}
        GROUP BY role
    `
    const { rows } = await db.query(query)
    return rows
  }

  async listUsersWithArticles() {
    const query = `
        SELECT u.id, u.full_name, u.role, COUNT(a.id) AS article_count
        FROM ${this.table} u
        LEFT JOIN articles a ON a.writer_id = u.id
        GROUP BY u.id, u.full_name, u.role
    `
    const { rows } = await db.query(query)
    return rows
  }

  async generateResetToken(userId) {
    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 3600 * 1000) // 1 giờ
    return this.update(userId, {
      reset_token: token,
      reset_token_expiry: expiry,
    })
  }

  async validateResetToken(userId, token) {
    const user = await this.findById(userId)
    if (!user || user.reset_token !== token || new Date() > user.reset_token_expiry) {
      return false
    }
    return true
  }
}

const userModel = new UserModel()
export default userModel
