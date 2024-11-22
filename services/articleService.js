// services/articleService.js

import articleModel from "../models/articleModel.js";
import articleTagModel from "../models/articleTagModel.js";
import tagModel from "../models/tagModel.js";
import categoryModel from "../models/categoryModel.js";

class ArticleService {
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
   * @returns {Promise<Object[]>} The list of articles retrieved from the database.
   *
   * @example
   * const articles = await articleService.getAllArticles({
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
  async getAllArticles(filters = {}, options = {}) {
    return await articleModel.getArticles(filters, options);
  }

  /**
   * Retrieves an article by its ID.
   *
   * This method will throw an error if the article is not found.
   *
   * @param {number} id - The ID of the article to retrieve.
   * @returns {Promise<Object>} The article retrieved from the database.
   *
   * @example
   * const article = await articleService.getArticleById(1);
   * console.log(article);
   * {
   *   id: 1,
   *   title: "Example Article",
   *   abstract: "This is an example article.",
   *   content: "<p>This is the article content.</p>",
   *   thumbnail: null,
   *   author_id: 1,
   *   category_id: null,
   *   status: "published",
   *   published_at: "2021-01-01T00:00:00.000Z",
   *   views: 0,
   *   is_premium: false,
   *   search_vector: null,
   *   created_at: "2021-01-01T00:00:00.000Z",
   *   updated_at: "2021-01-01T00:00:00.000Z",
   *   author_name: "John Doe",
   *   category_name: null,
   *   tags: [
   *     {
   *       id: 1,
   *       name: "JavaScript",
   *       created_at: "2021-01-01T00:00:00.000Z",
   *       updated_at: "2021-01-01T00:00:00.000Z",
   *     },
   *     {
   *       id: 2,
   *       name: "Node.js",
   *       created_at: "2021-01-01T00:00:00.000Z",
   *       updated_at: "2021-01-01T00:00:00.000Z",
   *     },
   *   ],
   * }
   */
  async getArticleById(id) {
    const article = await articleModel.getArticleById(id);
    if (!article) {
      throw new Error("Article not found");
    }
    const tags = await articleTagModel.getTagsByArticleId(id);
    article.tags = tags;
    return article;
  }

  /**
   * Creates a new article.
   *
   * This method will throw an error if the article is not created successfully.
   *
   * @param {Object} articleData - The data for the article to be created.
   * @param {number} authorId - The ID of the author who is creating the article.
   *
   * @returns {Promise<Object>} The newly created article.
   *
   * @example
   * const article = await articleService.createArticle({
   *   title: "Example Article",
   *   content: "<p>This is the article content.</p>",
   *   category_id: 1,
   *   tag_ids: [1, 2],
   * }, 1);
   * console.log(article);
   * {
   *   id: 1,
   *   title: "Example Article",
   *   abstract: null,
   *   content: "<p>This is the article content.</p>",
   *   thumbnail: null,
   *   author_id: 1,
   *   category_id: 1,
   *   status: "draft",
   *   published_at: null,
   *   views: 0,
   *   is_premium: false,
   *   search_vector: null,
   *   created_at: "2021-01-01T00:00:00.000Z",
   *   updated_at: "2021-01-01T00:00:00.000Z",
   * }
   */
  async createArticle(articleData, authorId) {
    const { title, content, category_id, tag_ids = [] } = articleData;

    const newArticle = {
      title,
      content,
      category_id,
      author_id: authorId,
      status: "draft",
    };

    const createdArticle = await articleModel.createArticle(newArticle);

    if (tag_ids.length > 0) {
      await articleTagModel.addTagsToArticle(createdArticle.id, tag_ids);
    }

    return createdArticle;
  }

  /**
   * Updates an existing article.
   *
   * This method will throw an error if the article is not found or if the
   * author ID does not match the article's author ID.
   *
   * @param {number} id - The ID of the article to update.
   * @param {Object} articleData - The data to update the article with.
   * @param {number} authorId - The ID of the author who is updating the article.
   *
   * @returns {Promise<Object>} The updated article.
   */
  async updateArticle(id, articleData, authorId) {
    const article = await articleModel.findById(id);
    if (!article) {
      throw new Error("Article not found");
    }

    if (article.author_id !== authorId) {
      throw new Error("Unauthorized");
    }

    // Extract the tag IDs from the article data and update the article
    const { tag_ids, ...updateData } = articleData;
    const updatedArticle = await articleModel.updateArticle(id, updateData);

    // If there are tag IDs, remove them from the article and re-add them
    if (tag_ids) {
      await articleTagModel.removeTagsFromArticle(id, tag_ids);
      await articleTagModel.addTagsToArticle(id, tag_ids);
    }

    return updatedArticle;
  }

  /**
   * Deletes an article.
   *
   * This method will throw an error if the article is not found or if the
   * author ID does not match the article's author ID.
   *
   * @param {number} id - The ID of the article to delete.
   * @param {number} authorId - The ID of the author who is deleting the article.
   *
   * @returns {Promise<void>} A promise that resolves when the article is deleted
   * successfully.
   */
  async deleteArticle(id, authorId) {
    // Retrieve the article from the database
    const article = await articleModel.findById(id);
    if (!article) {
      throw new Error("Article not found");
    }

    // Check if the author ID matches the article's author ID
    if (article.author_id !== authorId) {
      throw new Error("Unauthorized");
    }

    // Delete the article from the database
    return await articleModel.deleteArticle(id);
  }

  /**
   * Submits an article for approval.
   *
   * This method will throw an error if the article is not found or if the
   * author ID does not match the article's author ID. It will also throw an
   * error if the article is not in draft status.
   *
   * @param {number} id - The ID of the article to submit for approval.
   * @param {number} authorId - The ID of the author who is submitting the article.
   *
   * @returns {Promise<Object>} The updated article with the new status.
   */
  async submitArticleForApproval(id, authorId) {
    // Retrieve the article from the database
    const article = await articleModel.findById(id);
    if (!article) {
      throw new Error("Article not found");
    }

    // Check if the author ID matches the article's author ID
    if (article.author_id !== authorId) {
      throw new Error("Unauthorized");
    }

    // Check if the article is in draft status
    if (article.status !== "draft") {
      throw new Error("Article is not in draft status");
    }

    // Update the article status to "pending"
    return await articleModel.updateArticle(id, { status: "pending" });
  }

  /**
   * Approves an article for publication.
   *
   * This method will throw an error if the article is not found or if the
   * article is not in pending status.
   *
   * @param {number} id - The ID of the article to approve.
   * @param {number} editorId - The ID of the editor who is approving the article.
   *
   * @returns {Promise<Object>} The updated article with the new status.
   */
  async approveArticle(id, editorId) {
    // Retrieve the article from the database
    const article = await articleModel.findById(id);
    if (!article) {
      throw new Error("Article not found");
    }

    // Check if the article is in pending status
    if (article.status !== "pending") {
      throw new Error("Article is not pending approval");
    }

    // Allow the editor to approve the article only if they have the rights to do so
    // TODO: Implement the logic to check if the editor has the rights to approve the article

    // Update the article status to "published" and set the published_at field to the current date
    return await articleModel.updateArticle(id, {
      status: "published",
      published_at: new Date(),
      editor_id: editorId,
    });
  }

  /**
   * Rejects an article for publication.
   *
   * This method will throw an error if the article is not found or if the
   * article is not in pending status.
   *
   * @param {number} id - The ID of the article to reject.
   * @param {number} editorId - The ID of the editor who is rejecting the article.
   * @param {string} rejectionReason - The reason for rejecting the article.
   *
   * @returns {Promise<Object>} The updated article with the new status.
   */
  async rejectArticle(id, editorId, rejectionReason) {
    // Retrieve the article from the database
    const article = await articleModel.findById(id);
    if (!article) {
      throw new Error("Article not found");
    }

    // Check if the article is in pending status
    if (article.status !== "pending") {
      throw new Error("Article is not pending approval");
    }

    // Additional logic to check if editor has rights to reject this article

    // Update the article status to "rejected" and set the rejection_reason field to the provided reason
    return await articleModel.updateArticle(id, {
      status: "rejected",
      rejection_reason: rejectionReason,
      editor_id: editorId,
    });
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
   * const articles = await articleService.searchArticles("example");
   * console.log(articles);
   * [
   *   { id: 1, title: "Example Article", abstract: "This is an example article." },
   *   { id: 2, title: "Example Article 2", abstract: "This is another example article." },
   * ]
   */
  async searchArticles(keyword, options = {}) {
    // Chuẩn hóa từ khóa để sử dụng trong to_tsquery
    const formattedKeyword = keyword
      .trim() // Loại bỏ khoảng trắng ở đầu/cuối
      .replace(/\s+/g, " & "); // Thay khoảng trắng bằng & để dùng trong to_tsquery
    return await articleModel.searchArticles(formattedKeyword, options);
  }

  /**
   * Retrieves a list of articles that belong to a specific category.
   *
   * @param {number} categoryId - The ID of the category to retrieve articles for.
   * @param {Object} [options] - The options to apply to the query.
   * @param {number} [options.limit=10] - The number of records to return.
   * @param {number} [options.offset=0] - The number of records to skip before returning results.
   *
   * @returns {Promise<Object[]>} The list of articles that belong to the specified category, sorted by the published date in descending order.
   *
   * @example
   * const articles = await articleService.getArticlesByCategory(1);
   * console.log(articles);
   * [
   *   { id: 1, title: "Example Article", abstract: "This is an example article." },
   *   { id: 2, title: "Example Article 2", abstract: "This is another example article." },
   * ]
   */
  async getArticlesByCategory(categoryId, options = {}) {
    // Delegate the request to the article model to get articles by the specified category ID
    return await articleModel.getArticlesByCategory(categoryId, options);
  }

  /**
   * Retrieves a list of related articles for the specified article ID.
   *
   * This method retrieves a list of published articles that belong to the same
   * category as the specified article ID, excluding the specified article ID.
   * The results are ordered randomly and limited to the specified limit.
   *
   * @param {number} articleId - The ID of the article to retrieve related articles for.
   * @returns {Promise<Object[]>} A list of related articles, each containing the
   *                              `id`, `title`, and `thumbnail` properties.
   * @example
   * const relatedArticles = await articleService.getRelatedArticles(1);
   * console.log(relatedArticles);
   * [
   *   { id: 4, title: "Example Article 4", thumbnail: "example.jpg" },
   *   { id: 5, title: "Example Article 5", thumbnail: "example-2.jpg" },
   *   { id: 6, title: "Example Article 6", thumbnail: "example-3.jpg" },
   * ]
   */
  async getRelatedArticles(articleId) {
    // Retrieve the specified article
    const article = await articleModel.findById(articleId);

    // If the article does not exist, throw an error
    if (!article) {
      throw new Error("Article not found");
    }

    // Retrieve related articles using the article model
    return await articleModel.getRelatedArticles(
      article.category_id,
      articleId
    );
  }

  /**
   * Increases the view count of a specified article by 1.
   *
   * This method delegates the request to the article model to increment the
   * view count of the article with the given ID.
   *
   * @param {number} id - The ID of the article to increase the view count for.
   * @returns {Promise<number>} The updated view count of the article.
   * @throws {Error} If the article ID is invalid or the update fails.
   * @example
   * const updatedViewCount = await articleService.increaseArticleViewCount(1);
   * console.log(updatedViewCount); // 10
   */
  async increaseArticleViewCount(id) {
    // Delegate the request to the article model to increase the view count
    return await articleModel.increaseViewCount(id);
  }

  /**
   * Downloads an article by the specified ID.
   *
   * This method retrieves the article content for the specified article ID and
   * returns the content as a Buffer.
   *
   * @param {number} id - The ID of the article to download.
   * @returns {Promise<Buffer>} The content of the article as a Buffer.
   * @throws {Error} If the article ID is invalid or the download fails.
   * @example
   * const articleContent = await articleService.downloadArticle(1);
   * console.log(articleContent);
   * <Buffer 0a 0a 0a 0a 0a 0a 0a 0a 0a 0a 0a 0a>
   */
  async downloadArticle(id) {
    // TODO: Implement the download article functionality
  }
}

export default new ArticleService();
