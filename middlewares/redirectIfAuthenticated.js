// middlewares/redirectIfAuthenticated.js
const redirectIfAuthenticated = (redirectTo = '/') => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log('User is already authenticated:', req.user) // Debug
      return res.redirect(redirectTo)
    }
    next()
  }
}

export default redirectIfAuthenticated
