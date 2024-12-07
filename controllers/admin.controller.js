// controllers/admin.controller.js

import adminService from '../services/admin.service.js'
import userService from '../services/user.service.js'
import categoryService from '../services/category.service.js'
import tagService from '../services/tag.service.js'
import articleService from '../services/article.service.js'

const getAllUsers = async (req, res, next) => {
  try {
    // Extract filters
    const filters = {
      role: req.query.role || null,
      username: req.query.username || null,
    }

    // Extract and validate pagination options
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1) // Default to 10, min 1
    const page = parseInt(req.query.page, 10) || 1 // Default to page 1
    const offset = (page - 1) * limit // Calculate offset dynamically

    const options = {
      limit,
      offset,
      orderBy: req.query.orderBy || 'created_at DESC',
    }

    const { users, totalUsers } = await adminService.getAllUsers(filters, options)

    // Calculate pagination data
    const totalPages = Math.ceil(totalUsers / limit)
    const query = { ...req.query, limit, page } // Ensure limit and page are included in the query

    res.render('admin/users', {
      title: 'Admin Users',
      layout: 'admin',
      users,
      totalPages,
      currentPage: page, // Use `page` directly for consistency
      query,
      roles: ['admin', 'editor', 'guest', 'subscriber', 'writer'],
    })
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await userService.getUserById(userId)
    console.log(user)
    res.render('admin/edit-user', {
      title: 'Edit User',
      layout: 'admin',
      user,
      roles: ['admin', 'editor', 'guest', 'subscriber', 'writer'],
    })
  } catch (error) {
    next(error)
  }
}

const getAddUser = async (req, res, next) => {
  try {
    res.render('admin/add-user', {
      title: 'Add User',
      layout: 'admin',
      roles: ['admin', 'editor', 'guest', 'subscriber', 'writer'],
    })
  } catch (error) {
    next(error)
  }
}

const createUser = async (req, res, next) => {
  try {
    const data = req.body

    // Input validation (optional: consider using libraries like Joi or express-validator)
    if (!data.username || !data.password || !data.email || !data.full_name) {
      return res.status(400).json({ message: 'All required fields must be filled.' })
    }

    // Call the service to create the user
    await userService.registerUser(data)

    // Send success response
    res.status(201).json({ message: 'User added successfully!' })
  } catch (error) {
    // Send error response
    res.status(500).json({ message: error.message || 'An error occurred while adding the user.' })

    // Pass the error to the error handling middleware
    next(error)
  }
}

const getEditors = async (req, res, next) => {
  try {
    const editors = await adminService.getEditorsWithCategories()

    res.render('admin/editors', {
      title: 'Assign Categories',
      layout: 'admin',
      editors,
    })
  } catch (error) {
    next(error)
  }
}

const getEditorCategories = async (req, res, next) => {
  try {
    const { editorId } = req.params
    const editor = await userService.getUserById(editorId)

    // Fetch assigned categories
    const assignedCategories = await categoryService.getCategoriesByEditor(editorId)

    // Fetch available categories with pagination and sorting
    const filters = { exclude: assignedCategories.map((cat) => cat.id) } // Exclude already assigned categories
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1) // Default: 10, min: 1
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1) // Default: page 1
    const offset = (page - 1) * limit
    const orderBy = req.query.orderBy || 'name ASC' // Default sorting by name

    const { categories: availableCategories, totalCategories } =
      await categoryService.getAvailableCategories(filters, { limit, offset, orderBy })

    const totalPages = Math.ceil(totalCategories / limit)

    res.render('admin/editor-categories', {
      title: `Manage Categories for ${editor.full_name}`,
      layout: 'admin',
      editor,
      assignedCategories,
      availableCategories,
      query: { ...req.query, limit, page }, // Preserve query parameters
      currentPage: page,
      totalPages,
    })
  } catch (error) {
    next(error)
  }
}

const assignCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.body
    const { editorId } = req.params

    if (!editorId || !categoryId) {
      throw new Error('Editor ID and Category ID are required')
    }

    await categoryService.assignCategory(editorId, categoryId)
    res.redirect('/admin/editors/' + editorId + '/categories')
  } catch (error) {
    next(error)
  }
}

const unassignCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.body
    const { editorId } = req.params

    if (!editorId || !categoryId) {
      throw new Error('Editor ID and Category ID are required')
    }

    await categoryService.unassignCategory(editorId, categoryId)
    res.redirect('/admin/editors/' + editorId + '/categories')
  } catch (error) {
    next(error)
  }
}

