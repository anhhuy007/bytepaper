// models/articleTagModel.js

import BaseModel from "./Base.model.js";
import db from "../utils/Database.js";
// CREATE TABLE article_tags (
//   article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
//   tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
//   PRIMARY KEY (article_id, tag_id)
// );

class ArticleTagModel extends BaseModel {
  constructor() {
    super("article_tags");
  }
  /**
   * Adds tags to an article.
   *
   * This method will insert a new row for each of the specified tag IDs into
   * the article_tags table. If a tag is already associated with the article, the
   * method will not insert a new row and will instead return an empty array.
   *
   * @param {number} articleId - The ID of the article to add tags to.
   * @param {number[]} tagIds - The IDs of the tags to add to the article.
   * @returns {Promise<Object[]>} The inserted tags, or an empty array if the
   *                              tags were already associated with the article.
   *
   * @example
   * const tags = await articleTagModel.addTagsToArticle(1, [2, 3]);
   * console.log(tags);
   * [
   *   { article_id: 1, tag_id: 2 },
   *   { article_id: 1, tag_id: 3 },
   * ]
   */
  async addTagsToArticle(articleId, tagIds) {
    // Create the insert values as a string, with each tag ID as a separate
    // parameter
    const insertValues = tagIds
      .map((tagId, idx) => `($1, $${idx + 2})`)
      .join(", ");

    // Build the INSERT query with the ON CONFLICT DO NOTHING clause to
    // prevent duplicate tags from being inserted
    const query = `
      INSERT INTO article_tags (article_id, tag_id)
      VALUES ${insertValues}
      ON CONFLICT DO NOTHING
      RETURNING *
    `;

    // Execute the query with the article ID and tag IDs as parameters
    const values = [articleId, ...tagIds];
    const { rows } = await db.query(query, values);

    // Return the inserted tags, or an empty array if no tags were inserted
    return rows;
  }

  /**
   * Removes tags from an article.
   *
   * This method deletes the specified tags from the `article_tags` table
   * for the given article ID. If the tags do not exist for the article,
   * the method completes without error.
   *
   * @param {number} articleId - The ID of the article to remove tags from.
   * @param {number[]} tagIds - The IDs of the tags to remove from the article.
   * @returns {Promise<void>} A promise that resolves when the tags have been
   *                          removed.
   * @example
   * await articleTagModel.removeTagsFromArticle(1, [2, 3]);
   */
  async removeTagsFromArticle(articleId, tagIds) {
    // Create a string of placeholders for the tag IDs
    const deleteValues = tagIds.map((tagId, idx) => `$${idx + 2}`).join(", ");

    // Build the DELETE query to remove the specified tags from the article
    const query = `
      DELETE FROM article_tags
      WHERE article_id = $1 AND tag_id IN (${deleteValues})
    `;

    // Execute the query with the article ID and tag IDs as parameters
    const values = [articleId, ...tagIds];
    await db.query(query, values);
  }

  /**
   * Retrieves a list of articles that are associated with the specified tag ID.
   *
   * This method retrieves a list of articles that are associated with the
   * specified tag ID, ordered by the article's published date in descending
   * order. The results can be limited and offset by providing the `limit` and
   * `offset` properties in the `options` object.
   *
   * @param {number} tagId - The ID of the tag to retrieve articles for.
   * @param {Object} [options={}] - The options to apply to the query.
   * @param {number} [options.limit=10] - The maximum number of records to return.
   * @param {number} [options.offset=0] - The number of records to skip before returning results.
   *
   * @returns {Promise<Object[]>} A list of articles that are associated with the
   * specified tag ID, each containing the `id`, `title`, `abstract`, `content`,
   * `thumbnail`, `author_id`, `category_id`, `status`, `published_at`, `views`,
   * and `is_premium` properties.
   * @example
   * const articles = await articleTagModel.getArticlesByTagId(1);
   * console.log(articles);
   * [
   *   { id: 1, title: "Example Article", abstract: "This is an example article." },
   *   { id: 2, title: "Example Article 2", abstract: "This is another example article." },
   * ]
   */
  async getArticlesByTagId(tagId, options = {}) {
    const query = `
      SELECT a.*
      FROM articles a
      INNER JOIN article_tags at ON a.id = at.article_id
      WHERE at.tag_id = $1
      ORDER BY a.published_at DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [tagId, options.limit || 10, options.offset || 0];
    const { rows } = await db.query(query, values);
    return rows;
  }

  /**
   * Retrieves a list of tags associated with the specified article ID.
   *
   * This method retrieves a list of tags associated with the specified article
   * ID, ordered by the tag's name in ascending order. The results can be limited
   * and offset by providing the `limit` and `offset` properties in the `options`
   * object.
   *
   * @param {number} articleId - The ID of the article to retrieve tags for.
   * @param {Object} [options={}] - The options to apply to the query.
   * @param {number} [options.limit=10] - The maximum number of records to return.
   * @param {number} [options.offset=0] - The number of records to skip before returning results.
   *
   * @returns {Promise<Object[]>} A list of tags associated with the specified
   * article ID, each containing the `id`, `name`, and `description` properties.
   * @example
   * const tags = await articleTagModel.getTagsByArticleId(1);
   * console.log(tags);
   * [
   *   { id: 1, name: "example-tag", description: "This is an example tag." },
   *   { id: 2, name: "example-tag-2", description: "This is another example tag." },
   * ]
   */
  async getTagsByArticleId(articleId, options = {}) {
    // Construct the SQL query to retrieve tags associated with the given article ID
    const query = `
      SELECT t.*
      FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = $1
      ORDER BY t.name ASC
      LIMIT $2 OFFSET $3
    `;

    // Define query parameter values, using defaults for limit and offset if not provided
    const values = [articleId, options.limit || 10, options.offset || 0];

    // Execute the query with the provided values and retrieve the rows
    const { rows } = await db.query(query, values);

    // Return the list of retrieved tags
    return rows;
  }
  // Add another methods related to article_tags...
}

const articleTagModel = new ArticleTagModel();
export default articleTagModel;
