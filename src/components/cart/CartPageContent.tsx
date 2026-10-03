import { Link } from 'react-router-dom'
import { CartItemRow } from './CartItemRow'
import { CartSummary } from './CartSummary'
import { useCart } from '../../hooks/useCart'

export function CartPageContent() {
  const { lines, isLoading, error, retry } = useCart()

  if (isLoading) return <div className="cart-empty" role="status"><p className="eyebrow">Your selection</p><h1>Loading your cart.</h1><p>Syncing your cart with Hostinger.</p></div>
  if (error) return <div className="cart-empty" role="alert"><p className="eyebrow">Your selection</p><h1>Something went wrong.</h1><p>Try again later.</p><button className="button button-primary" type="button" onClick={retry}>Try Again</button></div>

  if (!lines.length) return <div className="cart-empty"><p className="eyebrow">Your selection</p><h1>Your cart is empty.</h1><p>Start with cards, protection and display essentials selected for collectors.</p><Link className="button button-primary" to="/shop">Continue shopping</Link></div>

  return <div className="cart-layout"><section className="cart-items"><div className="cart-items-heading"><h1>Your cart</h1><span>{lines.length} {lines.length === 1 ? 'item' : 'items'}</span></div>{lines.map((line) => <CartItemRow key={line.lineItemId} product={line.product} quantity={line.quantity} unitPrice={line.unitPrice} currencyCode={line.currencyCode} variantTitle={line.variantTitle} />)}</section><CartSummary /></div>
}
