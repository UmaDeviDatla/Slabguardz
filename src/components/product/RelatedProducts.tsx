import { motion } from 'framer-motion'
import type { Product } from '../../data/products'
import { ProductCard } from './ProductCard'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimateOnScroll, StaggerContainer } from '../ui/AnimateOnScroll'
import { staggerChildVariants } from '../ui/animationVariants'

type RelatedProductsProps = {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) return null

  return (
    <section className="home-section product-related">
      <Container>
        <AnimateOnScroll>
          <SectionHeading
            eyebrow="Keep exploring"
            title="Complete your collection"
            description="Considered pairings and accessories designed to protect and display your pieces."
          />
        </AnimateOnScroll>
        <StaggerContainer className="product-grid">
          {products.map((product) => (
            <motion.div key={product.id} variants={staggerChildVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  )
}
