import { useState, useEffect } from 'react'
import { orderService } from '../../../services/orderService'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import '../Dashboard/Dashboard.css'

const STATUSES = ['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED']

export default function OrdersManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  useEffect(() => {
    setLoading(true)
    orderService.getAll({ page, limit: PER_PAGE, status: statusFilter || undefined })
      .then(r => setOrders(r.data?.orders || r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [page, statusFilter])

  const handleStatusChange = async (id, status) => {
    try {
      await orderService.updateStatus(id, status)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    } catch {}
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h1 className="admin-page-title">PORUDŽBINE</h1>
        <select className="sort-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
          <option value="">Svi statusi</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>KUPAC</th><th>DATUM</th><th>IZNOS</th><th>STATUS</th></tr></thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="table-empty">Nema porudžbina.</td></tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.userName || o.user?.name || '—'}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString('hr-HR')}</td>
                  <td>{Number(o.total || o.totalAmount || 0).toFixed(2)} RSD</td>
                  <td>
                    <select
                      className="status-select"
                      value={o.status}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="admin-pagination">
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>&#8592;</button>
            <span>{page}</span>
            <button onClick={() => setPage(p=>p+1)} disabled={orders.length < PER_PAGE}>&#8594;</button>
          </div>
        </div>
      )}
    </div>
  )
}
