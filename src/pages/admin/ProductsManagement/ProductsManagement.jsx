import { useState, useEffect } from 'react'
import { productService, adminService } from '../../../services/productService'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import '../Dashboard/Dashboard.css'

const EMPTY_PRODUCT = { name: '', brandId: '', price: '', categoryId: '', gender: '', description: '', imageUrl: '' }
const GENDERS = ['Muski', 'Zenski']
const EU_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]

export default function ProductsManagement() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [sizes, setSizes] = useState([])
  const [newSize, setNewSize] = useState({ eu: '', stock: '' })
  const [images, setImages] = useState([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const PER_PAGE = 10

  useEffect(() => {
    adminService.getBrands().then(r => setBrands(r.data || [])).catch(() => {})
    adminService.getCategories().then(r => setCategories(r.data || [])).catch(() => {})
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await productService.getAll({ page, limit: PER_PAGE, search })
      setProducts(data.products || data || [])
      setTotal(data.total || (data.products || data || []).length)
    } catch { setProducts([]) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, search])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_PRODUCT)
    setSizes([])
    setNewSize({ eu: '', stock: '' })
    setImages([])
    setNewImageUrl('')
    setModalOpen(true)
  }

  const openEdit = async (p) => {
    setEditing(p)
    setForm({
      name: p.name,
      brandId: p.brand?.id ?? p.brandId ?? '',
      price: p.price,
      categoryId: p.category?.id ?? p.categoryId ?? '',
      gender: p.gender?.name ?? p.gender ?? '',
      description: p.description || '',
      imageUrl: p.imageUrl || '',
    })
    setSizes(p.sizes?.map(s => ({ id: s.id, eu: s.eu, stock: s.stock })) || [])
    setNewSize({ eu: '', stock: '' })
    setNewImageUrl('')
    try {
      const { data } = await adminService.getProductImages(p.id)
      setImages(data || [])
    } catch { setImages([]) }
    setModalOpen(true)
  }

  const handleAddSize = () => {
    const eu = Number(newSize.eu)
    const stock = Number(newSize.stock)
    if (!eu || stock < 0) return
    if (sizes.find(s => s.eu === eu)) return
    setSizes(prev => [...prev, { eu, stock, _tempId: Date.now() }])
    setNewSize({ eu: '', stock: '' })
  }

  const handleRemoveSize = (eu) => {
    setSizes(prev => prev.filter(s => s.eu !== eu))
  }

  const handleAddImageUrl = () => {
    const url = newImageUrl.trim()
    if (!url) return
    if (editing) {
      adminService.addProductImage(editing.id, { imageUrl: url })
        .then(r => { setImages(prev => [...prev, r.data]); setNewImageUrl('') })
        .catch(() => {})
    } else {
      setImages(prev => [...prev, { _tempId: Date.now(), imageUrl: url }])
      setNewImageUrl('')
    }
  }

  const handleDeleteImage = (img) => {
    if (editing) {
      adminService.deleteProductImage(editing.id, img.id)
        .then(() => setImages(prev => prev.filter(i => i.id !== img.id)))
        .catch(() => {})
    } else {
      setImages(prev => prev.filter(i => i._tempId !== img._tempId))
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, sizes: sizes.map(s => ({ eu: s.eu, stock: s.stock })) }
      if (editing) {
        await productService.update(editing.id, payload)
        setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...form } : p))
      } else {
        const { data } = await productService.create(payload)
        const productId = data.id ?? data.product?.id
        for (const img of images) {
          await adminService.addProductImage(productId, { imageUrl: img.imageUrl })
        }
        load()
      }
      setModalOpen(false)
    } catch {} finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await productService.delete(id); setProducts(prev => prev.filter(p => p.id !== id)); setDeleteConfirm(null) } catch {}
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  const availableEuSizes = EU_SIZES.filter(eu => !sizes.find(s => s.eu === eu))

  return (
    <div className="admin-products">
      <div className="admin-toolbar">
        <h1 className="admin-page-title">PROIZVODI</h1>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <input className="admin-search" placeholder="Pretraga..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          <button className="btn-primary" onClick={openCreate}>+ NOVI PROIZVOD</button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>SLIKA</th><th>NAZIV</th><th>BREND</th><th>CENA</th><th>AKCIJE</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td><img src={p.imageUrl || 'https://placehold.co/40x53/F5F5F5/767676?text=MK'} alt="" style={{ width: 40, height: 53, objectFit: 'cover' }} /></td>
                  <td>{p.name}</td>
                  <td>{p.brand?.name ?? p.brand}</td>
                  <td>{Number(p.price).toFixed(2)} RSD</td>
                  <td>
                    <button className="admin-action-btn" onClick={() => openEdit(p)}>Uredi</button>
                    <button className="admin-action-btn danger" onClick={() => setDeleteConfirm(p.id)}>Obrisi</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="admin-pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>&#8592;</button>
            <span>{page} / {totalPages || 1}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>&#8594;</button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <h2 className="modal-title">{editing ? 'UREDI PROIZVOD' : 'NOVI PROIZVOD'}</h2>
            <form onSubmit={handleSave} className="admin-form">

              <div className="admin-form-group">
                <label className="form-label">Naziv</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>

              <div className="admin-form-group">
                <label className="form-label">Brend</label>
                <select className="form-input" value={form.brandId} onChange={e => setForm(f => ({ ...f, brandId: e.target.value }))} required>
                  <option value="">-- Izaberite brend --</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="form-label">Kategorija</label>
                <select className="form-input" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required>
                  <option value="">-- Izaberite kategoriju --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="form-label">Pol</label>
                <select className="form-input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} required>
                  <option value="">-- Izaberite pol --</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="form-label">Cijena</label>
                <input className="form-input" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
              </div>

              <div className="admin-form-group">
                <label className="form-label">Glavna slika (URL) *</label>
                <input className="form-input" placeholder="https://..." value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} required />
              </div>

              <div className="admin-form-group">
                <label className="form-label">Opis</label>
                <textarea className="admin-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
              </div>

              <div className="admin-form-group">
                <label className="form-label">Velicine</label>
                {sizes.length > 0 && (
                  <table style={{ width: '100%', fontSize: 13, marginBottom: 8, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 600 }}>EU</th>
                        <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 600 }}>Na stanju</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {sizes.map(s => (
                        <tr key={s.eu} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '4px 8px' }}>{s.eu}</td>
                          <td style={{ padding: '4px 8px' }}>
                            <input
                              type="number"
                              min="0"
                              value={s.stock}
                              onChange={e => setSizes(prev => prev.map(x => x.eu === s.eu ? { ...x, stock: Number(e.target.value) } : x))}
                              style={{ width: 70, padding: '2px 6px', fontSize: 13, border: '1px solid var(--color-border)', borderRadius: 3 }}
                            />
                          </td>
                          <td style={{ padding: '4px 8px', textAlign: 'right' }}>
                            <button type="button" onClick={() => handleRemoveSize(s.eu)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', fontSize: 13 }}>Ukloni</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                    className="form-input"
                    style={{ flex: 1 }}
                    value={newSize.eu}
                    onChange={e => setNewSize(s => ({ ...s, eu: e.target.value }))}
                  >
                    <option value="">EU velicina</option>
                    {availableEuSizes.map(eu => <option key={eu} value={eu}>{eu}</option>)}
                  </select>
                  <input
                    className="form-input"
                    style={{ width: 90 }}
                    type="number"
                    min="0"
                    placeholder="Kolicina"
                    value={newSize.stock}
                    onChange={e => setNewSize(s => ({ ...s, stock: e.target.value }))}
                  />
                  <button type="button" className="btn-secondary" onClick={handleAddSize}>Dodaj</button>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="form-label">Dodatne slike (opciono)</label>
                {images.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    {images.map((img, i) => (
                      <div key={img.id ?? img._tempId ?? i} style={{ position: 'relative' }}>
                        <img src={img.imageUrl} alt="" style={{ width: 64, height: 85, objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img)}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 10, padding: '1px 4px' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="form-input"
                    placeholder="https://..."
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                  />
                  <button type="button" className="btn-secondary" onClick={handleAddImageUrl}>Dodaj</button>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'SNIMANJE...' : 'SACUVAJ'}</button>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>OTKAZI</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <h2 className="modal-title">POTVRDI BRISANJE</h2>
            <p style={{ fontSize: 13, color: 'var(--color-gray-text)', marginBottom: 'var(--space-4)' }}>Da li ste sigurni da zelite obrisati ovaj proizvod?</p>
            <div className="modal-actions">
              <button className="btn-primary" style={{ background: 'var(--color-error)', borderColor: 'var(--color-error)' }} onClick={() => handleDelete(deleteConfirm)}>OBRISI</button>
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>OTKAZI</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
