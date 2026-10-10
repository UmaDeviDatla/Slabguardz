import { CollectionHeader } from '../components/ui/CollectionHeader'
import { ProductSection } from '../components/home/ProductSection'
import { useProductCatalogState } from '../hooks/useProductCatalogState'

export function BestSellersPage() {
  const { products } = useProductCatalogState()
  const bestSellers = products.filter((product) => {
    const badge = product.badge?.toLowerCase() ?? ''
    return badge.includes('best') || badge.includes('popular') || badge.includes('flagship') || badge.includes('hot')
  })
  const displayedProducts = bestSellers.length ? bestSellers : products

  return (
    <div className="collection-page">
      <div className="container">
        <CollectionHeader eyebrow="Shop by category" title="Best sellers" />
      </div>
      <ProductSection
        eyebrow="Most wanted"
        title="Collector favourites"
        description="The pieces collectors come back to, season after season."
        products={displayedProducts}
        linkTo="/best-sellers"
        collectionCount={displayedProducts.length}
      />
    </div>
  )
}
