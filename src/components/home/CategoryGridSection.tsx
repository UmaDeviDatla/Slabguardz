import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { useProductCatalogState } from '../../hooks/useProductCatalogState'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimateOnScroll } from '../ui/AnimateOnScroll'
import { ProductCard } from '../product/ProductCard'

export function CategoryGridSection() {
  const { products, isLoading } = useProductCatalogState()

  const spotlightProducts = products.slice(0, 3)

  if (!isLoading && spotlightProducts.length === 0) {
    return null
  }

  return (
    <section className="home-section home-categories-graded">
      <Container>
        <div className="graded-spotlight-section" style={{ marginTop: 0 }}>
          <AnimateOnScroll>
            <SectionHeading
              eyebrow="FEATURED DROPS"
              title="PRECISION CASES & COLLECTOR GRAILS"
              action={
                <Link className="text-link" to="/shop">
                  View all ({products.length || 3}) <ArrowRight size={15} />
                </Link>
              }
            />
          </AnimateOnScroll>

          <div className="graded-spotlight-grid">
            {spotlightProducts.length > 0 ? (
              spotlightProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              [1, 2, 3].map((idx) => (
                <div key={idx} className="graded-product-card skeleton-card" style={{ minHeight: 380, padding: 16 }}>
                  <div className="skeleton" style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 10 }} />
                  <div style={{ padding: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton skeleton-text" style={{ width: '35%', height: 12, borderRadius: 4 }} />
                    <div className="skeleton skeleton-title" style={{ width: '85%', height: 20, borderRadius: 4 }} />
                    <div className="skeleton skeleton-text" style={{ width: '50%', height: 14, borderRadius: 4 }} />
                    <div className="skeleton skeleton-text" style={{ width: '30%', height: 18, borderRadius: 4, marginTop: 8 }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
