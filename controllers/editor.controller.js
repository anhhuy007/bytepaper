// controllers/editor.controller.js

import articleService from '../services/article.service.js'
import adminService from '../services/admin.service.js'
import tagService from '../services/tag.service.js'
import categoryService from '../services/category.service.js'
// import userService from '../services/user.service.js'

const getArticles = async (req, res, next) => {
  try {
    const editorId = req.user.id

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
    const { articles, totalArticles } = await articleService.getArticlesForEditor(
      editorId,
      filters,
      options,
    )
    const { categories } = await categoryService.getAllCategories()
    const { tags } = await tagService.getAllTags()

    // Enhance articles with conditional action properties
    const enhancedArticles = articles.map((article) => ({
      ...article,
      canReview: article.status === 'pending',
      canPublish: article.status === 'approved',
      canUnpublish: article.status === 'published',
    }))

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalArticles / limit)

    res.render('editor/articles', {
      title: 'Articles Management',
      layout: 'editor',
      articles: enhancedArticles,
      categories,
      tags,
      statuses: ['pending', 'published', 'approved', 'rejected'],
      selectedCategory: filters.category_id,
      selectedTag: filters.tag_id,
      selectedStatus: filters.status,
      query: { ...req.query, limit, page }, // Preserve query params
      totalPages,
      currentPage: page,
    })
  } catch (error) {
    next(error)
  }
}

const getDashboard = async (req, res, next) => {
  try {
    const editorId = req.user.id
    const categories = await adminService.getCategoriesByEditor(editorId)
    const stats = await articleService.getArticleStatsByEditor(editorId)
    res.render('editor/dashboard', {
      layout: 'editor',
      stats,
      categories,
    })
  } catch (error) {
    next(error)
  }
}

const approveArticle = async (req, res, next) => {
  try {
    const editorId = req.user.id
    const { published_at, category_id, tag_ids = [] } = req.body

    // Ensure tags are handled as an array
    const normalizedTagIds = Array.isArray(tag_ids) ? tag_ids : tag_ids ? [tag_ids] : []

    // Approve the article
    await articleService.approveArticle(
      req.params.articleId,
      editorId,
      category_id,
      normalizedTagIds,
      published_at,
    )

    res.redirect('/editor/articles')
  } catch (error) {
    next(error)
  }
}

const rejectArticle = async (req, res, next) => {
  try {
    const editorId = req.user.id
    const { rejection_reason } = req.body

    // Reject the article
    await articleService.rejectArticle(req.params.articleId, editorId, rejection_reason)

    // Redirect to the articles list
    res.redirect('/editor/articles')
  } catch (error) {
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

const getApproveArticle = async (req, res, next) => {
  try {
    const articleId = req.params.articleId

    // Fetch article details
    const article = await articleService.getArticleById(articleId)

    // Fetch available tags and categories
    const filters = {}
    const options = {
      limit: 100,
      offset: 0,
    }
    const { categories } = await categoryService.getAllCategories(filters, options)
    const { tags } = await tagService.getAllTags(filters, options)

    const articleTagIds = new Set(article.tags.map((tag) => tag.id))
    const tagsWithSelection = tags.map((tag) => ({
      ...tag,
      selected: articleTagIds.has(tag.id),
    }))

    res.render('editor/approve-article', {
      title: 'Approve Article',
      layout: 'editor',
      article,
      categories,
      tags: tagsWithSelection,
    })
  } catch (error) {
    next(error)
  }
}

const getRejectArticle = async (req, res, next) => {
  try {
    const articleId = req.params.articleId

    // Fetch the article details
    const article = await articleService.getArticleById(articleId)

    if (!article) {
      throw new Error('Article not found')
    }

    if (article.status !== 'pending') {
      throw new Error('Only articles in pending status can be rejected')
    }

    res.render('editor/reject-article', {
      title: 'Reject Article',
      layout: 'editor',
      article,
    })
  } catch (error) {
    next(error)
  }
}


const getArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.articleId

    // Fetch the article details
    const article = await articleService.getArticleById(articleId)

    // Fetch tags and categories (optional display purposes)
    const filters = {}
    const options = {
      limit: 100,
      offset: 0,
    }
    const { tags } = await tagService.getAllTags(filters, options)
    const { categories } = await categoryService.getAllCategories(filters, options)

    const articleTagIds = new Set(article.tags.map((tag) => tag.id))
    const tagsWithSelection = tags.map((tag) => ({
      ...tag,
      selected: articleTagIds.has(tag.id),
    }))

    res.render('editor/review-article', {
      title: 'Review Article',
      layout: 'editor',
      article,
      tags: tagsWithSelection,
      categories,
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getArticleById,
  getDashboard,
  getArticles,
  approveArticle,
  rejectArticle,
  publishArticle,
  unpublishArticle,
  getApproveArticle,
  getRejectArticle,
}
