import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { Badge } from '../ui/Badge'
import { PriceDisplay } from '../ui/PriceDisplay'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'

type ProductCardProps = {
  product: Product
}

function getProductCardTheme(product: Product): 'pokemon' | 'protection' | 'accessories' | 'neutral' {
  switch (product.category) {
    case 'pokemon-cards':
      return 'pokemon'
    case 'slabguardz-protection':
      return 'protection'
    case 'accessories':
      return 'accessories'
    default:
      return 'neutral'
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isOutOfStock = product.stockStatus === 'out-of-stock' || product.priceUnavailable
  const isSaved = isInWishlist(product.id)
  const theme = getProductCardTheme(product)

  return (
    <article className={`product-card product-card-theme-${theme}`}>
      <div className="product-card-media">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} />
        </Link>
        <button className={`product-card-wishlist${isSaved ? ' is-active' : ''}`} type="button" aria-label={`${isSaved ? 'Remove' : 'Add'} ${product.name} ${isSaved ? 'from' : 'to'} wishlist`} aria-pressed={isSaved} onClick={() => toggleWishlist(product)}>
          <Heart size={17} strokeWidth={1.8} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        {product.badge && <Badge tone="accent">{product.badge}</Badge>}
      </div>
      <div className="product-card-details">
        <div className="product-card-copy">
          <p className="product-card-category">{product.category.replaceAll('-', ' ')}</p>
          <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
          {product.stockStatus === 'low-stock' && <p className="product-card-stock product-card-stock-low">Low stock</p>}
          {product.stockStatus === 'out-of-stock' && <p className="product-card-stock product-card-stock-out">Out of stock</p>}
        </div>
        <div className="product-card-purchase">
          <PriceDisplay price={product.price} currencyCode={product.currencyCode} unavailable={product.priceUnavailable} compareAtPrice={product.compareAtPrice} />
          <button className="product-card-add" type="button" aria-label={`Add ${product.name} to cart`} title="Quick add" disabled={isOutOfStock} onClick={() => addItem(product)}>
            <ShoppingBag size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </article>
  )
}
