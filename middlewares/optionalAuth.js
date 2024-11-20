// middlewares/optionalAuth.js

import passport from "passport";

/**
 * Optional authentication middleware.
 *
 * This middleware authenticates the request using a JWT token if one is present.
 * If the token is valid, it adds the user object to the request object.
 * If the token is invalid or missing, it does not add the user object to the request.
 *
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @param {Function} next - The Express.js next middleware function.
 *
 * @returns {void} Nothing.
 */
const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    // If there is no error and the user is valid, add the user object to the request
    if (!err && user) {
      req.user = user;
    }
    // Call the next middleware
    next();
  })(req, res, next);
};

export default optionalAuth;
