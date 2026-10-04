import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../../data/products'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { Button } from '../ui/Button'
import { PriceDisplay } from '../ui/PriceDisplay'

type WishlistItemProps = {
  product: Product
}

export function WishlistItem({ product }: WishlistItemProps) {
  const { addItem } = useCart()
  const { removeFromWishlist } = useWishlist()
  const isOutOfStock = product.stockStatus === 'out-of-stock'

  return (
    <article className="wishlist-item-card">
      <Link className="wishlist-item-image" to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="wishlist-item-content">
        <div className="wishlist-item-heading">
          <div>
            <p className="wishlist-item-category">{product.category.replaceAll('-', ' ')}</p>
            <h2>
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </h2>
          </div>
          <button
            type="button"
            className="wishlist-remove-btn"
            aria-label={`Remove ${product.name} from wishlist`}
            onClick={() => removeFromWishlist(product.id)}
          >
            <Trash2 size={17} />
          </button>
        </div>
        <div className="wishlist-item-footer">
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button disabled={isOutOfStock} onClick={() => addItem(product)}>
              <ShoppingBag size={16} /> Add to Cart
            </Button>
          </motion.div>
        </div>
      </div>
    </article>
  )
}
