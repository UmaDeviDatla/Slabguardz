import { useParams, Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { Container } from '../components/ui/Container'
import { CollectionHeader } from '../components/ui/CollectionHeader'
import { CollectionToolbar } from '../components/ui/CollectionToolbar'
import type { ProductCategory } from '../data/products'
import { useProductCatalogState } from '../hooks/useProductCatalogState'

const categorySlugs: Record<string, ProductCategory> = {
  'pokemon-cards': 'pokemon-cards',
  'slabguardz-protection': 'slabguardz-protection',
  accessories: 'accessories',
}

export function CategoryPage() {
  const { category } = useParams()
  const { products, isLoading } = useProductCatalogState()

  const normalizedCategory = category
    ? categorySlugs[category] ?? (category as ProductCategory)
    : undefined

  const title = category?.replaceAll('-', ' ') ?? 'Category'
  const displayTitle = title.replace(/\b\w/g, (letter) => letter.toUpperCase())

  const categoryProducts = normalizedCategory
    ? products.filter((product) => {
        const assignedCategories = Array.isArray(product.categories)
          ? product.categories
          : [product.category]
        return (
          assignedCategories.includes(normalizedCategory) ||
          product.category === normalizedCategory ||
          product.collectionIds?.includes(category || '')
        )
      })
    : []

  return (
    <div className="category-page">
      <Container>
        <CollectionHeader eyebrow="Shop by category" title={displayTitle} />
        <CollectionToolbar count={categoryProducts.length} />

        {isLoading && categoryProducts.length === 0 ? (
          <div className="product-grid">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="graded-product-card skeleton-card" style={{ minHeight: 380, padding: 16 }}>
                <div className="skeleton" style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 10 }} />
                <div style={{ padding: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="skeleton skeleton-text" style={{ width: '35%', height: 12, borderRadius: 4 }} />
                  <div className="skeleton skeleton-title" style={{ width: '85%', height: 20, borderRadius: 4 }} />
                  <div className="skeleton skeleton-text" style={{ width: '30%', height: 18, borderRadius: 4, marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>
        ) : categoryProducts.length > 0 ? (
          <div className="product-grid">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="shop-empty-state">
            <h2>No products yet</h2>
            <p>We&apos;re carefully building this collection. Check back soon for new arrivals.</p>
            <Link className="button button-secondary" to="/shop">
              Explore all products
            </Link>
          </div>
        )}
      </Container>
    </div>
  )
}
