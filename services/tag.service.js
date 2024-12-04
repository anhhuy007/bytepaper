// services/tag.service.js

import tagModel from '../models/tag.model.js'
import articleTagModel from '../models/articleTag.model.js'

class TagService {
  async getAllTags() {
    return await tagModel.getAllTags()
  }

  async getTagById(id) {
    const tag = await tagModel.getTagById(id)
    if (!tag) {
      throw new Error('Tag not found')
    }
    return tag
  }

  async createTag(data) {
    return await tagModel.createTag(data)
  }

  async updateTag(id, data) {
    // Retrieve the tag from the database
    const tag = await tagModel.findById(id)
    // Check if the tag exists in the database
    if (!tag) {
      throw new Error('Tag not found')
    }

    // Update the tag in the database
    return await tagModel.updateTag(id, data)
  }

  async deleteTag(id) {
    const tag = await tagModel.findById(id)
    if (!tag) {
      throw new Error('Tag not found')
    }
    return await tagModel.deleteTag(id)
  }

  async getArticlesByTagId(tagId, options = {}) {
    return await articleTagModel.getArticlesByTagId(tagId, options)
  }
}

export default new TagService()
