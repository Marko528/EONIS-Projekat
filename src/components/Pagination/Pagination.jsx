import './Pagination.css'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >&#8592;</button>
      {pages.map(p => (
        <button
          key={p}
          className={`pagination-btn${p === currentPage ? ' active' : ''}`}
          onClick={() => onPageChange(p)}
        >{p}</button>
      ))}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >&#8594;</button>
    </div>
  )
}
