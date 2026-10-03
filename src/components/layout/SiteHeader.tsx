import { ChevronDown, Heart, Menu, Moon, Search, ShoppingBag, Sun, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { navigationItems, type NavigationItem } from '../../data/navigation'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { useTheme } from '../../hooks/useTheme'

export function SiteHeader() {
  const { itemCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsShopMenuOpen(false)
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const shopItem = navigationItems[0]
  const primaryItems = navigationItems.slice(1)

  return (
    <header className="site-header-wrap">
      <div className="announcement-bar">Free shipping on orders over ₹1,499</div>
      <div className="site-header">
        <button className="mobile-menu-toggle" type="button" aria-label="Open navigation" aria-expanded={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={21} strokeWidth={1.8} />
        </button>
        <Link className="wordmark" to="/" aria-label="SlabGuardz home">
          <img className="site-logo" src="/slabguardz_logo.png" alt="SlabGuardz" />
        </Link>
        <form className="header-search" role="search" onSubmit={(event) => { event.preventDefault(); navigate(search.trim() ? `/shop?search=${encodeURIComponent(search.trim())}` : '/shop') }}>
          <button className="header-search-submit" type="submit" aria-label="Search products"><Search size={18} strokeWidth={1.8} aria-hidden="true" /></button>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search cards, slabs and accessories" aria-label="Search products" />
        </form>
        <div className="header-actions">
          <button className="theme-toggle" type="button" aria-label={theme === 'day' ? 'Switch to dark theme' : 'Switch to light theme'} aria-pressed={theme === 'night'} onClick={toggleTheme}>
            {theme === 'day' ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
            <span>{theme === 'day' ? 'Day' : 'Night'}</span>
          </button>
          <Link to="/account" aria-label="Account">
            <UserRound size={19} strokeWidth={1.8} />
          </Link>
          <Link to="/wishlist" aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} saved` : ''}`}>
            <Heart size={19} strokeWidth={1.8} />
            <span className="wishlist-count">{wishlistCount}</span>
          </Link>
          <Link to="/cart" aria-label="Shopping cart">
            <ShoppingBag size={19} strokeWidth={1.8} />
            <span className="cart-count">{itemCount}</span>
          </Link>
        </div>
      </div>
      <nav className="primary-nav" aria-label="Primary navigation">
        <div className="primary-nav-shop">
          <div className="primary-nav-link-group">
            <NavLink to={shopItem.to} onClick={() => setIsShopMenuOpen(false)}>{shopItem.label}</NavLink>
            <button type="button" className="nav-chevron" aria-label="Toggle Shop menu" aria-expanded={isShopMenuOpen} onClick={() => setIsShopMenuOpen((isOpen) => !isOpen)}>
              <ChevronDown size={14} strokeWidth={1.8} />
            </button>
          </div>
          {isShopMenuOpen && <DesktopShopMenu items={shopItem.children ?? []} onNavigate={() => setIsShopMenuOpen(false)} />}
        </div>
        {primaryItems.map((item) => <NavLink key={item.to} to={item.to}>{item.label}</NavLink>)}
      </nav>
      {isMobileMenuOpen && <MobileNavigation items={navigationItems} onClose={() => setIsMobileMenuOpen(false)} />}
    </header>
  )
}

function DesktopShopMenu({ items, onNavigate }: { items: NavigationItem[]; onNavigate: () => void }) {
  return (
    <div className="desktop-shop-menu">
      <p className="eyebrow">Browse the collection</p>
      <div className="desktop-shop-links">
        {items.map((item) => <NavLink key={item.to} to={item.to} onClick={onNavigate}>{item.label}</NavLink>)}
      </div>
    </div>
  )
}

function MobileNavigation({ items, onClose }: { items: NavigationItem[]; onClose: () => void }) {
  return (
    <div className="mobile-navigation-layer">
      <button className="mobile-navigation-backdrop" type="button" aria-label="Close navigation" onClick={onClose} />
      <aside className="mobile-navigation" aria-label="Mobile navigation">
        <div className="mobile-navigation-header">
          <span className="wordmark"><img className="site-logo" src="/slabguardz_logo.png" alt="SlabGuardz" /></span>
          <button type="button" aria-label="Close navigation" onClick={onClose}><X size={21} strokeWidth={1.8} /></button>
        </div>
        <nav className="mobile-navigation-links">
          {items.map((item) => (
            <div key={item.to}>
              <NavLink to={item.to} onClick={onClose}>{item.label}</NavLink>
              {item.children && <div className="mobile-subnav">{item.children.slice(1).map((child) => <NavLink key={child.to} to={child.to} onClick={onClose}>{child.label}</NavLink>)}</div>}
            </div>
          ))}
        </nav>
      </aside>
    </div>
  )
}
