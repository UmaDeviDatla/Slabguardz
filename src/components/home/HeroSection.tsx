import { ArrowUpRight } from 'lucide-react'
import { ButtonLink } from '../ui/Button'

export function HeroSection() {
  return (
    <section className="home-hero" aria-label="Featured SlabGuardz banner">
      <div className="home-hero-inner">
        <img
          className="home-hero-banner-image"
          src="/pokemon_banner.jpeg"
          alt="SlabGuardz featured Pokémon banner"
        />
        <div className="home-hero-overlay">
          <div className="home-hero-copy">
            <p className="eyebrow">The collector's edit / 01</p>
            <h1>A sharper way to collect.</h1>
            <p className="home-hero-description">Rare finds, considered protection and display pieces made for the cards that deserve the spotlight.</p>
            <ButtonLink to="/shop" variant="primary">Explore the collection <ArrowUpRight size={16} /></ButtonLink>
          </div>
          <div className="home-hero-meta" aria-label="Collection highlights">
            <span>Curated for collectors</span>
            <span>India-wide shipping</span>
          </div>
        </div>
      </div>
    </section>
  )
}
