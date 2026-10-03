import type { Product } from '../data/products'
import { toMajorCurrencyAmount } from './hostingerApi'

const apiBaseUrl = import.meta.env.VITE_HOSTINGER_ECOMMERCE_API_URL ?? 'https://api-ecommerce.hostinger.com'
const salesChannelId = import.meta.env.VITE_HOSTINGER_SALES_CHANNEL_ID
const CART_ID_KEY = 'slabguardz:hostinger-cart-id'
const CART_TOKEN_KEY = 'slabguardz:hostinger-cart-token'

export type HostingerCartItem = {
  id: string
  variant_id: string | null
  quantity: number
  title?: string | null
  description?: string | null
  thumbnail?: string | null
  unit_price?: number | null
  variant?: { id?: string | null; title?: string | null; product_id?: string | null } | null
}

export type HostingerCart = {
  id: string | null
  currencyCode: string
  items: HostingerCartItem[]
  subtotal: number
  total: number
  taxTotal: number
  shippingTotal: number
}

type HostingerCartResponse = {
  data: {
    id?: string | null
    items?: HostingerCartItem[] | null
    subtotal?: number | null
    total?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    region?: { currency_code?: string | null } | null
    store?: { currency_code?: string | null } | null
  }
  cart_token?: string
}

export type HostingerCheckoutItem = {
  variant_id: string
  quantity: number
}

export type HostingerCheckoutRequest = {
  items: HostingerCheckoutItem[]
  success_url: string
  cancel_url: string
  locale?: string
}

export type HostingerCheckoutResponse = {
  url: string
  cart_token: string
}

function getSession() {
  if (typeof window === 'undefined') return { cartId: null, cartToken: null }
  return { cartId: sessionStorage.getItem(CART_ID_KEY), cartToken: sessionStorage.getItem(CART_TOKEN_KEY) }
}

function setSession(cartId: string, cartToken: string) {
  sessionStorage.setItem(CART_ID_KEY, cartId)
  sessionStorage.setItem(CART_TOKEN_KEY, cartToken)
}

export function clearHostingerCartSession() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(CART_ID_KEY)
  sessionStorage.removeItem(CART_TOKEN_KEY)
}

function isInvalidCartSessionError(error: unknown): boolean {
  return (
    error instanceof Error &&
    /(\(400\)|\(401\)|\(404\))/.test(error.message)
  )
}

function getCartUrl(cartId: string) {
  return new URL(`/v2/carts/${encodeURIComponent(cartId)}`, apiBaseUrl)
}

function logHostingerRequestFailure(
  method: string,
  url: URL,
  status: number,
  responseBody: unknown,
) {
  if (!import.meta.env.DEV) return

  const payload =
    typeof responseBody === 'string'
      ? responseBody
      : responseBody && typeof responseBody === 'object'
        ? responseBody
        : undefined

  console.error('[SlabGuardz cart debug]', {
    method,
    url: url.toString(),
    status,
    body: payload,
  })
}

async function request<T>(url: URL, init: RequestInit = {}, cartToken?: string): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (cartToken) headers.set('Authorization', `Bearer ${cartToken}`)

  try {
    const response = await fetch(url, { ...init, headers })

    const rawText = await response.text()
    let payload: unknown = rawText

    if (rawText) {
      try {
        payload = JSON.parse(rawText)
      } catch {
        payload = rawText
      }
    }

    if (!response.ok) {
      logHostingerRequestFailure(
        init.method ?? 'GET',
        url,
        response.status,
        payload,
      )
      throw new Error('Try again later.')
    }

    return (payload && typeof payload === 'object' ? payload : {}) as T
  } catch (error) {
    if (error instanceof Error && error.message === 'Try again later.') {
      throw error
    }
    logHostingerRequestFailure(
      init.method ?? 'GET',
      url,
      0,
      error,
    )
    throw new Error('Try again later.')
  }
}

function mapCart(payload: HostingerCartResponse, fallbackToken?: string): HostingerCart {
  const data = payload.data
  const currencyCode = data.region?.currency_code ?? data.store?.currency_code ?? 'INR'
  const normalize = (amount?: number | null) => toMajorCurrencyAmount(amount ?? null, currencyCode) ?? 0
  if (data.id && payload.cart_token) setSession(data.id, payload.cart_token)
  else if (data.id && fallbackToken) setSession(data.id, fallbackToken)
  return {
    id: data.id ?? null,
    currencyCode,
    items: data.items ?? [],
    subtotal: normalize(data.subtotal),
    total: normalize(data.total),
    taxTotal: normalize(data.tax_total),
    shippingTotal: normalize(data.shipping_total),
  }
}

function checkoutReturnUrls() {
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return { success_url: `${origin}/cart`, cancel_url: `${origin}/cart` }
}

