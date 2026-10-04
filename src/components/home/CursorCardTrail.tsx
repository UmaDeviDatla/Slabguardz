import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductCatalogState } from '../../hooks/useProductCatalogState'

type TrailCard = {
  id: number
  x: number
  y: number
  rotation: number
  image: string
  zIndex: number
}

const DEFAULT_SLAB_IMAGES = [
  '/slabs/slab-1.jpeg',
  '/slabs/slab-2.jpeg',
  '/slabs/slab-3.jpeg',
  '/slabs/slab-4.jpeg',
  '/slabs/slab-5.jpeg',
  '/slabs/slab-6.jpeg',
]

type CursorCardTrailProps = {
  children?: React.ReactNode
  className?: string
  minDistance?: number
}

export function CursorCardTrail({
  children,
  className = '',
  minDistance = 65,
}: CursorCardTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState<TrailCard[]>([])
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const lastScrollSpawnRef = useRef(0)
  const imageIndexRef = useRef(0)
  const cardIdRef = useRef(0)
  const zIndexRef = useRef(10)
  const isInsideRef = useRef(false)

  const { products } = useProductCatalogState()
  const allImages = useMemo(() => {
    const productImages = products.map((p) => p.image).filter(Boolean)
    return productImages.length > 0 ? [...DEFAULT_SLAB_IMAGES, ...productImages] : DEFAULT_SLAB_IMAGES
  }, [products])

  const spawnCard = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      const nextImage = allImages[imageIndexRef.current % allImages.length]
      imageIndexRef.current += 1
      cardIdRef.current += 1
      zIndexRef.current += 1

      // Subtle natural tilt between -8deg and +8deg
      const rotation = (Math.random() - 0.5) * 16

      const newCard: TrailCard = {
        id: cardIdRef.current,
        x,
        y,
        rotation,
        image: nextImage,
        zIndex: zIndexRef.current,
      }

      setCards((prev) => {
        // Keep at most 8 active cards on screen for high performance & clean wake
        const trimmed = prev.length >= 8 ? prev.slice(prev.length - 7) : prev
        return [...trimmed, newCard]
      })

      lastPosRef.current = { x: clientX, y: clientY }

      // Auto-remove card after animation lifecycle finishes
      setTimeout(() => {
        setCards((prev) => prev.filter((c) => c.id !== newCard.id))
      }, 2400)
    },
    [allImages]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isInsideRef.current = true
      const last = lastPosRef.current
      if (!last) {
        spawnCard(e.clientX, e.clientY)
        return
      }

      const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y)
      if (dist >= minDistance) {
        spawnCard(e.clientX, e.clientY)
      }
    },
    [minDistance, spawnCard]
  )

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      isInsideRef.current = true
      const now = Date.now()
      if (now - lastScrollSpawnRef.current > 160) {
        lastScrollSpawnRef.current = now
        spawnCard(e.clientX, e.clientY)
      }
    },
    [spawnCard]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0]
      if (!touch) return
      isInsideRef.current = true
      const last = lastPosRef.current
      if (!last) {
        spawnCard(touch.clientX, touch.clientY)
        return
      }
      const dist = Math.hypot(touch.clientX - last.x, touch.clientY - last.y)
      if (dist >= minDistance) {
        spawnCard(touch.clientX, touch.clientY)
      }
    },
    [minDistance, spawnCard]
  )

  // Also spawn cards during window scroll if cursor is inside hero
  useEffect(() => {
    let lastTime = 0
    const handleScroll = () => {
      if (!isInsideRef.current || !lastPosRef.current) return
      const now = Date.now()
      if (now - lastTime > 180) {
        lastTime = now
        spawnCard(lastPosRef.current.x, lastPosRef.current.y)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [spawnCard])

  return (
    <div
      ref={containerRef}
      className={`cursor-card-trail-container ${className}`}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => { isInsideRef.current = true }}
      onMouseLeave={() => {
        isInsideRef.current = false
        lastPosRef.current = null
      }}
    >
      {/* Background / hero content */}
      {children}

      {/* Floating Trail Cards */}
      <div className="cursor-card-trail-canvas" aria-hidden="true">
        <AnimatePresence>
          {cards.map((card) => (
            <div
              key={card.id}
              className="trail-slab-card-wrapper"
              style={{
                left: `${card.x}px`,
                top: `${card.y}px`,
                zIndex: card.zIndex,
              }}
            >
              <motion.div
                className="trail-slab-card"
                initial={{
                  scale: 0.7,
                  opacity: 0,
                  rotate: card.rotation,
                  filter: 'blur(0px)',
                  y: 10,
                }}
                animate={{
                  scale: [0.7, 1.02, 1, 0.98, 0.92],
                  opacity: [0, 1, 1, 0.65, 0],
                  filter: ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(5px)', 'blur(12px)'],
                  y: [10, -4, 0, 12, 24],
                }}
                exit={{ opacity: 0, filter: 'blur(16px)', scale: 0.88 }}
                transition={{
                  duration: 2.3,
                  times: [0, 0.12, 0.55, 0.8, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="trail-slab-inner">
                  <img
                    src={card.image}
                    alt=""
                    loading="eager"
                    className="trail-slab-img"
                  />
                </div>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
