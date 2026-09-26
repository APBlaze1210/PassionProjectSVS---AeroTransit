import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createUser, getUserByUsername, getUserById, saveTrip, getTrips, deleteTrip, toggleFavorite, updatePreferences, addPoints } from './db.js'
import { generateTrip } from './amadeus.js'

const app = express()
app.use(cors())
app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

function auth(req, res, next) {
  const h = req.headers.authorization
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' })
  try {
    req.user = jwt.verify(h.slice(7), JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

app.get('/health', (req, res) => res.json({ status: 'ok' }))

// --- Auth ---
app.post('/api/auth/register', async (req, res) => {
  const { username, password, phone } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' })
  if (username.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
  if (getUserByUsername(username)) return res.status(409).json({ error: 'Username already taken' })

  const hashed = await bcrypt.hash(password, 10)
  const user = createUser(username, hashed, phone || '')
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user })
})

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' })
  const u = getUserByUsername(username)
  if (!u) return res.status(401).json({ error: 'Invalid username or password' })
  if (!(await bcrypt.compare(password, u.password))) return res.status(401).json({ error: 'Invalid username or password' })

  const user = getUserById(u.id)
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user })
})

app.get('/api/auth/me', auth, (req, res) => {
  const user = getUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user })
})

// --- User data ---
app.get('/api/user/data', auth, (req, res) => {
  const trips = getTrips(req.user.id)
  const user = getUserById(req.user.id)
  res.json({ trips, favorites: trips.filter(t => t.is_favorite), preferences: user?.preferences || [], points: user?.points || 0 })
})

app.post('/api/user/trips', auth, (req, res) => {
  const { tripData } = req.body
  if (!tripData) return res.status(400).json({ error: 'Trip data is required' })
  const id = saveTrip(req.user.id, tripData)
  const user = addPoints(req.user.id, 10)
  res.json({ id, points: user?.points || 0 })
})

app.delete('/api/user/trips/:id', auth, (req, res) => {
  deleteTrip(req.user.id, parseInt(req.params.id))
  res.json({ success: true })
})

app.post('/api/user/trips/:id/favorite', auth, (req, res) => {
  res.json({ isFavorite: toggleFavorite(req.user.id, parseInt(req.params.id)) })
})

app.put('/api/user/preferences', auth, (req, res) => {
  res.json({ user: updatePreferences(req.user.id, req.body.preferences || []) })
})

// --- Trip generation (Amadeus) ---
app.post('/api/trips/generate', async (req, res) => {
  try {
    res.json(await generateTrip(req.body))
  } catch (e) {
    console.error('Trip generation error:', e.message)
    res.status(500).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
