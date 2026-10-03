const WISHLIST_STORAGE_KEY = 'slabguardz:wishlist'

export function readWishlistIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const storedValue = window.localStorage.getItem(WISHLIST_STORAGE_KEY)
    const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : []
    return Array.isArray(parsedValue) && parsedValue.every((value) => typeof value === 'string') ? parsedValue : []
  } catch {
    return []
  }
}

export function writeWishlistIds(productIds: string[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(productIds))
}
