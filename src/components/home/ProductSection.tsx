import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../../data/products'
import { ProductCard } from '../product/ProductCard'
import { Container } from '../ui/Container'
import { CollectionToolbar } from '../ui/CollectionToolbar'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimateOnScroll, StaggerContainer, staggerChildVariants } from '../ui/AnimateOnScroll'

type ProductSectionProps = {
  eyebrow: string
  title: string
  description: string
  products: Product[]
  linkTo: string
  collectionCount?: number
}

export function ProductSection({ eyebrow, title, description, products, linkTo, collectionCount }: ProductSectionProps) {
  return (
    <section className="home-section home-products">
      <Container>
        <AnimateOnScroll>
          {collectionCount === undefined ? <SectionHeading eyebrow={eyebrow} title={title} description={description} action={<Link className="text-link" to={linkTo}>View all <ArrowRight size={15} /></Link>} /> : <CollectionToolbar count={collectionCount} />}
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
