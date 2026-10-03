import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { PageIntro } from '../components/ui/PageIntro'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductInformation } from '../components/product/ProductInformation'
import { ProductPurchasePanel } from '../components/product/ProductPurchasePanel'
import { RelatedProducts } from '../components/product/RelatedProducts'
import { useProductCatalogState } from '../hooks/useProductCatalogState'

export function ProductPage() {
  const { id } = useParams()
  const { products, getProductById } = useProductCatalogState()
  const product = id ? getProductById(id) : undefined

  if (!product) {
    return <PageIntro eyebrow="Product detail" title="Product not found" description="This product may have moved or is no longer part of the collection." />
  }

  const sameCategoryProducts = products.filter((candidate) => candidate.id !== product.id && candidate.category === product.category)
  const relatedProducts = (sameCategoryProducts.length ? sameCategoryProducts : products.filter((candidate) => candidate.id !== product.id)).slice(0, 4)

  return (
    <div className="product-page">
      <Container className="product-breadcrumbs"><Link to="/shop">Shop</Link><span>/</span><span>{product.name}</span></Container>
      <Container className="product-detail-layout">
        <ProductGallery product={product} />
        <ProductPurchasePanel product={product} />
      </Container>
      <Container><ProductInformation product={product} /></Container>
      <RelatedProducts products={relatedProducts} />
    </div>
  )
}
