// controllers/admin.controller.js

import adminService from '../services/admin.service.js'
import userService from '../services/user.service.js'

const getAllUsers = async (req, res, next) => {
  try {
    const filters = req.query
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    }
    const users = await adminService.getAllUsers(filters, options)
    res.status(200).json({ success: true, data: users })
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await userService.getUserById(userId)
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

const getAllEditors = async (req, res, next) => {
  try {
    const editors = await adminService.getAllEditors()
    return { editors }
  } catch (error) {
    next(error)
  }
}

const assignUserRole = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const { role } = req.body
    const user = await adminService.assignUserRole(userId, role)
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    await adminService.deleteUser(userId)
    res.status(200).json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    next(error)
  }
}

const createCategory = async (req, res, next) => {
  try {
    const data = req.body
    const category = await adminService.createCategory(data)
    res.status(201).json({ success: true, data: category })
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    // Extract update data from the request body
    const data = req.body

    // Call the admin service to update the category with the given ID and data
    const category = await adminService.updateCategory(req.params.categoryId, data)

    // Send a success response with the updated category data
    res.status(200).json({ success: true, data: category })
  } catch (error) {
    // Pass any errors to the next middleware
    next(error)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    // Delete the category with the given ID from the database
    await adminService.deleteCategory(req.params.categoryId)

    // Send a success response with a success message
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    // Pass any errors to the next middleware
    next(error)
  }
}

const assignCategoriesToEditor = async (req, res, next) => {
  try {
    const editorId = req.params.editorId
    const { categoryIds } = req.body
    const assignments = await adminService.assignCategoriesToEditor(editorId, categoryIds)
    res.status(200).json({ success: true, data: assignments })
  } catch (error) {
    next(error)
  }
}

const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboard()
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      layout: 'admin',
      stats,
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getAllUsers,
  getAllEditors,
  getUserById,
  assignUserRole,
  deleteUser,
  createCategory,
  updateCategory,
  deleteCategory,
  assignCategoriesToEditor,
  getDashboard,
}
