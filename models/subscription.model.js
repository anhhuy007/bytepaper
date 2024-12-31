// models/subscription.model.js

import BaseModel from './Base.model.js'
import db from '../utils/Database.js'
// CREATE TABLE subscriptions (
//   user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
//   expiry_date TIMESTAMPTZ NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

class SubscriptionModel extends BaseModel {
  constructor() {
    super('subscriptions')
  }
  async findByUserId(userId) {
    const query = `
      SELECT * FROM subscriptions
      WHERE user_id = $1
    `
    const { rows } = await db.query(query, [userId])
    return rows[0]
  }

  async upsert(userId, expiryDate) {
    // Define the SQL query to insert or update the subscription record
    const query = `
      INSERT INTO subscriptions (user_id, expiry_date)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET expiry_date = EXCLUDED.expiry_date, updated_at = NOW()
      RETURNING *
    `
    // Execute the query with the provided userId and expiryDate
    const { rows } = await db.query(query, [userId, expiryDate])
    // Return the newly inserted or updated subscription record
    return rows[0]
  }

  async deleteSubscription(userId) {
    const query = `
      DELETE FROM subscriptions
      WHERE user_id = $1
      RETURNING *
    `
    const { rows } = await db.query(query, [userId])
    return rows[0]
  }
}
export default new SubscriptionModel()
