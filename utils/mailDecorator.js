export const decorateSendMail = (otpCode) => {
  return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset OTP</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #4CAF50;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            font-size: 1.5rem;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .otp-code {
            display: inline-block;
            font-size: 2rem;
            font-weight: bold;
            color: #4CAF50;
            background-color: #f0f8f5;
            border: 1px dashed #4CAF50;
            padding: 10px 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            font-size: 0.875rem;
            color: #666;
            margin: 20px 0;
          }
          .footer a {
            color: #4CAF50;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            Password Reset Request
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Use the OTP code below to proceed with resetting your password:</p>
            <div class="otp-code">${otpCode}</div>
            <p>This OTP is valid for <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email or contact our support team.</p>
            <p>Thank you,<br>The Support Team</p>
          </div>
          <div class="footer">
            Need help? <a href="mailto:support@example.com">Contact Support</a>
          </div>
        </div>
      </body>
      </html>
      `
}
