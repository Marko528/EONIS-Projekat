import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import './Register.css'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Ime je obavezno.'
    if (!form.email) e.email = 'Email je obavezan.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Neispravan email.'
    if (!form.password) e.password = 'Lozinka je obavezna.'
    else if (form.password.length < 6) e.password = 'Lozinka mora imati min. 6 znakova.'
    if (form.password !== form.confirm) e.confirm = 'Lozinke se ne poklapaju.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    setServerError('')
    try {
      await authService.register({ name: form.name, email: form.email, password: form.password })
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Greska pri registraciji.')
    } finally { setLoading(false) }
  }

  const f = (field) => ({ value: form[field], onChange: e => setForm(p => ({ ...p, [field]: e.target.value })) })

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-box">
        <Link to="/" className="auth-logo">MK DR1P</Link>
        <h1 className="auth-title">REGISTRACIJA</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          {[
            { key: 'name', type: 'text', placeholder: 'Ime i prezime' },
            { key: 'email', type: 'email', placeholder: 'Email adresa' },
            { key: 'password', type: 'password', placeholder: 'Lozinka' },
            { key: 'confirm', type: 'password', placeholder: 'Potvrdite lozinku' },
          ].map(({ key, type, placeholder }) => (
            <div key={key} className="form-group">
              <input className={`form-input${errors[key] ? ' error' : ''}`} type={type} placeholder={placeholder} {...f(key)} />
              {errors[key] && <p className="error-text">{errors[key]}</p>}
            </div>
          ))}
          {serverError && <p className="error-text server-error">{serverError}</p>}
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'UCITAVANJE...' : 'REGISTRACIJA'}
          </button>
        </form>
        <p className="auth-switch">Imate nalog? <Link to="/login">Prijavite se</Link></p>
      </div>
    </div>
  )
}
