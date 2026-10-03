import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { ProductCard } from '../components/product/ProductCard'
import { ShopControls } from '../components/shop/ShopControls'
import type { ProductCategory } from '../data/products'
import type { SortOption } from '../data/shop'
import { useProductCatalog } from '../hooks/useProductCatalog'
import { Button } from '../components/ui/Button'
import { CollectionHeader } from '../components/ui/CollectionHeader'
import { CollectionToolbar } from '../components/ui/CollectionToolbar'
import { useProductCatalogState } from '../hooks/useProductCatalogState'

export function ShopPage() {
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState<ProductCategory | 'all'>('all')
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [sort, setSort] = useState<SortOption>('featured')
  const { products, total: totalProducts, isLoading, error, retry } = useProductCatalogState()
  const catalog = useProductCatalog({ products, category, search, sort })
  const collectionCount = category === 'all' && !search ? totalProducts : catalog.products.length

  return (
    <div className="shop-page">
      <Container className="shop-page-heading">
        <CollectionHeader eyebrow="Shop by category" title="Shop all" breadcrumb="Shop" />
      </Container>
      <Container className="shop-page-content">
        <ShopControls category={category} search={search} sort={sort} onCategoryChange={setCategory} onSearchChange={setSearch} onSortChange={setSort} />
        <CollectionToolbar count={collectionCount} />
        {isLoading && <div className="shop-empty-state" role="status"><h2>Loading products</h2><p>Fetching the latest collection.</p></div>}
        {!isLoading && error && <div className="shop-empty-state" role="alert"><h2>Products unavailable</h2><p>{error}</p><Button variant="secondary" onClick={retry}>Retry</Button></div>}
        {!isLoading && !error && <>
          {catalog.products.length > 0 ? <div className="product-grid">{catalog.products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="shop-empty-state"><h2>No products found</h2><p>Try a different search or category.</p></div>}
          {catalog.hasMore && <div className="shop-load-more"><Button variant="secondary" onClick={catalog.loadMore}>Load more</Button></div>}
        </>}
      </Container>
    </div>
  )
}
