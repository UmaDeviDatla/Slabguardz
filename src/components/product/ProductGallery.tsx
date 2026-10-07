import { motion, AnimatePresence } from 'framer-motion'
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
    <div className="gg-gallery">
      {/* Vertical thumbnails column on the left side (GradedGuard layout) */}
      <div className="gg-gallery-thumbs" aria-label="Product image thumbnails">
        {images.map((image, index) => (
          <button
            className={`gg-thumb${index === selectedImage ? ' is-active' : ''}`}
            key={`${image}-${index}`}
            type="button"
            aria-label={`View product image ${index + 1}`}
            onClick={() => setSelectedImage(index)}
          >
            <img src={image} alt={`${product.name} thumbnail ${index + 1}`} />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="gg-gallery-main">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={images[selectedImage]}
            alt={product.name}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
        <button
          className="gg-gallery-expand"
          type="button"
          aria-label="Open product image preview"
          onClick={() => setIsZoomed(true)}
        >
          <Maximize2 size={16} strokeWidth={1.8} />
        </button>
      </div>

      {/* Fullscreen zoom modal */}
      {isZoomed && (
        <div
          className="product-image-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} image preview`}
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="product-image-modal-close"
            type="button"
            aria-label="Close image preview"
            onClick={() => setIsZoomed(false)}
          >
            <X size={24} />
          </button>
          <img
            src={images[selectedImage]}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
