import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../../data/products'
import { ProductCard } from '../product/ProductCard'
import { Container } from '../ui/Container'
import { CollectionToolbar } from '../ui/CollectionToolbar'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimateOnScroll, StaggerContainer } from '../ui/AnimateOnScroll'
import { staggerChildVariants } from '../ui/animationVariants'

type ProductSectionProps = {
  eyebrow: string
  title: string
  description: ReactNode
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
          {products.length > 0
            ? products.map((product) => (
                <motion.div key={product.id} variants={staggerChildVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            : [1, 2, 3, 4].map((idx) => (
                <div key={idx} className="graded-product-card skeleton-card" style={{ minHeight: 380, padding: 16 }}>
                  <div className="skeleton" style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 10 }} />
                  <div style={{ padding: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton skeleton-text" style={{ width: '35%', height: 12, borderRadius: 4 }} />
                    <div className="skeleton skeleton-title" style={{ width: '85%', height: 20, borderRadius: 4 }} />
                    <div className="skeleton skeleton-text" style={{ width: '50%', height: 14, borderRadius: 4 }} />
                    <div className="skeleton skeleton-text" style={{ width: '30%', height: 18, borderRadius: 4, marginTop: 8 }} />
                  </div>
                </div>
              ))}
        </StaggerContainer>
      </Container>
    </section>
  )
}
