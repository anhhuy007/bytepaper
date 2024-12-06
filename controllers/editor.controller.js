// controllers/editor.controller.js

import articleService from '../services/article.service.js'
import adminService from '../services/admin.service.js'
// import tagService from '../services/tag.service.js'
// import categoryService from '../services/category.service.js'
// import userService from '../services/user.service.js'

/**
 * Retrieves a list of pending articles assigned to the current editor, based on
 * the categories they are assigned to.
 *
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @param {Function} next - The Express.js next middleware function for error
 *   handling.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has
 *   finished executing.
 * @throws {Error} If there is an error retrieving the articles.
 * @example
 * const response = await editorController.getPendingArticles(
 *   req,
 *   res,
 *   next
 * );
 * console.log(response);
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: 1,
 *       title: "Example Article",
 *       abstract: "This is an example article.",
 *       content: "<p>This is the article content.</p>",
 *       thumbnail: null,
 *       author_id: 1,
 *       category_id: null,
 *       status: "pending",
 *       published_at: null,
 *       views: 0,
 *       is_premium: false,
 *       search_vector: null,
 *       created_at: "2021-01-01T00:00:00.000Z",
 *       updated_at: "2021-01-01T00:00:00.000Z",
 *       author_name: "John Doe",
 *       category_name: null,
 *     },
 *   ]
 * }
 */
