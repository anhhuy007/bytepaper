// utils/Database.js
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

class Database {
  /**
   * Initializes a new instance of the Database class.
   * Sets up the connection pool to the PostgreSQL database.
   * @constructor
   */
  constructor() {
    /**
     * The connection pool to the PostgreSQL database.
     * @type {Pool}
     */
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    /**
     * Event listener for successful connection.
     * @param {Error} [err] - The error object if the connection failed.
     * @listens Pool#connect
     */
    this.pool.on("connect", () => {
      console.log("Connected to the PostgreSQL database");
    });

    /**
     * Event listener for errors on idle clients.
     * @param {Error} err - The error object.
     * @listens Pool#error
     */
    this.pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });
  }

  /**
   * Executes a SQL query on the PostgreSQL database.
   * The query is executed with the provided parameters.
   * The execution time and number of rows returned are logged.
   * @param {string} text - The SQL query to execute.
   * @param {Array<any>} [params] - The parameters to pass to the query.
   * @returns {Promise<QueryResult>} The result of the query.
   *
   * @example
   * const res = await db.query("SELECT 1 + 1 AS result", []);
   * console.log(res.rows[0].result); // Output: 2
   */
  async query(text, params = []) {
    try {
      console.log("Executing Query:", text);
      console.log("With Parameters:", params);
      const start = Date.now();
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log("Query executed successfully:", {
        duration,
        rows: res.rowCount,
      });
      return res;
    } catch (err) {
      console.error("Query failed:", { text, params });
      throw err;
    }
  }
  /**
   * Retrieves a client from the pool, or creates a new one if the pool is empty.
   * The client is returned with a modified `query` method that logs the executed
   * query, and a modified `release` method that clears the timeout.
   * @returns {Promise<Client>} The client instance.
   * @example
   * const client = await db.getClient();
   * try {
   *   const res = await client.query("SELECT 1 + 1 AS result", []);
   *   console.log(res.rows[0].result); // Output: 2
   * } finally {
   *   client.release();
   * }
   */
  async getClient() {
    const client = await this.pool.connect();
    const query = client.query;
    const release = client.release;

    // Set up timeout
    const timeout = setTimeout(() => {
      console.error("A client has been checked out for too long");
      console.error(`Last executed query: ${client.lastQuery}`);
    }, 5000);

    /**
     * Monkey patch the query method to log the executed query.
     * This method is called when the client executes a query.
     * It logs the executed query text and parameters.
     * @param {string} text - The SQL query to execute.
     * @param {Array<any>} [params] - The parameters to pass to the query.
     * @returns {Promise<QueryResult>} The result of the query.
     *
     * @example
     * const client = await db.getClient();
     * try {
     *   const res = await client.query("SELECT 1 + 1 AS result", []);
     *   console.log(res.rows[0].result); // Output: 2
     * } finally {
     *   client.release();
     * }
     */
    client.query = (...args) => {
      // Log the executed query text and parameters
      client.lastQuery = args;

      // Call the original query method to execute the query
      return query.apply(client, args);
    };

    /**
     * Monkey patch the release method to clear the timeout and restore the
     * original query and release methods to the client.
     * @returns {Promise<void>}
     *
     * This method is called when the client is released back to the pool.
     * It clears the timeout that was set when the client was checked out.
     * The original query and release methods are restored to the client to
     * prevent any potential memory leaks.
     * The original release method is called to return the client to the pool.
     */
    client.release = async () => {
      // Clear the timeout that was set when the client was checked out
      clearTimeout(timeout);

      // Restore the original query and release methods to the client
      client.query = query;
      client.release = release;

      // Call the original release method to return the client to the pool
      await release.apply(client);
    };

    return client;
  }
}

const db = new Database();
export default db;
