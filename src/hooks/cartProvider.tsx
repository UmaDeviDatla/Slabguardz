import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import {
  CartContext,
  type CartContextValue,
  type CartItem,
  type CartLine,
} from './cartContext'

import { useProductCatalogState } from './useProductCatalogState'

import {
  addHostingerCartItem,
  clearHostingerCartSession,
  createHostingerCheckout,
  getHostingerCart,
  removeHostingerCartItems,
  updateHostingerCartItem,
  type HostingerCheckoutItem,
  type HostingerCart,
} from '../lib/hostingerCartApi'

import { toMajorCurrencyAmount } from '../lib/hostingerApi'
import type { Product } from '../data/products'

const PENDING_CHECKOUT_KEY = 'slabguardz:pending-checkout'

type CheckoutSnapshot = {
  amount: number
  currencyCode: string
}

function getCartErrorMessage(): string {
  return 'Something went wrong. Try again later.'
}

function getSuccessfulCheckoutPaymentId(): string | null {
  if (typeof window === 'undefined') return null

  const searchParams = new URLSearchParams(window.location.search)
  if (searchParams.get('checkout') !== 'success') return null
  return searchParams.get('razorpay_payment_id')?.trim() || null
}

function fallbackProduct(
  item: {
    id: string
    variant_id: string | null
    title?: string | null
    thumbnail?: string | null
    unit_price?: number | null
  },
  currencyCode: string,
): Product {
  return {
    id: item.id,
    name: item.title ?? item.variant_id ?? item.id,
    category: 'accessories',
    price:
      toMajorCurrencyAmount(item.unit_price ?? null, currencyCode) ?? 0,
    currencyCode,
    image: item.thumbnail ?? '',
    variantId: item.variant_id ?? undefined,
    priceUnavailable: item.unit_price == null,
  }
}

