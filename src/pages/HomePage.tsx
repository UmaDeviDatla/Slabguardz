import { BrandStatement } from '../components/home/BrandStatement'
import { HeroSection } from '../components/home/HeroSection'
import { NewsletterSection } from '../components/home/NewsletterSection'
import { ProductSection } from '../components/home/ProductSection'
import { ProductMarquee } from '../components/home/ProductMarquee'
import { TrustSection } from '../components/home/TrustSection'
import { CategoryGridSection } from '../components/home/CategoryGridSection'
import { useProductCatalogState } from '../hooks/useProductCatalogState'

export function HomePage() {
  const { products } = useProductCatalogState()
  const newArrivals = products.filter((product) => product.badge === 'New')

  return (
    <>
      <HeroSection />
      <BrandStatement />
      <ProductSection
        eyebrow="Curated For Collectors"
        title="HOT & TRENDING"
        description={<>FOR YOUR <strong>COLLECTION</strong></>}
        products={products.slice(0, 3)}
        linkTo="/shop"
      />
      <CategoryGridSection />
      <ProductSection
        eyebrow="Just in"
        title="New arrivals"
        description="Fresh cards and essentials for the collection."
        products={newArrivals.length ? newArrivals.slice(0, 3) : products.slice(0, 3)}
        linkTo="/new-arrivals"
      />
      <ProductMarquee products={products} />
      <TrustSection />
      <NewsletterSection />
    </>
  )
}
