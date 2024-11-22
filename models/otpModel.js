// models/otpModel.js

import BaseModel from "./BaseModel.js";
import db from "../utils/Database.js";

// CREATE TABLE otps (
//   user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
//   otp TEXT NOT NULL,
//   expiry TIMESTAMPTZ NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

class OtpModel extends BaseModel {
  constructor() {
    super("otps");
  }

  /**
   * Creates a new OTP for the user or updates an existing one if it already exists.
   *
   * This method uses a UPSERT query to create a new record or update an
   * existing one in a single query. This helps prevent race conditions
   * where a new OTP is created while an existing one is still valid.
   *
   * @param {number} userId - The ID of the user.
   * @param {string} otp - The one-time password to store.
   * @returns {Promise<Object>} The newly created or updated OTP record.
   * @throws {Error} If the query fails.
   * @example
   * const otpRecord = await otpModel.createOrUpdate(1, "123456");
   * console.log(otpRecord);
   * // { user_id: 1, otp: "123456", expiry: "...", ... }
   */
  async createOrUpdate(userId, otp) {
    // Set expiry time to 10 minutes from now
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // Use a UPSERT query to insert or update the OTP record
    const query = `
      INSERT INTO otps (user_id, otp, expiry)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET otp = EXCLUDED.otp, expiry = EXCLUDED.expiry, updated_at = NOW()
      RETURNING *
    `;

    // Execute the query with the provided userId, otp, and expiry
    const { rows } = await db.query(query, [userId, otp, expiry]);

    // Return the newly created or updated OTP record
    return rows[0];
  }

  /**
   * Retrieves the OTP record for the given user ID.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Object>} The OTP record for the user, or null if no record
   * exists.
   * @example
   * const otpRecord = await otpModel.findByUserId(1);
   * console.log(otpRecord);
   * // { user_id: 1, otp: "123456", expiry: "...", ... }
   */
  async findByUserId(userId) {
    const query = `
      SELECT * FROM otps
      WHERE user_id = $1
    `;
    const { rows } = await db.query(query, [userId]);
    return rows[0];
  }

  /**
   * Deletes the OTP record for the given user ID.
   *
   * This method removes the OTP record associated with the specified user ID
   * from the database.
   *
   * @param {number} userId - The ID of the user whose OTP record is to be deleted.
   * @returns {Promise<void>}
   * @throws {Error} If the query fails.
   * @example
   * await otpModel.deleteOtp(1);
   */
  async deleteOtp(userId) {
    // SQL query to delete the OTP record for the user
    const query = `
      DELETE FROM otps
      WHERE user_id = $1
    `;

    // Execute the query with the provided userId
    await db.query(query, [userId]);
  }
}

const otpModel = new OtpModel();
export default otpModel;
