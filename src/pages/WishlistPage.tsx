import { PageIntro } from '../components/ui/PageIntro'
import { WishlistItem } from '../components/wishlist/WishlistItem'
import { Container } from '../components/ui/Container'
import { useWishlist } from '../hooks/useWishlist'
import { Link } from 'react-router-dom'

export function WishlistPage() {
  const { products } = useWishlist()

  return (
    <div className="wishlist-page">
      <PageIntro eyebrow="Your collection" title="Wishlist" description="Save products you want to keep an eye on. Wishlist syncing will be connected with customer accounts later." />
      <Container>
        {products.length ? <div className="wishlist-items">{products.map((product) => <WishlistItem key={product.id} product={product} />)}</div> : <div className="wishlist-empty"><p className="eyebrow">Your collection</p><h2>Nothing saved yet.</h2><p>Tap the heart on a product to keep it close.</p><Link className="button button-primary" to="/shop">Explore the collection</Link></div>}
      </Container>
    </div>
  )
}