const getPendingArticles = async (req, res, next) => {
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

const renderDashboard = async (req, res, next) => {
  try {
    // const editorId = req.user.id
    // const categories = await adminService.getCategoriesByEditor(editorId)

    // const categories = await categoryService.getAllCategories()

    const categories = [
      { id: 1, name: 'Kinh tế' },
      { id: 2, name: 'Công nghệ' },
      { id: 3, name: 'Giáo dục' },
      { id: 4, name: 'Sức khỏe' },
      { id: 5, name: 'Văn hóa' },
      { id: 6, name: 'Thể thao' },
      { id: 7, name: 'Chính trị' },
      { id: 8, name: 'Môi trường' },
      { id: 9, name: 'Du lịch' },
      { id: 10, name: 'Giải trí' },
    ]

    res.render('editor/dashboard', {
      layout: 'editor',
      data: categories,
    })
  } catch (error) {
    next(error)
  }
}

const getMyArticles = async (req, res, next) => {
  try {
    // const editorId = req.user.id
    // const categories = await adminService.getCategoriesByEditor(editorId)
    // const categoryIds = categories.map((category) => parseInt(category.id, 10))
    // if (!categoryIds.length) {
    //   return []
    // }
    // const filters = {
    //   category_id: categoryIds,
    // }
    let filters = {}

    const status = req.query.status

    if (!status) {
      filters.status = 'draft'
    }

    if (!['draft', 'pending', 'published', 'rejected', 'approved'].includes(status)) {
      throw new Error('Invalid status')
    }

    filters.status = status
    res.locals.status = status

    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    }
    // const articles = await articleService.getAllArticles(filters, options)
    // console.log(articles)

    // res.status(200).json({ success: true, data: articles });
    // return res.render('editor/articleDetail', { layout: 'editor', articles })

    // const article = filters

    // article.title = 'title1'
    // article.content = 'content1'
    // article.user = 'user1'
    // articles.user = userService.getUserById(2)

    const articles = [
      {
        id: 1,
        title: 'Introduction to Tailwind',
        content: `
      <div class="p-4 bg-gray-50 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800 mb-3">
          Getting Started with Tailwind CSS
        </h1>
        <p class="text-gray-700 leading-relaxed">
          Tailwind CSS is a utility-first CSS framework designed for rapid UI development. It offers ready-to-use classes for styling without custom CSS.
        </p>
      </div>
    `,
        abstract:
          'Learn the basics of Tailwind CSS and how to quickly set up a project using this utility-first framework.',
        user: 'user1',
        reject_reason: 'The content does not meet the required guidelines.',
        published_at: '2024-12-01T08:00:00Z',
      },
      {
        id: 2,
        title: 'Utility-First Design',
        content: `
      <div class="p-4 bg-gray-50 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800 mb-3">
          Why Choose Utility-First Design?
        </h1>
        <p class="text-gray-700 leading-relaxed">
          Utility-first design empowers developers to use pre-defined classes to craft custom designs without writing additional CSS rules.
        </p>
      </div>
    `,
        abstract:
          'Explore the benefits of utility-first design and how it streamlines development.',
        user: 'user2',
        reject_reason: 'Formatting issues and incomplete examples.',
        published_at: '2024-12-02T10:30:00Z',
      },
      {
        id: 3,
        title: 'Responsive Layouts',
        content: `
      <div class="p-4 bg-gray-50 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800 mb-3">
          Building Responsive Layouts with Tailwind
        </h1>
        <p class="text-gray-700 leading-relaxed">
          Tailwind CSS offers powerful utilities for creating responsive designs that adapt seamlessly to any screen size.
        </p>
      </div>
    `,
        abstract: 'Learn how to use Tailwind to create responsive layouts with ease.',
        user: 'user3',
        reject_reason: 'Requires additional examples for better clarity.',
        published_at: '2024-12-03T15:00:00Z',
      },
      {
        id: 4,
        title: 'Typography Utilities',
        content: `
      <div class="p-4 bg-gray-50 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800 mb-3">
          Mastering Typography Utilities
        </h1>
        <p class="text-gray-700 leading-relaxed">
          Tailwind provides extensive typography utilities for managing text size, weight, alignment, and more.
        </p>
      </div>
    `,
        abstract: 'Discover how Tailwind simplifies typography styling with its utilities.',
        user: 'user4',
        reject_reason: 'Content needs a deeper explanation on advanced topics.',
        published_at: '2024-12-04T09:45:00Z',
      },
      {
        id: 5,
        title: 'Customizing Colors',
        content: `
      <div class="p-4 bg-gray-50 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800 mb-3">
          Customizing Colors in Tailwind
        </h1>
        <p class="text-gray-700 leading-relaxed">
          Tailwind allows developers to customize the default color palette to match their brand identity.
        </p>
      </div>
    `,
        abstract: 'Learn how to customize and extend the color palette in Tailwind.',
        user: 'user5',
        reject_reason: 'Color palette lacks sufficient examples.',
        published_at: '2024-12-05T12:00:00Z',
      },
      {
        id: 6,
        title: 'Dark Mode Support',
        content: `
      <div class="p-4 bg-gray-50 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800 mb-3">
          Enabling Dark Mode
        </h1>
        <p class="text-gray-700 leading-relaxed">
          Tailwind makes it simple to add dark mode to your designs with utility classes.
        </p>
      </div>
    `,
        abstract: 'Enable dark mode in your projects with Tailwind CSS.',
        user: 'user6',
        reject_reason: 'Requires more in-depth coverage of dark mode setup.',
        published_at: '2024-12-06T14:30:00Z',
      },
      {
        id: 7,
        title: 'Grid Systems with Tailwind',
        content: `
      <div class="p-4 bg-gray-50 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800 mb-3">
          Utilizing Grid Systems
        </h1>
        <p class="text-gray-700 leading-relaxed">
          Learn how to build powerful grid-based layouts using Tailwind's grid utilities.
        </p>
      </div>
    `,
        abstract: 'A guide to implementing grid systems effectively using Tailwind CSS.',
        user: 'user7',
        reject_reason: 'Missing advanced grid examples.',
        published_at: '2024-12-07T16:00:00Z',
      },
      {
        id: 8,
        title: 'Animations in Tailwind',
        content: `
      <div class="p-4 bg-gray-50 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800 mb-3">
          Adding Animations
        </h1>
        <p class="text-gray-700 leading-relaxed">
          Tailwind CSS provides easy-to-use animation utilities to enhance user experience.
        </p>
      </div>
    `,
        abstract: 'Learn to create stunning animations using Tailwind’s utility classes.',
        user: 'user8',
        reject_reason: 'Needs more examples of complex animations.',
        published_at: '2024-12-08T13:30:00Z',
      },
      {
        id: 9,
        title: 'Custom Components',
        content: `
      <div class="p-4 bg-gray-50 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800 mb-3">
          Crafting Custom Components
        </h1>
        <p class="text-gray-700 leading-relaxed">
          Learn how to use Tailwind's utilities to craft reusable custom components.
        </p>
      </div>
    `,
        abstract: 'Master building custom components with Tailwind CSS.',
        user: 'user9',
        reject_reason: 'Requires detailed component examples.',
        published_at: '2024-12-09T18:00:00Z',
      },
      {
        id: 10,
        title: 'Advanced Techniques',
        content: `
      <div class="p-4 bg-gray-50 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800 mb-3">
          Advanced Tailwind Techniques
        </h1>
        <p class="text-gray-700 leading-relaxed">
          Explore advanced techniques in Tailwind CSS to enhance your workflow.
        </p>
      </div>
    `,
        abstract: 'Take your Tailwind CSS skills to the next level with these advanced techniques.',
        user: 'user10',
        reject_reason: 'Content requires additional best practices.',
        published_at: '2024-12-10T20:15:00Z',
      },
    ]

    // const tags = await tagService.getAllTags()
    // const categories = await categoryService.getAllCategories()

    const categories = [
      { id: 1, name: 'Kinh tế' },
      { id: 2, name: 'Công nghệ' },
      { id: 3, name: 'Giáo dục' },
      { id: 4, name: 'Sức khỏe' },
      { id: 5, name: 'Văn hóa' },
      { id: 6, name: 'Thể thao' },
      { id: 7, name: 'Chính trị' },
      { id: 8, name: 'Môi trường' },
      { id: 9, name: 'Du lịch' },
      { id: 10, name: 'Giải trí' },
    ]

    const tags = [
      { id: 1, name: 'tag1' },
      { id: 2, name: 'tag2' },
      { id: 3, name: 'tag3' },
      { id: 4, name: 'tag4' },
      { id: 5, name: 'tag5' },
      { id: 6, name: 'tag6' },
      { id: 7, name: 'tag7' },
      { id: 8, name: 'tag8' },
      { id: 9, name: 'tag9' },
      { id: 10, name: 'tag10' },
    ]

    res.render('editor/articleDetail', {
      layout: 'editor',
      data: articles,
      options: options,
      status: res.locals.status,
      tags: tags,
      categories: categories,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Approves an article for publication.
 *
 * This function handles the request to approve an article. It uses the article
 * service to perform the approval and sends a confirmation response back to the client.
 *
 * @param {Object} req - The Express.js request object containing the editor's ID in the user property and the article ID in the URL parameters.
 * @param {Object} res - The Express.js response object used to send the confirmation response.
 * @param {Function} next - The Express.js next middleware function for error handling.
 *
 * @returns {Promise<void>} A promise that resolves when the article has been approved and the response is sent.
 *
 * @throws {Error} If there is an error approving the article.
 */
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

/**
 * Rejects an article for publication.
 *
 * This function handles the request to reject an article. It uses the article
 * service to perform the rejection and sends a confirmation response back to the client.
 *
 * @param {Object} req - The Express.js request object containing the editor's ID in the user property and the article ID in the URL parameters, and the rejection reason in the request body.
 * @param {Object} res - The Express.js response object used to send the confirmation response.
 * @param {Function} next - The Express.js next middleware function for error handling.
 *
 * @returns {Promise<void>} A promise that resolves when the article has been rejected and the response is sent.
 *
 * @throws {Error} If there is an error rejecting the article.
 */
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

export default {
  renderDashboard,
  getPendingArticles,
  getMyArticles,
  approveArticle,
  rejectArticle,
}
