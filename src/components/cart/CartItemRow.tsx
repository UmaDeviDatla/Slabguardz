import { Minus, Plus, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { useCart } from '../../hooks/useCart'
import { PriceDisplay } from '../ui/PriceDisplay'

type CartItemRowProps = {
  product: Product
  quantity: number
  unitPrice?: number
  currencyCode?: string
  variantTitle?: string
  compact?: boolean
}

export function CartItemRow({ product, quantity, unitPrice = product.price, currencyCode = product.currencyCode, variantTitle, compact = false }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <article className={`cart-item-row${compact ? ' cart-item-row-compact' : ''}`}>
      <Link className="cart-item-image" to={`/product/${product.id}`}><img src={product.image} alt="" /></Link>
      <div className="cart-item-details">
        <div className="cart-item-heading"><div><p>{product.category.replaceAll('-', ' ')}</p><h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>{variantTitle && <p>{variantTitle}</p>}</div><button type="button" aria-label={`Remove ${product.name}`} onClick={() => removeItem(product.id)}><X size={16} /></button></div>
        <div className="cart-item-footer"><div className="cart-quantity"><button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(product.id, quantity - 1)}><Minus size={13} /></button><span>{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(product.id, quantity + 1)}><Plus size={13} /></button></div><PriceDisplay price={unitPrice * quantity} currencyCode={currencyCode} /></div>
      </div>
    </article>
  )
}
