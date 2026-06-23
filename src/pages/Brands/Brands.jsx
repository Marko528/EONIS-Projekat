import { useNavigate } from 'react-router-dom'
import './Brands.css'

const BRANDS = [
  {
    name: 'Nike',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Adidas',
    image: 'https://images.unsplash.com/photo-1691067951700-138ca8f4841f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'New Balance',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Jordan',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Puma',
    image: 'https://images.unsplash.com/photo-1680204101400-aeac783c9d87?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Converse',
    image: 'https://images.unsplash.com/photo-1494496195158-c3becb4f2475?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Vans',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Reebok',
    image: 'https://images.unsplash.com/photo-1673557475656-d580caccefa0?auto=format&fit=crop&w=800&q=80',
  },
]

export default function Brands() {
  const navigate = useNavigate()

  return (
    <div className="brands-page page-wrapper">
      <div className="container">
        <h1 className="page-heading">BRENDOVI</h1>
        <div className="brands-cards-grid">
          {BRANDS.map(brand => (
            <div
              key={brand.name}
              className="brand-card"
              onClick={() => navigate(`/products?brand=${encodeURIComponent(brand.name)}`)}
            >
              <div className="brand-card-img" style={{ backgroundImage: `url(${brand.image})` }} />
              <div className="brand-card-overlay" />
              <span className="brand-card-name">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
