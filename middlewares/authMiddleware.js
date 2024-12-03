// middlewares/authMiddleware.js

import { config } from 'dotenv'

config()

const authMiddleware =
  (roles = ['guest', 'subscriber', 'writer', 'editor', 'admin']) =>
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      console.warn('User is not authenticated') // Debug
      return res.status(401).redirect('/auth/login') // Redirect unauthenticated users
    }

    // console.log('Authenticated user:', req.user) // Log authenticated user details

    const user = req.user
    if (roles.length && !roles.includes(user.role)) {
      console.warn(`Access denied for user role: ${user.role}`) // Debug log
      return res.status(403).render('errors/403', { message: 'Access Denied' })
    }

    next()
  }

export default authMiddleware
