import { Shield, Sparkles, Truck, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container } from '../components/ui/Container'
import { AnimateOnScroll, StaggerContainer } from '../components/ui/AnimateOnScroll'
import { staggerChildVariants } from '../components/ui/animationVariants'
import { ButtonLink } from '../components/ui/Button'

const pillars = [
  {
    icon: Shield,
    title: 'Archival-Grade Protection',
    description: 'We believe cards are modern relics. Every case, bumper, and sleeve is manufactured with acid-free, UV-resistant materials designed to prevent fading and micro-scratches.',
  },
  {
    icon: Award,
    title: 'Uncompromising Authenticity',
    description: 'Zero bootlegs, zero compromises. Every graded card slab and raw collectible in our store is vetted by seasoned collectors with strict chain-of-custody verification.',
  },
  {
    icon: Truck,
    title: 'Fortress Packaging',
    description: 'Nothing ruins a card day faster than courier transit damage. We engineered custom multi-layer rigid armor packaging that withstands every drop and turn across India.',
  },
  {
    icon: Sparkles,
    title: 'Collector-First Ethos',
    description: 'Built by passionate TCG & sports card hobbyists. We curate the pieces we cherish ourselves, giving Indian collectors access to international standard supplies.',
  },
]

export function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Header */}
      <section className="about-hero">
        <Container>
          <AnimateOnScroll>
            <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">About Us</span>
            </nav>
            <p className="eyebrow">The SlabGuardz Story</p>
            <h1>Built to protect.<br />Made to display.</h1>
            <p className="about-hero-sub">
              SlabGuardz was founded with a singular conviction: your most prized cards deserve world-class protection, crystal-clear presentation, and collector-grade care.
            </p>
          </AnimateOnScroll>
        </Container>
      </section>

      {/* Philosophy Section */}
      <section className="about-narrative">
        <Container>
          <div className="about-narrative-grid">
            <AnimateOnScroll>
              <div className="about-narrative-image-wrap">
                <img src="/banners/banner-1.jpg" alt="SlabGuardz precision protection on graded Pokémon slab" />
                <div className="about-narrative-badge">
                  <span>EST. 2024</span>
                  <strong>BRED FOR COLLECTORS</strong>
                </div>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.2}>
              <div className="about-narrative-content">
                <p className="eyebrow">Why We Started</p>
                <h2>The journey from raw cards to protected grails.</h2>
                <p>
                  As card collecting surged across India, one persistent challenge haunted hobbyists: the lack of premium, reliable protection and display accessories. Standard sleeves scuffed expensive PSA cases, generic frames failed to block UV rays, and domestic shipping was unpredictable.
                </p>
                <p>
                  We built SlabGuardz to solve this permanently. By partnering directly with specialized manufacturers and collectors, we created a dedicated hub offering precision slab guards, certified graded cards, and elite preservation gear.
                </p>
                <div className="about-stats-row">
                  <div className="about-stat-item">
                    <strong>10,000+</strong>
                    <span>Cards Protected</span>
                  </div>
                  <div className="about-stat-item">
                    <strong>100%</strong>
                    <span>Authenticity Rate</span>
                  </div>
                  <div className="about-stat-item">
                    <strong>28</strong>
                    <span>Indian States Reached</span>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </section>

      {/* Pillars Section */}
      <section className="home-section about-pillars-section">
        <Container>
          <AnimateOnScroll>
            <div className="about-pillars-header">
              <p className="eyebrow">Our Standards</p>
              <h2>The four pillars of SlabGuardz.</h2>
              <p>Everything we design and curate is measured against four foundational commitments.</p>
            </div>
          </AnimateOnScroll>

          <StaggerContainer className="about-pillars-grid">
            {pillars.map(({ icon: Icon, title, description }) => (
              <motion.div key={title} variants={staggerChildVariants} className="about-pillar-card">
                <div className="pillar-icon-box">
                  <Icon size={24} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <Container>
          <div className="about-cta-card">
            <h2>Ready to elevate your collection?</h2>
            <p>Explore our curated selection of cards, slabs, and protective display pieces.</p>
            <ButtonLink to="/shop" variant="primary">
              Explore Collection <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  )
}
