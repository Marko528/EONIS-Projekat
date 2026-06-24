import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { cartService } from '../services/cartService'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); return }
    setLoading(true)
    try {
      const { data } = await cartService.getCart()
      setItems(data)
    } catch { setItems([]) }
    finally { setLoading(false) }
  }, [isAuthenticated])

  useEffect(() => { loadCart() }, [loadCart])

  const addToCart = async (product) => {
    if (!isAuthenticated) return
    try {
      const { data } = await cartService.addItem(product.productId, product.sizeId, 1)
      setItems(prev => {
        const existing = prev.find(i => i.id === data.id)
        if (existing) return prev.map(i => i.id === data.id ? data : i)
        return [...prev, data]
      })
      setIsOpen(true)
    } catch (err) {
      alert(err.response?.data?.message || 'Greška pri dodavanju u korpu.')
    }
  }

  const removeFromCart = async (cartItemId) => {
    if (!isAuthenticated) return
    try {
      await cartService.removeItem(cartItemId)
      setItems(prev => prev.filter(i => i.id !== cartItemId))
    } catch {}
  }

  const updateQuantity = async (cartItemId, quantity) => {
    if (!isAuthenticated) return
    if (quantity <= 0) { removeFromCart(cartItemId); return }
    try {
      const { data } = await cartService.updateItem(cartItemId, quantity)
      setItems(prev => prev.map(i => i.id === cartItemId ? data : i))
    } catch {}
  }

  const clearCart = async () => {
    if (!isAuthenticated) { setItems([]); return }
    try {
      await cartService.clearCart()
      setItems([])
    } catch { setItems([]) }
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, isOpen, setIsOpen, loading, reloadCart: loadCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
