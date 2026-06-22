import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { productService } from '../../services/productService'
import './Home.css'

const BRANDS = ['Nike', 'Adidas', 'New Balance', 'Jordan', 'Puma', 'Converse', 'Vans', 'Reebok']

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const [r1, r2] = await Promise.all([
          productService.getAll({ sort: 'newest', limit: 4 }),
          productService.getAll({ sort: 'popular', limit: 4 }),
        ])
        setNewArrivals(r1.data.products || r1.data || [])
        setTrending(r2.data.products || r2.data || [])
      } catch {
        setNewArrivals([])
        setTrending([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <span className="hero-label">NEW ARRIVALS</span>
          <h1 className="hero-title">MK DR1P</h1>
          <Link to="/products" className="btn-primary">SHOP NOW</Link>
        </div>
      </section>

      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">NEW ARRIVALS</h2>
          <Link to="/products?sort=newest" className="section-link">VIEW ALL &rarr;</Link>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="product-grid">
            {newArrivals.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <section className="brands-section container">
        <h2 className="section-title">SHOP BY BRAND</h2>
        <div className="brands-scroll">
          {BRANDS.map(b => (
            <button key={b} className="brand-btn" onClick={() => navigate(`/products?brand=${b}`)}>
              {b}
            </button>
          ))}
        </div>
      </section>

      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">TRENDING NOW</h2>
          <Link to="/products?sort=popular" className="section-link">VIEW ALL &rarr;</Link>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="product-grid">
            {trending.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
