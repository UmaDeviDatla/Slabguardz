import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { PriceDisplay } from '../ui/PriceDisplay'

type ProductMarqueeProps = {
  products: Product[]
}

function MarqueeGroup({ products, duplicate = false }: { products: Product[]; duplicate?: boolean }) {
  return (
    <div className="marquee-group" aria-hidden={duplicate}>
      {products.map((product) => (
        <Link className="marquee-card" key={`${duplicate ? 'duplicate-' : ''}${product.id}`} to={`/product/${product.id}`} tabIndex={duplicate ? -1 : undefined}>
          <div className="marquee-card-image">
            <img src={product.image} alt={duplicate ? '' : product.name} />
            <span className="marquee-card-arrow"><ArrowUpRight size={16} /></span>
          </div>
          <div className="marquee-card-copy">
            <span>{product.category.replaceAll('-', ' ')}</span>
            <strong>{product.name}</strong>
            <PriceDisplay price={product.price} currencyCode={product.currencyCode} unavailable={product.priceUnavailable} />
          </div>
        </Link>
      ))}
    </div>
  )
}

export function ProductMarquee({ products }: ProductMarqueeProps) {
  if (!products.length) return null

  return (
    <section className="home-marquee" aria-labelledby="marquee-heading">
      <div className="marquee-heading container">
        <div>
          <p className="eyebrow">The moving collection</p>
          <h2 id="marquee-heading">Built for the collection.</h2>
        </div>
        <p>Keep the pieces you care about in view, in motion, and ready for the next addition.</p>
      </div>
      <div className="marquee-viewport">
        <div className="marquee-track home-marquee-track">
          <MarqueeGroup products={products} />
          <MarqueeGroup products={products} duplicate />
        </div>
      </div>
    </section>
  )
}