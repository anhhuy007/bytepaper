// services/categoryService.js

import categoryModel from '../models/category.model.js'
import editorCategoryModel from '../models/editorCategory.model.js'
class CategoryService {
  async getAllCategories(filters = {}, options = {}) {
    // Fetch all categories from the category model
    return await categoryModel.getAllCategories(filters, options)
  }

  async getCategoryById(id) {
    const category = await categoryModel.getCategoryById(id)
    if (!category) {
      throw new Error(`Category with ID ${id} not found`)
    }
    return category
  }

  async createCategory(data) {
    return await categoryModel.createCategory(data)
  }

  async updateCategory(id, data) {
    const category = await categoryModel.findById(id)
    if (!category) {
      throw new Error('Category not found')
    }
    return await categoryModel.updateCategory(id, data)
  }

  async deleteCategory(id) {
    const category = await categoryModel.findById(id)
    if (!category) {
      throw new Error(`Category with ID ${id} not found`)
    }
    return await categoryModel.deleteCategory(id)
  }

  async getCategoriesWithArticleCount() {
    return await categoryModel.getCategoriesWithArticleCount()
  }

  async getParentCategory(id) {
    return await categoryModel.getParentCategory(id)
  }

  async getCategoriesByEditor(editorId) {
    return await editorCategoryModel.getCategoriesByEditor(editorId)
  }

  async getEditorsByCategory(categoryId) {
    return await editorCategoryModel.getEditorsByCategory(categoryId)
  }

  async updateEditorCategories(editorId, categoryIds) {
    return await editorCategoryModel.assignCategories(editorId, categoryIds)
  }

  async getAssignedCategories() {
    return await editorCategoryModel.getAssignedCategories()
  }

  async assignCategory(editorId, categoryId) {
    return await editorCategoryModel.assignCategory(editorId, categoryId)
  }

  async unassignCategory(editorId, categoryId) {
    return await editorCategoryModel.unassignCategory(editorId, categoryId)
  }

  async getAvailableCategories(filters, options) {
    return await categoryModel.getAvailableCategories(filters, options)
  }
}
export default new CategoryService()
