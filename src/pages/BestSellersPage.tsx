import { CollectionHeader } from '../components/ui/CollectionHeader'
import { ProductSection } from '../components/home/ProductSection'
import { useProductCatalogState } from '../hooks/useProductCatalogState'

export function BestSellersPage() {
  const { products } = useProductCatalogState()
  const bestSellers = products.filter((product) => product.badge === 'Best seller')
  const displayedProducts = bestSellers.length ? bestSellers : products.slice(0, 4)
  return <div className="collection-page"><div className="container"><CollectionHeader eyebrow="Shop by category" title="Best sellers" /></div><ProductSection eyebrow="Most wanted" title="Collector favourites" description="The pieces collectors come back to, season after season." products={displayedProducts} linkTo="/best-sellers" collectionCount={displayedProducts.length} /></div>
}
