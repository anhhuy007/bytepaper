// controllers/editor.controller.js

import articleService from '../services/article.service.js'
import adminService from '../services/admin.service.js'
import tagService from '../services/tag.service.js'
// import categoryService from '../services/category.service.js'
// import userService from '../services/user.service.js'

const getArticles = async (req, res, next) => {
  try {
    // Extract the editor ID from the request object
    const editorId = req.user.id

    // Retrieve categories assigned to the current editor
    const categories = await adminService.getCategoriesByEditor(editorId)

    // Map category IDs for filtering articles
    const categoryIds = categories.map((category) => category.id)

    // Define filters for pending articles within assigned categories
    const filters = {
      status: 'pending',
      category_id: categoryIds,
    }

    // Define options for pagination
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    }

    // Retrieve pending articles using the defined filters and options
    const articles = await articleService.getAllArticles(filters, options)

    // Send the retrieved articles as a JSON response
    res.status(200).json({ success: true, data: articles })
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error)
  }
}

const getDashboard = async (req, res, next) => {
  try {
    const editorId = req.user.id
    const categories = await adminService.getCategoriesByEditor(editorId)

    res.render('editor/dashboard', {
      layout: 'editor',
      data: categories,
    })
  } catch (error) {
    next(error)
  }
}

const approveArticle = async (req, res, next) => {
  try {
    // Extract the editor ID from the request object
    const editorId = req.user.id

    const { published_at, category_id, tag_ids = [] } = req.body

    // Approve the article using the article service
    await articleService.approveArticle(
      req.params.articleId,
      editorId,
      category_id,
      tag_ids,
      published_at,
    )

    // Send a success response
    res.status(200).json({ success: true, message: 'Article approved' })
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error)
  }
}

const rejectArticle = async (req, res, next) => {
  try {
    // Extract the editor ID from the request object
    const editorId = req.user.id

    // Extract the rejection reason from the request body
    const { rejection_reason } = req.body

    // Reject the article using the article service
    await articleService.rejectArticle(req.params.articleId, editorId, rejection_reason)

    // Send a success response
    res.status(200).json({ success: true, message: 'Article rejected' })
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error)
  }
}

const publishArticle = async (req, res, next) => {
  try {
    // Publish the article using the article service
    await articleService.publishArticle(req.params.articleId)

    // Send a success response
    res.status(200).json({ success: true, message: 'Article published' })
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error)
  }
}

const unpublishArticle = async (req, res, next) => {
  try {
    // Unpublish the article using the article service
    await articleService.unpublishArticle(req.params.articleId)

    // Send a success response
    res.status(200).json({ success: true, message: 'Article unpublished' })
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error)
  }
}

const addTag = async (req, res, next) => {
  try {
    // Extract the editor ID from the request object

    // Extract tag IDs from the request body
    const { tag_id } = req.body

    // Add tags to the article using the article service
    await articleService.addTagToArticle(req.params.articleId, tag_id)

    // Send a success response
    res.status(200).json({ success: true, message: 'Tags added to article' })
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error)
  }
}

const removeTag = async (req, res, next) => {
  try {
    // Extract the editor ID from the request object
    const editorId = req.user.id

    // Extract tag IDs from the request body
    const { tag_id } = req.body

    // Remove tags from the article using the article service
    await articleService.removeTagFromArticle(req.params.articleId, tag_id)

    // Send a success response
    res.status(200).json({ success: true, message: 'Tags removed from article' })
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error)
  }
}

export default {
  getDashboard,
  getArticles,
  approveArticle,
  rejectArticle,
  publishArticle,
  unpublishArticle,
  addTag,
  removeTag,
}
