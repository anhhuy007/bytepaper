// controllers/admin.controller.js

import adminService from '../services/admin.service.js'
import userService from '../services/user.service.js'
import categoryService from '../services/category.service.js'
import tagService from '../services/tag.service.js'
import articleService from '../services/article.service.js'
const getAllUsers = async (req, res, next) => {
  try {
    // Extract filters, pagination, and sorting options
    const filters = {
      role: req.query.role || null,
      username: req.query.username || null,
    }
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
      orderBy: req.query.orderBy || 'created_at DESC',
    }

    const { users, totalUsers } = await adminService.getAllUsers(filters, options)

    // Calculate pagination data
    const totalPages = Math.ceil(totalUsers / options.limit)
    const currentPage = Math.ceil(options.offset / options.limit) + 1

    res.render('admin/users', {
      title: 'Admin Users',
      layout: 'admin',
      users,
      totalPages,
      currentPage,
      query: req.query,
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

const getEditors = async (req, res, next) => {
  try {
    const editors = await adminService.getAllEditors() // Fetch editors
    const assignedCategories = await categoryService.getAssignedCategories() // Fetch all assignments

    // Map assigned categories for each editor
    const categoryMap = assignedCategories.reduce((map, row) => {
      if (!map[row.editor_id]) {
        map[row.editor_id] = []
      }
      map[row.editor_id].push(row) // Push the category object
      return map
    }, {})

    editors.forEach((editor) => {
      editor.assignedCategories = categoryMap[editor.id] || []
    })

    console.log(JSON.stringify(editors, null, 2))

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
    const categories = await categoryService.getAllCategories()
    const assignedCategories = await categoryService.getCategoriesByEditor(editorId)

    console.log('=============================', assignedCategories)

    const availableCategories = categories.filter(
      (category) => !assignedCategories.some((assigned) => assigned.id === category.id),
    )

    res.render('admin/editor-categories', {
      title: `Manage Categories for ${editor.full_name}`,
      editor,
      assignedCategories,
      availableCategories,
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
    await adminService.assignUserRole(userId, role)
    res.redirect('/admin/users/edit/' + userId)
  } catch (error) {
    next(error)
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

const createCategory = async (req, res, next) => {
  try {
    const data = req.body
    if (!req.body.parent_id) {
      data.parent_id = null
    }
    if (!req.body.name) {
      throw new Error('Category name is required')
    }

    await adminService.createCategory(data)
    res.redirect('/admin/categories')
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    // Extract update data from the request body
    const data = req.body

    // Call the admin service to update the category with the given ID and data
    await adminService.updateCategory(req.params.categoryId, data)

    // Send a success response with the updated category data
    res.redirect('/admin/categories')
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

const getEditCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.categoryId)
    const categories = await categoryService.getAllCategories()
    // Remove the current category from the list of categories
    const index = categories.findIndex((c) => c.id === category.id)
    if (index !== -1) {
      categories.splice(index, 1)
    }
    res.render('admin/edit-category', {
      title: 'Edit Category',
      layout: 'admin',
      category,
      categories,
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
    const filters = req.query
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    }

    const articles = await articleService.getFilteredArticles(filters, options)

    // Determine selected status
    const selectedStatus = filters.status || ''

    res.render('admin/articles', {
      title: 'Admin Articles',
      layout: 'admin',
      articles,
      statuses: ['draft', 'pending', 'published', 'approved', 'rejected'],
      selectedStatus, // Pass selected status to view
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
  createCategory,
  updateCategory,
  deleteCategory,
  assignCategoriesToEditor,
  getDashboard,
}
