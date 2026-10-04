import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CartPageContent } from '../components/cart/CartPageContent'
import { Container } from '../components/ui/Container'
import { useCart } from '../hooks/useCart'

export function CartPage() {
  const [searchParams] = useSearchParams()
  const paymentId = searchParams.get('razorpay_payment_id')?.trim()
  const isSuccessfulReturn =
    searchParams.get('checkout') === 'success' && Boolean(paymentId)
  const navigate = useNavigate()
  const { completeSuccessfulCheckout } = useCart()

  useEffect(() => {
    if (!isSuccessfulReturn || !paymentId) return

    completeSuccessfulCheckout(paymentId)
    navigate(
      `/order-confirmation?razorpay_payment_id=${encodeURIComponent(paymentId)}`,
      { replace: true },
    )
  }, [completeSuccessfulCheckout, isSuccessfulReturn, navigate, paymentId])

  if (isSuccessfulReturn) {
    return (
      <Container className="cart-page">
        <div className="cart-empty" role="status">
          <p className="eyebrow">Payment received</p>
          <h1>Confirming your payment.</h1>
        </div>
      </Container>
    )
  }

  return <Container className="cart-page"><CartPageContent /></Container>
}
