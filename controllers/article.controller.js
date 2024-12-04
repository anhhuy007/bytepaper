// controllers/article.controller.js

import articleService from '../services/article.service.js'
import commentService from '../services/comment.service.js'

const getArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.id

    // Fetch article, related articles, and comments
    const article = await articleService.getArticleById(articleId)
    const relatedArticles = await articleService.getRelatedArticles(articleId)
    const comments = await commentService.getCommentsByArticleId(articleId)
    const user = req.user

    console.log('=========================> Comments:', comments)

    // Render the detail view
    return res.render('articles/detail', {
      article,
      relatedArticles,
      comments,
      user,
    })
  } catch (error) {
    next(error)
  }
}

const increaseArticleViewCount = async (req, res, next) => {
  try {
    // Extract the article ID from the request parameters
    const { id } = req.params

    // Increase the article's view count using the article service
    const views = await articleService.increaseArticleViewCount(id)

    // Send a success response with the updated view count
    res.status(200).json({
      success: true,
      data: views,
    })
  } catch (error) {
    // Pass any errors to the next middleware
    next(error)
  }
}

const downloadArticle = async (req, res, next) => {
  try {
    // Retrieve the article ID from the request parameters
    const { id } = req.params

    // Retrieve the article from the database
    const article = await articleService.getArticleById(id)

    // Check if the article is found
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' })
    }

    // Check if the article is premium
    if (article.is_premium) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    // Check if the article is published
    if (article.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Article not published' })
    }

    // Download the file associated with the article
    const file = await articleService.downloadArticle(id)

    // Check if the file is found
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' })
    }

    // Send the file as a response
    res.download(file.path)
  } catch (error) {
    // Pass any errors to the next middleware
    next(error)
  }
}

// GET /api/v1/articles/home?type=(featured|most-viewed|newest|top-categories)
const getHomepageArticles = async (req, res, next) => {
  try {
    const type = req.query.type
    const homepageData = await articleService.getHomepageArticles(type)
    // res.status(200).json({
    //   success: true,
    //   data: homepageData,
    // });
    return homepageData
  } catch (error) {
    next(error)
  }
}

const handleArticles = async (req, res, next) => {
  try {
    const { keyword, categoryId, tagId, page = 1, limit = 10 } = req.query

    const options = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      status: 'published',
    }

    const filters = { keyword, categoryId, tagId, status: 'published' }

    const articles = await articleService.getFilteredArticles(filters, options)
    const totalPages = Math.ceil(articles.length / options.limit)

    return res.render('articles/list', {
      articles,
      currentPage: parseInt(page),
      totalPages,
      query: req.query,
    })
  } catch (error) {
    next(error)
  }
}

export default {
  handleArticles,
  getArticleById,
  increaseArticleViewCount,
  downloadArticle,
  getHomepageArticles,
}
