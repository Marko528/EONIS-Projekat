import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'mkdr1p_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.productId === product.productId && i.sizeId === product.sizeId
      )
      if (existing) {
        return prev.map(i =>
          i.productId === product.productId && i.sizeId === product.sizeId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsOpen(true)
  }

  const removeFromCart = (productId, sizeId) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.sizeId === sizeId)))
  }

  const updateQuantity = (productId, sizeId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId, sizeId); return }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.sizeId === sizeId ? { ...i, quantity } : i
      )
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, isOpen, setIsOpen
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
