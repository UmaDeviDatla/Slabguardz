import { CollectionHeader } from '../components/ui/CollectionHeader'
import { ProductSection } from '../components/home/ProductSection'
import { useProductCatalogState } from '../hooks/useProductCatalogState'

export function NewArrivalsPage() {
  const { products } = useProductCatalogState()
  const newArrivals = products.filter((product) => product.badge === 'New')
  const latestProducts = [...products].sort((first, second) => (second.updatedAt ?? '').localeCompare(first.updatedAt ?? '')).slice(0, 4)
  const displayedProducts = newArrivals.length ? newArrivals : latestProducts
  return <div className="collection-page"><div className="container"><CollectionHeader eyebrow="Shop by category" title="New arrivals" /></div><ProductSection eyebrow="Just in" title="Recently added" description="Fresh cards and essentials for the collection." products={displayedProducts} linkTo="/new-arrivals" collectionCount={displayedProducts.length} /></div>
}
