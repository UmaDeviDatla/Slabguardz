import { Outlet } from 'react-router-dom'
import { CartDrawer } from '../cart/CartDrawer'
import { CartProvider } from '../../hooks/cartProvider'
import { WishlistProvider } from '../../hooks/wishlistProvider'
import { ProductCatalogProvider } from '../../hooks/productCatalogProvider'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { ThemeProvider } from '../../hooks/themeProvider'

export function StorefrontLayout() {
  return (
    <ThemeProvider>
      <ProductCatalogProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="storefront-shell">
              <SiteHeader />
              <CartDrawer />
              <main>
                <Outlet />
              </main>
              <SiteFooter />
            </div>
          </WishlistProvider>
        </CartProvider>
      </ProductCatalogProvider>
    </ThemeProvider>
  )
}
