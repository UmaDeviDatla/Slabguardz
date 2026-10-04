import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categoryCards } from '../../data/home'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimateOnScroll, StaggerContainer, staggerChildVariants } from '../ui/AnimateOnScroll'

export function CategoryGridSection() {
  return (
    <section className="home-section home-categories">
      <Container>
        <AnimateOnScroll>
          <SectionHeading eyebrow="Find your next piece" title="Shop by category" description="From the card itself to the case around it, make every part of your collection count." />
        </AnimateOnScroll>
        <StaggerContainer className="category-grid">
          {categoryCards.map((category) => (
            <motion.div key={category.to} variants={staggerChildVariants}>
              <Link className={`category-card category-card-${category.accent}`} to={category.to}>
                <span className="category-card-index">0{categoryCards.indexOf(category) + 1}</span>
                <span className="category-card-art"><span /></span>
                <span className="category-card-content">
                  <strong>{category.label}</strong>
                  <small>{category.description}</small>
                </span>
                <ArrowUpRight className="category-card-arrow" size={18} strokeWidth={1.8} />
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  )
}
