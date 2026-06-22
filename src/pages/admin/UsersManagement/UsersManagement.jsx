import { useState, useEffect } from 'react'
import api from '../../../services/api'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import '../Dashboard/Dashboard.css'

export default function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  useEffect(() => {
    setLoading(true)
    api.get('/admin/users', { params: { page, limit: PER_PAGE } })
      .then(r => setUsers(r.data?.users || r.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div>
      <h1 className="admin-page-title">KORISNICI</h1>
      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>IME</th><th>EMAIL</th><th>ROLA</th><th>REGISTROVAN</th></tr></thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} className="table-empty">Nema korisnika.</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="status-badge">{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString('hr-HR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="admin-pagination">
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>&#8592;</button>
            <span>{page}</span>
            <button onClick={() => setPage(p=>p+1)} disabled={users.length < PER_PAGE}>&#8594;</button>
          </div>
        </div>
      )}
    </div>
  )
}
