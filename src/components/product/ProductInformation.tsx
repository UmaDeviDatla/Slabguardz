import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Truck, RotateCcw, FileText, CheckCircle2 } from 'lucide-react'
import type { Product } from '../../data/products'

type ProductInformationProps = {
  product: Product
}

type TabType = 'overview' | 'specs' | 'shipping' | 'care'

export function ProductInformation({ product }: ProductInformationProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  return (
    <section className="product-information-section">
      <div className="product-tabs-header">
        <button
          className={`product-tab-btn ${activeTab === 'overview' ? 'is-active' : ''}`}
          type="button"
          onClick={() => setActiveTab('overview')}
        >
          <FileText size={16} />
          <span>Overview</span>
          {activeTab === 'overview' && (
            <motion.div layoutId="productTabIndicator" className="tab-active-indicator" />
          )}
        </button>

        <button
          className={`product-tab-btn ${activeTab === 'specs' ? 'is-active' : ''}`}
          type="button"
          onClick={() => setActiveTab('specs')}
        >
          <CheckCircle2 size={16} />
          <span>Specifications</span>
          {activeTab === 'specs' && (
            <motion.div layoutId="productTabIndicator" className="tab-active-indicator" />
          )}
        </button>

        <button
          className={`product-tab-btn ${activeTab === 'shipping' ? 'is-active' : ''}`}
          type="button"
          onClick={() => setActiveTab('shipping')}
        >
          <Truck size={16} />
          <span>Shipping & Delivery</span>
          {activeTab === 'shipping' && (
            <motion.div layoutId="productTabIndicator" className="tab-active-indicator" />
          )}
        </button>

        <button
          className={`product-tab-btn ${activeTab === 'care' ? 'is-active' : ''}`}
          type="button"
          onClick={() => setActiveTab('care')}
        >
          <Shield size={16} />
          <span>Protection & Care</span>
          {activeTab === 'care' && (
            <motion.div layoutId="productTabIndicator" className="tab-active-indicator" />
          )}
        </button>
      </div>

      <div className="product-tab-content-wrapper">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="tab-panel tab-overview"
            >
              <div className="tab-overview-grid">
                <div className="tab-overview-text">
                  <h3>About this collectible</h3>
                  <p>{product.description ?? 'SlabGuardz provides premium, archival-grade collectible card slabs and protection systems tailored for serious collectors in India.'}</p>
                  {product.collectorInfo && (
                    <div className="collector-callout">
                      <strong>Collector's Note:</strong>
                      <p>{product.collectorInfo}</p>
                    </div>
                  )}
                </div>
                <div className="tab-overview-highlights">
                  <div className="highlight-item">
                    <Shield size={20} className="highlight-icon" />
                    <div>
                      <strong>Archival Grade Materials</strong>
                      <p>UV-resistant, acid-free construction to prevent degradation</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <CheckCircle2 size={20} className="highlight-icon" />
                    <div>
                      <strong>Precision Fit</strong>
                      <p>Engineered to exact millimeter tolerances for graded slabs</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <RotateCcw size={20} className="highlight-icon" />
                    <div>
                      <strong>Collector Guarantee</strong>
                      <p>Full transit insurance against damage or lost packages</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'specs' && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="tab-panel tab-specs"
            >
              <div className="specs-table-wrap">
                <dl className="specs-dl">
                  {product.category && (
                    <div className="specs-row">
                      <dt>Category</dt>
                      <dd>{product.category.replaceAll('-', ' ')}</dd>
                    </div>
                  )}
                  {product.condition && (
                    <div className="specs-row">
                      <dt>Condition</dt>
                      <dd>{product.condition}</dd>
                    </div>
                  )}
                  {product.grade && (
                    <div className="specs-row">
                      <dt>Grade / Certification</dt>
                      <dd>{product.grade}</dd>
                    </div>
                  )}
                  {product.sku && (
                    <div className="specs-row">
                      <dt>SKU / Reference</dt>
                      <dd>{product.sku}</dd>
                    </div>
                  )}
                  {(product.specifications ?? []).map((spec) => (
                    <div key={spec.label} className="specs-row">
                      <dt>{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                  <div className="specs-row">
                    <dt>Compatibility</dt>
                    <dd>Standard PSA, BGS, CGC, and raw magnetic one-touch cases</dd>
                  </div>
                  <div className="specs-row">
                    <dt>Country of Origin</dt>
                    <dd>Curated & distributed in India</dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          )}

          {activeTab === 'shipping' && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="tab-panel tab-shipping"
            >
              <div className="shipping-info-grid">
                <div className="shipping-card">
                  <Truck size={24} className="shipping-card-icon" />
                  <h4>India-wide Express Delivery</h4>
                  <p>Dispatched within 24-48 business hours via trusted courier partners (Delhivery, BlueDart, DTDC). Free shipping on orders over ₹1,499 (flat ₹99 below ₹1,499). Real-time tracking link sent via SMS and email.</p>
                </div>
                <div className="shipping-card">
                  <Shield size={24} className="shipping-card-icon" />
                  <h4>Armored Packaging</h4>
                  <p>Every single card and slab is packed inside bubble-wrapped rigid cardboard sleeves, waterproof sealed, and boxed to survive transit bumps.</p>
                </div>
                <div className="shipping-card">
                  <RotateCcw size={24} className="shipping-card-icon" />
                  <h4>Transit Guarantee</h4>
                  <p>In the rare event of transit damage or loss, our dedicated collector support team will issue a replacement or full refund promptly.</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'care' && (
            <motion.div
              key="care"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="tab-panel tab-care"
            >
              <div className="care-guidelines">
                <h4>Collector Guidelines for Long-Term Card Preservation</h4>
                <div className="care-grid">
                  <div className="care-item">
                    <strong>Avoid Direct Sunlight:</strong>
                    <p>Keep your displayed slabs out of harsh, direct UV exposure to protect foil holos and signature ink from fading over years.</p>
                  </div>
                  <div className="care-item">
                    <strong>Temperature & Humidity:</strong>
                    <p>Store in a cool, dry room between 18°C–24°C with relative humidity around 40%–50% to prevent micro-warping.</p>
                  </div>
                  <div className="care-item">
                    <strong>Cleaning & Care:</strong>
                    <p>Use an ultra-soft microfiber cloth to wipe fingerprints off acrylic surfaces. Avoid chemical alcohol cleaners on slab cases.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
