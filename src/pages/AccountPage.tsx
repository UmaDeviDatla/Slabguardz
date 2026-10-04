import { ArrowRight, PackageSearch, RotateCcw, XCircle, Heart, ShoppingBag, ShieldCheck, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'

const accountActions = [
  {
    to: '/contact?help=track',
    icon: PackageSearch,
    title: 'Track Your Shipment',
    description: 'Get real-time courier tracking updates, docket numbers, and delivery timelines.',
    action: 'Track Order',
  },
  {
    to: '/contact?help=return',
    icon: RotateCcw,
    title: 'Returns & Replacements',
    description: 'Initiate a replacement or return request for transit-damaged items.',
    action: 'Return Request',
  },
  {
    to: '/contact?help=cancel',
    icon: XCircle,
    title: 'Order Cancellations',
    description: 'Request cancellation of orders prior to courier warehouse dispatch.',
    action: 'Cancel Order',
  },
  {
    to: '/contact',
    icon: Mail,
    title: 'Collector Concierge',
    description: 'Speak directly with our card authenticity and grading specialists.',
    action: 'Contact Concierge',
  },
]

export function AccountPage() {
  const { itemCount } = useCart()
  const { count: wishlistCount } = useWishlist()

  return (
    <div className="account-page">
      <div className="account-page-intro">
        <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Account & Support Hub</span>
        </nav>

        <section className="account-header">
          <p className="eyebrow">Collector Hub</p>
          <h1>Account & Support Services</h1>
          <p className="account-description">
            Access dedicated assistance for your SlabGuardz orders, shipments, and collectible inquiries.
          </p>
        </section>
      </div>

      {/* Quick stats / navigation bar */}
      <div className="account-quick-bar">
        <Link to="/wishlist" className="account-quick-item">
          <Heart size={20} className="quick-item-icon" />
          <div>
            <strong>Saved to Wishlist</strong>
            <span>{wishlistCount} items saved</span>
          </div>
          <ArrowRight size={16} />
        </Link>
        <Link to="/cart" className="account-quick-item">
          <ShoppingBag size={20} className="quick-item-icon" />
          <div>
            <strong>Active Cart</strong>
            <span>{itemCount} items ready for checkout</span>
          </div>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Order Support Actions */}
      <section className="account-support-section">
        <div className="account-support-header">
          <p className="eyebrow">Order Services</p>
          <h2>How can we assist you today?</h2>
          <p>
            Select a service below to connect with our dedicated team. We verify your order details immediately to expedite all inquiries.
          </p>
        </div>

        <div className="account-actions-grid" role="list">
          {accountActions.map(({ to, icon: Icon, title, description, action }) => (
            <motion.div whileHover={{ y: -4 }} key={title}>
              <Link to={to} className="account-action-card" role="listitem">
                <div className="account-action-icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <div className="account-action-copy">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <span className="account-action-link">
                  {action} <ArrowRight size={16} strokeWidth={2} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Collector Guarantee Card */}
        <div className="account-guarantee-card">
          <div className="guarantee-icon-box">
            <ShieldCheck size={32} />
          </div>
          <div className="guarantee-content">
            <h3>The SlabGuardz Authenticity & Transit Guarantee</h3>
            <p>
              Every transaction made with SlabGuardz is protected by our zero-counterfeit policy and full-value transit insurance. For expedited assistance regarding custom card grading orders, email us at <a href="mailto:support@slabguardz.in">support@slabguardz.in</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
