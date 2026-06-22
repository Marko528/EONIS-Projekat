import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { wishlistService } from '../../services/wishlistService'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import './Wishlist.css'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    wishlistService.get()
      .then(r => setItems(r.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const remove = async (productId) => {
    try {
      await wishlistService.remove(productId)
      setItems(prev => prev.filter(i => (i.productId || i.id) !== productId))
    } catch {}
  }

  return (
    <div className="wishlist-page page-wrapper">
      <div className="container">
        <h1 className="page-heading">WISHLIST</h1>
        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <div className="empty-state">
            <p>Vas wishlist je prazan.</p>
            <Link to="/products" className="btn-primary">PREGLEDAJ PROIZVODE</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map((item, i) => {
              const p = item.product || item
              const pid = item.productId || item.id
              return (
                <div key={i} className="wishlist-card">
                  <Link to={`/products/${pid}`}>
                    <img src={p.imageUrl || p.images?.[0] || 'https://placehold.co/300x400/F5F5F5/767676?text=MK'} alt={p.name} />
                  </Link>
                  <div className="wishlist-card-info">
                    <span className="brand">{p.brand || p.brandName}</span>
                    <span className="name">{p.name}</span>
                    <span className="price">{Number(p.price).toFixed(2)} KM</span>
                    <button className="remove-btn" onClick={() => remove(pid)}>UKLONI</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
