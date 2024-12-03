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

export default {
  homeCacheKeyGenerator,
  articlesByCategoryCacheKeyGenerator,
  articlesByTagCacheKeyGenerator,
  articleDetailCacheKeyGenerator,
  searchCacheKeyGenerator,
  categoryListCacheKeyGenerator,
  tagListCacheKeyGenerator,
  userProfileCacheKeyGenerator,
}