export async function createHostingerCart(product: Product, quantity: number, signal?: AbortSignal) {
  if (!salesChannelId || !product.variantId) throw new Error('The product has no available Hostinger variant.')
  const url = new URL(`/v2/channels/${encodeURIComponent(salesChannelId)}/carts`, apiBaseUrl)
  const payload = await request<HostingerCartResponse>(url, {
    method: 'POST',
    body: JSON.stringify({ items: [{ variant_id: product.variantId, quantity }], ...checkoutReturnUrls() }),
    signal,
  })
  if (!payload.data.id || !payload.cart_token) throw new Error('Try again later.')
  return mapCart(payload)
}

export async function createHostingerCheckout(
  items: HostingerCheckoutItem[],
  signal?: AbortSignal,
) {
  if (!salesChannelId) {
    throw new Error('VITE_HOSTINGER_SALES_CHANNEL_ID is not configured.')
  }

  const origin = typeof window === 'undefined' ? '' : window.location.origin
  const url = new URL(
    `/v2/channels/${encodeURIComponent(salesChannelId)}/checkout`,
    apiBaseUrl,
  )
  const payload = await request<HostingerCheckoutResponse>(url, {
    method: 'POST',
    body: JSON.stringify({
      items,
      success_url: `${origin}/cart?checkout=success`,
      cancel_url: `${origin}/cart?checkout=cancelled`,
      locale: 'en-IN',
    } satisfies HostingerCheckoutRequest),
    signal,
  })

  if (!payload.url || !payload.cart_token) {
    throw new Error('Try again later.')
  }

  return payload.url
}

export async function getHostingerCart(signal?: AbortSignal) {
  const { cartId, cartToken } = getSession()
  if (!cartId || !cartToken) return null
  try {
    const payload = await request<HostingerCartResponse>(getCartUrl(cartId), { signal }, cartToken)
    return mapCart(payload, cartToken)
  } catch (error) {
    if (isInvalidCartSessionError(error)) {
      clearHostingerCartSession()
      return null
    }
    throw error
  }
}

export async function addHostingerCartItem(product: Product, quantity: number, signal?: AbortSignal) {
  const { cartId, cartToken } = getSession()
  if (!cartId || !cartToken) return createHostingerCart(product, quantity, signal)
  if (!product.variantId) throw new Error('The product has no available Hostinger variant.')

  try {
    const url = new URL(`/v2/carts/${encodeURIComponent(cartId)}/line-items`, apiBaseUrl)
    const payload = await request<HostingerCartResponse>(url, {
      method: 'POST',
      body: JSON.stringify({ items: [{ variant_id: product.variantId, quantity }] }),
      signal,
    }, cartToken)
    return mapCart(payload, cartToken)
  } catch (error) {
    if (isInvalidCartSessionError(error)) {
      clearHostingerCartSession()
      return createHostingerCart(product, quantity, signal)
    }
    throw error
  }
}

export async function updateHostingerCartItem(cartId: string, lineItemId: string, quantity: number, product: Product, signal?: AbortSignal) {
  const { cartToken } = getSession()
  if (!cartToken) throw new Error('The Hostinger cart session is missing.')
  const url = new URL(`/v2/carts/${encodeURIComponent(cartId)}/line-items/${encodeURIComponent(lineItemId)}`, apiBaseUrl)
  try {
    const payload = await request<HostingerCartResponse>(url, { method: 'PATCH', body: JSON.stringify({ quantity }), signal }, cartToken)
    return mapCart(payload, cartToken)
  } catch (error) {
    if (isInvalidCartSessionError(error)) {
      clearHostingerCartSession()
      return addHostingerCartItem(product, quantity, signal)
    }
    if (!(error instanceof Error) || !error.message.includes('(404)')) throw error
    await removeHostingerCartItems(cartId, [lineItemId], signal)
    return addHostingerCartItem(product, quantity, signal)
  }
}

export async function removeHostingerCartItems(cartId: string, lineItemIds: string[], signal?: AbortSignal) {
  const { cartToken } = getSession()
  if (!cartToken) throw new Error('The Hostinger cart session is missing.')

  try {
    const url = new URL(`/v2/carts/${encodeURIComponent(cartId)}/line-items`, apiBaseUrl)
    const payload = await request<HostingerCartResponse>(url, { method: 'DELETE', body: JSON.stringify({ line_item_ids: lineItemIds }), signal }, cartToken)
    return mapCart(payload, cartToken)
  } catch (error) {
    if (isInvalidCartSessionError(error)) {
      clearHostingerCartSession()
      return {
        id: null,
        currencyCode: 'INR',
        items: [],
        subtotal: 0,
        total: 0,
        taxTotal: 0,
        shippingTotal: 0,
      }
    }
    throw error
  }
}