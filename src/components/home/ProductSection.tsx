import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { ProductCard } from '../product/ProductCard'
import { Container } from '../ui/Container'
import { CollectionToolbar } from '../ui/CollectionToolbar'
import { SectionHeading } from '../ui/SectionHeading'

type ProductSectionProps = {
  eyebrow: string
  title: string
  description: string
  products: Product[]
  linkTo: string
  collectionCount?: number
}

export function ProductSection({ eyebrow, title, description, products, linkTo, collectionCount }: ProductSectionProps) {
  return (
    <section className="home-section home-products">
      <Container>
        {collectionCount === undefined ? <SectionHeading eyebrow={eyebrow} title={title} description={description} action={<Link className="text-link" to={linkTo}>View all <ArrowRight size={15} /></Link>} /> : <CollectionToolbar count={collectionCount} />}
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Container>
    </section>
  )
}
