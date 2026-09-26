import Database from 'better-sqlite3'

const db = new Database(process.env.DB_PATH || '/tmp/aero-transit.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    points INTEGER DEFAULT 0,
    preferences TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    trip_data TEXT NOT NULL,
    is_favorite INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`)

export function createUser(username, hashedPassword, phone) {
  const info = db.prepare('INSERT INTO users (username, password, phone) VALUES (?, ?, ?)').run(username, hashedPassword, phone)
  return getUserById(info.lastInsertRowid)
}

export function getUserByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username)
}

export function getUserById(id) {
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  if (!u) return null
  return { id: u.id, username: u.username, phone: u.phone, points: u.points, preferences: JSON.parse(u.preferences || '[]') }
}

export function addPoints(userId, pts) {
  db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(pts, userId)
  return getUserById(userId)
}

export function saveTrip(userId, tripData) {
  return db.prepare('INSERT INTO trips (user_id, trip_data) VALUES (?, ?)').run(userId, JSON.stringify(tripData)).lastInsertRowid
}

export function getTrips(userId) {
  return db.prepare('SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC').all(userId)
    .map(t => ({ id: t.id, ...JSON.parse(t.trip_data), is_favorite: !!t.is_favorite, created_at: t.created_at }))
}

export function deleteTrip(userId, tripId) {
  db.prepare('DELETE FROM trips WHERE id = ? AND user_id = ?').run(tripId, userId)
}

export function toggleFavorite(userId, tripId) {
  const t = db.prepare('SELECT is_favorite FROM trips WHERE id = ? AND user_id = ?').get(tripId, userId)
  if (!t) return null
  const v = t.is_favorite ? 0 : 1
  db.prepare('UPDATE trips SET is_favorite = ? WHERE id = ? AND user_id = ?').run(v, tripId, userId)
  return !!v
}

export function updatePreferences(userId, prefs) {
  db.prepare('UPDATE users SET preferences = ? WHERE id = ?').run(JSON.stringify(prefs), userId)
  return getUserById(userId)
}
