// controllers/categoryController.js

import categoryService from '../services/category.service.js'

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories()
    // res.status(200).json({ success: true, data: categories });
    return { categories }
  } catch (error) {
    next(error)
  }
}

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id)
    return { category }
  } catch (error) {
    next(error)
  }
}

const createCategory = async (req, res, next) => {
  try {
    const data = req.body
    const category = await categoryService.createCategory(data)
    res.status(201).json({ success: true, data: category })
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const data = req.body
    const category = await categoryService.updateCategory(req.params.id, data)
    res.status(200).json({ success: true, data: category })
  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id)
    res.status(200).json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}
