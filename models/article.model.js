// models/article.model.js
import BaseModel from './Base.model.js'
import db from '../utils/Database.js'

// CREATE TYPE article_status AS ENUM ('draft', 'pending', 'approved', 'published', 'rejected');
// CREATE TABLE articles (
//   id SERIAL PRIMARY KEY,
//   title VARCHAR(200) NOT NULL,
//   abstract TEXT NOT NULL,
//   content TEXT NOT NULL,
//   thumbnail VARCHAR(255),
//   author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
//   status article_status NOT NULL DEFAULT 'draft',
//   published_at TIMESTAMPTZ,
//   views INTEGER DEFAULT 0,
//   is_premium BOOLEAN DEFAULT FALSE,
//   search_vector tsvector,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

// Create a trigger function to update the search_vector column
// CREATE FUNCTION articles_search_vector_update() RETURNS trigger AS $$
// BEGIN
//   NEW.search_vector :=
//     setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
//     setweight(to_tsvector('english', coalesce(NEW.abstract, '')), 'B') ||
//     setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C');
//   RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;

// CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
// ON articles FOR EACH ROW EXECUTE PROCEDURE articles_search_vector_update();

// Create indexes for the articles table
// CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
// CREATE INDEX idx_articles_category_id ON articles(category_id);
// CREATE INDEX idx_articles_search_vector ON articles USING GIN(search_vector);

class ArticleModel extends BaseModel {
  constructor() {
    super('articles')
  }

  async getArticleById(id) {
    // Build the SELECT query to retrieve the article by its ID
    const query = `
      SELECT a.*,
             u.full_name AS author_name,
             c.name AS category_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = $1
    `
    // Execute the query and return the result
    const { rows } = await db.query(query, [id])
    return rows[0]
  }

  async getArticles(filters = {}, options = {}) {
    // Initialize base query
    let query = `
      SELECT a.*, u.full_name AS author_name, c.name AS category_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE 1=1
    `

    // Store query parameters
    const queryParams = []

    // Dynamically add conditions
    if (filters.author_id) {
      queryParams.push(filters.author_id)
      query += ` AND a.author_id = $${queryParams.length}`
    }

    if (filters.category_id) {
      queryParams.push(filters.category_id)
      query += ` AND a.category_id = $${queryParams.length}`
    }

    if (filters.status) {
      queryParams.push(filters.status)
      query += ` AND a.status = $${queryParams.length}`
    }

    if (filters.is_premium) {
      queryParams.push(filters.is_premium)
      query += ` AND a.is_premium = $${queryParams.length}`
    }

    // Add ORDER BY, LIMIT, and OFFSET
    query += `
      ORDER BY a.published_at DESC
      LIMIT $${queryParams.length + 1}
      OFFSET $${queryParams.length + 2}
    `

    // Add LIMIT and OFFSET to queryParams
    queryParams.push(options.limit || 10)
    queryParams.push(options.offset || 0)

    // Execute query
    const { rows } = await db.query(query, queryParams)
    return rows
  }

  async createArticle(data) {
    return await this.create(data)
  }

  async updateArticle(id, data) {
    return await this.update(id, data)
  }

  async deleteArticle(id) {
    // Delete the article from the database
    return await this.delete(id)
  }

  async searchArticles(keyword, options = {}) {
    const query = `
      SELECT a.*, ts_rank_cd(a.search_vector, query) AS rank
      FROM articles a, to_tsquery('english', $1) query
      WHERE a.search_vector @@ query
      ORDER BY rank DESC
      LIMIT $2 OFFSET $3
    `
    const values = [keyword, options.limit || 10, options.offset || 0]
    const { rows } = await db.query(query, values)
    return rows
  }

  async getArticlesByCategory(categoryId, options = {}) {
    return await this.getArticles({ category_id: categoryId, status: 'published' }, options)
  }

  async getArticlesByAuthor(authorId, options = {}) {
    return await this.getArticles({ author_id: authorId }, options)
  }

  async increaseViewCount(id) {
    // Define the SQL query to update the view count
    const query = `
      UPDATE articles
      SET views = views + 1
      WHERE id = $1
      RETURNING views
    `
    // Execute the query with the provided article ID
    const { rows } = await db.query(query, [id])
    // Return the updated view count
    return rows[0]
  }

  async getRelatedArticles(categoryId, excludeArticleId, limit = 5) {
    const query = `
      SELECT a.*, c.name as category, c.id as category_id
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.category_id = $1 AND a.id != $2 AND status = 'published'
      ORDER BY RANDOM()
      LIMIT $3
    `
    const { rows } = await db.query(query, [categoryId, excludeArticleId, limit])
    return rows
  }

