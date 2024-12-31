// models/subscriptionRequest.model.js
import db from '../utils/Database.js'
import BaseModel from './Base.model.js'

// CREATE TABLE subscription_requests (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   days INTEGER NOT NULL,
//   status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

class SubscriptionRequestModel extends BaseModel {
  constructor() {
    super('subscription_requests')
  }
  async createOne(userId, days) {
    const query = `
      INSERT INTO subscription_requests (user_id, days)
      VALUES ($1, $2)
      RETURNING *;
    `
    const { rows } = await db.query(query, [userId, days])
    return rows[0]
  }

  async getAll() {
    const query = `
      SELECT r.*, u.full_name, u.email
      FROM subscription_requests r
      JOIN users u ON r.user_id = u.id
      WHERE r.status = 'pending'
      ORDER BY r.created_at DESC;
    `
    const { rows } = await db.query(query)
    return rows
  }

  async findById(requestId) {
    const query = `
      SELECT * FROM subscription_requests
      WHERE id = $1;
    `
    const { rows } = await db.query(query, [requestId])
    return rows[0]
  }

  async updateStatus(requestId, status) {
    const query = `
      UPDATE subscription_requests
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `
    const { rows } = await db.query(query, [status, requestId])
    return rows[0]
  }
}

export default new SubscriptionRequestModel()
