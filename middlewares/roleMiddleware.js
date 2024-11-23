// middlewares/roleMiddleware.js

/**
 * Checks if the user has the required role.
 *
 * @param {string} requiredRole - The required role for the route.
 * @returns {function} The middleware function.
 */
const roleMiddleware = (requiredRole) => {
  /**
   * Checks if the user has the required role.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {function} next - The next middleware function.
   * @returns {undefined}
   */
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
};


export default roleMiddleware;
