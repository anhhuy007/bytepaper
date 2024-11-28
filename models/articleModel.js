// models/articleModel.js
import BaseModel from "./BaseModel.js";
import db from "../utils/Database.js";
import { buildSelectQuery, buildWhereClause } from "../utils/queryBuilder.js";

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
  /**
   * Creates a new instance of the ArticleModel class, which is responsible for
   * interacting with the "articles" table in the database.
   *
   * @class ArticleModel
   * @extends BaseModel
   * @constructor
   */
  constructor() {
    /**
     * Calls the constructor of the parent class, BaseModel.
     *
     * @param {string} tableName - The name of the table in the database that
     * this model is responsible for.
     */
    super("articles");
  }

  /**
   * Retrieves an article by its ID.
   *
   * @param {number} id - The ID of the article to retrieve.
   * @returns {Promise<Object>} The article retrieved from the database, or null if
   * no matching article was found.
   *
   * @example
   * const article = await articleModel.getArticleById(1);
   * console.log(article);
   * {
   *   id: 1,
   *   title: "Example Article",
   *   abstract: "This is an example article.",
   *   content: "<p>This is the article content.</p>",
   *   thumbnail: null,
   *   author_id: 1,
   *   category_id: null,
   *   status: "draft",
   *   published_at: null,
   *   views: 0,
   *   is_premium: false,
   *   search_vector: null,
   *   created_at: "2021-01-01T00:00:00.000Z",
   *   updated_at: "2021-01-01T00:00:00.000Z",
   *   author_name: "John Doe",
   *   category_name: null,
   * }
   */
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
    `;
    // Execute the query and return the result
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  /**
   * Retrieves a list of articles from the database based on the provided filters
   * and options.
   *
   * @param {Object} [filters={}] - The filters to apply to the query. Each filter
   * should be an object with the column name as the key and the value to filter by
   * as the value.
   * @param {Object} [options={}] - The options to apply to the query. The
   * following options are supported:
   *
   *   - `orderBy`: The column(s) to order the results by.
   *   - `limit`: The maximum number of records to return.
   *   - `offset`: The number of records to skip before returning results.
   *
   * @returns {Promise<any[]>} The list of articles retrieved from the database.
   *
   * @example
   * const articles = await articleModel.getArticles({
   *   status: "published",
   * }, {
   *   orderBy: "published_at DESC",
   *   limit: 10,
   * });
   * console.log(articles);
   * [
   *   {
   *     id: 1,
   *     title: "Example Article",
   *     abstract: "This is an example article.",
   *     content: "<p>This is the article content.</p>",
   *     thumbnail: null,
   *     author_id: 1,
   *     category_id: null,
   *     status: "published",
   *     published_at: "2021-01-01T00:00:00.000Z",
   *     views: 0,
   *     is_premium: false,
   *     search_vector: null,
   *     created_at: "2021-01-01T00:00:00.000Z",
   *     updated_at: "2021-01-01T00:00:00.000Z",
   *     author_name: "John Doe",
   *     category_name: null,
   *   },
   * ]
   */
  async getArticles(filters = {}, options = {}) {
    // Build the WHERE clause from the provided filters
    const { whereClause, values } = buildWhereClause(filters);
    // Build the SELECT query with the provided options
    const query = `
      SELECT a.*, u.full_name AS author_name, c.name AS category_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      ${whereClause ? `WHERE ${whereClause}` : ""}
      ORDER BY ${options.orderBy || "a.published_at DESC"}
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;
    // Add the limit and offset to the values array
    values.push(options.limit || 10, options.offset || 0);
    // Execute the query and return the results
    const { rows } = await db.query(query, values);
    return rows;
  }

  /**
   * Creates a new article in the database.
   *
   * @param {Object} data - The data to create the article with. The following
   * properties are required:
   *
   *   - `title`: The title of the article.
   *   - `abstract`: The abstract of the article.
   *   - `content`: The content of the article.
   *   - `thumbnail`: The thumbnail of the article, or null if no thumbnail is
   *     provided.
   *   - `author_id`: The ID of the author who is creating the article.
   *   - `category_id`: The ID of the category that the article belongs to, or
   *     null if no category is specified.
   *
   * @returns {Promise<Object>} The created article with its ID.
   *
   * @example
   * const article = await articleModel.createArticle({
   *   title: "Example Article",
   *   abstract: "This is an example article.",
   *   content: "<p>This is the article content.</p>",
   *   thumbnail: null,
   *   author_id: 1,
   *   category_id: null,
   * });
   * console.log(article);
   * {
   *   id: 1,
   *   title: "Example Article",
   *   abstract: "This is an example article.",
   *   content: "<p>This is the article content.</p>",
   *   thumbnail: null,
   *   author_id: 1,
   *   category_id: null,
   *   status: "draft",
   *   published_at: null,
   *   views: 0,
   *   is_premium: false,
   *   search_vector: null,
   *   created_at: "2021-01-01T00:00:00.000Z",
   *   updated_at: "2021-01-01T00:00:00.000Z",
   * }
   */
  async createArticle(data) {
    return await this.create(data);
  }

  /**
   * Updates an existing article.
   * @param {number} id - The ID of the article to update.
   * @param {Object} data - The data to update the article with.
   *
   * @returns {Promise<Object>} The updated article record created in the database.
   *
   * @example
   * const article = await articleModel.updateArticle(1, {
   *   title: "Updated Article Title",
   * });
   * console.log(article);
   * {
   *   id: 1,
   *   title: "Updated Article Title",
   *   abstract: "This is an example article.",
   *   content: "<p>This is the article content.</p>",
   *   thumbnail: null,
   *   author_id: 1,
   *   category_id: null,
   *   status: "draft",
   *   published_at: null,
   *   views: 0,
   *   is_premium: false,
   *   search_vector: null,
   *   created_at: "2021-01-01T00:00:00.000Z",
   *   updated_at: "2021-01-01T00:00:00.000Z",
   * }
   */
  async updateArticle(id, data) {
    return await this.update(id, data);
  }

  /**
   * Deletes an article from the database.
   *
   * @param {number} id - The ID of the article to delete.
   *
   * @returns {Promise<void>} A promise that resolves if the article is deleted
   * successfully.
   *
   * @example
   * await articleModel.deleteArticle(1);
   */
  async deleteArticle(id) {
    // Delete the article from the database
    return await this.delete(id);
  }

  /**
   * Searches for articles based on a keyword.
   *
   * This method performs a full-text search on the `search_vector` column of the
   * `articles` table. The search is performed using the `to_tsquery` function
   * with a rank of 1 for the keyword.
   *
   * The method returns a list of articles that match the search query, sorted by
   * the rank of the search result in descending order (i.e., the most relevant
   * results are returned first). The list of articles is limited to the number
   * of records specified by the `limit` option, and the results are offset by
   * the number of records specified by the `offset` option.
   *
   * @param {string} keyword - The keyword to search for.
   * @param {Object} [options] - The options to apply to the search query.
   * @param {number} [options.limit=10] - The number of records to return.
   * @param {number} [options.offset=0] - The number of records to skip before
   *   returning results.
   *
   * @returns {Promise<Object[]>} The list of articles that match the search
   * query, sorted by the rank of the search result in descending order.
   *
   * @example
   * const articles = await articleModel.searchArticles("example");
   * console.log(articles);
   * [
   *   { id: 1, title: "Example Article", abstract: "This is an example article." },
   *   { id: 2, title: "Example Article 2", abstract: "This is another example article." },
   * ]
   */
  async searchArticles(keyword, options = {}) {
    const query = `
      SELECT a.*, ts_rank_cd(a.search_vector, query) AS rank
      FROM articles a, to_tsquery('english', $1) query
      WHERE a.search_vector @@ query
      ORDER BY rank DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [keyword, options.limit || 10, options.offset || 0];
    const { rows } = await db.query(query, values);
    return rows;
  }

  /**
   * Retrieves a list of articles that belong to a specific category.
   *
   * @param {number} categoryId - The ID of the category to retrieve articles for.
   * @param {Object} [options] - The options to apply to the query.
   * @param {number} [options.limit=10] - The number of records to return.
   * @param {number} [options.offset=0] - The number of records to skip before
   *   returning results.
   *
   * @returns {Promise<Object[]>} The list of articles that belong to the
   * specified category, sorted by the published date in descending order.
   *
   * @example
   * const articles = await articleModel.getArticlesByCategory(1);
   * console.log(articles);
   * [
   *   { id: 1, title: "Example Article", abstract: "This is an example article." },
   *   { id: 2, title: "Example Article 2", abstract: "This is another example article." },
   * ]
   */
  async getArticlesByCategory(categoryId, options = {}) {
    return await this.getArticles({ category_id: categoryId }, options);
  }

  /**
   * Retrieves a list of articles that belong to a specific author.
   *
   * @param {number} authorId - The ID of the author to retrieve articles for.
   * @param {Object} [options] - The options to apply to the query.
   * @param {number} [options.limit=10] - The number of records to return.
   * @param {number} [options.offset=0] - The number of records to skip before
   *   returning results.
   *
   * @returns {Promise<Object[]>} The list of articles that belong to the
   * specified author, sorted by the published date in descending order.
   *
   * @example
   * const articles = await articleModel.getArticlesByAuthor(1);
   * console.log(articles);
   * [
   *   { id: 1, title: "Example Article", abstract: "This is an example article." },
   *   { id: 2, title: "Example Article 2", abstract: "This is another example article." },
   * ]
   */
  async getArticlesByAuthor(authorId, options = {}) {
    return await this.getArticles({ author_id: authorId }, options);
  }

  /**
   * Increases the view count of an article by 1.
   *
   * This method updates the `views` column of the `articles` table for the
   * specified article ID, incrementing it by 1. It returns the updated view
   * count of the article.
   *
   * @param {number} id - The ID of the article to increase the view count for.
   * @returns {Promise<number>} The updated view count of the article.
   * @example
   * const updatedViews = await articleModel.increaseViewCount(1);
   * console.log(updatedViews); // Output: the new view count
   */
  async increaseViewCount(id) {
    // Define the SQL query to update the view count
    const query = `
      UPDATE articles
      SET views = views + 1
      WHERE id = $1
      RETURNING views
    `;
    // Execute the query with the provided article ID
    const { rows } = await db.query(query, [id]);
    // Return the updated view count
    return rows[0];
  }

  /**
   * Retrieves a list of related articles for the specified article category ID.
   *
   * This method retrieves a list of published articles that belong to the
   * specified article category ID, excluding the specified article ID. The
   * results are ordered randomly and limited to the specified limit.
   *
   * @param {number} categoryId - The ID of the article category to retrieve
   *                              related articles for.
   * @param {number} excludeArticleId - The ID of the article to exclude from the
   *                                   results.
   * @param {number} [limit=5] - The maximum number of related articles to
   *                            retrieve.
   * @returns {Promise<Object[]>} A list of related articles, each containing the
   *                              `id`, `title`, and `thumbnail` properties.
   * @example
   * const relatedArticles = await articleModel.getRelatedArticles(
   *   1,  // Category ID
   *   2,  // Exclude article ID
   *   3   // Limit
   * );
   * console.log(relatedArticles);
   * [
   *   { id: 4, title: "Example Article 4", thumbnail: "example.jpg" },
   *   { id: 5, title: "Example Article 5", thumbnail: "example-2.jpg" },
   *   { id: 6, title: "Example Article 6", thumbnail: "example-3.jpg" },
   * ]
   */
  async getRelatedArticles(categoryId, excludeArticleId, limit = 5) {
    const query = `
      SELECT id, title, thumbnail
      FROM articles
      WHERE category_id = $1 AND id != $2 AND status = 'published'
      ORDER BY RANDOM()
      LIMIT $3
    `;
    const { rows } = await db.query(query, [
      categoryId,
      excludeArticleId,
      limit,
    ]);
    return rows;
  }

  /**
   * Deletes articles associated with a given user ID from the database.
   *
   * @param {string|number} user_id - The ID of the user whose articles will be deleted.
   *
   * @returns {Promise<void>} The promise that resolves when the articles are deleted.
   * @throws {Error} If any error occurs while deleting the articles.
   */
  async deleteArticleByUserID(user_id) {
    const text = "DELETE FROM articles WHERE author_id = $1 RETURNING *;";
    const values = [user_id];

    await db.query(text, values);
  }
}

const articleModel = new ArticleModel();
export default articleModel;
