import { ArrowRight, ArrowUpRight, Check, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Container } from '../ui/Container'
import { useProductCatalogState } from '../../hooks/useProductCatalogState'
import { PriceDisplay } from '../ui/PriceDisplay'
import { useCart } from '../../hooks/useCart'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimateOnScroll } from '../ui/AnimateOnScroll'

function getProductDescription(product: { description?: string; category: string; name: string }) {
  if (product.description && product.description.trim()) {
    const plain = product.description.replace(/<[^>]*>?/gm, '').trim()
    if (plain.length > 5) return plain
  }
  if (product.category === 'pokemon-cards') {
    return 'Authenticated PSA graded Pokémon collectible single, preserved in collector-grade condition.'
  }
  if (product.category === 'slabguardz-protection') {
    return 'Precision snap-on TPU bumper case with drop-absorbing corner defense.'
  }
  return 'Premium collector display and storage solution engineered for graded cards.'
}

export function CategoryGridSection() {
  const { products } = useProductCatalogState()
  const { addItem } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)

  const spotlightProducts = products.length > 0 ? products.slice(0, 3) : []

  const handleQuickAdd = (product: typeof products[0]) => {
    addItem(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1600)
  }

  return (
    <section className="home-section home-categories-graded">
      <Container>
        <div className="graded-spotlight-section" style={{ marginTop: 0 }}>
          <AnimateOnScroll>
            <SectionHeading
              eyebrow="FEATURED DROPS"
              title="PRECISION CASES & COLLECTOR GRAILS"
              action={
                <Link className="text-link" to="/shop">
                  View all ({products.length || 3}) <ArrowRight size={15} />
                </Link>
              }
            />
          </AnimateOnScroll>

          <div className="graded-spotlight-grid">
            {spotlightProducts.length > 0 ? (
              spotlightProducts.map((product) => {
                const isAdded = addedId === product.id
                return (
                  <motion.div
                    key={product.id}
                    className="graded-product-card"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="graded-card-img-wrap">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="graded-card-img"
                        />
                      </Link>
                      <span className="graded-badge-pill">
                        {product.badge || (product.stockStatus === 'in-stock' ? 'IN STOCK' : 'VERIFIED')}
                      </span>
                    </div>
                    <div className="graded-card-body">
                      <span className="graded-card-cat">{product.category.replaceAll('-', ' ')}</span>
                      <h3 className="graded-card-name">
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                      </h3>
                      <p className="graded-card-desc">
                        {getProductDescription(product)}
                      </p>
                      <div className="graded-card-footer">
                        <div className="graded-card-price-wrap">
                          <PriceDisplay
                            price={product.price}
                            currencyCode={product.currencyCode}
                            compareAtPrice={product.compareAtPrice}
                          />
                        </div>
                        <button
                          type="button"
                          className={`graded-card-action-btn${isAdded ? ' is-added' : ''}`}
                          onClick={() => handleQuickAdd(product)}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <span>{isAdded ? 'Added' : 'Add to Cart'}</span>
                          {isAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              [
                {
                  id: 'psa-gengar',
                  title: 'SlabGuardz Bumper — Crimson Flame',
                  cat: 'SLABGUARDZ PROTECTION',
                  desc: 'Precision snap-on TPU bumper cases engineered for PSA & CGC slabs.',
                  img: '/banners/banner-1.jpg',
                  price: 499,
                  badge: 'FLAGSHIP',
                },
                {
                  id: 'psa-dragonite',
                  title: 'Graded Pokémon Cards',
                  cat: 'AUTHENTIC GRAILS',
                  desc: 'Authenticated PSA & CGC vintage holos, modern grails, and Japanese gems.',
                  img: '/banners/banner-2.jpg',
                  price: 1499,
                  badge: 'VERIFIED',
                },
                {
                  id: 'psa-mew',
                  title: 'Collector Accessories',
                  cat: 'GEAR & DISPLAY',
                  desc: 'Precision card sleeves, acrylic stands, and travel protection kits.',
                  img: '/banners/banner-3.jpg',
                  price: 799,
                  badge: 'ESSENTIALS',
                },
              ].map((item) => (
                <motion.div
                  key={item.id}
                  className="graded-product-card"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="graded-card-img-wrap">
                    <Link to="/category/slabguardz-protection">
                      <img
                        src={item.img}
                        alt={item.title}
                        loading="lazy"
                        className="graded-card-img"
                      />
                    </Link>
                    <span className="graded-badge-pill">{item.badge}</span>
                  </div>
                  <div className="graded-card-body">
                    <span className="graded-card-cat">{item.cat}</span>
                    <h3 className="graded-card-name">
                      <Link to="/category/slabguardz-protection">{item.title}</Link>
                    </h3>
                    <p className="graded-card-desc">{item.desc}</p>
                    <div className="graded-card-footer">
                      <span className="graded-price">₹{item.price}</span>
                      <Link to="/shop" className="graded-card-action-btn">
                        <span>Shop Now</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
