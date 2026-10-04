import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { trustItems } from '../../data/home'
import { StaggerContainer, staggerChildVariants } from '../ui/AnimateOnScroll'

export function TrustSection() {
  return (
    <section className="home-section home-trust">
      <Container>
        <StaggerContainer className="trust-grid">
          {trustItems.map(({ title, description, icon: Icon }) => (
            <motion.div className="trust-item" key={title} variants={staggerChildVariants}>
              <Icon size={20} strokeWidth={1.7} />
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.div>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  )
}
