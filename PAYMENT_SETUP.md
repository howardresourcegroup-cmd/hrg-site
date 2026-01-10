# Payment Solution Setup Guide

## Overview
Your HRG site now has checkout functionality set up. This guide explains the payment options and how to configure them.

## Current Status
✅ **Cart functionality** - Products can be added to cart and quantities adjusted
✅ **Checkout flow** - Ready for payment processing
❌ **Payment processing** - Not yet configured (you need to choose and set up a payment provider)

---

## Payment Solution Options

### Option 1: **Stripe** (RECOMMENDED for you)
**Best for:** Professional businesses, high volume, custom computers + services

**Pros:**
- Industry standard, trusted by millions
- Supports credit cards, Apple Pay, Google Pay, bank transfers
- Excellent for both one-time purchases and subscriptions
- Strong fraud protection
- Detailed analytics & reporting
- Best for custom pricing (builds vary in price)

**Cons:**
- Requires backend server for session management
- Slightly more complex setup
- 2.9% + $0.30 per transaction

**Cost:** 2.9% + $0.30 per card transaction

**Setup:** ~30 minutes (requires basic backend knowledge or serverless function)

---

### Option 2: **Paddle** 
**Best for:** Digital products, subscription services, simpler setup

**Pros:**
- Minimal backend required (can use API from frontend)
- Good for digital downloads
- Handles VAT/GST automatically for international
- Marketing features built-in

**Cons:**
- More expensive fees
- Not ideal for variable pricing
- Less payment method options
- Overkill for your use case

**Cost:** 5% + $0.50 per transaction

**Setup:** ~20 minutes

---

### Option 3: **Square**
**Best for:** Local businesses with in-person + online

**Pros:**
- Integrates with Square point-of-sale (if you sell in-store)
- Good dashboard
- Reasonable fees

**Cons:**
- Fewer payment methods
- Weaker for international
- Middling integrations

**Cost:** 2.9% + $0.30 per transaction

**Setup:** ~30 minutes

---

### Option 4: **SMS Only** (Current Fallback)
**Current Status:** ✅ Implemented as fallback

Sends order details via SMS for manual processing.

**Pros:**
- Zero setup
- Works immediately
- Personal touch

**Cons:**
- Manual processing
- No automated payment capture
- Bad for high volume
- Doesn't inspire confidence in customers

---

## RECOMMENDATION FOR YOUR SITE

**Use: Stripe (with SMS fallback)**

Why?
1. **Custom computer pricing** - Your builds vary ($500-$3000+), Stripe handles this perfectly
2. **Professional image** - Customers expect real payment processing
3. **Diagnostic services + products** - Works for both one-time purchases
4. **Scalability** - As you grow, you have room to add subscriptions, recurring orders, etc.

---

## How It Works Currently

### Without Backend Server (Current)
- ❌ Cannot charge cards directly
- ✅ Falls back to SMS for quote/order

### With Backend Server (Recommended)
1. Customer adds items to cart → clicks "Proceed to Checkout"
2. Frontend sends cart to your backend → Backend creates Stripe session
3. Customer redirected to Stripe checkout page (hosted by Stripe)
4. Customer enters payment info (on Stripe's secure servers)
5. Stripe processes payment and redirects to success page
6. Webhook notifies your backend → You fulfill order

---

## Setup Instructions for Stripe

### Step 1: Create Stripe Account
```
1. Go to https://stripe.com
2. Sign up with email
3. Verify email
4. Create new account (if not US-based, ensure you're in supported country)
5. Complete onboarding (business type, volume, etc.)
```

### Step 2: Get API Keys
```
Dashboard → Developers → API Keys
```

You'll see:
- **Publishable Key** (starts with `pk_live_...` or `pk_test_...`)
- **Secret Key** (starts with `sk_live_...` or `sk_test_...`)

**IMPORTANT:** 
- Use TEST keys first
- Use LIVE keys only when ready for production
- Never share your Secret Key

### Step 3: Set Publishable Key in Your Site

Edit `cart.html` (line with Stripe SDK) or create `stripe.js`:

```javascript
window.STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_KEY_HERE';
```

Replace `pk_test_YOUR_KEY_HERE` with your actual key.

### Step 4: Create Backend Endpoint (Required)

You'll need a backend route that creates Stripe checkout sessions. This can be:
- Node.js/Express
- Python/Flask
- PHP
- Serverless function (AWS Lambda, Vercel, etc.)

**Example: Node.js/Express**

```javascript
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');

app.post('/api/checkout', async (req, res) => {
  try {
    const { items } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: item.short || item.category
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: 'https://yoursite.com/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yoursite.com/cart.html'
    });
    
    res.json({ url: session.url });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

**Example: Vercel Serverless Function** (easiest for static sites)

Create `api/checkout.js`:

```javascript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { items } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: item.short || item.category
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL || 'https://yoursite.com'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VERCEL_URL || 'https://yoursite.com'}/cart.html`
    });
    
    return res.json({ url: session.url });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
```

