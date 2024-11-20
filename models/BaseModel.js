// src/models/BaseModel.js
import db from "../utils/Database.js";
import {
  buildSelectQuery,
  buildInsertQuery,
  buildUpdateQuery,
  buildDeleteQuery,
} from "../utils/queryBuilder.js";

class BaseModel {
  /**
   * Initializes a new instance of the BaseModel class.
   * @param {string} table - The name of the database table associated with this model.
   */
  constructor(table) {
    // Assign the table name to the instance for use in query building
    this.table = table;
  }

  /**
   * Retrieves a list of records from the database based on the provided filters
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
   * @returns {Promise<any[]>} The list of records retrieved from the database.
   *
   * @example
   * const users = await User.find({
   *   name: "John Doe",
   *   age: [18, 65],
   * }, {
   *   orderBy: "name ASC",
   *   limit: 10,
   * });
   */
  async find(filters = {}, options = {}) {
    // Build the WHERE clause from the provided filters
    const { whereClause, values } = buildWhereClause(filters);
    // Build the SELECT query with the provided options
    const query = buildSelectQuery({
      table: this.table,
      where: whereClause,
      orderBy: options.orderBy,
      limit: options.limit,
      offset: options.offset,
    });
    // Execute the query and return the results
    const { rows } = await db.query(query, values);
    return rows;
  }

  /**
   * Retrieves a single record from the database by its ID.
   *
   * @param {number} id - The ID of the record to retrieve.
   *
   * @returns {Promise<Object>} The record retrieved from the database, or null if
   * no matching record was found.
   *
   * @example
   * const user = await User.findById(1);
   * console.log(user);
   * // { id: 1, name: "John Doe", age: 25 }
   */
  async findById(id) {
    // Build the SELECT query to retrieve the record with the specified ID
    const query = buildSelectQuery({
      table: this.table,
      where: "id = $1",
    });
    // Execute the query and return the result
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  /**
   * Creates a new record in the database.
   *
   * @param {Object} data - The data to create the record with.
   *
   * @returns {Promise<Object>} The new record created in the database.
   *
   * @example
   * const user = await User.create({
   *   name: "John Doe",
   *   age: 25,
   * });
   * console.log(user);
   * // { id: 1, name: "John Doe", age: 25 }
   */
  async create(data) {
    // Build the INSERT query to create the record
    const { query, params } = buildInsertQuery({
      table: this.table,
      data,
    });
    // Execute the query and return the result
    const { rows } = await db.query(query, params);
    return rows[0];
  }

  /**
   * Updates an existing record in the database.
   *
   * @param {number} id - The ID of the record to update.
   * @param {Object} data - The data to update the record with.
   *
   * @returns {Promise<Object>} The updated record created in the database.
   *
   * @example
   * const user = await User.update(1, {
   *   name: "Jane Doe",
   *   age: 26,
   * });
   * console.log(user);
   * // { id: 1, name: "Jane Doe", age: 26 }
   */
  async update(id, data) {
    // Build the UPDATE query to update the record
    const { query, params } = buildUpdateQuery({
      table: this.table,
      data,
      // The WHERE clause is constructed by using the ID of the record
      // and the number of columns in the data object
      where: `id = $${Object.keys(data).length + 1}`,
    });
    // Add the ID of the record to the parameters array
    params.push(id);
    // Execute the query and return the result
    const { rows } = await db.query(query, params);
    return rows[0];
  }

  /**
   * Deletes a record from the database by its ID.
   *
   * @param {number} id - The ID of the record to delete.
   *
   * @returns {Promise<Object>} The deleted record.
   *
   * @example
   * const user = await User.delete(1);
   * console.log(user);
   * // { id: 1, name: "John Doe", age: 25 }
   */
  async delete(id) {
    // Build the DELETE query to delete the record
    const query = buildDeleteQuery({
      table: this.table,
      where: "id = $1",
    });
    // Execute the query and return the result
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

export default BaseModel;
