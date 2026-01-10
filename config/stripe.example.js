/**
 * Stripe Configuration
 * 
 * This file shows how to set up Stripe payment processing.
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a Stripe account at https://stripe.com
 * 2. Get your Publishable Key from Dashboard > Developers > API Keys
 * 3. Create a new file called "stripe.js" (copy this file and rename it)
 * 4. Add your Stripe Publishable Key below
 * 5. Set window.STRIPE_PUBLISHABLE_KEY in your site before checkout
 * 
 * For production, you'll also need:
 * - Backend API endpoint to create checkout sessions
 * - Webhook handler to process payment events
 */

// Example: Replace with your actual Publishable Key from Stripe Dashboard
window.STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_PUBLISHABLE_KEY_HERE';

/**
 * Create a checkout session on your backend
 * 
 * You'll need a backend route that:
 * 1. Creates a Stripe Checkout Session
 * 2. Returns the session ID
 * 
 * Example Node.js/Express route:
 * 
 * app.post('/api/checkout', async (req, res) => {
 *   const { items } = req.body;
 *   
 *   const session = await stripe.checkout.sessions.create({
 *     payment_method_types: ['card'],
 *     line_items: items.map(item => ({
 *       price_data: {
 *         currency: 'usd',
 *         product_data: { name: item.title },
 *         unit_amount: Math.round(item.price * 100)
 *       },
 *       quantity: item.quantity
 *     })),
 *     mode: 'payment',
 *     success_url: 'https://yoursite.com/success.html?session_id={CHECKOUT_SESSION_ID}',
 *     cancel_url: 'https://yoursite.com/cart.html'
 *   });
 *   
 *   res.json({ sessionId: session.id });
 * });
 */
