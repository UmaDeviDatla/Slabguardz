import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { trustItems } from '../../data/home'
import { AnimateOnScroll, StaggerContainer } from '../ui/AnimateOnScroll'
import { staggerChildVariants } from '../ui/animationVariants'
import { SectionHeading } from '../ui/SectionHeading'

export function TrustSection() {
  return (
    <section className="home-section home-trust">
      <Container>
        <AnimateOnScroll>
          <SectionHeading
            eyebrow="The SlabGuardz Promise"
            title="Built on collector trust"
            description="From secure payment processing to tamper-proof packaging, every detail is considered."
          />
        </AnimateOnScroll>
        <StaggerContainer className="trust-grid">
          {trustItems.map(({ title, description, icon: Icon }) => (
            <motion.div className="trust-card" key={title} variants={staggerChildVariants}>
              <div className="trust-icon-box">
                <Icon size={22} strokeWidth={2} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.div>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  )
}
