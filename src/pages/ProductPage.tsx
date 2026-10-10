import { useParams, Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductPurchasePanel } from '../components/product/ProductPurchasePanel'
import { RelatedProducts } from '../components/product/RelatedProducts'
import { useProductCatalogState } from '../hooks/useProductCatalogState'

export function ProductPage() {
  const { id } = useParams()
  const { products, getProductById, isLoading } = useProductCatalogState()
  const product = id ? getProductById(id) : undefined

  if (isLoading && !product) {
    return (
      <div className="product-page gg-product-page">
        <Container className="gg-breadcrumbs">
          <div className="skeleton skeleton-text" style={{ width: 160, height: 16, borderRadius: 4 }} />
        </Container>

        <Container className="gg-product-detail-layout">
          <div className="gg-gallery-skeleton" style={{ width: '100%', maxWidth: 580 }}>
            <div
              className="skeleton"
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: 16,
                background: 'var(--color-surface-soft)',
              }}
            />
          </div>

          <div
            className="gg-panel-skeleton"
            style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 520 }}
          >
            <div className="skeleton skeleton-text" style={{ width: 80, height: 14, borderRadius: 4 }} />
            <div className="skeleton skeleton-title" style={{ width: '80%', height: 38, borderRadius: 6 }} />
            <div className="skeleton skeleton-text" style={{ width: 140, height: 26, borderRadius: 4 }} />
            <div className="skeleton" style={{ width: '100%', height: 72, borderRadius: 8 }} />
            <div className="skeleton" style={{ width: '65%', height: 48, borderRadius: 9999, marginTop: 12 }} />
          </div>
        </Container>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-page gg-product-page">
        <Container>
          <div
            className="shop-empty-state"
            style={{
              padding: 'clamp(60px, 10vw, 120px) 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <p className="eyebrow">Product Catalog</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', margin: 0, fontWeight: 800 }}>
              Product Not Found
            </h2>
            <p style={{ maxWidth: 440, color: 'var(--color-ink-muted)', margin: '0 0 12px' }}>
              This product may have moved or is no longer available in the active catalog.
            </p>
            <Link className="button button-primary" to="/shop">
              Explore All Products
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const sameCategoryProducts = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category === product.category,
  )
  const relatedProducts = (
    sameCategoryProducts.length
      ? sameCategoryProducts
      : products.filter((candidate) => candidate.id !== product.id)
  ).slice(0, 3)

  return (
    <div className="product-page gg-product-page">
      <Container className="gg-breadcrumbs">
        <Link to="/" className="gg-breadcrumb-home">
          Home
        </Link>
        <span className="gg-breadcrumb-sep">/</span>
        <Link to={`/category/${product.category}`} className="gg-breadcrumb-home">
          {product.category.replaceAll('-', ' ')}
        </Link>
        <span className="gg-breadcrumb-sep">/</span>
        <span className="gg-breadcrumb-current">{product.name}</span>
      </Container>

      <Container className="gg-product-detail-layout">
        <ProductGallery product={product} />
        <ProductPurchasePanel product={product} />
      </Container>

      <RelatedProducts products={relatedProducts} />
    </div>
  )
}
