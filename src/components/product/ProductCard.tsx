import { Heart, ShoppingBag, Check } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../../data/products'
import { PriceDisplay } from '../ui/PriceDisplay'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'

type ProductCardProps = {
  product: Product
}

function getProductDescription(product: Product) {
  if (product.description && product.description.trim()) {
    const plain = product.description.replace(/<[^>]*>?/gm, '').trim()
    if (plain.length > 5) return plain
  }
  if (product.category === 'pokemon-cards') {
    return 'Authenticated PSA graded Pokémon collectible single, preserved in collector-grade condition.'
  }
  if (product.category === 'slabguardz-protection') {
    return 'Precision snap-on TPU bumper case with drop-absorbing corner defense.'
  }
  return 'Premium collector display and storage solution engineered for graded cards.'
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [justAdded, setJustAdded] = useState(false)
  const isOutOfStock = product.stockStatus === 'out-of-stock' || product.priceUnavailable
  const isSaved = isInWishlist(product.id)
  const badgeText = product.badge || (isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK')

  const handleQuickAdd = () => {
    if (isOutOfStock) return
    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <article className="graded-product-card">
      <div className="graded-card-img-wrap">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img
            src={product.image || product.gallery?.[0] || '/favicon.png'}
            alt={product.name}
            loading="lazy"
            className="graded-card-img"
          />
        </Link>
        <span className="graded-badge-pill">{badgeText}</span>
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
      </div>
      <div className="graded-card-body">
        <span className="graded-card-cat">{product.category.replaceAll('-', ' ')}</span>
        <h3 className="graded-card-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="graded-card-desc">
          {getProductDescription(product)}
        </p>
        <div className="graded-card-footer">
          <div className="graded-card-price-wrap">
            <PriceDisplay
              price={product.price}
              currencyCode={product.currencyCode}
              unavailable={product.priceUnavailable}
              compareAtPrice={product.compareAtPrice}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            className={`graded-card-action-btn${justAdded ? ' is-added' : ''}`}
            type="button"
            aria-label={`Add ${product.name} to cart`}
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
          >
            <span>{justAdded ? 'Added' : isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            {justAdded ? <Check size={14} strokeWidth={2.2} /> : <ShoppingBag size={14} strokeWidth={1.8} />}
          </motion.button>
        </div>
      </div>
    </article>
  )
}
