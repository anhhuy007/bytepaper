// models/tagModel.js
import BaseModel from "./Base.model.js";
import db from "../utils/Database.js";
// CREATE TABLE tags (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(50) UNIQUE NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

class TagModel extends BaseModel {
  constructor() {
    super("tags");
  }

  /**
   * Retrieves a tag from the database by its ID.
   *
   * This method will return a tag with the specified `id` if it exists in the
   * database, otherwise it will return `null`.
   *
   * @param {number} id The ID of the tag to retrieve.
   * @returns {Promise<Object | null>} The tag with the specified `id` or `null`
   * if it does not exist.
   *
   * @example
   * const tag = await tagModel.getTagById(1);
   * console.log(tag);
   * // { id: 1, name: "JavaScript", created_at: "2022-01-01 12:00:00", ... }
   */
  async getTagById(id) {
    return await this.findById(id);
  }

  /**
   * Retrieves all tags from the database.
   *
   * This method will return a list of all tags available in the database.
   *
   * @returns {Promise<Object[]>} The list of all tags retrieved from the database.
   *
   * @example
   * const tags = await tagModel.getAllTags();
   * console.log(tags);
   * // [{ id: 1, name: "JavaScript", ... }, { id: 2, name: "Node.js", ... }, ...]
   */
  async getAllTags() {
    // Retrieve all tags using the find method
    return await this.find();
  }

  /**
   * Creates a new tag in the database.
   *
   * This method will insert a new tag with the specified `data` into the
   * database and return the newly created tag.
   *
   * @param {Object} data - The data to create the tag with, must contain the
   * `name` property.
   *
   * @returns {Promise<Object>} The newly created tag.
   *
   * @example
   * const tag = await tagModel.createTag({ name: "React" });
   * console.log(tag);
   * // { id: 1, name: "React", created_at: "2022-01-01 12:00:00", ... }
   */
  async createTag(data) {
    // Create the tag using the create method
    return await this.create(data);
  }

  /**
   * Updates an existing tag in the database.
   *
   * This method will update the tag with the specified `id` using the provided `data`.
   *
   * @param {number} id - The ID of the tag to update.
   * @param {Object} data - The data to update the tag with.
   * @returns {Promise<Object>} The updated tag.
   *
   * @example
   * const updatedTag = await tagModel.updateTag(1, { name: "Updated Tag Name" });
   * console.log(updatedTag);
   * // { id: 1, name: "Updated Tag Name", ... }
   */
  async updateTag(id, data) {
    // Update the tag using the update method
    return await this.update(id, data);
  }

  /**
   * Deletes a tag from the database by its ID.
   *
   * This method will delete the tag with the specified `id` from the database.
   *
   * @param {number} id - The ID of the tag to delete.
   *
   * @returns {Promise<void>} A promise that resolves if the tag is deleted
   *                          successfully.
   *
   * @example
   * await tagModel.deleteTag(1);
   */
  async deleteTag(id) {
    return await this.delete(id);
  }

  /**
   * Retrieves a list of tags associated with the specified article ID.
   *
   * This method retrieves a list of tags associated with the specified article
   * ID. The results are ordered by the tag's name in ascending order.
   *
   * @param {number} articleId - The ID of the article to retrieve tags for.
   *
   * @returns {Promise<Object[]>} A list of tags associated with the specified
   * article ID, each containing the `id`, `name`, and `description` properties.
   * @example
   * const tags = await tagModel.getTagsByArticleId(1);
   * console.log(tags);
   * [
   *   { id: 1, name: "example-tag", description: "This is an example tag." },
   *   { id: 2, name: "example-tag-2", description: "This is another example tag." },
   * ]
   */
  async getTagsByArticleId(articleId) {
    // Construct the SQL query to retrieve tags associated with the given article ID
    const query = `
      SELECT t.*
      FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = $1
      ORDER BY t.name ASC
    `;

    // Execute the query with the article ID as a parameter
    const { rows } = await db.query(query, [articleId]);

    // Return the list of retrieved tags
    return rows;
  }
}

const tagModel = new TagModel();
export default tagModel;
