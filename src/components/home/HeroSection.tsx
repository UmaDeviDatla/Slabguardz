import { ArrowUpRight, ShieldCheck, Check, ShoppingBag } from 'lucide-react'
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

export function HeroSection() {
  const { products } = useProductCatalogState()
  const { addItem } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)

  // Use top products from Hostinger API, or fallback to authentic showcase items
  const spotlightProducts = products.length > 0 ? products.slice(0, 4) : []

  const handleQuickAdd = (product: typeof products[0]) => {
    addItem(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1600)
  }

  return (
    <section className="graded-hero" aria-label="SlabGuardz Graded Card Protection">
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

        {/* Live Product Spotlight Showcase (Hostinger API Products) */}
        <div className="graded-spotlight-section">
          <div className="graded-spotlight-header">
            <div>
              <p className="spotlight-kicker">FEATURED DROPS</p>
              <h2 className="spotlight-title">Precision Cases & Collector Grails</h2>
            </div>
            <Link to="/shop" className="spotlight-view-all">
              <span>View All ({products.length || 6})</span>
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
                      {product.badge && (
                        <span className="graded-badge-pill">{product.badge}</span>
                      )}
                    </div>
                    <div className="graded-card-body">
                      <span className="graded-card-cat">{product.category.replaceAll('-', ' ')}</span>
                      <h3 className="graded-card-name">
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                      </h3>
                      <div className="graded-card-footer">
                        <PriceDisplay
                          price={product.price}
                          currencyCode={product.currencyCode}
                          compareAtPrice={product.compareAtPrice}
                        />
                        <button
                          type="button"
                          className={`graded-quick-btn${isAdded ? ' is-added' : ''}`}
                          onClick={() => handleQuickAdd(product)}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          {isAdded ? <Check size={15} /> : <ShoppingBag size={15} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              // Showcase authentic slab bumper cards while Hostinger loads
              [
                { id: 'psa-gengar', title: 'SlabGuardz Bumper — Crimson Flame', cat: 'PSA Precision Fit', img: '/slabs/slab-3.jpeg', price: 499 },
                { id: 'psa-mew', title: 'SlabGuardz Bumper — Royal Purple', cat: 'PSA Precision Fit', img: '/slabs/slab-2.jpeg', price: 499 },
                { id: 'psa-dragonite', title: 'SlabGuardz Bumper — Onyx Stealth', cat: 'PSA Precision Fit', img: '/slabs/slab-1.jpeg', price: 499 },
                { id: 'psa-emerald', title: 'SlabGuardz Bumper — Emerald Glow', cat: 'CGC & PSA Fit', img: '/slabs/slab-4.jpeg', price: 499 },
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
                    <span className="graded-badge-pill">POPULAR</span>
                  </div>
                  <div className="graded-card-body">
                    <span className="graded-card-cat">{item.cat}</span>
                    <h3 className="graded-card-name">
                      <Link to="/category/slabguardz-protection">{item.title}</Link>
                    </h3>
                    <div className="graded-card-footer">
                      <span className="graded-price">₹{item.price}</span>
                      <Link to="/shop" className="graded-quick-btn" aria-label="View product">
                        <ArrowUpRight size={15} />
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
