// utils/mailer.js
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME || 'your_email_username',
    pass: process.env.EMAIL_PASSWORD || 'your_email_password',
  },
})


const sendMail = async ({ to, subject, html }) => {
  if (!to || typeof to !== 'string' || to.trim() === '') {
    throw new Error('Recipient email address is missing or invalid.')
  }

  // Define the email options, including sender, recipient, subject, and HTML content
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender's email address from environment variables
    to, // Recipient's email address
    subject, // Subject line of the email
    html, // HTML body content of the email
  }

  // Send the email using the transporter and the defined options
  await transporter.sendMail(mailOptions)
}

export default sendMail
