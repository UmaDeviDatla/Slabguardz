import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimateOnScroll, StaggerContainer } from '../ui/AnimateOnScroll'
import { staggerChildVariants } from '../ui/animationVariants'

const collections = [
  {
    title: 'SlabGuardz Protection',
    desc: 'Precision snap-on TPU bumper cases engineered for PSA & CGC slabs',
    tag: 'BUMPER CASES',
    to: '/category/slabguardz-protection',
    img: '/slabs/slab-3.jpeg',
    badge: 'FLAGSHIP',
  },
  {
    title: 'Graded Pokémon Cards',
    desc: 'Authenticated PSA & CGC vintage holos, modern grails, and Japanese gems',
    tag: 'AUTHENTIC GRAILS',
    to: '/category/pokemon-cards',
    img: '/slabs/slab-1.jpeg',
    badge: 'VERIFIED',
  },
  {
    title: 'Collector Accessories',
    desc: 'Precision card sleeves, acrylic stands, and travel protection kits',
    tag: 'GEAR & DISPLAY',
    to: '/category/accessories',
    img: '/slabs/slab-2.jpeg',
    badge: 'ESSENTIALS',
  },
]

export function CategoryGridSection() {
  return (
    <section className="home-section home-categories-graded">
      <Container>
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
                  <img src={col.img} alt={col.title} loading="lazy" />
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
      </Container>
    </section>
  )
}
