# Product Configuration Quick Reference

## What Changed

✅ **Old System**: Tier selection (Budget, Standard, Premium)  
✅ **New System**: Part-by-part selection (choose CPU, GPU, RAM, Storage, etc.)

This allows customers to build exactly what they need without being locked into predefined tiers.

---

## Service Rates (At a Glance)

| Service | Rate | Notes |
|---------|------|-------|
| Computer Repair | $40/hr | Diagnostics, fixes, upgrades |
| **Piano Player Units** | **$125/hr** | MIDI optimization & setup |
| Remote Support | $20 | 30-min consultation |
| Website Dev | $40/hr | Design, build, deploy |
| App Development | $35/hr | Custom apps & backend |
| PC Builds | $60/hr | Custom assembly & setup |
| **Prebuilt Systems** | **Cost + 0.325%** | Small markup on hardware |

---

## How Customers Build a PC

### Step 1: Choose Build Type
Select category:
- Gaming Build
- Workstation Build
- (Add more categories as needed)

### Step 2: Select Components
For each category, parts are grouped:
- **CPU**: Choose processor
- **GPU**: Choose graphics card
- **Memory**: Choose RAM
- **Storage**: Choose SSD/HDD

### Step 3: See Price Update
Real-time total shows:
- Base price (usually $0 for custom)
- Sum of selected parts
- Service charges (if applicable)

### Step 4: Add to Cart
Saved with:
- Product title
- All selected parts
- Total price
- Configuration details

---

## Creating a New Product JSON

### Minimal Example

```json
{
  "title": "Budget Gaming PC",
  "description": "Affordable gaming at 1080p",
  "type": "custom-build",
  "basePrice": 0,
  "badges": ["BUDGET", "GAMING", "60/HOUR"],
  "categories": [
    {
      "name": "Budget Gaming",
      "description": "1080p gaming performance",
      "parts": [
        {
          "name": "Processor",
          "category": "CPU",
          "model": "Intel i5-13600K",
          "price": 300,
          "description": "6-core budget gaming"
        },
        {
          "name": "Graphics Card",
          "category": "GPU",
          "model": "RTX 4060",
          "price": 300,
          "description": "1080p high gaming"
        }
      ]
    }
  ]
}
```

### Full Example with Multiple Categories

See `content/products/CUSTOM-BUILD-TEMPLATE.json` for complete example.

---

## File Locations

| File | Purpose |
|------|---------|
| `product.html` | Product page with part selector |
| `content/products/*.json` | Product definitions |
| `CUSTOM-BUILD-TEMPLATE.json` | Template for new products |
| `PRICING_GUIDE.md` | Full pricing documentation |

---

## Pricing Rules

### For Services
- **Hourly**: Charge per hour worked
- **Fixed**: One-time fee (like $20 remote support)
- **Estimate first**: Always provide estimate before starting

### For Hardware
- **Custom builds**: $60/hour service + cost of parts
- **Piano player setup**: $125/hour (specialized service)
- **Prebuilt systems**: Hardware cost × 1.00325 (0.325% markup)

### Example Calculations

**Custom Gaming PC (3 hours)**:
- Part 1 (CPU): $300
- Part 2 (GPU): $600
- Part 3 (RAM): $150
- Part 4 (SSD): $100
- **Hardware Subtotal**: $1,150
- **Service (3 hrs × $60)**: $180
- **Total**: $1,330

**Piano Setup (2.5 hours)**:
- **Service (2.5 hrs × $125)**: $312.50

**Prebuilt System (2000 cost)**:
- **Price**: $2,000 × 1.00325 = $2,006.50

---

## Testing Product Configuration

### 1. Create JSON File
```bash
# Place in content/products/your-product.json
# Use template as reference
```

### 2. Open Product Page
```
https://howardresourcegroup.com/product.html?item=your-product
```

### 3. Verify
- ✅ Categories show up
- ✅ Parts display correctly
- ✅ Price updates when selecting parts
- ✅ "Add to Cart" works
- ✅ Price shows in cart.html

---

## Common Issues & Fixes

### Parts not showing?
- Check JSON syntax (use JSONLint)
- Verify `categories` array is present
- Check each part has required fields: name, category, model, price

### Price not updating?
- Parts must have `price` field (number, not string)
- Check browser console for errors (F12)
- Clear cache: Ctrl+Shift+Delete

### Can't add to cart?
- Check all parts have selection
- Verify localStorage is enabled (F12 → Application → LocalStorage)

---

## Next Steps

1. **Create your first custom product** using CUSTOM-BUILD-TEMPLATE.json
2. **Test the configuration** at product.html?item=your-product-name
3. **Update catalog.js** to show it on products.html page
4. **Add to homepage** featured section if you want

---

## Piano Player Unit Special

Piano Player is a **specialized service** with its own page:

- **File**: `piano-player.html`
- **Rate**: $125/hour (vs $40/hour standard repair)
- **What's included**: MIDI calibration, latency optimization, software setup
- **Typical project**: 2-4 hours = $250-$500 service

Link to it from repair.html pricing section ✅ (already done)

---

**Questions?** Check [PRICING_GUIDE.md](PRICING_GUIDE.md) for details.
