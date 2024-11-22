// models/editorCategoryModel.js

import BaseModel from "./BaseModel.js";
import db from "../utils/Database.js";
// CREATE TABLE editor_categories (
//   editor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
//   PRIMARY KEY (editor_id, category_id)
// );

class EditorCategoryModel extends BaseModel {
  constructor() {
    super("editor_categories");
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
    `;
    await db.query(deleteQuery, [editorId]);

    // Insert new assignments
    const insertValues = categoryIds
      .map((categoryId, idx) => `($1, $${idx + 2})`)
      .join(", ");

    const query = `
      INSERT INTO editor_categories (editor_id, category_id)
      VALUES ${insertValues}
      RETURNING *
    `;
    const values = [editorId, ...categoryIds];
    const { rows } = await db.query(query, values);
    return rows;
  }

  /**
   * Retrieves the categories assigned to an editor.
   *
   * This method will return a list of categories assigned to the specified
   * editor ID.
   *
   * @param {number} editorId - The ID of the editor to retrieve categories for.
   * @returns {Promise<Object[]>} The list of categories assigned to the editor.
   *
   * @example
   * const categories = await editorCategoryModel.getCategoriesByEditor(1);
   * console.log(categories);
   * [
   *   { id: 1, name: "JavaScript", parent_id: null, created_at: "2022-01-01 12:00:00", ... },
   *   { id: 2, name: "Node.js", parent_id: 1, created_at: "2022-01-01 12:00:00", ... },
   * ]
   */
  async getCategoriesByEditor(editorId) {
    const query = `
      SELECT c.*
      FROM categories c
      INNER JOIN editor_categories ec ON c.id = ec.category_id
      WHERE ec.editor_id = $1
    `;
    const { rows } = await db.query(query, [editorId]);
    return rows;
  }

  /**
   * Retrieves the editors assigned to a category.
   *
   * This method will return a list of editors assigned to the specified
   * category ID.
   *
   * @param {number} categoryId - The ID of the category to retrieve editors for.
   * @returns {Promise<Object[]>} The list of editors assigned to the category.
   *
   * @example
   * const editors = await editorCategoryModel.getEditorsByCategory(1);
   * console.log(editors);
   * [
   *   { id: 1, full_name: "John Doe", email: "johndoe@example.com", role: "editor", ... },
   *   { id: 2, full_name: "Jane Doe", email: "janedoe@example.com", role: "editor", ... },
   * ]
   */
  async getEditorsByCategory(categoryId) {
    const query = `
      SELECT u.*
      FROM users u
      INNER JOIN editor_categories ec ON u.id = ec.editor_id
      WHERE ec.category_id = $1
    `;
    const { rows } = await db.query(query, [categoryId]);
    return rows;
  }

  /**
   * Deletes all category assignments for the specified editor ID.
   *
   * This method will remove all entries from the `editor_categories` table
   * that have the specified `editorId`.
   *
   * @param {number} editorId - The ID of the editor to delete category assignments for.
   * @returns {Promise<void>}
   */
  async deleteByEditorId(editorId) {
    const query = `
      DELETE FROM editor_categories
      WHERE editor_id = $1
    `;
    await db.query(query, [editorId]);
  }

  // Add another methods related to editor_categories...
}

const editorCategoryModel = new EditorCategoryModel();
export default editorCategoryModel;
