// models/editorCategoryModel.js

import BaseModel from './Base.model.js'
import db from '../utils/Database.js'
// CREATE TABLE editor_categories (
//   editor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
//   PRIMARY KEY (editor_id, category_id)
// );

class EditorCategoryModel extends BaseModel {
  constructor() {
    super('editor_categories')
  }
  /**
   * Assigns categories to an editor.
   *
   * This method will delete all existing category assignments for the editor
   * and then insert new assignments for the specified category IDs.
   *
   * @param {number} editorId - The ID of the editor to assign categories to.
   * @param {number[]} categoryIds - The IDs of the categories to assign.
   * @returns {Promise<Object[]>} The inserted assignments.
   *
   * @example
   * const assignments = await editorCategoryModel.assignCategories(1, [1, 2]);
   * console.log(assignments);
   * [
   *   { editor_id: 1, category_id: 1 },
   *   { editor_id: 1, category_id: 2 },
   * ]
   */
  async assignCategories(editorId, categoryIds) {
    // Delete existing assignments
    const deleteQuery = `
      DELETE FROM editor_categories
      WHERE editor_id = $1
    `
    await db.query(deleteQuery, [editorId])

    // Insert new assignments
    const insertValues = categoryIds.map((categoryId, idx) => `($1, $${idx + 2})`).join(', ')

    const query = `
      INSERT INTO editor_categories (editor_id, category_id)
      VALUES ${insertValues}
      RETURNING *
    `
    const values = [editorId, ...categoryIds]
    const { rows } = await db.query(query, values)
    return rows
  }

  async assignCategory(editorId, categoryId) {
    const query = `
      INSERT INTO editor_categories (editor_id, category_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `

    await db.query(query, [editorId, categoryId])
  }

  async unassignCategory(editorId, categoryId) {
    const query = `
      DELETE FROM editor_categories
      WHERE editor_id = $1 AND category_id = $2
    `
    await db.query(query, [editorId, categoryId])
  }

  async getCategoriesByEditor(editorId) {
    const query = `
      SELECT c.*
      FROM categories c
      INNER JOIN editor_categories ec ON c.id = ec.category_id
      WHERE ec.editor_id = $1
    `
    const { rows } = await db.query(query, [editorId])
    return rows
  }

  async getEditorsByCategory(categoryId) {
    const query = `
      SELECT u.*
      FROM users u
      INNER JOIN editor_categories ec ON u.id = ec.editor_id
      WHERE ec.category_id = $1
    `
    const { rows } = await db.query(query, [categoryId])
    return rows
  }

  async deleteByEditorId(editorId) {
    const query = `
      DELETE FROM editor_categories
      WHERE editor_id = $1
    `
    await db.query(query, [editorId])
  }

  async getAssignedCategories() {
    const query = `
    SELECT ec.editor_id, c.*
    FROM editor_categories ec
    INNER JOIN categories c ON c.id = ec.category_id
  `
    const { rows } = await db.query(query)
    return rows
  }

  // Add another methods related to editor_categories...
  async getEditorsWithCategories() {
    const query = `
      SELECT 
        u.id AS editor_id, 
        u.full_name, 
        u.email, 
        json_agg(json_build_object('id', c.id, 'name', c.name)) AS assignedCategories
      FROM users u
      LEFT JOIN editor_categories ec ON u.id = ec.editor_id
      LEFT JOIN categories c ON ec.category_id = c.id
      WHERE u.role = 'editor'
      GROUP BY u.id
      ORDER BY u.full_name ASC
    `
    const { rows } = await db.query(query)
    return rows.map((row) => ({
      id: row.editor_id,
      full_name: row.full_name,
      email: row.email,
      assignedCategories: row.assignedcategories.filter(Boolean), // Filter out null values
    }))
  }
}

const editorCategoryModel = new EditorCategoryModel()
export default editorCategoryModel
