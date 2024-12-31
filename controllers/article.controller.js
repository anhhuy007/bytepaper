// controllers/article.controller.js

import articleService from '../services/article.service.js'
import commentService from '../services/comment.service.js'
import categoryService from '../services/category.service.js'
import tagService from '../services/tag.service.js'
import sanitizeHtml from 'sanitize-html'

const processArticleContent = (content) => {
  if (!content) return '<p>No content available.</p>'

  // Kiểm tra nếu content đã có thẻ HTML
  const isHtmlContent = /<\/?[a-z][\s\S]*>/i.test(content)

  if (isHtmlContent) {
    // Sanitize nội dung HTML để bảo mật
    return sanitizeHtml(content, {
      allowedTags: [
        ...sanitizeHtml.defaults.allowedTags,
        'iframe', // Thêm iframe vào danh sách thẻ được phép
        'img',
        'h1',
        'h2',
        'h3',
      ],
      allowedAttributes: {
        '*': ['style', 'class', 'id'], // Giữ lại các thuộc tính chung
        a: ['href', 'name', 'target'], // Thuộc tính cho thẻ <a>
        img: ['src', 'alt'], // Thuộc tính cho thẻ <img>
        iframe: ['src', 'frameborder', 'allowfullscreen', 'class'], // Thuộc tính cho <iframe>
      },
      allowedSchemes: ['http', 'https'], // Chỉ cho phép các URL bắt đầu bằng http/https
    })
  }

  // Nếu không có thẻ HTML, bọc nội dung bằng <p>
  return `<p>${sanitizeHtml(content)}</p>`
}

const getArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.id

    // Fetch article, related articles, and comments
    const article = await articleService.getArticleById(articleId)
    const relatedArticles = await articleService.getRelatedArticles(articleId)
    const comments = await commentService.getCommentsByArticleId(articleId)
    const user = req.user

    // Restrict access to premium content
    if (article.is_premium && (!user || user.role !== 'subscriber')) {
      return res.status(403).render('errors/403', {
        message: 'This content is only available to subscribers. Please subscribe to access.',
      })
    }

    article.content = processArticleContent(article.content)

    // Determine the action button logic
    let actionButton = null
    if (article.is_premium) {
      if (user) {
        if (user.role === 'subscriber') {
          actionButton = { label: 'Download', href: '/download/' + articleId }
        } else {
          actionButton = { label: 'Extend Subscription', href: '/user/extend-subscription' }
        }
      } else {
        actionButton = { label: 'Login to Download', href: '/auth/login' }
      }
    }
    // Increase the article's view count
    await articleService.increaseArticleViewCount(articleId)
    // Render the detail view
    return res.render('articles/detail', {
      article,
      relatedArticles,
      comments,
      user,
      layout: 'article',
      actionButton, // Pass action button data to the template
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

const getHomepageArticles = async (req, res, next) => {
  try {
    const type = req.query.type
    const homepageData = await articleService.getHomepageArticles(type)

    return homepageData
  } catch (error) {
    next(error)
  }
}

const getArticlesByFilter = async (req, res, next) => {
  try {
    // Extract filters and pagination options
    const filters = {
      keyword: req.query.keyword || null,
      category_id: req.query.category_id || null,
      tag_id: parseInt(req.query.tag_id, 10) || null,
      status: req.query.status || 'published',
    }

    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1) // Default: 10, min: 1
    const page = parseInt(req.query.page, 10) || 1 // Default: page 1
    const offset = (page - 1) * limit

    const options = {
      limit,
      offset,
      orderBy: req.query.orderBy || 'published_at DESC', // Default: Newest
    }

    // Fetch filtered articles and total count
    let { articles, totalArticles } = await articleService.getFilteredArticles(filters, options)
    let { articles, totalArticles } = await articleService.getFilteredArticles(filters, options)

    // Fetch all categories and tags for filtering
    const allOptions = {
      limit: 100,
      offset: 0,
    }

    const allFilters = {}
    const { categories } = await categoryService.getAllCategories(allFilters, allOptions)
    const { tags } = await tagService.getAllTags(allFilters, allOptions)

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalArticles / limit)

    // If user is a subscriber, prioritize showing premium articles
    const user = req.user
    if (user && user.role === 'subscriber') {
      const premiumArticles = articles.filter((article) => article.is_premium)
      const freeArticles = articles.filter((article) => !article.is_premium)
      articles = [...premiumArticles, ...freeArticles]
    }

    // Render view with articles, filters, and pagination
    res.render('articles/search', {
      articles,
      categories,
      tags,
      currentPage: page,
      totalPages,
      query: req.query,
      selectedCategory: filters.category_id,
      selectedTag: filters.tag_id,
      keyword: filters.keyword,
    })
  } catch (error) {
    next(error)
  }
}

const getArticlesByTagId = async (req, res, next) => {
  try {
    const tagId = req.params.tagId

    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1) // Default: 10, min: 1
    const page = parseInt(req.query.page, 10) || 1 // Default: page 1
    const offset = (page - 1) * limit

    const options = {
      limit,
      offset,
      orderBy: req.query.orderBy || 'published_at DESC',
    }

    const filters = {
      tag_id: tagId,
      status: 'published',
    }

    let { articles, totalArticles } = await articleService.getFilteredArticles(filters, options)
    const totalPages = Math.ceil(totalArticles / limit)
    const tag = await tagService.getTagById(tagId)
    const user = req.user
    // If user is a subscriber, prioritize showing premium articles
    if (user && user.role === 'subscriber') {
      const premiumArticles = articles.filter((article) => article.is_premium)
      const freeArticles = articles.filter((article) => !article.is_premium)
      articles = [...premiumArticles, ...freeArticles]
    }
    res.render('articles/list', {
      articles,
      currentPage: page,
      totalPages,
      title: `Nhãn: ${tag.name}`,
      query: req.query,
    })
  } catch (error) {
    next(error)
  }
}

const getArticlesByCategoryId = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId

    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1) // Default: 10, min: 1
    const page = parseInt(req.query.page, 10) || 1 // Default: page 1
    const offset = (page - 1) * limit

    const options = {
      limit,
      offset,
      orderBy: req.query.orderBy || 'published_at DESC',
    }

    const category = await categoryService.getCategoryById(categoryId)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    let filters = { status: 'published' }

    // Check if the category is a parent or child
    if (!category.parent_id) {
      // Parent category: Get all child categories
      const childCategories = await categoryService.getChildCategories(categoryId)
      const childCategoryIds = childCategories.map((child) => child.id)

      // Filter articles belonging to any of the child categories
      filters.category_ids = childCategoryIds
    } else {
      // Child category: Filter articles belonging to this category
      filters.category_id = categoryId
    }
    console.log(filters)
    let { articles, totalArticles } = await articleService.getFilteredArticles(filters, options)
    const totalPages = Math.ceil(totalArticles / limit)

    const user = req.user
    // If user is a subscriber, prioritize showing premium articles
    if (user && user.role === 'subscriber') {
      const premiumArticles = articles.filter((article) => article.is_premium)
      const freeArticles = articles.filter((article) => !article.is_premium)
      articles = [...premiumArticles, ...freeArticles]
    }
    res.render('articles/list', {
      currentCategoryId: categoryId,
      articles,
      currentPage: page,
      totalPages,
      title: `Chuyên mục: ${category.name}`,
      query: req.query,
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getArticlesByFilter,
  getArticleById,
  increaseArticleViewCount,
  getHomepageArticles,
  getArticlesByTagId,
  getArticlesByCategoryId,
}
