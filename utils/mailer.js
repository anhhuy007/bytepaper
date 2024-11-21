// utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME || "your_email_username",
    pass: process.env.EMAIL_PASSWORD || "your_email_password",
  },
});

/**
 * Sends an email using the configured transporter.
 *
 * @function sendMail
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content of the email.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 *
 * @example
 * import sendMail from "./mailer";
 * // Send an email to the user
 * sendMail(
 *   "user@example.com",
 *   "Hello from Node.js",
 *   `<p>Hello!</p><p>This is a message sent from Node.js.</p>`
 * );
 */
const sendMail = async (to, subject, html) => {
  // Define the email options, including sender, recipient, subject, and HTML content
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender's email address from environment variables
    to, // Recipient's email address
    subject, // Subject line of the email
    html, // HTML body content of the email
  };

  // Send the email using the transporter and the defined options
  await transporter.sendMail(mailOptions);
};

export default sendMail;