export function CartProvider({
  children,
}: {
  children: ReactNode
}) {
  const { products } = useProductCatalogState()

  const successfulReturnOnMount = getSuccessfulCheckoutPaymentId()
  const [cart, setCart] = useState<HostingerCart | null>(null)
  const [isLoading, setIsLoading] = useState(
    () => successfulReturnOnMount === null,
  )
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  const [isDrawerOpen, setIsDrawerOpen] = useReducer(
    (open) => !open,
    false,
  )

  const mutationQueue = useRef(Promise.resolve())

  const completeSuccessfulCheckout = useCallback((paymentId: string) => {
    const confirmationKey = `slabguardz:checkout-confirmation:${paymentId}`

    try {
      if (!sessionStorage.getItem(confirmationKey)) {
        const pendingCheckout = sessionStorage.getItem(PENDING_CHECKOUT_KEY)
        if (pendingCheckout) {
          sessionStorage.setItem(confirmationKey, pendingCheckout)
        }
      }
      sessionStorage.removeItem(PENDING_CHECKOUT_KEY)
    } catch (storageError) {
      console.error('Unable to preserve checkout confirmation details.', storageError)
    }

    clearHostingerCartSession()
    setCart(null)
    setIsLoading(false)
    setError(null)
  }, [])

  /*
   * Load the existing Hostinger cart when the provider starts.
   */
  useEffect(() => {
    if (successfulReturnOnMount) {
      return
    }

    const controller = new AbortController()

    getHostingerCart(controller.signal)
      .then(setCart)
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        ) {
          return
        }

        setError(getCartErrorMessage())
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [retryKey, successfulReturnOnMount])

  /*
   * Queue cart mutations so multiple quick clicks
   * do not overwrite each other.
   */
  const runMutation = useCallback(
    (mutation: () => Promise<HostingerCart | null>) => {
      const nextMutation = mutationQueue.current.then(mutation)

      mutationQueue.current = nextMutation.then(
        () => undefined,
        () => undefined,
      )

      return nextMutation
    },
    [],
  )

  /*
   * Convert Hostinger cart items into the application's
   * CartLine format.
   */
  const lines = useMemo<CartLine[]>(() => {
    if (!cart) {
      return []
    }

    return cart.items.map((item) => {
      const product =
        products.find(
          (candidate) => candidate.variantId === item.variant_id,
        ) ?? fallbackProduct(item, cart.currencyCode)

      const unitPrice =
        item.unit_price == null
          ? product.price
          : toMajorCurrencyAmount(
              item.unit_price,
              cart.currencyCode,
            ) ?? product.price

      return {
        product,
        quantity: item.quantity,
        lineItemId: item.id,
        variantId: item.variant_id ?? undefined,
        variantTitle:
          item.variant?.title ?? product.variantTitle,
        unitPrice,
        currencyCode: cart.currencyCode,
        lineTotal: unitPrice * item.quantity,
      }
    })
  }, [cart, products])

  /*
   * Execute a Hostinger cart mutation and update
   * the local cart with Hostinger's response.
   */
  const updateRemoteCart = useCallback(
    (mutation: () => Promise<HostingerCart | null>) => {
      setError(null)

      return runMutation(mutation)
        .then(setCart)
        .catch(() => {
          setError(getCartErrorMessage())
        })
    },
    [runMutation],
  )

  /*
   * Build the public cart context.
   */
  const value = useMemo<CartContextValue>(() => {
    const findLine = (productId: string) =>
      lines.find((line) => line.product.id === productId)

    const addItem = (
      product: Product,
      quantity = 1,
    ) => {
      if (!product.variantId) {
        setError(getCartErrorMessage())
        return
      }

      void updateRemoteCart(() =>
        addHostingerCartItem(product, quantity),
      )

      if (!isDrawerOpen) {
        setIsDrawerOpen()
      }
    }

    const updateQuantity = (
      productId: string,
      quantity: number,
    ) => {
      const line = findLine(productId)

      if (!line || !cart?.id) {
        return
      }

      void updateRemoteCart(() =>
        quantity <= 0
          ? removeHostingerCartItems(
              cart.id!,
              [line.lineItemId],
            )
          : updateHostingerCartItem(
              cart.id!,
              line.lineItemId,
              quantity,
              line.product,
            ),
      )
    }

    const removeItem = (productId: string) => {
      const line = findLine(productId)

      if (!line || !cart?.id) {
        return
      }

      void updateRemoteCart(() =>
        removeHostingerCartItems(
          cart.id!,
          [line.lineItemId],
        ),
      )
    }

    const clearCart = () => {
      if (!cart?.id || !lines.length) {
        return
      }

      void updateRemoteCart(() =>
        removeHostingerCartItems(
          cart.id!,
          lines.map((line) => line.lineItemId),
        ),
      )
    }

    const checkout = () => {
      if (isCheckoutLoading) {
        return
      }

      if (!lines.length) {
        setError('Your cart is empty.')
        return
      }

      const items: HostingerCheckoutItem[] = lines.map((line) => ({
        variant_id: line.variantId ?? '',
        quantity: line.quantity,
      }))

      if (
        items.some(
          (item) =>
            !item.variant_id ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1,
        )
      ) {
        setError(getCartErrorMessage())
        return
      }

      setError(null)
      setIsCheckoutLoading(true)

      const checkoutSnapshot: CheckoutSnapshot = {
        amount:
          cart?.total ??
          cart?.subtotal ??
          lines.reduce((sum, line) => sum + line.lineTotal, 0),
        currencyCode: cart?.currencyCode ?? lines[0]?.currencyCode ?? 'INR',
      }
      try {
        sessionStorage.setItem(
          PENDING_CHECKOUT_KEY,
          JSON.stringify(checkoutSnapshot),
        )
      } catch (storageError) {
        console.error('Unable to save checkout confirmation details.', storageError)
      }

      void createHostingerCheckout(items)
        .then((checkoutUrl) => {
          window.location.assign(checkoutUrl)
        })
        .catch(() => {
          setError(getCartErrorMessage())
        })
        .finally(() => {
          setIsCheckoutLoading(false)
        })
    }

    return {
      /*
       * Cart items and lines
       */
      items: lines.map(
        (line) =>
          ({
            productId: line.product.id,
            quantity: line.quantity,
            lineItemId: line.lineItemId,
            variantId: line.variantId,
          }) satisfies CartItem,
      ),

      lines,

      itemCount: lines.reduce(
        (total, line) => total + line.quantity,
        0,
      ),

      /*
       * Hostinger totals
       */
      subtotal:
        cart?.subtotal ??
        lines.reduce(
          (total, line) => total + line.lineTotal,
          0,
        ),

      shippingTotal: cart?.shippingTotal ?? 0,

      taxTotal: cart?.taxTotal ?? 0,

      total:
        cart?.total ??
        cart?.subtotal ??
        lines.reduce(
          (total, line) => total + line.lineTotal,
          0,
        ),

      currencyCode: cart?.currencyCode ?? 'INR',

      /*
       * UI state
       */
      isDrawerOpen,
      isLoading,
      isCheckoutLoading,
      error,

      /*
       * Retry
       */
      retry: () => {
        setError(null)
        setRetryKey((key) => key + 1)
      },

      checkout,
      completeSuccessfulCheckout,

      /*
       * Cart actions
       */
      addItem,
      updateQuantity,
      removeItem,
      clearCart,

      /*
       * Drawer controls
       */
      openDrawer: () => {
        if (!isDrawerOpen) {
          setIsDrawerOpen()
        }
      },

      closeDrawer: () => {
        if (isDrawerOpen) {
          setIsDrawerOpen()
        }
      },
    }
  }, [
    cart,
    completeSuccessfulCheckout,
    error,
    isDrawerOpen,
    isCheckoutLoading,
    isLoading,
    lines,
    updateRemoteCart,
  ])

  /*
   * Clear the saved Hostinger cart session
   * when the cart becomes empty.
   */
  useEffect(() => {
    if (cart?.items.length === 0) {
      clearHostingerCartSession()
    }
  }, [cart])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}