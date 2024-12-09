// utils/cacheKeyGenerator.js

const homeCacheKeyGenerator = (req) => {
  const type = req.query.type || 'all'
  return `home:${type}`
}

const articlesByCategoryCacheKeyGenerator = (req) => {
  const categoryId = req.params.categoryId
  const limit = req.query.limit || 10
  const offset = req.query.offset || 0
  return `articles:category:${categoryId}:limit:${limit}:offset:${offset}`
}

const articlesByTagCacheKeyGenerator = (req) => {
  const tagId = req.params.tagId
  const limit = req.query.limit || 10
  const offset = req.query.offset || 0
  return `articles:tag:${tagId}:limit:${limit}:offset:${offset}`
}

const articleDetailCacheKeyGenerator = (req) => {
  const articleId = req.params.id
  return `article:${articleId}`
}

const searchCacheKeyGenerator = (req) => {
  const q = req.query.q || ''
  const limit = req.query.limit || 10
  const offset = req.query.offset || 0
  return `search:q:${q}:limit:${limit}:offset:${offset}`
}

const categoryListCacheKeyGenerator = () => 'categories:list'

const tagListCacheKeyGenerator = () => 'tags:list'

const userProfileCacheKeyGenerator = (req) => {
  const userId = req.user.id
  return `user:${userId}`
}

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
  editorCategories: (req) => `admin:editor:${req.params.editorId}:categories`, // Cache for an editor's categories
}

export default {
  homeCacheKeyGenerator,
  articlesByCategoryCacheKeyGenerator,
  articlesByTagCacheKeyGenerator,
  articleDetailCacheKeyGenerator,
  searchCacheKeyGenerator,
  categoryListCacheKeyGenerator,
  tagListCacheKeyGenerator,
  userProfileCacheKeyGenerator,
  adminCacheKeyGenerator,
}
