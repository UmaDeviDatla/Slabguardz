import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { ButtonLink } from '../ui/Button'
import { CursorCardTrail } from './CursorCardTrail'

export function HeroSection() {
  return (
    <section className="home-hero-framer" aria-label="SlabGuardz interactive showcase">
      <CursorCardTrail className="hero-trail-wrap">
        <div className="hero-framer-inner">
          {/* Subtle ambient spotlight in the center */}
          <div className="hero-ambient-glow" aria-hidden="true" />

          {/* Top Eyebrow Tag */}
          <motion.div
            className="hero-eyebrow-pill"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Sparkles size={14} className="pill-icon" />
            <span>KEEP YOUR GRAILS SAFE, KEEP YOUR FLEX LOUD 👀</span>
          </motion.div>

          {/* Giant Center Typography from Screenshot */}
          <div className="hero-framer-heading-box">
            <motion.h1
              className="hero-giant-bracket-title"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              [SLABGUARDZ]
            </motion.h1>

            <motion.p
              className="hero-byline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              BY THEPOKEMYSTERY
            </motion.p>
          </div>

          {/* Interactive Hint */}
          <motion.p
            className="hero-interactive-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            ✦ Move your cursor or scroll to reveal the collection ✦
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-cta-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ButtonLink to="/shop" variant="primary" className="hero-btn-main">
              Explore All Guardz <ArrowUpRight size={17} />
            </ButtonLink>
            <ButtonLink to="/category/slabguardz-protection" variant="secondary" className="hero-btn-secondary">
              <ShieldCheck size={17} /> Protection Gear
            </ButtonLink>
          </motion.div>

          {/* Bottom Trust Indicators */}
          <motion.div
            className="hero-bottom-badges"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="hero-badge-item">
              <span className="dot" />
              <span>PSA & CGC Precision Fit</span>
            </div>
            <div className="hero-badge-item">
              <span className="dot" />
              <span>Shipping Worldwide & Pan-India</span>
            </div>
            <div className="hero-badge-item">
              <span className="dot" />
              <span>UV & Scratch Defended</span>
            </div>
          </motion.div>
        </div>
      </CursorCardTrail>
    </section>
  )
}
