import './SizeSelector.css'

export default function SizeSelector({ sizes = [], selected, onSelect }) {
  return (
    <div className="size-selector">
      {sizes.map(size => (
        <button
          key={size.eu}
          className={`size-btn${selected === size.id ? ' selected' : ''}${size.stock === 0 ? ' disabled' : ''}`}
          onClick={() => size.stock > 0 && size.id && onSelect(size)}
          disabled={size.stock === 0}
          title={size.stock === 0 ? 'Nema na stanju' : ''}
        >
          {size.eu}
        </button>
      ))}
    </div>
  )
}
