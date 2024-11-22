// models/subscriptionsModel.js

import BaseModel from "./BaseModel.js";
import db from "../utils/Database.js";
// CREATE TABLE subscriptions (
//   user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
//   expiry_date TIMESTAMPTZ NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

class SubscriptionModel extends BaseModel {
  constructor() {
    super("subscriptions");
  }
  /**
   * Retrieves the subscription record for the given user ID.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Object>} The subscription record for the user, or null if no record
   * exists.
   * @example
   * const subscription = await subscriptionModel.findByUserId(1);
   * console.log(subscription);
   * // { user_id: 1, expiry_date: "...", created_at: "...", updated_at: "..." }
   */
  async findByUserId(userId) {
    const query = `
      SELECT * FROM subscriptions
      WHERE user_id = $1
    `;
    const { rows } = await db.query(query, [userId]);
    return rows[0];
  }

  /**
   * Inserts or updates a subscription record for the given user ID.
   *
   * This method uses an UPSERT query to either insert a new subscription record
   * or update an existing one if the user ID already exists in the database.
   *
   * @param {number} userId - The ID of the user.
   * @param {Date} expiryDate - The expiry date of the subscription.
   * @returns {Promise<Object>} The newly inserted or updated subscription record.
   * @example
   * const subscription = await subscriptionModel.upsert(1, new Date());
   * console.log(subscription);
   * // { user_id: 1, expiry_date: "...", created_at: "...", updated_at: "..." }
   */
  async upsert(userId, expiryDate) {
    // Define the SQL query to insert or update the subscription record
    const query = `
      INSERT INTO subscriptions (user_id, expiry_date)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET expiry_date = EXCLUDED.expiry_date, updated_at = NOW()
      RETURNING *
    `;
    // Execute the query with the provided userId and expiryDate
    const { rows } = await db.query(query, [userId, expiryDate]);
    // Return the newly inserted or updated subscription record
    return rows[0];
  }

  /**
   * Deletes a subscription record for the given user ID.
   *
   * This method will remove the subscription record associated with the
   * specified user ID from the database and return the deleted record.
   *
   * @param {number} userId - The ID of the user whose subscription is to be deleted.
   * @returns {Promise<Object>} The deleted subscription record.
   * @example
   * const deletedSubscription = await subscriptionModel.deleteSubscription(1);
   * console.log(deletedSubscription);
   * // { user_id: 1, expiry_date: "...", created_at: "...", updated_at: "..." }
   */
  async deleteSubscription(userId) {
    const query = `
      DELETE FROM subscriptions
      WHERE user_id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [userId]);
    return rows[0];
  }

  // Another methods related to subscriptions...

  /**
   * Deletes subscriptions associated with a given user ID from the database.
   *
   * @param {string|number} user_id - The ID of the user whose subscriptions will be deleted.
   *
   * @returns {Promise<void>} The promise that resolves when the subscriptions are deleted.
   * @throws {Error} If any error occurs while deleting the subscriptions.
   */
  async deleteSubscriptionsByUserID(user_id) {
    const text = "DELETE FROM subscriptions WHERE userId = $1 RETURNING *;";
    const values = [user_id];

    await db.query(text, values);
  }
}

const subscriptionModel = new SubscriptionModel();
export default subscriptionModel;