### Step 5: Update Cart JavaScript

Update `cart.html` checkout function to call your backend:

```javascript
function initiateStripeCheckout(items, subtotal, tax, total) {
  // Call your backend to create a session
  fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  })
  .then(res => res.json())
  .then(data => {
    if (data.url) {
      window.location.href = data.url;
    } else if (data.error) {
      alert('Checkout error: ' + data.error);
    }
  })
  .catch(err => {
    console.error('Checkout failed:', err);
    fallbackToSMS(items, subtotal, tax, total);
  });
}
```

### Step 6: Test with Stripe Test Cards

Use these card numbers to test:
```
Card: 4242 4242 4242 4242
Exp: 12/34
CVC: 567
Name: Any name
```

### Step 7: Deploy & Go Live

Once testing is complete:
1. Get LIVE keys from Stripe Dashboard
2. Replace test keys with live keys
3. Update success URL to production domain
4. Deploy your backend

---

## Diagnostics Setup

Your diagnostic product (`diagnostic-dawsonville.json`) is already:
✅ In the product catalog
✅ Purchasable (can add to cart)
✅ Displays on products page
✅ Has proper pricing ($50)

**What happens when someone buys a diagnostic:**
1. Adds to cart → checkout → payment processed
2. Order confirmation sent
3. You receive order notification
4. Contact customer to schedule on-site visit

---

## Webhook Setup (Optional but Recommended)

To automate order processing, set up Stripe webhooks:

```
Dashboard → Developers → Webhooks
Add endpoint: https://yoursite.com/api/webhooks/stripe
Events to listen for:
  - checkout.session.completed
  - payment_intent.succeeded
```

This lets you:
- Send automatic order confirmation emails
- Trigger fulfillment workflows
- Track payments in your system

---

## Quick Comparison Table

| Feature | Stripe | Paddle | Square | SMS |
|---------|--------|--------|--------|-----|
| Setup Time | 30 min | 20 min | 30 min | Now |
| Payment Methods | 15+ | 10+ | 8+ | None |
| Cost | 2.9% + $0.30 | 5% + $0.50 | 2.9% + $0.30 | $0 |
| Backend Required | Yes | Maybe | Yes | No |
| International | Excellent | Good | Fair | N/A |
| Variable Pricing | Perfect | Poor | Good | N/A |
| Your Use Case | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ |

---

## Support

- **Stripe Docs:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **Test Mode:** Always start in test mode first
- **Keys in Code:** Never commit live keys to git; use environment variables

---

## Files Updated

- ✅ `cart.html` - Updated checkout function with Stripe support
- ✅ `success.html` - New success/confirmation page
- ✅ `config/stripe.example.js` - Configuration template
- ✅ `diagnostic-dawsonville.json` - Already purchasable

---

## Next Steps

1. **Choose a payment provider** (recommended: Stripe)
2. **Create account** and get API keys
3. **Set up backend** (or use serverless like Vercel)
4. **Test with test keys**
5. **Deploy with live keys**
6. **Start accepting payments!**

For help setting up Stripe or other payments, feel free to ask!
