import { useState, useEffect } from 'react'
import { productService } from '../../../services/productService'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import '../Dashboard/Dashboard.css'

const EMPTY_PRODUCT = { name: '', brand: '', price: '', category: '', gender: '', description: '', imageUrl: '' }

export default function ProductsManagement() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const PER_PAGE = 10

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await productService.getAll({ page, limit: PER_PAGE, search })
      setProducts(data.products || data || [])
      setTotal(data.total || (data.products || data || []).length)
    } catch { setProducts([]) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, search])

  const openCreate = () => { setEditing(null); setForm(EMPTY_PRODUCT); setModalOpen(true) }
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, brand: p.brand||'', price: p.price, category: p.category||'', gender: p.gender||'', description: p.description||'', imageUrl: p.imageUrl||'' }); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const { data } = await productService.update(editing.id, form)
        setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...data } : p))
      } else {
        await productService.create(form)
        load()
      }
      setModalOpen(false)
    } catch {} finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await productService.delete(id); setProducts(prev => prev.filter(p => p.id !== id)); setDeleteConfirm(null) } catch {}
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="admin-products">
      <div className="admin-toolbar">
        <h1 className="admin-page-title">PROIZVODI</h1>
        <div style={{display:'flex',gap:'var(--space-2)',alignItems:'center'}}>
          <input className="admin-search" placeholder="Pretraga..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} />
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
                  <td><img src={p.imageUrl||'https://placehold.co/40x53/F5F5F5/767676?text=MK'} alt="" style={{width:40,height:53,objectFit:'cover'}} /></td>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>{Number(p.price).toFixed(2)} KM</td>
                  <td>
                    <button className="admin-action-btn" onClick={() => openEdit(p)}>Uredi</button>
                    <button className="admin-action-btn danger" onClick={() => setDeleteConfirm(p.id)}>Obrisi</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="admin-pagination">
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>&#8592;</button>
            <span>{page} / {totalPages||1}</span>
            <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages}>&#8594;</button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={e=>e.stopPropagation()}>
            <h2 className="modal-title">{editing ? 'UREDI PROIZVOD' : 'NOVI PROIZVOD'}</h2>
            <form onSubmit={handleSave} className="admin-form">
              {[['name','Naziv'],['brand','Brend'],['price','Cijena'],['category','Kategorija'],['gender','Pol'],['imageUrl','URL slike']].map(([k,l]) => (
                <div key={k} className="admin-form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} required={k==='name'||k==='price'} />
                </div>
              ))}
              <div className="admin-form-group">
                <label className="form-label">OPIS</label>
                <textarea className="admin-textarea" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={saving}>{saving?'SNIMANJE...':'SACUVAJ'}</button>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>OTKAZI</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:380}}>
            <h2 className="modal-title">POTVRDI BRISANJE</h2>
            <p style={{fontSize:13,color:'var(--color-gray-text)',marginBottom:'var(--space-4)'}}>Da li ste sigurni da zelite obrisati ovaj proizvod?</p>
            <div className="modal-actions">
              <button className="btn-primary" style={{background:'var(--color-error)',borderColor:'var(--color-error)'}} onClick={() => handleDelete(deleteConfirm)}>OBRISI</button>
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>OTKAZI</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
