import { ChevronDown, Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { navigationItems, type NavigationItem } from '../../data/navigation'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'

export function SiteHeader() {
  const { itemCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const shopMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsShopMenuOpen(false)
        setIsMobileSearchOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
        setIsShopMenuOpen(false)
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
      setIsMobileSearchOpen(false)
    } else {
      navigate('/shop')
    }
  }

  const [istTime, setIstTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      setIstTime(formatter.format(now).toUpperCase())
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const shopItem = navigationItems[0]
  const primaryItems = navigationItems.slice(1)

  return (
    <header className="site-header-wrap">
      <div className="announcement-bar">
        <span>Free India-wide express shipping on orders over ₹1,499 · 100% Authentic Collectibles</span>
        {istTime && <span className="header-ist-clock">IST {istTime}</span>}
      </div>
      <div className="site-header">
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label="Open navigation"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={22} strokeWidth={1.8} />
        </button>

        <Link className="wordmark" to="/" aria-label="SlabGuardz home">
          <img className="site-logo" src="/slabguardz_logo.png" alt="SlabGuardz" />
        </Link>

        {/* Desktop Search Bar */}
        <form className="header-search" role="search" onSubmit={handleSearchSubmit}>
          <button className="header-search-submit" type="submit" aria-label="Search products">
            <Search size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search cards, slabs, sleeves and accessories..."
            aria-label="Search products"
          />
        </form>

        <div className="header-actions">
          {/* Mobile search toggle */}
          <button
            className="mobile-search-toggle"
            type="button"
            aria-label="Open search"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search size={20} strokeWidth={1.8} />
          </button>

          {/* Account */}
          <Link to="/account" aria-label="Account" className="header-action-btn">
            <UserRound size={20} strokeWidth={1.8} />
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} saved` : ''}`} className="header-action-btn">
            <Heart size={20} strokeWidth={1.8} />
            {wishlistCount > 0 && (
              <motion.span
                className="wishlist-count"
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                key={wishlistCount}
              >
                {wishlistCount}
              </motion.span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" aria-label="Shopping cart" className="header-action-btn header-cart-btn">
            <ShoppingBag size={20} strokeWidth={1.8} />
            {itemCount > 0 && (
              <motion.span
                className="cart-count"
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                key={itemCount}
              >
                {itemCount}
              </motion.span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            className="mobile-search-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSearchSubmit}>
              <Search size={18} strokeWidth={1.8} />
              <input
                type="search"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cards, slabs, accessories..."
              />
              <button type="button" onClick={() => setIsMobileSearchOpen(false)}>
                <X size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Primary Navigation */}
      <nav className="primary-nav" aria-label="Primary navigation">
        <div className="primary-nav-shop" ref={shopMenuRef}>
          <div className="primary-nav-link-group">
            <NavLink to={shopItem.to} onClick={() => setIsShopMenuOpen(false)}>
              {shopItem.label}
            </NavLink>
            <button
              type="button"
              className="nav-chevron"
              aria-label="Toggle Shop menu"
              aria-expanded={isShopMenuOpen}
              onClick={() => setIsShopMenuOpen((isOpen) => !isOpen)}
            >
              <ChevronDown
                size={14}
                strokeWidth={1.8}
                style={{
                  transform: isShopMenuOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
          </div>
          <AnimatePresence>
            {isShopMenuOpen && (
              <DesktopShopMenu
                items={shopItem.children ?? []}
                onNavigate={() => setIsShopMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
        {primaryItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileNavigation
            items={navigationItems}
            search={search}
            setSearch={setSearch}
            onSearchSubmit={handleSearchSubmit}
            onClose={() => setIsMobileMenuOpen(false)}
            wishlistCount={wishlistCount}
            itemCount={itemCount}
          />
        )}
      </AnimatePresence>
    </header>
  )
}

function DesktopShopMenu({ items, onNavigate }: { items: NavigationItem[]; onNavigate: () => void }) {
  return (
    <motion.div
      className="desktop-shop-menu"
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
    >
      <p className="eyebrow">Browse by Collection</p>
      <div className="desktop-shop-links">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={onNavigate}>
            {item.label}
          </NavLink>
        ))}
      </div>
    </motion.div>
  )
}

type MobileNavigationProps = {
  items: NavigationItem[]
  search: string
  setSearch: (value: string) => void
  onSearchSubmit: (e: React.FormEvent) => void
  onClose: () => void
  wishlistCount: number
  itemCount: number
}

function MobileNavigation({
  items,
  search,
  setSearch,
  onSearchSubmit,
  onClose,
  wishlistCount,
  itemCount,
}: MobileNavigationProps) {
  return (
    <motion.div
      className="mobile-navigation-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button className="mobile-navigation-backdrop" type="button" aria-label="Close navigation" onClick={onClose} />
      <motion.aside
        className="mobile-navigation"
        aria-label="Mobile navigation"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      >
        <div className="mobile-navigation-header">
          <span className="wordmark">
            <img className="site-logo" src="/slabguardz_logo.png" alt="SlabGuardz" />
          </span>
          <button type="button" aria-label="Close navigation" onClick={onClose}>
            <X size={22} strokeWidth={1.8} />
          </button>
        </div>

        {/* Search inside mobile drawer */}
        <form className="mobile-drawer-search" onSubmit={(e) => { onSearchSubmit(e); onClose(); }}>
          <Search size={18} strokeWidth={1.8} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards, slabs, etc..."
          />
        </form>

        <nav className="mobile-navigation-links">
          {items.map((item) => (
            <div key={item.to} className="mobile-nav-group">
              <NavLink to={item.to} onClick={onClose} className="mobile-nav-parent">
                {item.label}
              </NavLink>
              {item.children && (
                <div className="mobile-subnav">
                  {item.children.slice(1).map((child) => (
                    <NavLink key={child.to} to={child.to} onClick={onClose}>
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="mobile-navigation-footer">
          <div className="mobile-nav-shortcuts">
            <Link to="/account" onClick={onClose} className="mobile-nav-shortcut">
              <UserRound size={18} />
              <span>Account</span>
            </Link>
            <Link to="/wishlist" onClick={onClose} className="mobile-nav-shortcut">
              <Heart size={18} />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
            <Link to="/cart" onClick={onClose} className="mobile-nav-shortcut">
              <ShoppingBag size={18} />
              <span>Cart ({itemCount})</span>
            </Link>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  )
}
