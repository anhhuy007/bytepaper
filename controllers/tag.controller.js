// controllers/tagController.js

import tagService from '../services/tag.service.js'

const getAllTags = async (req, res, next) => {
  try {
    const filters = {
      name: req.query.name || null,
    }

    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1)
    const page = parseInt(req.query.page, 10) || 1
    const offset = (page - 1) * limit

    const options = {
      limit,
      offset,
      orderBy: req.query.orderBy || 'name ASC',
    }

    const { tags, totalTags } = await tagService.getAllTags(filters, options)
    const totalPages = Math.ceil(totalTags / limit)

    res.render('admin/tags', {
      title: 'Tags Management',
      layout: 'admin',
      tags,
      totalPages,
      currentPage: page,
      query: { ...req.query, limit, page },
    })
  } catch (error) {
    next(error)
  }
}

const getAddTag = async (req, res, next) => {}

const getTagById = async (req, res, next) => {
  try {
    // Retrieve the tag by its ID from the request parameters
    const tag = await tagService.getTagById(req.params.id)

    // Send a success response with the retrieved tag data
    res.status(200).json({ success: true, data: tag })
  } catch (error) {
    // Pass any errors to the next middleware
    next(error)
  }
}

const createTag = async (req, res, next) => {
  try {
    const data = req.body
    await tagService.createTag(data)
    res.redirect('/admin/tags')
  } catch (error) {
    next(error)
  }
}

const updateTag = async (req, res, next) => {
  try {
    const data = req.body
    const { tagId: id } = req.params
    const tag = await tagService.updateTag(id, data)
    // res.status(200).json({ success: true, data: tag })
    res.redirect('/admin/tags')
  } catch (error) {
    next(error)
  }
}

const deleteTag = async (req, res, next) => {
  try {
    const { tagId: id } = req.params
    await tagService.deleteTag(id)
    // res.status(200).json({ success: true, message: 'Tag deleted successfully' })
    res.redirect('/admin/tags')
  } catch (error) {
    next(error)
  }
}

export default {
  getAllTags,
  getTagById,
  getAddTag,
  createTag,
  updateTag,
  deleteTag,
}
