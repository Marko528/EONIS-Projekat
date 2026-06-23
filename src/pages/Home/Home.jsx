import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { productService } from '../../services/productService'
import './Home.css'

const BRANDS = ['Nike', 'Adidas', 'New Balance', 'Jordan', 'Puma', 'Converse', 'Vans', 'Reebok']

const SLIDES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1800&q=80',
]

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)
  const navigate = useNavigate()
  const timerRef = useRef(null)

  const goTo = (i) => {
    setSlide(i)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 10000)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 10000)
    return () => clearInterval(timerRef.current)
  }, [])

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
        {SLIDES.map((src, i) => (
          <div
            key={i}
            className={`hero-slide${i === slide ? ' active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-label">NEW ARRIVALS</span>
          <h1 className="hero-title">MK DR1P</h1>
          <Link to="/products" className="btn-primary">SHOP NOW</Link>
        </div>
        <div className="hero-dots">
          {SLIDES.map((_, i) => (
            <button key={i} className={`hero-dot${i === slide ? ' active' : ''}`} onClick={() => goTo(i)} />
          ))}
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