  async deleteArticleByUserID(user_id) {
    const text = 'DELETE FROM articles WHERE author_id = $1 RETURNING *;'
    const values = [user_id]

    await db.query(text, values)
  }

  async getHomepageArticles() {
    const featuredArticles = await this.getFeaturedArticles()
    const mostViewedArticles = await this.getMostViewedArticles()
    const newestArticles = await this.getNewestArticles()
    const topCategoryArticles = await this.getTopCategoryArticles()

    return {
      featuredArticles,
      mostViewedArticles,
      newestArticles,
      topCategoryArticles,
    }
  }

  async getFeaturedArticles() {
    const query = `
      SELECT a.*, c.name AS category
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE status = 'published' 
      ORDER BY views DESC 
      LIMIT 4
    `
    const { rows } = await db.query(query)
    return rows
  }

  async getMostViewedArticles() {
    const query = `
      SELECT a.*, c.name AS category
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE status = 'published' 
      ORDER BY views DESC 
      LIMIT 10
    `
    const { rows } = await db.query(query)
    return rows
  }

  async getNewestArticles() {
    const query = `
      SELECT a.*, c.name AS category
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE status = 'published' 
      ORDER BY published_at DESC 
      LIMIT 10
    `
    const { rows } = await db.query(query)
    return rows
  }

  async getTopCategoryArticles() {
    const query = `
      SELECT DISTINCT ON (category_id) a.*, c.name AS category
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE status = 'published' 
      ORDER BY category_id, published_at DESC
      LIMIT 10
    `
    const { rows } = await db.query(query)
    return rows
  }

  async getArticleStats(authorId) {
    const query = `
    SELECT
      COUNT(*) FILTER (WHERE status = 'draft') AS draftArticles,
      COUNT(*) FILTER (WHERE status = 'pending') AS pendingArticles,
      COUNT(*) FILTER (WHERE status = 'approved') AS approvedArticles,
      COUNT(*) FILTER (WHERE status = 'rejected') AS rejectedArticles,
      COUNT(*) FILTER (WHERE status = 'published') AS publishedArticles
    FROM articles
    WHERE author_id = $1
  `
    const { rows } = await db.query(query, [authorId])
    return rows[0]
  }

  async getFilteredArticles(filters = {}, options = {}) {
    const queryParams = []
    const countParams = [] // Separate parameters for countQuery
    let whereClause = `WHERE 1=1 `

    // Add search query if a keyword is provided
    if (filters.keyword) {
      const formattedKeyword = filters.keyword.trim().replace(/\s+/g, ' & ')
      whereClause += `AND a.search_vector @@ to_tsquery('english', $${queryParams.length + 1}) `
      queryParams.push(formattedKeyword)
      countParams.push(formattedKeyword)
    }

    // Apply dynamic filters
    if (filters.author_id) {
      queryParams.push(filters.author_id)
      countParams.push(filters.author_id)
      whereClause += `AND a.author_id = $${queryParams.length} `
    }

    if (filters.category_id) {
      queryParams.push(filters.category_id)
      countParams.push(filters.category_id)
      whereClause += `AND a.category_id = $${queryParams.length} `
    }

    if (filters.tag_id) {
      whereClause += `AND a.id IN (
          SELECT article_id
          FROM article_tags
          WHERE tag_id = $${queryParams.length + 1}
        ) `
      queryParams.push(filters.tag_id)
      countParams.push(filters.tag_id)
    }

    if (filters.status) {
      queryParams.push(filters.status)
      countParams.push(filters.status)
      whereClause += `AND a.status = $${queryParams.length} `
    }

    if (filters.is_premium) {
      queryParams.push(filters.is_premium)
      countParams.push(filters.is_premium)
      whereClause += `AND a.is_premium = $${queryParams.length} `
    }

    // Build main query
    const query = `
      SELECT 
        a.*, 
        u.full_name AS author_name, 
        c.name AS category_name, 
        ${filters.keyword ? "ts_rank_cd(a.search_vector, to_tsquery('english', $1))" : '0'} AS rank
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      ${whereClause}
      ORDER BY ${filters.keyword ? 'rank DESC,' : ''} ${options.orderBy || 'a.published_at DESC'}
      LIMIT $${queryParams.length + 1}
      OFFSET $${queryParams.length + 2}
    `
    queryParams.push(options.limit || 10)
    queryParams.push(options.offset || 0)

    // Build count query
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      ${whereClause}
    `

    // Execute the count query
    const countResult = await db.query(countQuery, countParams)

    // Execute the main query
    const { rows } = await db.query(query, queryParams)

    return {
      articles: rows,
      totalArticles: parseInt(countResult.rows[0]?.total || 0, 10),
    }
  }
}

const articleModel = new ArticleModel()
export default articleModel
