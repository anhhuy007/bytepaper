// config/passport.js
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
import userService from '../services/user.service.js'

dotenv.config()

// Local Strategy for username/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        console.log('Authenticating user:', username)
        const user = await userService.authenticateUser({ username, password })
        if (!user) {
          console.warn('Invalid credentials for username:', username)
          return done(null, false, { message: 'Invalid credentials' })
        }
        return done(null, user)
      } catch (error) {
        console.error('Error in Local strategy:', error)
        return done(error)
      }
    },
  ),
)

// Serialize user for session
passport.serializeUser((user, done) => {
  if (!user || !user.id) {
    console.error('User object is invalid:', user)
    return done(new Error('Failed to serialize user'))
  }
  done(null, user.id) // Store user ID in session
})

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id) // Ensure this function works as expected
    if (!user) {
      console.warn('No user found with id:', id) // Debug log
      return done(new Error('User not found'))
    }
    done(null, user)
  } catch (error) {
    console.error('Error in deserializing user:', error) // Debug log
    done(error, null)
  }
})

// Google Strategy for OAuth authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userService.findOrCreateByGoogle(profile)
        console.log('Google user authenticated:', user) // Debug log
        return done(null, user)
      } catch (error) {
        console.error('Error in Google strategy:', error)
        return done(error, false)
      }
    },
  ),
)

export default passport
