import { useState } from 'react'
import { supabase } from '../supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + window.location.search
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-cyan-400 tracking-wide">N3XOS</h1>
          <p className="text-sm text-slate-500 mt-1">Operator Substrate</p>
        </div>

        {sent ? (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-center">
            <p className="text-slate-200 text-sm">Check your email</p>
            <p className="text-slate-400 text-xs mt-2">
              We sent a login link to <span className="text-cyan-400">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <label className="block text-xs text-slate-400 mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-medium py-2 rounded transition-colors"
            >
              {loading ? 'Sending...' : 'Send login link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
