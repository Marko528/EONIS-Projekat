import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import './Profile.css'

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [msg, setMsg] = useState('')

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await authService.updateProfile(form)
      setMsg('Podaci uspjesno azurirani!')
    } catch { setMsg('Greska pri azuriranju.') }
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="profile-page page-wrapper">
      <div className="container">
        <h1 className="page-heading">MOJ PROFIL</h1>
        <div className="profile-layout">

          <div className="profile-form-section">
            <h2 className="section-heading">LICNI PODACI</h2>
            <form className="profile-form" onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">IME I PREZIME</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">EMAIL</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              {msg && <p className="update-msg">{msg}</p>}
              <button type="submit" className="btn-primary profile-save-btn">SACUVAJ PROMJENE</button>
            </form>
          </div>

          <div className="profile-sidebar">
            <Link to="/orders" className="profile-link-btn btn-secondary">MOJE PORUDZINE</Link>
            <Link to="/wishlist" className="profile-link-btn btn-secondary">WISHLIST</Link>
          </div>

        </div>
      </div>
    </div>
  )
}
