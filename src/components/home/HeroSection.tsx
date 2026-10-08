import {
  ArrowUpRight,
  ShieldCheck,
  Check,
  ShoppingBag,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ButtonLink } from '../ui/Button'
import { useProductCatalogState } from '../../hooks/useProductCatalogState'
import { PriceDisplay } from '../ui/PriceDisplay'
import { useCart } from '../../hooks/useCart'

const heroQuickFilters = [
  { label: 'All Products', to: '/shop' },
  { label: 'PSA Cases', to: '/category/slabguardz-protection' },
  { label: 'Pokémon Cards', to: '/category/pokemon-cards' },
  { label: 'Accessories', to: '/category/accessories' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Best Sellers', to: '/best-sellers' },
]

const heroTrustSignals = [
  { label: 'Impact-Absorbing TPU', desc: 'Drop-tested corner armor' },
  { label: 'Exact Precision Tolerances', desc: 'Snug fit for PSA & CGC' },
  { label: 'Zero Scratch Bezel', desc: 'Protects acrylic slab surfaces' },
  { label: 'Pan-India Express', desc: 'Reliable doorstep dispatch' },
]

function getProductDescription(product: { description?: string; category: string; name: string }) {
  if (product.description && product.description.trim()) {
    const plain = product.description.replace(/<[^>]*>?/gm, '').trim()
    if (plain.length > 5) return plain
  }
  if (product.category === 'pokemon-cards') {
    return 'Authenticated PSA graded Pokémon collectible single, preserved in collector-grade condition.'
  }
  if (product.category === 'slabguardz-protection') {
    return 'Precision snap-on TPU bumper case with drop-absorbing corner defense.'
  }
  return 'Premium collector display and storage solution engineered for graded cards.'
}

export function HeroSection() {
  const { products } = useProductCatalogState()
  const { addItem } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)

  // Exactly 3 products per row matching the category section
  const spotlightProducts = products.length > 0 ? products.slice(0, 3) : []

  const handleQuickAdd = (product: typeof products[0]) => {
    addItem(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1600)
  }

  return (
    <section className="graded-hero" aria-label="SlabGuardz Graded Card Protection">
      {/* Fixed High-Resolution Hero Banner (Uncropped) */}
      <div className="gg-hero-banner-wrapper">
        <div className="gg-hero-banner-stage">
          <div className="gg-hero-slide">
            <Link to="/shop" className="gg-hero-slide-link" aria-label="Shop SlabGuardz Collection">
              <img
                src="/banners/banner-1.jpg"
                alt="SlabGuardz Precision Slab Armor & Grail Collection"
                className="gg-hero-banner-img"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="graded-hero-container">
        {/* Eyebrow badge */}
        <motion.div
          className="graded-hero-eyebrow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow-accent-dot" />
          <span>PRECISION PROTECTION FOR GRADED CARDS</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="graded-hero-title"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          THE ULTIMATE CASE FOR GRADED CARDS.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="graded-hero-subtitle"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Engineered bumper cases and collector accessories tailored for PSA, CGC, and modern trading card slabs. Armor-grade TPU defense with zero obstruction.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="graded-hero-cta"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ButtonLink to="/shop" variant="primary" className="btn-graded-primary">
            Shop All Products <ArrowUpRight size={17} />
          </ButtonLink>
          <ButtonLink to="/category/slabguardz-protection" variant="secondary" className="btn-graded-secondary">
            <ShieldCheck size={17} /> Explore Protection
          </ButtonLink>
        </motion.div>

        {/* GradedGuard-style Quick Category Filter Bar */}
        <motion.div
          className="graded-filter-bar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
        >
          {heroQuickFilters.map((filter) => (
            <Link key={filter.label} to={filter.to} className="graded-filter-pill">
              {filter.label}
            </Link>
          ))}
        </motion.div>

        {/* Live Product Spotlight Showcase (Hostinger API Products) — 3 products per row */}
        <div className="graded-spotlight-section">
          <div className="graded-spotlight-header">
            <div>
              <p className="spotlight-kicker">FEATURED DROPS</p>
              <h2 className="spotlight-title">Precision Cases & Collector Grails</h2>
            </div>
            <Link to="/shop" className="spotlight-view-all">
              <span>View All ({products.length || 3})</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="graded-spotlight-grid">
            {spotlightProducts.length > 0 ? (
              spotlightProducts.map((product) => {
                const isAdded = addedId === product.id
                return (
                  <motion.div
                    key={product.id}
                    className="graded-product-card"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="graded-card-img-wrap">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="eager"
                          className="graded-card-img"
                        />
                      </Link>
                      <span className="graded-badge-pill">
                        {product.badge || (product.stockStatus === 'in-stock' ? 'IN STOCK' : 'VERIFIED')}
                      </span>
                    </div>
                    <div className="graded-card-body">
                      <span className="graded-card-cat">{product.category.replaceAll('-', ' ')}</span>
                      <h3 className="graded-card-name">
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                      </h3>
                      <p className="graded-card-desc">
                        {getProductDescription(product)}
                      </p>
                      <div className="graded-card-footer">
                        <div className="graded-card-price-wrap">
                          <PriceDisplay
                            price={product.price}
                            currencyCode={product.currencyCode}
                            compareAtPrice={product.compareAtPrice}
                          />
                        </div>
                        <button
                          type="button"
                          className={`graded-card-action-btn${isAdded ? ' is-added' : ''}`}
                          onClick={() => handleQuickAdd(product)}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <span>{isAdded ? 'Added' : 'Add to Cart'}</span>
                          {isAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              // Showcase client's authentic banner photography while Hostinger loads — 3 per row
              [
                {
                  id: 'psa-gengar',
                  title: 'SlabGuardz Bumper — Crimson Flame',
                  cat: 'SLABGUARDZ PROTECTION',
                  desc: 'Precision snap-on TPU bumper cases engineered for PSA & CGC slabs.',
                  img: '/banners/banner-1.jpg',
                  price: 499,
                  badge: 'FLAGSHIP',
                },
                {
                  id: 'psa-dragonite',
                  title: 'Graded Pokémon Cards',
                  cat: 'AUTHENTIC GRAILS',
                  desc: 'Authenticated PSA & CGC vintage holos, modern grails, and Japanese gems.',
                  img: '/banners/banner-2.jpg',
                  price: 1499,
                  badge: 'VERIFIED',
                },
                {
                  id: 'psa-mew',
                  title: 'Collector Accessories',
                  cat: 'GEAR & DISPLAY',
                  desc: 'Precision card sleeves, acrylic stands, and travel protection kits.',
                  img: '/banners/banner-3.jpg',
                  price: 799,
                  badge: 'ESSENTIALS',
                },
              ].map((item) => (
                <motion.div
                  key={item.id}
                  className="graded-product-card"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="graded-card-img-wrap">
                    <Link to="/category/slabguardz-protection">
                      <img
                        src={item.img}
                        alt={item.title}
                        loading="eager"
                        className="graded-card-img"
                      />
                    </Link>
                    <span className="graded-badge-pill">{item.badge}</span>
                  </div>
                  <div className="graded-card-body">
                    <span className="graded-card-cat">{item.cat}</span>
                    <h3 className="graded-card-name">
                      <Link to="/category/slabguardz-protection">{item.title}</Link>
                    </h3>
                    <p className="graded-card-desc">{item.desc}</p>
                    <div className="graded-card-footer">
                      <span className="graded-price">₹{item.price}</span>
                      <Link to="/shop" className="graded-card-action-btn">
                        <span>Shop Now</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Technical Trust Signals */}
        <div className="graded-trust-strip">
          {heroTrustSignals.map((signal) => (
            <div key={signal.label} className="graded-trust-item">
              <span className="graded-trust-icon">✦</span>
              <div>
                <strong>{signal.label}</strong>
                <p>{signal.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
