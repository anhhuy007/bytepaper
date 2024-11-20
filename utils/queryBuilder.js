// utils/queryBuilder.js

/**
 * Builds a SELECT query based on the provided options
 * @param {Object} options - The options for building the query
 * @param {string} options.table - The table to select from
 * @param {string[]} [options.columns=["*"]] - The columns to select
 * @param {string} [options.where=""] - The WHERE clause
 * @param {string} [options.orderBy=""] - The ORDER BY clause
 * @param {string} [options.limit=""] - The LIMIT clause
 * @param {string} [options.offset=""] - The OFFSET clause
 * @returns {string} The built SELECT query
 * @example
 * const query = buildSelectQuery({
 *   table: "users",
 *   columns: ["id", "name", "email"],
 *   where: "age > 18",
 *   orderBy: "name ASC",
 *   limit: 10,
 *   offset: 5,
 * });
 * console.log(query);
 * // SELECT id, name, email FROM users WHERE age > 18 ORDER BY name ASC LIMIT 10 OFFSET 5;
 */
export const buildSelectQuery = ({
  table,
  columns = ["*"],
  where = "",
  orderBy = "",
  limit = "",
  offset = "",
}) => {
  let query = `SELECT ${columns.join(", ")} FROM ${table}`;
  if (where) query += ` WHERE ${where}`;
  if (orderBy) query += ` ORDER BY ${orderBy}`;
  if (limit) query += ` LIMIT ${limit}`;
  if (offset) query += ` OFFSET ${offset}`;
  return query;
};

/**
 * Builds an INSERT query based on the provided options
 * @param {{table: string, data: Object}} options
 * @param {string} options.table - The table to insert into
 * @param {Object} options.data - The data to insert
 * @returns {{query: string, params: any[]}} The built INSERT query and its
 * parameters
 * @example
 * const query = buildInsertQuery({
 *   table: "users",
 *   data: { name: "John Doe", email: "john@example.com" },
 * });
 * console.log(query);
 * // {
 * //   query: "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
 * //   params: ["John Doe", "john@example.com"],
 * // }
 */
export const buildInsertQuery = ({ table, data }) => {
  const columns = Object.keys(data);
  const values = columns.map((col, idx) => `$${idx + 1}`);
  const query = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${values.join(", ")}) RETURNING *`;
  const params = Object.values(data);
  return { query, params };
};

/**
 * Builds an UPDATE query based on the provided options
 * @param {Object} options - The options for building the query
 * @param {string} options.table - The table to update
 * @param {Object} options.data - The data to update
 * @param {string} options.where - The WHERE clause to identify rows to update
 * @returns {{query: string, params: any[]}} The built UPDATE query and its parameters
 * @example
 * const query = buildUpdateQuery({
 *   table: "users",
 *   data: { name: "John Doe", email: "john@example.com" },
 *   where: "id = 1",
 * });
 * console.log(query);
 * // {
 * //   query: "UPDATE users SET name = $1, email = $2 WHERE id = 1 RETURNING *",
 * //   params: ["John Doe", "john@example.com"],
 * // }
 */
export const buildUpdateQuery = ({ table, data, where }) => {
  // Get the columns to update
  const columns = Object.keys(data);
  // Construct the SET clause for the query
  const setClause = columns
    .map((col, idx) => `${col} = $${idx + 1}`)
    .join(", ");
  // Construct the full UPDATE query
  const query = `UPDATE ${table} SET ${setClause} WHERE ${where} RETURNING *`;
  // Get the parameter values for the query
  const params = Object.values(data);
  return { query, params };
};

/**
 * Builds a DELETE query based on the provided options.
 *
 * @param {Object} options - The options for building the DELETE query.
 * @param {string} options.table - The table to delete from.
 * @param {string} options.where - The WHERE clause to identify rows to delete.
 * @returns {string} The built DELETE query.
 *
 * @example
 * const query = buildDeleteQuery({
 *   table: "users",
 *   where: "id = 1",
 * });
 * console.log(query);
 * // DELETE FROM users WHERE id = 1 RETURNING *
 */
export const buildDeleteQuery = ({ table, where }) => {
  // Construct the DELETE query string
  const query = `DELETE FROM ${table} WHERE ${where} RETURNING *`;
  // Return the constructed query
  return query;
};

/**
 * Builds a WHERE clause based on the provided filters.
 * @param {Object} filters - The filters to build the WHERE clause from.
 * @param {number} [startingIndex=1] - The starting index for the values in the
 * WHERE clause.
 * @returns {{whereClause: string, values: any[]}} The built WHERE clause and its
 * values.
 * @example
 * const { whereClause, values } = buildWhereClause({
 *   id: 1,
 *   name: "John Doe",
 *   age: [18, 65],
 * });
 * console.log(whereClause);
 * // id = $1 AND name = $2 AND age = ANY($3::integer[])
 * console.log(values);
 * // [1, "John Doe", [18, 65]]
 */
export const buildWhereClause = (filters, startingIndex = 1) => {
  const conditions = [];
  const values = [];
  let index = startingIndex;

  for (const [key, value] of Object.entries(filters)) {
    // If the value is an array, use the ANY operator to build the condition
    if (Array.isArray(value)) {
      conditions.push(`${key} = ANY($${index}::${typeof value[0]}[])`);
    } else {
      // Otherwise, use the = operator to build the condition
      conditions.push(`${key} = $${index}`);
    }
    // Add the value to the values array
    values.push(value);
    // Increment the index to the next parameter index
    index++;
  }

  // Build the WHERE clause by joining the conditions with AND
  const whereClause = conditions.length ? conditions.join(" AND ") : "";
  // Return the built WHERE clause and its values
  return { whereClause, values };
};
