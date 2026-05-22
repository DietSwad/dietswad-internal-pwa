import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { apiLogin } from '../api/auth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await apiLogin(password)
      login(token)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status
      if (status === 401) setError('Wrong password. Please try again.')
      else if (status === 429) setError('Too many attempts. Please try again in 5 minutes.')
      else setError('Login failed. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-linen flex items-center justify-center p-4">
      <main className="w-full max-w-sm bg-linen">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-espresso rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md">
            <span className="text-gold font-bold text-xl tracking-tight">DS</span>
          </div>
          <h1 className="text-2xl font-bold text-ink">Diet Swad</h1>
          <p className="text-sm text-ink/70 mt-1">Team Dashboard — Internal Access</p>
        </div>
        <div className="bg-cream rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
                Team Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                placeholder="Enter team password"
                className="w-full px-4 py-3 rounded-xl border border-surface bg-white text-ink focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold placeholder:text-ink/40 disabled:opacity-60 transition-colors"
              />
            </div>
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full py-3 px-4 bg-espresso text-on-dark font-semibold rounded-xl hover:bg-espresso-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-ink/80 mt-6">Radiant Twins Enterprise · Internal use only</p>
      </main>
    </div>
  )
}
