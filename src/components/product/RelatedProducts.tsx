import type { Product } from '../../data/products'
import { ProductCard } from './ProductCard'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

type RelatedProductsProps = {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <>
      <section className="product-related"><Container><SectionHeading eyebrow="Keep exploring" title="Related products" description="A few considered companions for this part of your collection." /><div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></Container></section>
      <section className="product-recently-viewed"><Container><SectionHeading eyebrow="Your trail" title="Recently viewed" description="Your recently viewed products will appear here as you browse." /><div className="recently-viewed-placeholder">Recently viewed products will be remembered here.</div></Container></section>
    </>
  )
}
