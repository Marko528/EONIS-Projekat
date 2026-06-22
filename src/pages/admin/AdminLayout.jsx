import { NavLink, Outlet } from 'react-router-dom'
import './admin.css'

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">Admin Panel</div>
        <NavLink to="/admin/dashboard" className={({isActive}) => `admin-nav-link${isActive ? ' active' : ''}`}>Dashboard</NavLink>
        <NavLink to="/admin/products" className={({isActive}) => `admin-nav-link${isActive ? ' active' : ''}`}>Proizvodi</NavLink>
        <NavLink to="/admin/orders" className={({isActive}) => `admin-nav-link${isActive ? ' active' : ''}`}>Porudzine</NavLink>
        <NavLink to="/admin/users" className={({isActive}) => `admin-nav-link${isActive ? ' active' : ''}`}>Korisnici</NavLink>
        <NavLink to="/admin/transactions" className={({isActive}) => `admin-nav-link${isActive ? ' active' : ''}`}>Transakcije</NavLink>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}
