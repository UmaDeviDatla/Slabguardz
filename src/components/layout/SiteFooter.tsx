import { Link } from 'react-router-dom'
import { Mail, ArrowRight } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="premium-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <img src="/slabguardz_logo.png" alt="SlabGuardz Logo" />
          <p>For collectors who keep the details.</p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a href="#" aria-label="Youtube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                <polygon points="10 15 15 12 10 9 10 15"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Shop</h3>
          <div className="footer-links">
            <Link to="/shop">Shop All</Link>
            <Link to="/best-sellers">Best Sellers</Link>
            <Link to="/new-arrivals">New Arrivals</Link>
            <Link to="/category/pokemon-cards">Pokemon Cards</Link>
            <Link to="/category/slabguardz-protection">SlabGuardz Protection</Link>
            <Link to="/category/accessories">Accessories</Link>
          </div>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Support</h3>
          <div className="footer-links">
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/about">About</Link>
            <Link to="/account">Account</Link>
          </div>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Stay in the loop</h3>
          <p>Subscribe for updates on new drops and exclusive offers.</p>
          <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <Mail className="newsletter-icon" />
            <input type="email" placeholder="Email address" required />
            <button type="submit" aria-label="Subscribe"><ArrowRight /></button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 SlabGuardz. All rights reserved.</p>
        <p>Secure payments via Razorpay · UPI · Cards</p>
      </div>
    </footer>
  )
}
