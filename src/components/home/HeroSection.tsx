import {
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ButtonLink } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimateOnScroll, StaggerContainer } from '../ui/AnimateOnScroll'
import { staggerChildVariants } from '../ui/animationVariants'

const heroQuickFilters = [
  { label: 'All Products', to: '/shop' },
  { label: 'PSA Cases', to: '/category/slabguardz-protection' },
  { label: 'Pokémon Cards', to: '/category/pokemon-cards' },
  { label: 'Accessories', to: '/category/accessories' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Best Sellers', to: '/best-sellers' },
]

const collections = [
  {
    title: 'SlabGuardz Protection',
    desc: 'Precision snap-on TPU bumper cases engineered for PSA & CGC slabs',
    tag: 'BUMPER CASES',
    to: '/category/slabguardz-protection',
    img: '/banners/banner-1.jpg',
    badge: 'FLAGSHIP',
  },
  {
    title: 'Graded Pokémon Cards',
    desc: 'Authenticated PSA & CGC vintage holos, modern grails, and Japanese gems',
    tag: 'AUTHENTIC GRAILS',
    to: '/category/pokemon-cards',
    img: '/banners/banner-2.jpg',
    badge: 'VERIFIED',
  },
  {
    title: 'Collector Accessories',
    desc: 'Precision card sleeves, acrylic stands, and travel protection kits',
    tag: 'GEAR & DISPLAY',
    to: '/category/accessories',
    img: '/banners/banner-3.jpg',
    badge: 'ESSENTIALS',
  },
]

const heroTrustSignals = [
  { label: 'Impact-Absorbing TPU', desc: 'Drop-tested corner armor' },
  { label: 'Exact Precision Tolerances', desc: 'Snug fit for PSA & CGC' },
  { label: 'Zero Scratch Bezel', desc: 'Protects acrylic slab surfaces' },
  { label: 'Pan-India Express', desc: 'Reliable doorstep dispatch' },
]

export function HeroSection() {
  return (
    <section className="graded-hero luxury-hero" aria-label="SlabGuardz Graded Card Protection">
      {/* Ultra-Luxury $10,000+ Hero Stage: Content positioned directly on the client's high-res banner image */}
      <div className="luxury-hero-banner">
        {/* Full-bleed high-res client banner photography */}
        <img
          src="/banners/banner-1.jpg"
          alt="SlabGuardz Precision Slab Armor & Grail Collection"
          className="luxury-hero-bg-img"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />

        {/* Multi-layered luxury glassmorphism & cinematic dark vignette overlay */}
        <div className="luxury-hero-overlay" />

        {/* Floating Hero Content Overlay */}
        <div className="luxury-hero-content-wrap">
          {/* Eyebrow badge */}
          <motion.div
            className="luxury-hero-eyebrow"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow-accent-dot" />
            <span>PRECISION PROTECTION FOR GRADED CARDS</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="luxury-hero-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            THE ULTIMATE CASE
            <br />
            FOR GRADED CARDS.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="luxury-hero-subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Engineered bumper cases and collector accessories tailored for PSA, CGC, and modern trading card slabs. Armor-grade TPU defense with zero obstruction.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="luxury-hero-cta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ButtonLink to="/shop" variant="primary" className="btn-luxury-primary">
              Shop All Products <ArrowUpRight size={17} />
            </ButtonLink>
            <ButtonLink to="/category/slabguardz-protection" variant="secondary" className="btn-luxury-secondary">
              <ShieldCheck size={17} /> Explore Protection
            </ButtonLink>
          </motion.div>

          {/* GradedGuard-style Quick Category Filter Bar Floating on the Banner */}
          <motion.div
            className="luxury-filter-bar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38 }}
          >
            {heroQuickFilters.map((filter) => (
              <Link key={filter.label} to={filter.to} className="luxury-filter-pill">
                {filter.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Transition directly into Shop by Category below the banner */}
      <div className="graded-hero-container luxury-below-banner">
        <div className="graded-spotlight-section">
          <AnimateOnScroll>
            <SectionHeading
              eyebrow="EXPLORE COLLECTIONS"
              title="Shop by category"
              description="From armor-grade slab bumpers to authenticated grails, browse our curated editions."
            />
          </AnimateOnScroll>

          <StaggerContainer className="graded-category-grid">
            {collections.map((col) => (
              <motion.div key={col.to} variants={staggerChildVariants}>
                <Link to={col.to} className="graded-cat-tile">
                  <div className="graded-cat-media">
                    <img src={col.img} alt={col.title} loading="eager" />
                    <span className="graded-cat-badge">{col.badge}</span>
                  </div>
                  <div className="graded-cat-content">
                    <span className="graded-cat-tag">{col.tag}</span>
                    <h3 className="graded-cat-title">{col.title}</h3>
                    <p className="graded-cat-desc">{col.desc}</p>
                    <span className="graded-cat-link">
                      Explore Collection <ArrowUpRight size={15} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </StaggerContainer>
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
