// middlewares/authMiddleware.js

import passport from 'passport'

/**
 * Authentication middleware with role-based access control
 *
 * This middleware checks if the request is authenticated and the user has the
 * required role. If the request is authenticated and the user has the required
 * role, it calls the next middleware function in the stack. If the request is not
 * authenticated or the user does not have the required role, it returns an error
 * response.
 *
 * @param {string[]} [roles] - The roles allowed to access the route
 * @returns {Function} - The middleware function
 */
const authMiddleware = (roles = ['guest', 'subscriber', 'writer', 'editor', 'admin']) => {
  /**
   * Checks if the request is authenticated and the user has the required role
   *
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @param {Function} next - The next middleware function in the stack
   * @returns {Promise<void>} - A promise that resolves when the middleware is done
   */
  return (req, res, next) => {
    /**
     * Authenticates the request using the JWT strategy
     *
     * @param {Error} err - The error object if authentication failed
     * @param {Object} user - The authenticated user object
     * @param {Object} info - The extra information about the authentication result
     * @returns {Promise<void>} - A promise that resolves when the authentication is done
     */
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
      }
      req.user = user

      // Role-based access control
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Forbidden, you must be ${roles[0]} to access`,
        })
      }

      next()
    })(req, res, next)
  }
}

export default authMiddleware
