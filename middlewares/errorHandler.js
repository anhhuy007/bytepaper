// middlewares/errorHandler.js

/**
 * Express.js error handling middleware.
 *
 * This middleware function handles errors that occur during request processing.
 * It logs the error and sends an error response back to the client.
 *
 * @param {Error} err - The error object representing the error that occurred.
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @param {Function} next - The Express.js next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err);

  // Set the response status code (default to 500 for server errors)
  const statusCode = err.statusCode || 500;

  // Send a JSON response containing the error message
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