const assignUserRole = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const { role } = req.body

    // Validate role
    if (!['admin', 'editor', 'guest', 'subscriber', 'writer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected.' })
    }

    await adminService.assignUserRole(userId, role)

    res.status(200).json({ message: 'User role updated successfully.' })
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'An error occurred while updating the user role.' })
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    await adminService.deleteUser(userId)
    res.redirect('/admin/users')
  } catch (error) {
    next(error)
  }
}

const getAllCategories = async (req, res, next) => {
  try {
    const filters = {
      parent_id: req.query.parent_id || null,
      name: req.query.name || null,
    }

    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1) // Default to 10, min 1
    const page = parseInt(req.query.page, 10) || 1 // Default to page 1
    const offset = (page - 1) * limit // Calculate offset dynamically

    const options = {
      limit,
      offset,
      orderBy: req.query.orderBy || 'name ASC', // Default sorting by name
    }

    const { categories, totalCategories } = await adminService.getAllCategories(filters, options)

    const totalPages = Math.ceil(totalCategories / limit)
    const query = { ...req.query, limit, page }

    res.render('admin/categories', {
      title: 'Admin Categories',
      layout: 'admin',
      categories,
      totalPages,
      currentPage: page,
      query,
    })
  } catch (error) {
    next(error)
  }
}

const createCategory = async (req, res, next) => {
  try {
    const data = req.body
    data.parent_id = data.parent_id || null // Ensure null for no parent
    if (!data.name) throw new Error('Category name is required')
    await adminService.createCategory(data)
    res.status(200).send({ message: 'Category added successfully' })
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const data = req.body
    data.parent_id = data.parent_id || null // Ensure null for no parent
    await adminService.updateCategory(req.params.categoryId, data)
    res.status(200).send({ message: 'Category updated successfully' })
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    // Delete the category with the given ID from the database
    await adminService.deleteCategory(req.params.categoryId)

    // Send a success response with a success message
    res.redirect('/admin/categories')
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

const getAddCategory = async (req, res, next) => {
  try {
    const { categories } = await categoryService.getAllCategories()
    res.render('admin/add-category', {
      title: 'Add Category',
      layout: 'admin',
      categories,
    })
  } catch (error) {
    next(error)
  }
}

const getEditCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.categoryId)
    const { categories } = await categoryService.getAllCategories()

    // Remove the current category from potential parent category options
    const filteredCategories = categories.filter((c) => c.id !== category.id)

    res.render('admin/edit-category', {
      title: 'Edit Category',
      layout: 'admin',
      category,
      categories: filteredCategories,
    })
  } catch (error) {
    next(error)
  }
}

const getEditTag = async (req, res, next) => {
  try {
    const tag = await tagService.getTagById(req.params.tagId)
    res.render('admin/edit-tag', {
      title: 'Edit Tag',
      layout: 'admin',
      tag,
    })
  } catch (error) {
    next(error)
  }
}

const getAllArticles = async (req, res, next) => {
  try {
    // Extract filters and pagination options
    const filters = {
      keyword: req.query.keyword || null,
      category_id: req.query.category_id || null,
      tag_id: req.query.tag_id || null,
      status: req.query.status || null,
    }

    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1) // Default: 10, min: 1
    const page = parseInt(req.query.page, 10) || 1 // Default: page 1
    const offset = (page - 1) * limit

    const options = {
      limit,
      offset,
      orderBy: req.query.orderBy || 'published_at DESC',
    }

    // Fetch articles and related data
    const { articles, totalArticles } = await articleService.getFilteredArticles(filters, options)
    const { categories } = await categoryService.getAllCategories() // Fetch all categories for filtering

    console.log('=============================', totalArticles)
    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalArticles / limit)
    res.render('admin/articles', {
      title: 'Articles Management',
      layout: 'admin',
      articles,
      categories,
      statuses: ['draft', 'pending', 'published', 'approved', 'rejected'],
      selectedCategory: filters.category_id, // Preserve selected category
      selectedStatus: filters.status,
      query: { ...req.query, limit, page }, // Preserve query params
      totalPages,
      currentPage: page,
    })
  } catch (error) {
    next(error)
  }
}

const updateArticleStatus = async (req, res, next) => {
  try {
    const articleId = req.params.articleId
    await articleService.updateArticleStatus(articleId, req.body.status)
    res.redirect('/admin/articles')
  } catch (error) {
    next(error)
  }
}

export default {
  getAddCategory,
  getAddUser,
  createUser,
  getEditors,
  getEditorCategories,
  assignCategory,
  unassignCategory,
  updateArticleStatus,
  getAllArticles,
  getEditTag,
  getEditCategory,
  getAllUsers,
  getUserById,
  assignUserRole,
  deleteUser,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  assignCategoriesToEditor,
  getDashboard,
}
