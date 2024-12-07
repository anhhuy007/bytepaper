// controllers/writer.controller.js

import articleService from '../services/article.service.js'
import categoryService from '../services/category.service.js'
const getDashboard = async (req, res, next) => {
  try {
    const authorId = req.user.id

    // Fetch statistics
    const stats = await articleService.getArticleStats(authorId)

    // Fetch articles
    const filters = { author_id: authorId, status: req.query.status || undefined }
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    }
    const articles = await articleService.getArticles(filters, options)

    res.render('writer/articles', {
      stats,
      articles,
      statuses: ['draft', 'pending', 'approved', 'published', 'rejected'],
      selectedStatus: req.query.status || '',
    })
  } catch (error) {
    next(error)
  }
}

const getCreateArticle = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories()
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
    const categories = await categoryService.getAllCategories()
    res.render('writer/edit-article', {
      title: 'Edit Article',
      layout: 'writer',
      article,
      categories,
    })
  } catch (error) {
    next(error)
  }
}

const updateArticle = async (req, res, next) => {
  try {
    const authorId = req.user.id
    console.log('=================== body:', req.body)
    // Lấy hành động từ form
    const { action, ...articleData } = req.body
    const actionType = action[1]
    console.log('Action:', actionType)
    console.log('Article Data:', articleData)

    if (actionType === 'save') {
      await articleService.updateArticle(req.params.articleId, articleData, authorId)
      res.redirect('/writer/articles')
    } else if (actionType === 'submit') {
      await articleService.submitArticleForApproval(req.params.articleId, authorId)
      res.redirect('/writer/articles')
    } else if (actionType === 'delete') {
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

export default {
  getEditArticle,
  getCreateArticle,
  getDashboard,
  createArticle,
  deleteArticle,
  updateArticle,
  submitArticleForApproval,
}
