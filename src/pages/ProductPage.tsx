import { useParams, Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { PageIntro } from '../components/ui/PageIntro'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductPurchasePanel } from '../components/product/ProductPurchasePanel'
import { RelatedProducts } from '../components/product/RelatedProducts'
import { useProductCatalogState } from '../hooks/useProductCatalogState'

export function ProductPage() {
  const { id } = useParams()
  const { products, getProductById } = useProductCatalogState()
  const product = id ? getProductById(id) : undefined

  if (!product) {
    return (
      <PageIntro
        eyebrow="Product detail"
        title="Product not found"
        description="This product may have moved or is no longer part of the collection."
      />
    )
  }

  const sameCategoryProducts = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category === product.category
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
