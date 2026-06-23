import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <span className="footer-logo">MK DR1P</span>
          <p>Premium patike. Ekskluzivni stilovi.</p>
        </div>
        <div className="footer-col">
          <h4>SHOP</h4>
          <Link to="/products?gender=Muški">Muški</Link>
          <Link to="/products?gender=Ženski">Ženski</Link>
          <Link to="/products">Svi proizvodi</Link>
        </div>
        <div className="footer-col">
          <h4>NALOG</h4>
          <Link to="/profile">Profil</Link>
          <Link to="/orders">Porudžbine</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
        <div className="footer-col">
          <h4>INFO</h4>
          <a href="#">O nama</a>
          <a href="#">Dostava i povrat</a>
          <a href="#">Kontakt</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MK DR1P. Sva prava zadrzana.</p>
      </div>
    </footer>
  )
}
