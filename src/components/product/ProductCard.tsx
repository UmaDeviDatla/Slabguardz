import { Heart, ShoppingBag, Check } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  const [justAdded, setJustAdded] = useState(false)
  const isOutOfStock = product.stockStatus === 'out-of-stock' || product.priceUnavailable
  const isSaved = isInWishlist(product.id)
  const theme = getProductCardTheme(product)

  const handleQuickAdd = () => {
    if (isOutOfStock) return
    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <article className={`product-card product-card-theme-${theme}`}>
      <div className="product-card-media">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        <motion.button
          whileTap={{ scale: 0.85 }}
          className={`product-card-wishlist${isSaved ? ' is-active' : ''}`}
          type="button"
          aria-label={`${isSaved ? 'Remove' : 'Add'} ${product.name} ${isSaved ? 'from' : 'to'} wishlist`}
          aria-pressed={isSaved}
          onClick={() => toggleWishlist(product)}
        >
          <Heart size={16} strokeWidth={2} fill={isSaved ? 'currentColor' : 'none'} />
        </motion.button>
        {product.badge && <Badge tone="accent">{product.badge}</Badge>}
      </div>
      <div className="product-card-details">
        <div className="product-card-copy">
          <p className="product-card-category">{product.category.replaceAll('-', ' ')}</p>
          <h3>
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <div className="product-card-stock-wrap">
            {product.stockStatus === 'low-stock' && (
              <p className="product-card-stock product-card-stock-low">Low stock</p>
            )}
            {product.stockStatus === 'out-of-stock' && (
              <p className="product-card-stock product-card-stock-out">Out of stock</p>
            )}
            {product.stockStatus !== 'low-stock' && product.stockStatus !== 'out-of-stock' && (
              <p className="product-card-stock product-card-stock-available">In stock</p>
            )}
          </div>
        </div>
        <div className="product-card-purchase">
          <PriceDisplay
            price={product.price}
            currencyCode={product.currencyCode}
            unavailable={product.priceUnavailable}
            compareAtPrice={product.compareAtPrice}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`product-card-add${justAdded ? ' is-added' : ''}`}
            type="button"
            aria-label={`Add ${product.name} to cart`}
            title={justAdded ? 'Added!' : 'Quick add'}
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
          >
            {justAdded ? <Check size={16} strokeWidth={2.4} /> : <ShoppingBag size={16} strokeWidth={1.8} />}
          </motion.button>
        </div>
      </div>
    </article>
  )
}
