import type { Product } from '../../data/products'

type ProductInformationProps = {
  product: Product
}

export function ProductInformation({ product }: ProductInformationProps) {
  return (
    <section className="product-information">
      <div className="product-description-block">
        <p className="eyebrow">The details</p>
        <h2>Made to keep your collection close.</h2>
        <p>{product.description ?? 'Product details will be added as this catalogue develops.'}</p>
      </div>
      <div className="product-information-grid">
        <div><h3>Specifications</h3><dl>{(product.specifications ?? []).map((specification) => <div key={specification.label}><dt>{specification.label}</dt><dd>{specification.value}</dd></div>)}</dl></div>
        <div><h3>Collector information</h3><p>{product.collectorInfo ?? 'Collector notes will be added for this product.'}</p><h3>Shipping</h3><p>{product.shippingInfo ?? 'India-wide shipping information will be confirmed at checkout.'}</p><h3>Returns</h3><p>{product.returnsInfo ?? 'Return information will be provided before checkout.'}</p></div>
      </div>
    </section>
  )
}
