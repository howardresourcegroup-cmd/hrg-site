# HRG Site Architecture & Integration Audit

**Date**: January 13, 2026  
**Status**: ✅ All systems integrated and operational

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│        howardresourcegroup.com (GitHub Pages)           │
│                 Static Site Frontend                     │
├─────────────────────────────────────────────────────────┤
│  index.html • products.html • product.html • *.css/js   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ Fetches product catalog
                       ↓
┌─────────────────────────────────────────────────────────┐
│    content/products/ (JSON Data Layer)                  │
│    20 products: 5 professional + 15 gaming              │
├─────────────────────────────────────────────────────────┤
│  index.json • _TEMPLATE.json • [product].json           │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ↓              ↓              ↓
   catalog.js    product.html   admin_server.py
                                      │
                                      │ Railway Deployment
                                      ↓
                    ┌──────────────────────────────┐
                    │ admin.howardresourcegroup.com │
                    │  (Railway + Cloudflare DNS)   │
                    ├──────────────────────────────┤
                    │ Admin Portal (Flask + Templates)
                    │ Product Management Interface   │
                    └──────────────────────────────┘
```

---

## File Integration Map

### Frontend (Main Site)

| File | Purpose | Dependencies | Status |
|------|---------|--------------|--------|
| `index.html` | Homepage with hero, features, FAQ, CTA | style.css, script.js | ✅ Live |
| `products.html` | Product catalog/grid | catalog.js, style.css, script.js | ✅ Live |
| `product.html` | Product configurator with tiers | style.css, script.js | ✅ Fixed for backward compat |
| `catalog.js` | Product loader & filter | content/products/index.json | ✅ Working |
| `script.js` | Cart, theme switching, interactions | localStorage | ✅ Live |
| `style.css` | Complete styling system | None | ✅ Live |

### Data Layer (Product Catalog)

| File | Format | Updated | Notes |
|------|--------|---------|-------|
| `content/products/index.json` | JSON array of filenames | ✅ Jan 13 | 20 products listed |
| `content/products/_TEMPLATE.json` | Template structure | ✅ Jan 13 | Reference for new products |
| **Professional Builds** (5 files) | Multi-tier JSON | ✅ Jan 13 | New tier structure |
| **Gaming Builds** (15 files) | Simple JSON | ✅ Existing | Backward compatible |

**Professional Builds:**
- `blender-workstation.json` - 3 tiers (Value/Pro/Elite)
- `cad-workstation.json` - 2 tiers (Value/Pro)
- `video-workstation.json` - 2 tiers (Value/Pro)
- `streaming-pc.json` - 1 tier (Pro)
- `office-pc.json` - 1 tier (Value)

**Gaming Builds (Legacy):**
- `minecraft-*.json` (6), `roblox-*.json` (3), `callofduty.json`, `battlefield*.json` (2), `gta6.json`, `aaa-highclass.json`, `vr-superhot.json`

### Admin Portal (Backend)

| File | Purpose | Framework | Dependencies |
|------|---------|-----------|--------------|
| `admin_server.py` | Flask app + API | Flask 3.0.0 | Werkzeug, gunicorn |
| `admin/templates/base.html` | Layout template | Jinja2 | CSS in file |
| `admin/templates/dashboard.html` | Inventory grid view | Jinja2 | admin_server.py |
| `admin/templates/products.html` | Product catalog grid | Jinja2 | admin_server.py |
| `admin/templates/login.html` | Authentication | Jinja2 | admin_server.py |
| `admin/templates/product_edit.html` | Product CRUD form | Jinja2 | admin_server.py |
| `Procfile` | Railway deployment config | Railway | None |
| `requirements.txt` | Python dependencies | pip | Flask, Werkzeug, gunicorn |

### Deployment Files

| File | Purpose | Status |
|------|---------|--------|
| `Procfile` | Railway web process | ✅ Created |
| `DEPLOYMENT.md` | Setup guide | ✅ Created |
| `RAILWAY_SETUP.md` | Interactive ChatGPT guide | ✅ Created |

---

## Data Structure Compatibility

### Product Format (Unified)

All products follow this structure:

```json
{
  "title": "Product Name",
  "short": "One-line description",
  "description": "Full description",
  "price": 1999,
  "category": "workstation|game|office",
  "featured": true,
  "image": "assets/products/image.jpg",
  "badges": ["tag1", "tag2"],
  "availability": "in-stock",
  
  // Simple products use these:
  "specs": { "CPU": "...", "GPU": "..." },
  "idealFor": ["Use case 1", "Use case 2"],
  
  // Tier-based products use this instead:
  "tiers": [
    {
      "name": "Value|Pro|Elite",
      "price": 1999,
      "target": "Target audience",
      "bottlenecks": ["Limiting factors"],
      "parts": {
        "cpu": { "pick": "CPU Model", "alts": ["Alt 1", "Alt 2"] },
        "gpu": { "pick": "GPU Model", "alts": [] },
        "storage": {
          "os": { "pick": "1TB NVMe", "alts": [] },
          "cache": { "pick": "2TB NVMe", "alts": [] }
        }
      },
      "notes": ["Setup tip 1", "Setup tip 2"]
    }
  ]
}
```

### Loader Logic

**catalog.js** → Loads from `index.json` → Fetches each product file → Displays in grid  
**product.html** → Fetches single product → Renders tiers or converts to single tier  
**admin_server.py** → Reads from `content/products/` → Serves in admin dashboard

**Backward Compatibility:**
- Old gaming builds (no `tiers`) → product.html converts `specs` to single-tier view
- Admin portal displays all products regardless of format
- New products get tier structure from `_TEMPLATE.json`

---

## API Endpoints (Admin Portal)

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---|
| `/admin/login` | GET/POST | User authentication | No |
| `/admin/logout` | GET | Clear session | Yes |
| `/admin` | GET | Dashboard with inventory grid | Yes |
| `/admin/products` | GET | Products grid view | Yes |
| `/admin/products/new` | GET/POST | Create product | Yes |
| `/admin/products/<id>/edit` | GET/POST | Edit product | Yes |
| `/admin/products/<id>/delete` | POST | Delete product | Yes |
| `/admin/api/products` | GET | JSON product list (API) | Yes |

---

## Environment Variables (Railway)

| Variable | Value | Purpose |
|----------|-------|---------|
| `ENVIRONMENT` | `production` | Enable production mode |
| `ADMIN_PASSWORD` | `P3ace4me` | Login credential |
| `FLASK_SECRET_KEY` | `<32-hex-chars>` | Session encryption |
| `ALLOWED_ORIGIN` | `https://howardresourcegroup.com` | CORS origin |
| `PORT` | `5000` (auto) | Server port |

