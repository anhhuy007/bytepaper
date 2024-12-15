// routes/index.routes.js

import express from 'express'
import authRoutes from './auth.routes.js'
import articleRoutes from './article.routes.js'
import categoryRoutes from './category.routes.js'
import tagRoutes from './tag.routes.js'
import commentRoutes from './comment.routes.js'
import userRoutes from './user.routes.js'
import writerRoutes from './writer.routes.js'
import editorRoutes from './editor.routes.js'
import adminRoutes from './admin.routes.js'
import subscriptionRoutes from './subscription.routes.js'

const router = express.Router()

// Public Routes
router.use('/auth', authRoutes)
router.use('/articles', articleRoutes)
router.use('/categories', categoryRoutes)
router.use('/tags', tagRoutes)
router.use('/comments', commentRoutes)

// Protected Routes
router.use('/subscription', subscriptionRoutes)
router.use('/user', userRoutes)
router.use('/writer', writerRoutes)
router.use('/editor', editorRoutes)
router.use('/admin', adminRoutes)

router.get('/', (req, res) => {
  res.redirect('/articles/home')
})


export default router
