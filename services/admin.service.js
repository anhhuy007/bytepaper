// services/admin.service.js

import userModel from '../models/user.model.js'
import categoryModel from '../models/category.model.js'
import editorCategoryModel from '../models/editorCategory.model.js'
import tagModel from '../models/tag.model.js'
import articleModel from '../models/article.model.js'
class AdminService {
  async getAllUsers(filters = {}, options = {}) {
    return await userModel.getAllUsers(filters, options)
  }

  async assignUserRole(userId, role) {
    if (!role) {
      throw new Error('Role is required.')
    }

    return await userModel.assignRole(userId, role)
  }

  async deleteUser(userId) {
    // Delete the user with the specified ID and return the deleted record
    return await userModel.delete(userId)
  }

  async createCategory(data) {
    return await categoryModel.createCategory(data)
  }

  async updateCategory(id, data) {
    return await categoryModel.updateCategory(id, data)
  }

  async deleteCategory(id) {
    return await categoryModel.deleteCategory(id)
  }

  async assignCategoriesToEditor(editorId, categoryIds) {
    // Check if the editor exists
    const editor = await userModel.findById(editorId)
    if (!editor) {
      throw new Error('Editor not found')
    }

    if (!categoryIds || categoryIds.length === 0) {
      throw new Error('Category IDs are required')
    }

    if (categoryIds.some((id) => typeof id !== 'number')) {
      throw new Error('Category IDs must be numbers')
    }

    if (categoryIds.length !== new Set(categoryIds).size) {
      throw new Error('Category IDs must be unique')
    }

    if (editor.role !== 'editor') {
      throw new Error('Only editors can be assigned categories')
    }

    return await editorCategoryModel.assignCategories(editorId, categoryIds)
  }

  async getCategoriesByEditor(editorId) {
    return await editorCategoryModel.getCategoriesByEditor(editorId)
  }

  async getEditorsByCategory(categoryId) {
    return await editorCategoryModel.getEditorsByCategory(categoryId)
  }

  async getAllEditors() {
    return await userModel.find({ role: 'editor' })
  }

  async getDashboard() {
    const users = await this.getAllUsers()
    const categories = await categoryModel.getAllCategories()
    const tags = await tagModel.getAllTags()

    const articles = await articleModel.getArticles()
    return {
      totalUsers: users.length,
      totalCategories: categories.length,
      totalTags: tags.length,
      totalArticles: articles.length,
    }
  }
}

export default new AdminService()
