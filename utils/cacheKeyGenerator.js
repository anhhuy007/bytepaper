// utils/cacheKeyGenerator.js

export const adminCacheKeyGenerator = {
  adminDashboard: () => 'admin:dashboard',
  userList: (req) => `admin:users:${JSON.stringify(req.query)}`, // Include query for pagination, filters, etc.
  addUser: () => 'admin:user:add',
  userDetails: (req) => `admin:user:${req.params.userId}`, // Cache based on userId
  categoryList: (req) => `admin:categories:${JSON.stringify(req.query)}`, // Cache for category list with filters/pagination
  categoryDetails: (req) => `admin:category:${req.params.categoryId}`, // Cache for individual category
  addCategoryPage: () => 'admin:categories:add-page', // Cache for "Add Category" page
  editCategoryPage: (req) => `admin:categories:edit-page:${req.params.categoryId}`, // Cache for "Edit Category" page
  tagList: (req) => `admin:tags:${JSON.stringify(req.query)}`, // Cache for tag list with filters/pagination
  tagDetails: (tagId) => `admin:tag:${tagId}`, // Cache for individual tag details if needed
  articleList: (req) => `admin:articles:${JSON.stringify(req.query)}`, // Cache for articles with filters/pagination
  editorList: () => 'admin:editors', // Cache for editor list
  editorCategories: (req) => {
    const query = JSON.stringify(req.query) // Serialize query parameters
    return `admin:editor:${req.params.editorId}:categories:${query}`
  },
}

export const authCacheKeyGenerator = {
  signupPage: () => 'auth:signup',
  loginPage: () => 'auth:login',
  forgotPasswordPage: () => 'auth:forgot-password',
}

export const articleCacheKeyGenerator = {
  homepage: (req) => `articles:home:${req.query.type || 'default'}`, // Cache homepage by type
  filtered: (req) => `articles:filter:${JSON.stringify(req.query)}`, // Cache filtered articles
  byTag: (req) => `articles:tag:${req.params.tagId}:${JSON.stringify(req.query)}`, // Cache by tag ID
  byCategory: (req) => `articles:category:${req.params.categoryId}:${JSON.stringify(req.query)}`, // Cache by category ID
  details: (req) => `articles:details:${req.params.id}`, // Cache article details
}

export const userCacheKeyGenerator = {
  profile: (req) => `user:${req.user.id}:profile`, // Cache key for user profile
  editProfile: (req) => `user:${req.user.id}:edit-profile`, // Cache key for edit profile
  changePassword: (req) => `user:change-password`, // Cache key for change password
  subscription: (req) => `user:subscription`, // Cache key for subscription
}

export const writerCacheKeyGenerator = {
  dashboard: (req) => `writer:${req.user.id}:dashboard:${JSON.stringify(req.query)}`, // Cache key for dashboard
  createArticle: (req) => `writer:${req.user.id}:create-article`, // Cache key for create article page
  editArticle: (req) => `writer:${req.user.id}:edit-article:${req.params.articleId}`, // Cache key for edit article page
  articleRejections: (req) => `writer:${req.user.id}:article-rejections:${req.params.articleId}`, // Cache key for article rejections
}

export const editorCacheKeyGenerator = {
  dashboard: (req) => `editor:${req.user.id}:dashboard`,
  articles: (req) => `editor:${req.user.id}:articles:${JSON.stringify(req.query)}`, // Cache by filters and pagination
  articleDetails: (req) => `editor:${req.user.id}:article:${req.params.articleId}`,
  approveForm: (req) => `editor:${req.user.id}:article:${req.params.articleId}:approve`,
  rejectForm: (req) => `editor:${req.user.id}:article:${req.params.articleId}:reject`,
}

export default {
  adminCacheKeyGenerator,
  authCacheKeyGenerator,
  articleCacheKeyGenerator,
  userCacheKeyGenerator,
  writerCacheKeyGenerator,
  editorCacheKeyGenerator,
}
