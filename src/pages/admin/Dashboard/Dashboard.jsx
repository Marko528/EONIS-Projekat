import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../services/api'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').catch(() => ({ data: null })),
      api.get('/orders?limit=10').catch(() => ({ data: [] })),
    ]).then(([s, o]) => {
      setStats(s.data)
      setRecentOrders(o.data?.orders || o.data || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="dashboard">
      <h1 className="admin-page-title">DASHBOARD</h1>
      <div className="stats-grid">
        {[
          { label: 'UKUPAN PRIHOD', value: stats ? `${Number(stats.totalRevenue || 0).toFixed(2)} KM` : '—' },
          { label: 'BROJ PORUDZINA', value: stats?.totalOrders ?? '—' },
          { label: 'BROJ KORISNIKA', value: stats?.totalUsers ?? '—' },
          { label: 'NOVI KORISNICI (MESEC)', value: stats?.newUsersThisMonth ?? '—' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
          </div>
        ))}
      </div>
      <h2 className="admin-section-title">POSLED. 10 PORUDZINA</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>KUPAC</th><th>DATUM</th><th>STATUS</th><th>IZNOS</th></tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr><td colSpan={5} className="table-empty">Nema porudzina.</td></tr>
            ) : recentOrders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.userName || o.user?.name || '—'}</td>
                <td>{new Date(o.createdAt).toLocaleDateString('hr-HR')}</td>
                <td><span className={`status-badge status-${(o.status||'').toLowerCase()}`}>{o.status}</span></td>
                <td>{Number(o.total || o.totalAmount || 0).toFixed(2)} KM</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
