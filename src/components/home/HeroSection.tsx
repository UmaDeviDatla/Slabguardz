import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { ButtonLink } from '../ui/Button'

export function HeroSection() {
  return (
    <section className="home-hero" aria-label="Featured SlabGuardz banner">
      <div className="home-hero-inner">
        <motion.img
          className="home-hero-banner-image"
          src="/pokemon_banner.jpeg"
          alt="SlabGuardz featured Pokémon banner"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1.015, opacity: 0.92 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />
        <div className="home-hero-overlay">
          <div className="home-hero-copy">
            <motion.p className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>The collector's edit / 01</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>A sharper way to collect.</motion.h1>
            <motion.p className="home-hero-description" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>Rare finds, considered protection and display pieces made for the cards that deserve the spotlight.</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
              <ButtonLink to="/shop" variant="primary">Explore the collection <ArrowUpRight size={16} /></ButtonLink>
            </motion.div>
          </div>
          <motion.div className="home-hero-meta" aria-label="Collection highlights" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <span>Curated for collectors</span>
            <span>India-wide shipping</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
