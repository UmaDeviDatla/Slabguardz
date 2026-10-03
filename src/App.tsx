import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { StorefrontLayout } from './components/layout/StorefrontLayout'
import { AboutPage } from './pages/AboutPage'
import { AccountPage } from './pages/AccountPage'
import { BestSellersPage } from './pages/BestSellersPage'
import { CartPage } from './pages/CartPage'
import { CategoryPage } from './pages/CategoryPage'
import { ContactPage } from './pages/ContactPage'
import { FaqPage } from './pages/FaqPage'
import { HomePage } from './pages/HomePage'
import { NewArrivalsPage } from './pages/NewArrivalsPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { ProductPage } from './pages/ProductPage'
import { ShopPage } from './pages/ShopPage'
import { WishlistPage } from './pages/WishlistPage'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="category/:category" element={<CategoryPage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="new-arrivals" element={<NewArrivalsPage />} />
          <Route path="best-sellers" element={<BestSellersPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="track-order" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
