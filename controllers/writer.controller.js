// controllers/writer.controller.js

import articleService from '../services/article.service.js'
import categoryService from '../services/category.service.js'
const getDashboard = async (req, res, next) => {
  try {
    // Extract filters and pagination options
    const author_id = req.user.id
    const filters = {
      keyword: req.query.keyword || null,
      category_id: req.query.category_id || null,
      tag_id: req.query.tag_id || null,
      status: req.query.status || null,
      author_id,
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

    const enhancedArticles = articles.map((article) => ({
      ...article,
      canEdit: article.status === 'draft' || article.status === 'pending',
      canDelete: article.status === 'draft',
    }))

    const stats = await articleService.getArticleStats(author_id)

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalArticles / limit)
    res.render('writer/articles', {
      title: 'Articles Management',
      layout: 'writer',
      stats,
      articles: enhancedArticles,
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

const getCreateArticle = async (req, res, next) => {
  try {
    const filters = {}
    const options = {
      limit: 100,
      offset: 0,
    }
    const { categories } = await categoryService.getAllCategories(filters, options)

    res.render('writer/create-article', {
      title: 'Create Article',
      layout: 'writer',
      categories,
    })
  } catch (error) {
    next(error)
  }
}

const createArticle = async (req, res, next) => {
  try {
    const authorId = req.user.id
    const articleData = req.body

    // Validate category_id
    const category = await categoryService.getCategoryById(articleData.category_id)
    if (!category) {
      return res.status(400).send('Invalid category selected.')
    }

    // Handle thumbnail upload (if any)
    if (req.file) {
      console.log(req.file)
      articleData.thumbnail = `/uploads/${req.file.filename}`
    }

    // Convert is_premium to boolean
    articleData.is_premium = articleData.is_premium === 'on' ? true : false

    // Check for content
    if (!articleData.content || articleData.content.trim() === '') {
      return res.status(400).send('Content cannot be empty.')
    }
    console.log('===========> Article Data:', articleData)

    await articleService.createArticle(articleData, authorId)
    // res.redirect('/writer/articles')
    res.redirect('/writer/articles')
  } catch (error) {
    next(error)
  }
}

const getEditArticle = async (req, res, next) => {
  try {
    const article = await articleService.getArticleById(req.params.articleId)
    const filters = {}
    const options = {
      limit: 100,
      offset: 0,
    }
    const { categories } = await categoryService.getAllCategories(filters, options)

    res.render('writer/edit-article', {
      title: 'Edit Article',
      layout: 'writer',
      article,
      categories,
      canDelete: article.status !== 'pending',
      canSubmit: article.status !== 'pending',
    })
  } catch (error) {
    next(error)
  }
}

const updateArticle = async (req, res, next) => {
  try {
    const authorId = req.user.id
    console.log('=================== body:', req.body)

    // Extract the action and article data from the request body
    const { action, ...articleData } = req.body

    console.log('Article Data:', articleData)

    if (action === 'edit') {
      await articleService.updateArticle(req.params.articleId, articleData, authorId)
      res.redirect('/writer/articles')
    } else if (action === 'submit') {
      await articleService.submitArticleForApproval(req.params.articleId, authorId)
      res.redirect('/writer/articles')
    } else if (action === 'delete') {
      await articleService.deleteArticle(req.params.articleId, authorId)
      res.redirect('/writer/articles')
    } else {
      res.redirect('/writer/articles/edit/' + req.params.articleId)
    }
  } catch (error) {
    next(error)
  }
}

const submitArticleForApproval = async (req, res, next) => {
  try {
    // Extract the author ID from the request object
    const authorId = req.user.id

    // Submit the article for approval using the article service
    await articleService.submitArticleForApproval(req.params.articleId, authorId)

    // Send a success response
    // res.status(200).json({ success: true, message: 'Article submitted for approval' })
    res.redirect('/writer/articles')
  } catch (error) {
    // Pass any errors to the next middleware function
    next(error)
  }
}

const deleteArticle = async (req, res, next) => {
  try {
    const authorId = req.user.id
    const articleID = req.params.articleId
    console.log('===========> Article ID:', articleID)
    await articleService.deleteArticle(articleID, authorId)
    // res.status(200).json({ success: true, data: article })
    res.redirect('/writer/articles')
  } catch (error) {
    next(error)
  }
}

const getRejectedArticles = async (req, res, next) => {
  try {
    const articles = await articleService.getArticleRejections(req.user.id)
    res.render('writer/rejected-articles', {
      title: 'Rejected Articles',
      layout: 'writer',
      articles,
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getRejectedArticles,
  getEditArticle,
  getCreateArticle,
  getDashboard,
  createArticle,
  deleteArticle,
  updateArticle,
  submitArticleForApproval,
}
