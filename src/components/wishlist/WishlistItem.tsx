import { ShoppingBag, X } from 'lucide-react'
import { Link } from 'react-router-dom'
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
    <article className="wishlist-item">
      <Link className="wishlist-item-image" to={`/product/${product.id}`}><img src={product.image} alt={product.name} /></Link>
      <div className="wishlist-item-content">
        <div className="wishlist-item-heading"><div><p>{product.category.replaceAll('-', ' ')}</p><h2><Link to={`/product/${product.id}`}>{product.name}</Link></h2></div><button type="button" aria-label={`Remove ${product.name} from wishlist`} onClick={() => removeFromWishlist(product.id)}><X size={17} /></button></div>
        <div className="wishlist-item-footer"><PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} /><Button disabled={isOutOfStock} onClick={() => addItem(product)}><ShoppingBag size={16} /> Add to cart</Button></div>
      </div>
    </article>
  )
}
