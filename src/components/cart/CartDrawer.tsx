import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CartItemRow } from './CartItemRow'
import { CartSummary } from './CartSummary'
import { useCart } from '../../hooks/useCart'

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, lines, isLoading, error, retry } = useCart()

  useEffect(() => {
    if (!isDrawerOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeDrawer() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [closeDrawer, isDrawerOpen])

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="cart-drawer-layer">
          <motion.button 
            className="cart-drawer-backdrop" 
            type="button" 
            aria-label="Close cart" 
            onClick={closeDrawer}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          />
          <motion.aside 
            className="cart-drawer" 
            aria-label="Shopping cart" 
            role="dialog" 
            aria-modal="true"
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="cart-drawer-header"><div><p className="eyebrow">Your selection</p><h2>Cart</h2></div><button type="button" aria-label="Close cart" onClick={closeDrawer}><X size={21} /></button></div>
            {isLoading ? <div className="cart-drawer-empty"><p>Syncing your cart with Hostinger.</p></div> : error ? <div className="cart-drawer-empty" role="alert"><p>{error}</p><button type="button" onClick={retry}>Try Again</button></div> : lines.length ? <><div className="cart-drawer-items">{lines.map((line) => <CartItemRow key={line.lineItemId} product={line.product} quantity={line.quantity} unitPrice={line.unitPrice} currencyCode={line.currencyCode} variantTitle={line.variantTitle} compact />)}</div><CartSummary compact /></> : <div className="cart-drawer-empty"><p>Your cart is waiting for something worth keeping.</p><Link to="/shop" onClick={closeDrawer}>Explore the collection</Link></div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
