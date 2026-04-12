import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { supabase } from './supabase'
import App from './App'
import LoginPage from './pages/Login'
import './index.css'

function AuthGate() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return <LoginPage />
  }

  const params = new URLSearchParams(window.location.search)
  if (params.get('email') !== session.user.email) {
    params.set('email', session.user.email)
    window.history.replaceState({}, '', '?' + params.toString() + window.location.hash)
  }

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthGate />
    </BrowserRouter>
  </React.StrictMode>
)
