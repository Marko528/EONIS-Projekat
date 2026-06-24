import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { orderService } from '../../services/orderService'
import { useNavigate } from 'react-router-dom'
import './CartDrawer.css'

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalPrice, isOpen, setIsOpen, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (!isAuthenticated) { navigate('/login'); setIsOpen(false); return }
    try {
      const orderItems = items.map(i => ({
        productId: i.productId,
        sizeId: i.sizeId,
        quantity: i.quantity,
        price: i.price,
      }))
      const { data } = await orderService.create({ items: orderItems })
      await clearCart()
      setIsOpen(false)
      if (data.stripeUrl) {
        window.location.href = data.stripeUrl
      } else {
        navigate('/order-success', { state: { orderId: data.id } })
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Greška pri kreiranju porudžbine. Pokušajte ponovo.')
    }
  }

  return (
    <>
      <div className={`cart-overlay${isOpen ? ' open' : ''}`} onClick={() => setIsOpen(false)} />
      <div className={`cart-drawer${isOpen ? ' open' : ''}`}>
        <div className="cart-drawer-header">
          <h2>KORPA ({items.length})</h2>
          <button onClick={() => setIsOpen(false)} className="cart-close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <p className="cart-empty">Korpa je prazna.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl || 'https://placehold.co/80x107/F5F5F5/767676?text=MK'} alt={item.productName} />
                <div className="cart-item-info">
                  <span className="cart-item-brand">{item.brandName}</span>
                  <span className="cart-item-name">{item.productName}</span>
                  <span className="cart-item-size">Veličina: EU {item.sizeEu}</span>
                  <div className="cart-item-controls">
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <span className="cart-item-price">{(item.price * item.quantity).toFixed(2)} RSD</span>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>UKUPNO</span>
              <span>{totalPrice.toFixed(2)} RSD</span>
            </div>
            <button className="btn-primary cart-checkout-btn" onClick={handleCheckout}>
              NASTAVI NA PLACANJE
            </button>
          </div>
        )}
      </div>
    </>
  )
}
