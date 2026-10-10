import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, X } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../../data/products'

type ProductGalleryProps = {
  product: Product
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const rawImages = product.gallery?.length ? product.gallery : [product.image]
  const images = rawImages.filter(Boolean).length > 0 ? rawImages.filter(Boolean) : ['/favicon.png']
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const activeIndex = selectedImage < images.length ? selectedImage : 0
  const activeImage = images[activeIndex]

  return (
    <div className={`gg-gallery${images.length <= 1 ? ' single-image' : ''}`}>
      {/* Vertical thumbnails column (shown only when multiple images exist) */}
      {images.length > 1 && (
        <div className="gg-gallery-thumbs" aria-label="Product image thumbnails">
          {images.map((image, index) => (
            <button
              className={`gg-thumb${index === activeIndex ? ' is-active' : ''}`}
              key={`${image}-${index}`}
              type="button"
              aria-label={`View product image ${index + 1}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={image} alt={`${product.name} thumbnail ${index + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Main image container */}
      <div className="gg-gallery-main">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={product.name}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            loading="eager"
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
            src={activeImage}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
