import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CartPageContent } from '../components/cart/CartPageContent'
import { Container } from '../components/ui/Container'
import { useCart } from '../hooks/useCart'

export function CartPage() {
  const [searchParams] = useSearchParams()
  const razorpayPaymentId = searchParams.get('razorpay_payment_id')?.trim()
  const orderId = searchParams.get('order_id')?.trim() || searchParams.get('payment_id')?.trim()
  const isCheckoutSuccess = searchParams.get('checkout') === 'success'

  const navigate = useNavigate()
  const { completeSuccessfulCheckout } = useCart()

  useEffect(() => {
    if (!isCheckoutSuccess) return

    const effectivePaymentId =
      razorpayPaymentId ||
      orderId ||
      `SG-PAY-${Date.now().toString(36).toUpperCase()}`

    completeSuccessfulCheckout(effectivePaymentId)
    const targetParams = new URLSearchParams()
    targetParams.set('razorpay_payment_id', effectivePaymentId)
    if (orderId) {
      targetParams.set('order_id', orderId)
    }

    navigate(
      `/order-confirmation?${targetParams.toString()}`,
      { replace: true },
    )
  }, [completeSuccessfulCheckout, isCheckoutSuccess, navigate, orderId, razorpayPaymentId])

  if (isCheckoutSuccess) {
    return (
      <Container className="cart-page">
        <div className="cart-empty" role="status">
          <p className="eyebrow">Payment received</p>
          <h1>Confirming your payment...</h1>
          <p>Redirecting to your order confirmation receipt.</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="cart-page">
      <CartPageContent />
    </Container>
  )
}
