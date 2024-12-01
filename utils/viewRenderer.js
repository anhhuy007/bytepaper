// utils/viewRenderer.js

/**
 * Middleware to render views dynamically or return JSON response.
 *
 * This middleware function is used in Express routes to render a specified
 * Handlebars view or return a JSON response depending on the request method.
 *
 * @param {string} viewName - The name of the Handlebars view to render.
 * @param {function|null} dataLoader - Optional asynchronous function to load data for the view.
 * @returns {function} Middleware for Express routes.
 * @example
 * const router = express.Router();
 * router.get("/", viewRenderer("home"));
 * router.get("/about", viewRenderer("about"));
 * router.get("/admin/users", viewRenderer("admin/users", adminController.getUsers));
 * router.get("/admin/categories", viewRenderer("admin/categories", adminController.getCategories));
 */
export const viewRenderer =
  (viewName, dataLoader = null) =>
  async (req, res, next) => {
    try {
      // Load additional data using the dataLoader function if provided
      const additionalData = dataLoader ? await dataLoader(req) : {};

      // Define default data to be included in all responses
      const defaultData = {
        title: "Electronic Newspaper",
        user: req.user || null, // Attach user session data if available
      };

      // Merge default data with any additional data
      const data = { ...defaultData, ...additionalData };

      if (req.method === "GET") {
        // For GET requests, render the specified view with the data
        return res.render(viewName, data);
      }

      // For non-GET requests, return a JSON response with the data
      res.json({ success: true, data });
    } catch (error) {
      // If an error occurs, pass it to the next middleware for handling
      next(error);
    }
  };

export default viewRenderer;
