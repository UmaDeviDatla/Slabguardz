import { Heart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { WishlistItem } from '../components/wishlist/WishlistItem'
import { Container } from '../components/ui/Container'
import { useWishlist } from '../hooks/useWishlist'

export function WishlistPage() {
  const { products } = useWishlist()

  return (
    <div className="wishlist-page">
      <section className="wishlist-header">
        <Container>
          <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Wishlist</span>
          </nav>
          <p className="eyebrow">Saved Collection</p>
          <h1>Your Saved Pieces</h1>
          <p className="wishlist-description">
            Curate and monitor the cards, slabs, and protective display pieces you have your eye on.
          </p>
        </Container>
      </section>

      <Container>
        {products.length > 0 ? (
          <div className="wishlist-items-container">
            <div className="wishlist-summary-bar">
              <span>{products.length} {products.length === 1 ? 'item' : 'items'} saved in your wishlist</span>
              <Link to="/shop" className="text-link">
                Continue browsing <ArrowRight size={15} />
              </Link>
            </div>
            <div className="wishlist-items">
              <AnimatePresence>
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  >
                    <WishlistItem product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="wishlist-empty-card">
            <div className="wishlist-empty-icon">
              <Heart size={36} strokeWidth={1.8} />
            </div>
            <p className="eyebrow">Your Wishlist is Empty</p>
            <h2>Nothing saved yet.</h2>
            <p>Tap the heart icon on any product while browsing to keep it saved right here.</p>
            <Link className="button button-primary" to="/shop">
              Explore Collection <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </Container>
    </div>
  )
}
