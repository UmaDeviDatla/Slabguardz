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
  const { products } = useProductCatalogState()
  const normalizedCategory = category ? categorySlugs[category] : undefined
  const title = category?.replaceAll('-', ' ') ?? 'Category'
  const categoryProducts = normalizedCategory
    ? products.filter((product) => {
        const assignedCategories = Array.isArray(product.categories)
          ? product.categories
          : [product.category]
        return assignedCategories.includes(normalizedCategory)
      })
    : []
  const displayTitle = title.replace(/\b\w/g, (letter) => letter.toUpperCase())

  return (
    <div className="category-page">
      <Container>
        <CollectionHeader eyebrow="Shop by category" title={displayTitle} />
        <CollectionToolbar count={categoryProducts.length} />
        {normalizedCategory && categoryProducts.length ? (
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
