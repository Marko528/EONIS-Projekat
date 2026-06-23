import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const { totalItems, setIsOpen } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const close = () => setDrawerOpen(false)
  const handleLogout = () => { logout(); navigate('/'); close() }

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    setSearchOpen(false)
    setSearchQuery('')
    navigate(`/products?search=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">

          <div className="navbar-left">
            <button className="navbar-hamburger" onClick={() => setDrawerOpen(true)} aria-label="Meni">
              <span /><span /><span />
            </button>
          </div>

          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-text">MK DR1P</span>
          </Link>

          <div className="navbar-right">
            <button className="navbar-icon-btn" onClick={() => setSearchOpen(true)} title="Pretraga">
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
            <button className="navbar-icon-btn" onClick={() => setIsOpen(true)} title="Korpa" style={{ position: 'relative' }}>
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
              </>
            ) : (
              <button className="navbar-icon-btn" onClick={() => navigate('/login')} title="Prijava">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      <div className={`search-overlay${searchOpen ? ' open' : ''}`} onClick={() => setSearchOpen(false)}>
        <form className="search-box" onClick={e => e.stopPropagation()} onSubmit={handleSearch}>
          <input
            autoFocus
            placeholder="Pretraži proizvode..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
          />
          <button type="submit" title="Pretraži">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>
      </div>

      {/* Drawer overlay */}
      <div className={`drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={close} />

      {/* Side Drawer */}
      <aside className={`side-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="drawer-header">
          <Link to="/" className="navbar-logo" onClick={close}>
            <span className="navbar-logo-text">MK DR1P</span>
          </Link>
          <button className="drawer-close" onClick={close} aria-label="Zatvori">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <nav className="drawer-nav">
          <Link to="/products?gender=Muski" onClick={close}>MUSKI</Link>
          <Link to="/products?gender=Zenski" onClick={close}>ZENSKI</Link>
          <Link to="/products" onClick={close}>BRENDOVI</Link>
          <Link to="/products?sort=newest" onClick={close}>NOVO</Link>
        </nav>

        <div className="drawer-divider" />

        <nav className="drawer-secondary">
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={close}>PROFIL</Link>
              <Link to="/orders" onClick={close}>PORUDZINE</Link>
              <Link to="/wishlist" onClick={close}>WISHLIST</Link>
              {isAdmin && <Link to="/admin/dashboard" onClick={close}>ADMIN</Link>}
              <button onClick={handleLogout}>ODJAVA</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={close}>PRIJAVA</Link>
              <Link to="/register" onClick={close}>REGISTRACIJA</Link>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}
