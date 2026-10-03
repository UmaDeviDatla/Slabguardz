import { Maximize2, X } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../../data/products'

type ProductGalleryProps = {
  product: Product
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.gallery?.length ? product.gallery : [product.image]
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <img src={images[selectedImage]} alt={product.name} />
        <button className="product-gallery-zoom" type="button" aria-label="Open product image preview" onClick={() => setIsZoomed(true)}>
          <Maximize2 size={17} strokeWidth={1.8} />
        </button>
      </div>
      <div className="product-gallery-thumbnails" aria-label="Product image thumbnails">
        {images.map((image, index) => <button className={index === selectedImage ? 'is-active' : ''} key={`${image}-${index}`} type="button" aria-label={`View product image ${index + 1}`} onClick={() => setSelectedImage(index)}><img src={image} alt="" /></button>)}
      </div>
      {isZoomed && <div className="product-image-modal" role="dialog" aria-modal="true" aria-label={`${product.name} image preview`}>
        <button className="product-image-modal-close" type="button" aria-label="Close image preview" onClick={() => setIsZoomed(false)}><X size={22} /></button>
        <img src={images[selectedImage]} alt={product.name} />
      </div>}
    </div>
  )
}
