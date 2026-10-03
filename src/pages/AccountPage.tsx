import { ArrowRight, PackageSearch, RotateCcw, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const accountActions = [
  {
    to: '/contact?help=track',
    icon: PackageSearch,
    title: 'Get Order Details',
    description: 'Request your order status and details from our support team.',
    action: 'Get Order Details',
  },
  {
    to: '/contact?help=return',
    icon: RotateCcw,
    title: 'Return an Order',
    description: 'Submit a return request for an order you\'ve received.',
    action: 'Return Order',
  },
  {
    to: '/contact?help=cancel',
    icon: XCircle,
    title: 'Cancel an Order',
    description: 'Request cancellation of an eligible order.',
    action: 'Cancel Order',
  },
]

export function AccountPage() {
  return (
    <div className="account-page">
      <div className="account-page-intro">
        <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Account</span>
        </nav>
        <section className="account-header" aria-labelledby="account-page-title">
          <p className="eyebrow">Your account</p>
          <h1 id="account-page-title">Account</h1>
          <p className="account-description">Manage your order support requests and get help with your SlabGuardz purchases.</p>
        </section>
      </div>

      <section className="account-support-section" aria-labelledby="account-support-title">
        <div className="account-support-header">
          <p className="eyebrow">Order support</p>
          <h2 id="account-support-title">Need help with an order?</h2>
          <p>Get your order details, request a return, or contact our support team. Our Orders team will verify your order before processing any request.</p>
        </div>

        <div className="account-actions-grid" role="list" aria-label="Account support actions">
          {accountActions.map(({ to, icon: Icon, title, description, action }) => (
            <Link key={title} to={to} className="account-action-card" role="listitem">
              <div className="account-action-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.8} /></div>
              <div className="account-action-copy">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="account-action-link">{action} <ArrowRight size={16} strokeWidth={1.9} /></span>
            </Link>
          ))}
        </div>

        <div className="account-contact-card">
          <div>
            <p className="eyebrow">Contact support</p>
            <h3>Need help with something else?</h3>
          </div>
          <Link to="/contact" className="button button-secondary">
            Contact Us <ArrowRight size={16} strokeWidth={1.9} />
          </Link>
        </div>
      </section>

      <section className="account-info-card" aria-labelledby="account-info-title">
        <p className="eyebrow">Customer accounts</p>
        <h2 id="account-info-title">Full account history and previous orders will be available when secure customer account access is connected.</h2>
      </section>
    </div>
  )
}
