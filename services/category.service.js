// services/categoryService.js

import categoryModel from '../models/category.model.js'

class CategoryService {
  async getAllCategories() {
    // Fetch all categories from the category model
    return await categoryModel.getAllCategories()
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
}
export default new CategoryService()
