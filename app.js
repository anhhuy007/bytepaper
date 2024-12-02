// app.js
// Core modules
import path from 'path'
import { fileURLToPath } from 'url'

// Third-party libraries
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import session from 'express-session'
import livereload from 'livereload'
import connectLivereload from 'connect-livereload'
import { engine } from 'express-handlebars'
import { RedisStore } from 'connect-redis'
import cookieParser from 'cookie-parser'

// Custom modules
import routes from './routes/index.routes.js'
import errorHandler from './middlewares/errorHandler.js'
import passport from './config/passport.js'
import redisClient from './utils/redisClient.js'
import * as helpers from './helpers/handlebars.js'

// Load environment variables
dotenv.config()

// Application Constants
const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isDevelopment = process.env.NODE_ENV === 'dev'
const maxAge = parseInt(process.env.JWT_EXPIRY, 10) || 1000 * 60 * 60 * 24 * 7 // Default to 7 days

// Initialize Express app
const app = express()

// Core Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'))

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: isDevelopment ? false : undefined,
  }),
)
app.use(cors())

// Session Management
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Allow in dev
      maxAge: 1000 * 60 * 30, // 30 minutes,
    },
  }),
)

app.use(cookieParser())

// Logging Middleware
app.use(morgan(isDevelopment ? 'dev' : 'combined'))

// Passport Initialization
app.use(passport.initialize())
app.use(passport.session())

app.use('/uploads', express.static('uploads'))

/* ---------- Handlebars Setup ---------- */
app.engine(
  'hbs',
  engine({
    extname: 'hbs',
    partialsDir: path.join(__dirname, 'views', 'partials'),
    helpers: { ...helpers },
    cache: !isDevelopment, // Enable cache in production
  }),
)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

/* ---------- Live Reload for Development ---------- */
function setupLiveReload(app) {
  const liveReloadServer = livereload.createServer()
  liveReloadServer.watch(path.join(__dirname, 'views'))
  app.use(connectLivereload())
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/')
    }, 100)
  })
}

if (isDevelopment) setupLiveReload(app)

// For debugging
// app.use((req, res, next) => {
//   console.log('Session ID:', req.sessionID)
//   console.log('Session Data:', req.session)
//   console.log('Authenticated:', req.isAuthenticated())
//   console.log('User:', req.user)
//   next()
// })

// Routes
app.use('/', routes)

// Error Handling
// app.use((req, res) => {
//   res.status(404).render('errors/404', { title: 'Page Not Found' })
// })
app.use(errorHandler)

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
