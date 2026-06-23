import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email je obavezan.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Neispravan email.'
    if (!form.password) e.password = 'Lozinka je obavezna.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    setServerError('')
    try {
      const user = await login(form.email, form.password)
      navigate(user?.role === 'ADMIN' || user?.role === 'Admin' ? '/admin/dashboard' : '/')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Pogresni podaci za prijavu.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-box">
        <Link to="/" className="auth-logo">MK DR1P</Link>
        <h1 className="auth-title">PRIJAVA</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className={`form-input${errors.email ? ' error' : ''}`}
              type="email" placeholder="Email adresa"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="form-group">
            <input
              className={`form-input${errors.password ? ' error' : ''}`}
              type="password" placeholder="Lozinka"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          {serverError && <p className="error-text server-error">{serverError}</p>}
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'UČITAVANJE...' : 'PRIJAVA'}
          </button>
        </form>
        <p className="auth-switch">Nemate nalog? <Link to="/register">Registrujte se</Link></p>
      </div>
    </div>
  )
}
