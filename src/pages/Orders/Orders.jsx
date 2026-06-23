import { useState, useEffect } from 'react'
import { orderService } from '../../services/orderService'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import './Orders.css'

const STATUS_LABELS = {
  PENDING: 'Na cekanju',
  CONFIRMED: 'Potvrdjeno',
  SHIPPED: 'Poslato',
  DELIVERED: 'Dostavljeno',
  CANCELLED: 'Otkazano',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    orderService.getMyOrders()
      .then(r => setOrders(r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="orders-page page-wrapper">
      <div className="container">
        <h1 className="page-heading">MOJE PORUDŽBINE</h1>
        {loading ? <LoadingSpinner /> : orders.length === 0 ? (
          <p className="no-orders">Nemate jos nijednu porudžbinu.</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-summary" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="order-meta">
                    <span className="order-id">#{order.id}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('hr-HR')}</span>
                  </div>
                  <div className="order-meta">
                    <span className={`order-status status-${(order.status || '').toLowerCase()}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <span className="order-total">{Number(order.total || order.totalAmount).toFixed(2)} RSD</span>
                  </div>
                  <span className="order-expand">{expanded === order.id ? '−' : '+'}</span>
                </div>
                {expanded === order.id && (
                  <div className="order-details">
                    {(order.items || []).map((item, i) => (
                      <div key={i} className="order-item">
                        <img src={item.imageUrl || 'https://placehold.co/60x80/F5F5F5/767676?text=MK'} alt={item.productName} />
                        <div>
                          <p className="order-item-name">{item.productName || item.product?.name}</p>
                          <p className="order-item-meta">EU {item.sizeEU || item.size?.eu} · Kol: {item.quantity}</p>
                          <p className="order-item-price">{Number(item.price).toFixed(2)} RSD</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
