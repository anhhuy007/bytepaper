// middlewares/redirectIfAuthenticated.js
const redirectIfAuthenticated = (redirectTo = '/') => {
  return (req, res, next) => {
    // Check if user want to logout
    if (req.url === '/logout') {
      return next()
    }
    if (req.isAuthenticated()) {
      console.log('User is already authenticated:', req.user) // Debugz
      return res.redirect(redirectTo)
    }
    next()
  }
}

export default redirectIfAuthenticated
