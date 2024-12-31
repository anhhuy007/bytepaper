// controllers/writer.controller.js

import articleService from '../services/article.service.js'
import categoryService from '../services/category.service.js'
import tagService from '../services/tag.service.js'
import sanitizeHtml from 'sanitize-html'
import dotenv from 'dotenv'
dotenv.config()

const processContent = (content) => {
  if (!content) return null

  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: [
      'p',
      'b',
      'i',
      'u',
      'a',
      'img',
      'iframe',
      'strong',
      'em',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'br',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'],
    },
    allowedSchemes: ['http', 'https'],
  })

  return sanitizedContent
}

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
      canEdit:
        article.status === 'draft' || article.status === 'pending' || article.status === 'rejected',
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
    const { tags } = await tagService.getAllTags(filters, options)
    res.render('writer/create-article', {
      title: 'Create Article',
      layout: 'writer',
      categories,
      tags,
      imgbbApiKey: process.env.IMGBB_API_KEY,
    })
  } catch (error) {
    next(error)
  }
}

const createArticle = async (req, res, next) => {
  try {
    const authorId = req.user.id
    const articleData = req.body

    console.log('=== Raw Content Received (Before Processing) ===', articleData.content)
    // Validate category_id
    const category = await categoryService.getCategoryById(articleData.category_id)
    if (!category) {
      return res.status(400).send('Invalid category selected.')
    }

    // Handle thumbnail upload (if any)
    if (req.file) {
      articleData.thumbnail = `/uploads/${req.file.filename}`
    }

    // Convert is_premium to boolean
    articleData.is_premium = articleData.is_premium === 'on' ? true : false

    // Check for content
    if (!articleData.content || articleData.content.trim() === '') {
      return res.status(400).send('Content cannot be empty.')
    }
    console.log('=== Content Before Sanitize ===', articleData.content)
    // Process content
    articleData.content = processContent(articleData.content)
    console.log('=== Content After Sanitize ===', articleData.content)
    // Create the article
    const createdArticle = await articleService.createArticle(articleData, authorId)

    // Handle tags
    if (articleData.tags && Array.isArray(articleData.tags)) {
      const tagIds = articleData.tags.map(Number)
      await articleService.addTagsToArticle(createdArticle.id, tagIds)
    }

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
    const { tags } = await tagService.getAllTags(filters, options)
    const articleTagIds = new Set(article.tags.map((tag) => tag.id))

    const tagsWithSelection = tags.map((tag) => ({
      ...tag,
      selected: articleTagIds.has(tag.id),
    }))
    console.log('=========================> Article Tags: ', article.tags)
    res.render('writer/edit-article', {
      title: 'Edit Article',
      layout: 'writer',
      article,
      categories,
      tags: tagsWithSelection,
      canDelete: article.status !== 'pending',
      canSubmit: article.status !== 'pending',
      canViewRejections: article.status === 'rejected',
      imgbbApiKey: process.env.IMGBB_API_KEY,
    })
  } catch (error) {
    next(error)
  }
}

const updateArticle = async (req, res, next) => {
  try {
    const authorId = req.user.id
    const { action, tags, ...articleData } = req.body
    const { is_premium } = articleData

    articleData.is_premium = is_premium === 'on' ? true : false

    console.log('=================== body:', req.body)

    // Normalize tags to an array
    const normalizedTags = Array.isArray(tags) ? tags : tags ? [tags] : []

    console.log('Article Data:', { ...articleData, tags: normalizedTags })

    if (action === 'edit') {
      await articleService.updateArticle(req.params.articleId, {
        ...articleData,
        tags: normalizedTags,
      })
      res.redirect('/writer/articles')
    } else if (action === 'submit') {
      await articleService.submitArticleForApproval(req.params.articleId, authorId)
      res.redirect('/writer/articles')
    } else if (action === 'delete') {
      await articleService.deleteArticle(req.params.articleId, authorId)
      res.redirect('/writer/articles')
    } else {
      res.redirect(`/writer/articles/edit/${req.params.articleId}`)
    }
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getArticleRejections = async (req, res, next) => {
  try {
    const articleId = req.params.articleId
    console.log('=========================> Article ID: ', articleId)
    const rejections = await articleService.getArticleRejections(articleId)
    res.render('writer/article-rejections', {
      title: 'Rejected Articles',
      layout: 'writer',
      rejections,
      articleId,
    })
  } catch (error) {
    next(error)
  }
}

const deleteArticle = async (req, res, next) => {
  try {
    const authorId = req.user.id
    await articleService.deleteArticle(req.params.articleId, authorId)
    res.redirect('/writer/articles')
  } catch (error) {
    next(error)
  }
}

export default {
  getArticleRejections,
  getEditArticle,
  getCreateArticle,
  getDashboard,
  createArticle,
  updateArticle,
  deleteArticle,
}