---

## DNS Configuration (Cloudflare)

| Subdomain | Type | Target | Proxy |
|-----------|------|--------|-------|
| `@` (root) | A | GitHub Pages IP | Proxied |
| `www` | CNAME | `howardresourcegroup.com` | Proxied |
| `admin` | CNAME | `hrg-site-production.up.railway.app` | Proxied |

---

## Testing Checklist

✅ **Homepage** (index.html)
- Loads without errors
- Menu navigation works
- CTA buttons link correctly

✅ **Product Catalog** (products.html)
- Loads all 20 products from index.json
- Filtering works (category, featured)
- Search works
- Cards link to product.html with correct item param

✅ **Product Configurator** (product.html)
- Loads tier-based products with tier selector
- Loads legacy products in single-tier mode
- Tier selection updates price and parts display
- Add to cart saves to localStorage

✅ **Admin Portal** (Railway deployment)
- Login works with P3ace4me
- Dashboard shows all 20 products in grid
- Product edit form submits
- Product delete removes from index.json

✅ **Cross-Origin** 
- admin.howardresourcegroup.com routes to Railway
- CORS headers allow requests from main site

---

## Recent Changes (Jan 13, 2026)

1. ✅ Updated `admin/templates/dashboard.html` - Visual inventory grid
2. ✅ Updated `admin/templates/products.html` - Product card grid
3. ✅ Fixed `product.html` - Backward compatible tier/simple product handling
4. ✅ Committed all files to GitHub
5. ✅ Railway deployment auto-redeploys on commits

---

## Known Compatibility Notes

- **Old gaming builds** (no tiers): Converted to single-tier view by product.html
- **New professional builds** (with tiers): Full tier selection in product.html
- **Admin portal**: Works with both formats seamlessly
- **Cart**: Stores selected tier configuration in localStorage

---

## Next Steps (Optional)

- [ ] Add product images (currently placeholders)
- [ ] Implement checkout page
- [ ] Add Stripe integration for payments
- [ ] Database migration (from JSON to PostgreSQL)
- [ ] Email notifications for admin portal
- [ ] Product comparison feature
- [ ] Customer reviews system

