import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

// Create payment intent for premium customizations
export const createPaymentIntent = async (amount: number, userId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        userId,
        product: 'premium_customization',
      },
    })
    return paymentIntent
  } catch (error) {
    console.error('Payment intent error:', error)
    throw error
  }
}

// Verify payment
export const retrievePaymentIntent = async (clientSecret: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      clientSecret.split('_secret_')[0]
    )
    return paymentIntent
  } catch (error) {
    console.error('Retrieve payment error:', error)
    throw error
  }
}

// Webhook handler for payment events
export const handleStripeWebhook = async (event: any) => {
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object)
      // Update user subscription/premium status
      break
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object)
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}
