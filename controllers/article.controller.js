// controllers/article.controller.js

import articleService from '../services/article.service.js'
import tagService from '../services/tag.service.js'
import categoryService from '../services/category.service.js'

const getAllArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, orderBy = 'a.published_at DESC', query } = req.query

    const options = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      orderBy,
    }

    const filters = query ? { query } : {}

    filters.status = 'published'

    // Retrieve categories assigned to the current editor
    const categories = await categoryService.getAllCategories()

    // Map category IDs for filtering articles
    const categoryIds = categories.map((category) => category.id)

    filters.category_id = categoryIds

    const articles = await articleService.getAllArticles(filters, options)

    const totalPages = Math.ceil(articles.length / options.limit)

    console.log('==================> articles', articles)
    return res.render('articles/list', {
      articles,
      currentPage: parseInt(page),
      totalPages,
      query,
    })
  } catch (error) {
    next(error)
  }
}

const getArticleById = async (req, res, next) => {
  try {
    // Retrieve the article by its ID
    const article = await articleService.getArticleById(req.params.id)
    // Return the article as JSON response
    // res.status(200).json({ success: true, data: article });
    return { article }
  } catch (error) {
    // If any error occurs, pass it to the next middleware function
    next(error)
  }
}

const searchArticles = async (req, res, next) => {
  try {
    // Extract the search keyword from the query parameters
    const keyword = req.query.q || '' // Default to an empty string if no query provided
    console.log('Search Keyword:', keyword)

    // Define search options for pagination (limit and offset)
    const options = {
      limit: parseInt(req.query.limit, 10) || 10,
      offset: parseInt(req.query.offset, 10) || 0,
    }

    // Call the service method to search for articles based on the keyword and options
    const articles = await articleService.searchArticles(keyword, options)

    console.log('Search Results:', articles)

    // Optionally, calculate pagination info here or within the service
    const totalArticles = articles.length // Assuming articles have all results
    const totalPages = Math.ceil(totalArticles / options.limit)

    // Return the search results along with pagination data
    return res.render('articles/search', {
      articles,
      currentPage: req.query.page || 1,
      totalPages: totalPages,
      query: keyword,
    })
  } catch (error) {
    next(error)
  }
}

const getArticlesByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    }
    const articles = await articleService.getArticlesByCategory(categoryId, options)
    // res.status(200).json({ success: true, data: articles });
    return { articles }
  } catch (error) {
    next(error)
  }
}

const getArticlesByTag = async (req, res, next) => {
  try {
    const { tagId } = req.params
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    }
    const articles = await tagService.getArticlesByTagId(tagId, options)
    // res.status(200).json({ success: true, data: articles });
    return { articles }
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

export default {
  getAllArticles,
  getArticleById,
  searchArticles,
  getArticlesByCategory,
  getArticlesByTag,
  increaseArticleViewCount,
  downloadArticle,
  getHomepageArticles,
}
