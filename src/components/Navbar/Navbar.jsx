import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const { totalItems, setIsOpen } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">MK DR1P</Link>
          <div className="navbar-links">
            <Link to="/products?gender=Muski">MUSKI</Link>
            <Link to="/products?gender=Zenski">ZENSKI</Link>
            <Link to="/products">BRENDOVI</Link>
            <Link to="/products?sort=newest">NOVO</Link>
          </div>
          <div className="navbar-actions">
            <button className="navbar-icon-btn" onClick={() => navigate('/products')} title="Pretraga">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            {isAuthenticated && (
              <button className="navbar-icon-btn" onClick={() => navigate('/wishlist')} title="Wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            )}
            <button className="navbar-icon-btn" onClick={() => setIsOpen(true)} title="Korpa">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <button className="navbar-icon-btn" onClick={() => navigate('/admin/dashboard')} title="Admin">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  </button>
                )}
                <button className="navbar-icon-btn" onClick={() => navigate('/profile')} title="Profil">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>
                <button className="navbar-icon-btn" onClick={handleLogout} title="Odjava">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </>
            ) : (
              <button className="navbar-icon-btn" onClick={() => navigate('/login')} title="Prijava">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            )}
            <button className="navbar-hamburger" onClick={() => setMobileOpen(p => !p)}>
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <Link to="/products?gender=Muski" onClick={() => setMobileOpen(false)}>MUSKI</Link>
        <Link to="/products?gender=Zenski" onClick={() => setMobileOpen(false)}>ZENSKI</Link>
        <Link to="/products" onClick={() => setMobileOpen(false)}>BRENDOVI</Link>
        <Link to="/products?sort=newest" onClick={() => setMobileOpen(false)}>NOVO</Link>
        {isAuthenticated && <Link to="/orders" onClick={() => setMobileOpen(false)}>PORUDZINE</Link>}
        {!isAuthenticated && <Link to="/login" onClick={() => setMobileOpen(false)}>PRIJAVA</Link>}
      </div>
    </>
  )
}
