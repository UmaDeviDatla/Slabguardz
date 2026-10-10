import { UploadCloud, X } from 'lucide-react'
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'

export type UploadedImage = {
  id: string
  file: File
  name: string
  size: number
  dataUrl: string
}

type ImageUploadFieldProps = {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
  label?: string
  helperText?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Compresses an image in the browser using HTML Canvas so it can be safely sent
 * via EmailJS or stored in memory without exceeding payload limits.
 */
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onerror = () => resolve('')
    reader.onload = (event) => {
      const img = new window.Image()
      img.onerror = () => resolve(String(event.target?.result || ''))
      img.onload = () => {
        const MAX_DIM = 1000
        let { width, height } = img

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width)
            width = MAX_DIM
          } else {
            width = Math.round((width * MAX_DIM) / height)
            height = MAX_DIM
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          resolve(String(event.target?.result || ''))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        // Compress as JPEG with 0.75 quality for small payload (~40-70KB)
        const compressed = canvas.toDataURL('image/jpeg', 0.75)
        resolve(compressed)
      }
      img.src = String(event.target?.result || '')
    }
    reader.readAsDataURL(file)
  })
}

export function ImageUploadField({
  images,
  onImagesChange,
  maxImages = 3,
  label = 'Add Photos / Attachments',
  helperText = 'Upload photos of the product or packaging from your device (PNG, JPG, WEBP).',
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const remainingSlots = maxImages - images.length
    if (remainingSlots <= 0) return

    const filesToProcess = Array.from(fileList).slice(0, remainingSlots)
    setIsProcessing(true)

    try {
      const newUploads: UploadedImage[] = []

      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) continue

        const compressedDataUrl = await compressImage(file)
        if (!compressedDataUrl) continue

        newUploads.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          dataUrl: compressedDataUrl,
        })
      }

      onImagesChange([...images, ...newUploads])
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    void handleFiles(event.target.files)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    void handleFiles(event.dataTransfer.files)
  }

  const handleRemove = (idToRemove: string) => {
    onImagesChange(images.filter((img) => img.id !== idToRemove))
  }

  const isFull = images.length >= maxImages

  return (
    <div className="image-upload-wrapper">
      <div className="image-upload-header">
        <label className="image-upload-label" htmlFor="device-file-input">
          {label}
        </label>
        <span className="image-upload-count">
          {images.length} / {maxImages} uploaded
        </span>
      </div>

      <p className="image-upload-hint">{helperText}</p>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        id="device-file-input"
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple
        disabled={isFull || isProcessing}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {/* Dropzone button / container */}
      {!isFull && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload photos from device"
          className={`image-upload-dropzone${isDragging ? ' is-dragging' : ''}${isProcessing ? ' is-processing' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="image-upload-icon-circle">
            <UploadCloud size={22} strokeWidth={2} />
          </div>
          <div className="image-upload-dropzone-text">
            <strong>
              {isProcessing ? 'Processing photos...' : 'Click or drop files from your device'}
            </strong>
            <span>PNG, JPG, WEBP up to 10MB per file</span>
          </div>
        </div>
      )}

      {/* Uploaded thumbnails list */}
      {images.length > 0 && (
        <div className="image-upload-previews" role="list" aria-label="Attached images">
          {images.map((image) => (
            <div key={image.id} className="image-upload-preview-card" role="listitem">
              <div className="image-upload-thumb-wrap">
                <img src={image.dataUrl} alt={image.name} className="image-upload-thumb" />
              </div>
              <div className="image-upload-meta">
                <span className="image-upload-filename" title={image.name}>
                  {image.name}
                </span>
                <span className="image-upload-filesize">{formatFileSize(image.size)}</span>
              </div>
              <button
                type="button"
                className="image-upload-remove-btn"
                aria-label={`Remove photo ${image.name}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(image.id)
                }}
              >
                <X size={15} strokeWidth={2.2} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
