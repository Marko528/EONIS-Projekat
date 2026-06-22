import { useState, useEffect } from 'react'
import api from '../../../services/api'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import '../Dashboard/Dashboard.css'

export default function Transactions() {
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  useEffect(() => {
    setLoading(true)
    api.get('/admin/transactions', { params: { page, limit: PER_PAGE } })
      .then(r => setTxns(r.data?.transactions || r.data || []))
      .catch(() => setTxns([]))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div>
      <h1 className="admin-page-title">TRANSAKCIJE</h1>
      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>DATUM</th><th>KUPAC</th><th>PROIZVODI</th><th>IZNOS</th><th>STRIPE ID</th></tr></thead>
            <tbody>
              {txns.length === 0 ? (
                <tr><td colSpan={5} className="table-empty">Nema transakcija.</td></tr>
              ) : txns.map((t, i) => (
                <tr key={i}>
                  <td>{new Date(t.createdAt || t.date).toLocaleDateString('hr-HR')}</td>
                  <td>{t.customerName || t.customer || '—'}</td>
                  <td>{t.products || t.itemCount || '—'}</td>
                  <td>{Number(t.amount || 0).toFixed(2)} KM</td>
                  <td><code style={{fontSize:11}}>{t.stripeId || t.stripe_id || '—'}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="admin-pagination">
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>&#8592;</button>
            <span>{page}</span>
            <button onClick={() => setPage(p=>p+1)} disabled={txns.length < PER_PAGE}>&#8594;</button>
          </div>
        </div>
      )}
    </div>
  )
}
