import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <span className="footer-mark">SLABGUARDZ</span>
        <p>For collectors who keep the details.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/faq">FAQ</Link>
      </nav>
    </footer>
  )
}
