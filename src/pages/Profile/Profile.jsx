import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import { loyaltyService } from '../../services/loyaltyService'
import './Profile.css'

export default function Profile() {
  const { user } = useAuth()
  const [loyalty, setLoyalty] = useState(null)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    loyaltyService.getStatus().then(r => setLoyalty(r.data)).catch(() => {})
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await authService.updateProfile(form)
      setMsg('Podaci uspjesno azurirani!')
    } catch { setMsg('Greska pri azuriranju.') }
    setTimeout(() => setMsg(''), 3000)
  }

  const loyaltyLevel = (points) => {
    if (points >= 1000) return 'GOLD'
    if (points >= 500) return 'SILVER'
    return 'BRONZE'
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
              <button type="submit" className="btn-primary">SACUVAJ PROMJENE</button>
            </form>
          </div>
          <div className="profile-sidebar">
            {loyalty && (
              <div className="loyalty-card">
                <span className="loyalty-level">{loyaltyLevel(loyalty.points || 0)}</span>
                <p className="loyalty-points">{loyalty.points || 0} bodova</p>
                <p className="loyalty-desc">Skupljajte bodove sa svakom kupovinom.</p>
              </div>
            )}
            <Link to="/orders" className="profile-link-btn btn-secondary">MOJE PORUDZINE</Link>
            <Link to="/wishlist" className="profile-link-btn btn-secondary">WISHLIST</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
