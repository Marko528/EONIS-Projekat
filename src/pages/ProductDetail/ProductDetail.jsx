import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productService } from '../../services/productService'
import { reviewService } from '../../services/reviewService'
import { wishlistService } from '../../services/wishlistService'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import SizeSelector from '../../components/SizeSelector/SizeSelector'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [accordion, setAccordion] = useState(null)
  const [sizeError, setSizeError] = useState(false)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [reviewError, setReviewError] = useState('')
  const [wishlistMsg, setWishlistMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          productService.getById(id),
          reviewService.getByProduct(id),
        ])
        setProduct(pRes.data)
        setReviews(rRes.data || [])
      } catch { } finally { setLoading(false) }
    }
    load()
  }, [id])

  if (loading) return <div className="page-wrapper"><LoadingSpinner /></div>
  if (!product) return <div className="page-wrapper container"><p style={{paddingTop:96}}>Proizvod nije pronadjen.</p></div>

  const images = product.images?.length ? product.images : [product.imageUrl || 'https://placehold.co/600x800/F5F5F5/767676?text=MK+DR1P']

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return }
    setSizeError(false)
    addToCart({
      productId: product.id,
      productName: product.name,
      brandName: product.brand?.name ?? product.brand ?? product.brandName,
      imageUrl: images[0],
      price: product.price,
      sizeId: selectedSize.id,
      sizeEU: selectedSize.eu,
    })
  }

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) { setWishlistMsg('Prijavite se da dodate u wishlist.'); return }
    try {
      await wishlistService.add(product.id)
      setWishlistMsg('Dodano u wishlist!')
    } catch { setWishlistMsg('Greška pri dodavanju.') }
    setTimeout(() => setWishlistMsg(''), 3000)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { setReviewError('Prijavite se da ostavite recenziju.'); return }
    if (!review.comment.trim()) { setReviewError('Komentar ne moze biti prazan.'); return }
    try {
      const { data } = await reviewService.create({ productId: id, ...review })
      setReviews(prev => [data, ...prev])
      setReview({ rating: 5, comment: '' })
      setReviewError('')
    } catch { setReviewError('Greška pri slanju recenzije.') }
  }

  return (
    <div className="product-detail page-wrapper">
      <div className="product-detail-inner container">
        <div className="product-gallery">
          <div className="gallery-main">
            <img src={images[activeImage]} alt={product.name} />
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, i) => (
                <img key={i} src={img} alt="" className={activeImage === i ? 'active' : ''} onClick={() => setActiveImage(i)} />
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <Link to={`/products?brand=${product.brand?.name ?? product.brand ?? product.brandName}`} className="product-brand-link">
            {product.brand?.name ?? product.brand ?? product.brandName}
          </Link>
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">{Number(product.price).toFixed(2)} RSD</p>
          <hr className="product-divider" />

          <p className="size-label">IZABERITE VELIČINU:</p>
          <SizeSelector
            sizes={[36,37,38,39,40,41,42,43,44,45,46,47,48].map(eu => {
              const found = product.sizes?.find(s => Number(s.eu) === eu)
              return found ? found : { id: null, eu: String(eu), stock: 0 }
            })}
            selected={selectedSize?.id}
            onSelect={(s) => { setSelectedSize(s); setSizeError(false) }}
          />
          {sizeError && <p className="error-text">Molimo izaberite veličinu.</p>}

          <div className="product-actions">
            <button className="btn-primary product-cta" onClick={handleAddToCart}>DODAJ U KORPU</button>
            <button className="btn-secondary product-cta" onClick={handleAddToWishlist}>DODAJ U WISHLIST</button>
            {wishlistMsg && <p className="wishlist-msg">{wishlistMsg}</p>}
          </div>

          <hr className="product-divider" />

          <div className="accordion">
            <div className="accordion-item">
              <button className="accordion-header" onClick={() => setAccordion(accordion === 'desc' ? null : 'desc')}>
                <span>OPIS PROIZVODA</span><span>{accordion === 'desc' ? '−' : '+'}</span>
              </button>
              {accordion === 'desc' && <div className="accordion-body">{product.description || 'Nema opisa.'}</div>}
            </div>
            <div className="accordion-item">
              <button className="accordion-header" onClick={() => setAccordion(accordion === 'ship' ? null : 'ship')}>
                <span>DOSTAVA I POVRAT</span><span>{accordion === 'ship' ? '−' : '+'}</span>
              </button>
              {accordion === 'ship' && (
                <div className="accordion-body">
                  <p>Besplatna dostava za porudžbine iznad 5000 RSD.</p>
                  <p>Povrat unutar 30 dana od kupovine.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-section container">
        <h2 className="reviews-title">RECENZIJE</h2>
        <form className="review-form" onSubmit={handleSubmitReview}>
          <div className="review-rating">
            <label>Ocjena:</label>
            <select value={review.rating} onChange={e => setReview(r => ({ ...r, rating: +e.target.value }))}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>
          <textarea
            className="review-textarea"
            placeholder="Vaš komentar..."
            value={review.comment}
            onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
            rows={3}
          />
          {reviewError && <p className="error-text">{reviewError}</p>}
          <button type="submit" className="btn-primary">POŠALJI RECENZIJU</button>
        </form>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">Nema recenzija za ovaj proizvod.</p>
          ) : reviews.map((r, i) => (
            <div key={i} className="review-item">
              <div className="review-header">
                <span className="review-author">{r.userName || r.user?.name || 'Korisnik'}</span>
                <span className="review-rating-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
