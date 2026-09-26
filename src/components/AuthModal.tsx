import { useState } from 'react'
import { X, User, Lock, Phone, Loader as Loader2, Plane } from 'lucide-react'
import { useAuth } from '../lib/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') await login(username, password)
      else await register(username, password, phone)
      setUsername(''); setPassword(''); setPhone('')
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-card p-8 max-w-md w-full border-glow-red" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <Plane className="w-5 h-5 text-cream-100" />
            </div>
            <h2 className="font-display font-bold text-xl text-cream-100">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-6 p-1 rounded-xl bg-cream-100/5">
          <button
            onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-red-500/20 text-red-300' : 'text-cream-400 hover:text-cream-200'}`}
          >
            Login
          </button>
          <button
            onClick={() => { setMode('register'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'bg-red-500/20 text-red-300' : 'text-cream-400 hover:text-cream-200'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cream-200 mb-2">
              <User className="w-4 h-4 inline mr-1.5 text-red-400" /> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input-field"
              placeholder="Choose a username"
              required
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream-200 mb-2">
              <Lock className="w-4 h-4 inline mr-1.5 text-red-400" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-cream-200 mb-2">
                <Phone className="w-4 h-4 inline mr-1.5 text-red-400" /> Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input-field"
                placeholder="e.g. +1 555 123 4567"
              />
            </div>
          )}

          {error && (
            <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Please wait...</>
            ) : (
              <>{mode === 'login' ? 'Login' : 'Create Account'}</>
            )}
          </button>
        </form>

        <p className="text-xs text-cream-500 text-center mt-4">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-red-400 hover:text-red-300 font-medium"
          >
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
