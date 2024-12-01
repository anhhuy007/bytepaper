// services/tagService.js

import tagModel from "../models/tag.model.js";
import articleTagModel from "../models/articleTag.model.js";

class TagService {
  /**
   * Retrieves all tags from the database.
   *
   * This method will return a list of all tags available in the database.
   *
   * @returns {Promise<Object[]>} The list of all tags retrieved from the database.
   *
   * @example
   * const tags = await tagService.getAllTags();
   * console.log(tags);
   * // [{ id: 1, name: "JavaScript", ... }, { id: 2, name: "Node.js", ... }, ...]
   */
  async getAllTags() {
    return await tagModel.getAllTags();
  }

  /**
   * Retrieves a tag from the database by its ID.
   *
   * This method will return a tag with the specified `id` if it exists in the
   * database, otherwise it will throw an error.
   *
   * @param {number} id - The ID of the tag to retrieve.
   *
   * @returns {Promise<Object>} The tag with the specified `id` or throw an error
   * if it does not exist.
   *
   * @example
   * const tag = await tagService.getTagById(1);
   * console.log(tag);
   * // { id: 1, name: "JavaScript", ... }
   */
  async getTagById(id) {
    const tag = await tagModel.getTagById(id);
    if (!tag) {
      throw new Error("Tag not found");
    }
    return tag;
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
   * const tag = await tagService.createTag({ name: "React" });
   * console.log(tag);
   * // { id: 1, name: "React", created_at: "2022-01-01 12:00:00", ... }
   */
  async createTag(data) {
    return await tagModel.createTag(data);
  }

  /**
   * Updates an existing tag in the database.
   *
   * This method will update the tag with the specified `id` using the
   * provided `data`.
   *
   * @param {number} id - The ID of the tag to update.
   * @param {Object} data - The data to update the tag with, must contain the
   * `name` property.
   *
   * @returns {Promise<Object>} The updated tag.
   *
   * @example
   * const updatedTag = await tagService.updateTag(1, { name: "Updated Tag Name" });
   * console.log(updatedTag);
   * // { id: 1, name: "Updated Tag Name", created_at: "2022-01-01 12:00:00", ... }
   */
  async updateTag(id, data) {
    // Retrieve the tag from the database
    const tag = await tagModel.findById(id);
    // Check if the tag exists in the database
    if (!tag) {
      throw new Error("Tag not found");
    }

    // Update the tag in the database
    return await tagModel.updateTag(id, data);
  }

  /**
   * Deletes a tag from the database.
   *
   * This method will delete the tag with the specified `id` from the
   * database and return the deleted tag.
   *
   * @param {number} id - The ID of the tag to delete.
   *
   * @returns {Promise<Object>} The deleted tag.
   *
   * @example
   * const tag = await tagService.deleteTag(1);
   * console.log(tag);
   * // { id: 1, name: "JavaScript", ... }
   */
  async deleteTag(id) {
    const tag = await tagModel.findById(id);
    if (!tag) {
      throw new Error("Tag not found");
    }
    return await tagModel.deleteTag(id);
  }

  /**
   * Retrieves a list of articles associated with the specified tag ID.
   *
   * This method uses the `ArticleTagModel.getArticlesByTagId` method to
   * retrieve the list of articles associated with the specified tag ID.
   *
   * @param {number} tagId - The ID of the tag to retrieve articles for.
   * @param {Object} [options={}] - The options to apply to the query.
   * @param {number} [options.limit=10] - The maximum number of records to return.
   * @param {number} [options.offset=0] - The number of records to skip before returning results.
   *
   * @returns {Promise<Object[]>} A list of articles associated with the specified
   * tag ID, each containing the `id`, `title`, `abstract`, `content`, `thumbnail`,
   * `author_id`, `category_id`, `status`, `published_at`, `views`, and `is_premium`
   * properties.
   *
   * @example
   * const articles = await tagService.getArticlesByTagId(1);
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
   *     status: "draft",
   *     published_at: null,
   *     views: 0,
   *     is_premium: false,
   *   },
   * ]
   */
  async getArticlesByTagId(tagId, options = {}) {
    return await articleTagModel.getArticlesByTagId(tagId, options);
  }
}

export default new TagService();
