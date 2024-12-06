// services/user.service.js

import userModel from '../models/user.model.js'
import subscriptionModel from '../models/subscription.model.js'
import otpModel from '../models/otp.model.js'
import bcrypt from 'bcrypt'
import sendEmail from '../utils/mailer.js'
import { decorateSendMail } from '../utils/mailDecorator.js'
class UserService {
  async registerUser(userData) {
    const { username, email, password, full_name } = userData

    // Check if username or email already exists in the database
    const existingUserEmail = await userModel.findByEmail(email)

    if (existingUserEmail) {
      throw new Error('Email already exists. Please use a different email.')
    }

    const existingUser = await userModel.findByUsername(username)
    if (existingUser) {
      throw new Error('Username already exists. Please use a different username.')
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10)

    // Prepare the new user object with hashed password
    const newUser = {
      username,
      email,
      password_hash: hashedPassword,
      full_name,
    }

    // Create the new user in the database
    const createdUser = await userModel.create(newUser)

    // Return the newly created user record
    return createdUser
  }

  async authenticateUser({ username, password }) {
    // Retrieve the user by username
    const user = await userModel.findByUsername(username)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Validate the password
    const isValidPassword = await userModel.validatePassword(user.id, password)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    return user
  }

  async getUserById(id) {
    return await userModel.findById(id)
  }

  async updateUserProfile(userId, profileData) {
    return await userModel.updateProfile(userId, profileData)
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userModel.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isValidPassword) {
      throw new Error('Current password is incorrect')
    }

    return await userModel.updatePassword(userId, newPassword)
  }

  async resetPassword(email, otpCode, newPassword) {
    // Retrieve the user by email
    const user = await userModel.findByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    // Retrieve the OTP record for the user
    const otpRecord = await otpModel.findByUserId(user.id)
    console.log(otpRecord.otp, otpCode)
    if (!otpRecord || otpRecord.otp !== otpCode) {
      throw new Error('Invalid OTP')
    }

    // Check if the OTP has expired
    if (new Date() > new Date(otpRecord.expiry)) {
      throw new Error('OTP has expired')
    }

    // Update password
    await userModel.updatePassword(user.id, newPassword)
    // Delete OTP
    await otpModel.deleteOtp(user.id)

    return true
  }

  async sendPasswordResetOtp(email) {
    if (!email || typeof email !== 'string' || email.trim() === '') {
      throw new Error('Invalid email address.')
    }
    // Retrieve the user by email
    const user = await userModel.findByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    // Generate a random OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Store the OTP code in the user's OTP record
    await otpModel.createOrUpdate(user.id, otpCode)
    console.log('User email', email)
    // Send the OTP code via email
    await sendEmail({
      to: email,
      subject: 'Password Reset OTP',
      html: decorateSendMail(otpCode),
    })

    return true
  }

  async getUserSubscription(userId) {
    return await subscriptionModel.findByUserId(userId)
  }

  async isSubscriptionValid(userId) {
    const subscription = await subscriptionModel.findByUserId(userId)
    if (!subscription) {
      return false
    }

    // Check if the subscription expiry date is in the future
    return new Date(subscription.expiry_date) > new Date()
  }

  async extendSubscription(userId, days) {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + days)
    return await subscriptionModel.upsert(userId, expiryDate)
  }

  async assignUserRole(userId, role) {
    return await userModel.assignRole(userId, role)
  }

  async listUsersWithRoles(filters = {}, options = {}) {
    // Retrieve users with the specified filters and options
    return await userModel.find(filters, options)
  }

  async deleteUser(user_id) {
    return await userModel.delete(user_id)
  }

  async findOrCreateByGoogle(profile) {
    const email = profile.emails[0]?.value
    const fullName = profile.displayName

    // Check if user exists by email
    let user = await userModel.findByEmail(email)
    if (!user) {
      // Create a new user if not found
      const hashedPassword = await bcrypt.hash('oauth_user', 10)
      user = await userModel.create({
        email,
        full_name: fullName,
        username: profile.id, // Use Google ID as username
        role: 'guest', // Default role
        password_hash: hashedPassword, // Not needed for OAuth users
      })
    }

    return user
  }
}

export default new UserService()
