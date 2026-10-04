import { ArrowUpRight, ShieldCheck, Sparkles, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categoryCards } from '../../data/home'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimateOnScroll, StaggerContainer } from '../ui/AnimateOnScroll'
import { staggerChildVariants } from '../ui/animationVariants'

function getCategoryIcon(label: string) {
  if (label.toLowerCase().includes('pokémon') || label.toLowerCase().includes('pokemon')) {
    return <Sparkles size={28} strokeWidth={1.8} />
  }
  if (label.toLowerCase().includes('protection') || label.toLowerCase().includes('slab')) {
    return <ShieldCheck size={28} strokeWidth={1.8} />
  }
  return <Package size={28} strokeWidth={1.8} />
}

export function CategoryGridSection() {
  return (
    <section className="home-section home-categories">
      <Container>
        <AnimateOnScroll>
          <SectionHeading
            eyebrow="Find your next piece"
            title="Shop by category"
            description="From graded slabs to precision sleeves, browse the collector essentials."
          />
        </AnimateOnScroll>
        <StaggerContainer className="category-grid">
          {categoryCards.map((category) => (
            <motion.div key={category.to} variants={staggerChildVariants} className="category-card-wrapper">
              <Link className={`category-card category-card-${category.accent}`} to={category.to}>
                <div className="category-card-top">
                  <span className="category-card-index">0{categoryCards.indexOf(category) + 1}</span>
                  <div className="category-card-icon-bubble">
                    {getCategoryIcon(category.label)}
                  </div>
                </div>
                <div className="category-card-content">
                  <strong>{category.label}</strong>
                  <small>{category.description}</small>
                </div>
                <div className="category-card-arrow-wrap">
                  <ArrowUpRight className="category-card-arrow" size={18} strokeWidth={2} />
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  )
}
