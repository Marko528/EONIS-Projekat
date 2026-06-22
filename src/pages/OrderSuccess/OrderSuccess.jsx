import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useEffect } from 'react'
import './OrderSuccess.css'

export default function OrderSuccess() {
  const location = useLocation()
  const { clearCart } = useCart()
  const orderId = location.state?.orderId

  useEffect(() => { clearCart() }, [])

  return (
    <div className="order-success page-wrapper">
      <div className="success-box">
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <h1>HVALA NA KUPOVINI!</h1>
        {orderId && <p className="order-number">Broj porudzine: <strong>#{orderId}</strong></p>}
        <p className="success-msg">Vasa porudzina je uspjesno primljena. Ocekujte email potvrdu.</p>
        <Link to="/products" className="btn-primary">NASTAVI SA KUPOVINOM</Link>
      </div>
    </div>
  )
}
