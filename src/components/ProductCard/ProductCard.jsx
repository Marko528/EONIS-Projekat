import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleQuickAdd = (e) => {
    e.preventDefault()
    const firstSize = product.sizes?.find(s => s.stock > 0)
    if (!firstSize) return
    addToCart({
      productId: product.id,
      productName: product.name,
      brandName: product.brand?.name ?? product.brand,
      imageUrl: product.imageUrl || product.images?.[0],
      price: product.price,
      sizeId: firstSize.id,
      sizeEU: firstSize.eu,
    })
  }

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image-wrap">
        <img
          src={product.imageUrl || product.images?.[0] || 'https://placehold.co/400x533/F5F5F5/767676?text=MK+DR1P'}
          alt={product.name}
          className="product-card-image"
        />
        <button className="quick-add-btn" onClick={handleQuickAdd}>
          QUICK ADD
        </button>
      </div>
      <div className="product-card-info">
        <span className="product-card-brand">{product.brand?.name ?? product.brand ?? product.brandName}</span>
        <span className="product-card-name">{product.name}</span>
        <span className="product-card-price">{Number(product.price).toFixed(2)} RSD</span>
      </div>
    </Link>
  )
}
