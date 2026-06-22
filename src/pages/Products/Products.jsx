import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import Pagination from '../../components/Pagination/Pagination'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { productService } from '../../services/productService'
import './Products.css'

const CATEGORIES = ['Lifestyle', 'Running', 'Basketball', 'Skateboarding']
const GENDERS = ['Muski', 'Zenski', 'Unisex']
const EU_SIZES = [38, 39, 40, 41, 42, 43, 44, 45, 46, 47]
const BRANDS = ['Nike', 'Adidas', 'New Balance', 'Jordan', 'Puma', 'Converse', 'Vans', 'Reebok']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Najnovije' },
  { value: 'popular', label: 'Najpopularnije' },
  { value: 'price_asc', label: 'Cena: niska → visoka' },
  { value: 'price_desc', label: 'Cena: visoka → niska' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [filters, setFilters] = useState({
    brands: searchParams.get('brand') ? [searchParams.get('brand')] : [],
    categories: [],
    gender: searchParams.get('gender') || '',
    sizes: [],
    minPrice: '',
    maxPrice: '',
  })
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(1)
  const PER_PAGE = 9

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: PER_PAGE,
        sort,
        ...(filters.brands.length && { brand: filters.brands.join(',') }),
        ...(filters.categories.length && { category: filters.categories.join(',') }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.sizes.length && { sizes: filters.sizes.join(',') }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      }
      const { data } = await productService.getAll(params)
      const all = data.products || data || []
      const inStock = all.filter(p => !p.sizes?.length || p.sizes.some(s => s.stock > 0))
      setProducts(inStock)
      setTotal(data.total || inStock.length)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [page, sort, filters])

  useEffect(() => { load() }, [load])

  const toggleBrand = (b) => setFilters(f => ({
    ...f, brands: f.brands.includes(b) ? f.brands.filter(x => x !== b) : [...f.brands, b]
  }))
  const toggleCategory = (c) => setFilters(f => ({
    ...f, categories: f.categories.includes(c) ? f.categories.filter(x => x !== c) : [...f.categories, c]
  }))
  const toggleSize = (s) => setFilters(f => ({
    ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s]
  }))
  const clearFilters = () => setFilters({ brands: [], categories: [], gender: '', sizes: [], minPrice: '', maxPrice: '' })

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="products-page page-wrapper">
      <div className="products-layout container">
        <button className="mobile-filter-toggle" onClick={() => setFiltersOpen(true)}>
          FILTERI
        </button>
        <aside className={`filters-sidebar${filtersOpen ? ' open' : ''}`}>
          <div className="filters-header">
            <span className="filters-title">FILTERI</span>
            <button className="filters-close" onClick={() => setFiltersOpen(false)}>✕</button>
          </div>

          <div className="filter-group">
            <h4 className="filter-label">BREND</h4>
            {BRANDS.map(b => (
              <label key={b} className="filter-checkbox">
                <input type="checkbox" checked={filters.brands.includes(b)} onChange={() => toggleBrand(b)} />
                <span>{b}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4 className="filter-label">KATEGORIJA</h4>
            {CATEGORIES.map(c => (
              <label key={c} className="filter-checkbox">
                <input type="checkbox" checked={filters.categories.includes(c)} onChange={() => toggleCategory(c)} />
                <span>{c}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4 className="filter-label">POL</h4>
            {GENDERS.map(g => (
              <label key={g} className="filter-radio">
                <input type="radio" name="gender" value={g} checked={filters.gender === g} onChange={() => setFilters(f => ({ ...f, gender: g }))} />
                <span>{g}</span>
              </label>
            ))}
            <label className="filter-radio">
              <input type="radio" name="gender" value="" checked={filters.gender === ''} onChange={() => setFilters(f => ({ ...f, gender: '' }))} />
              <span>Svi</span>
            </label>
          </div>

          <div className="filter-group">
            <h4 className="filter-label">VELICINA (EU)</h4>
            <div className="size-filter-grid">
              {EU_SIZES.map(s => (
                <button key={s} className={`size-filter-btn${filters.sizes.includes(s) ? ' active' : ''}`} onClick={() => toggleSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-label">CENA (KM)</h4>
            <div className="price-range">
              <input className="form-input" type="number" placeholder="Min" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
              <span>—</span>
              <input className="form-input" type="number" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn-primary" onClick={() => { setPage(1); setFiltersOpen(false) }}>PRIMENI FILTERE</button>
            <button className="btn-secondary" onClick={clearFilters}>OCISTI</button>
          </div>
        </aside>

        <main className="products-main">
          <div className="products-toolbar">
            <span className="products-count">{total} proizvoda</span>
            <select className="sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {loading ? <LoadingSpinner /> : (
            <>
              <div className="products-grid">
                {products.length === 0
                  ? <p className="no-products">Nema proizvoda za izabrane filtere.</p>
                  : products.map(p => <ProductCard key={p.id} product={p} />)
                }
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
