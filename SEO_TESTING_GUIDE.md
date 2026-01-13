# SEO Testing & Verification Guide

## What We Just Updated ✅

All pages now have:
- **Canonical Tags** - Prevent duplicate content issues
- **Open Graph Meta Tags** - Proper social media sharing (Facebook, LinkedIn)
- **Twitter Card Meta Tags** - Better Twitter preview appearance
- **Keywords Meta Tags** - Target search intent
- **Updated Sitemap** - Reflects new page structure (repair.html, consulting.html)
- **GA4 Tracking** - Already in place on all pages

---

## Phase 1: Basic SEO Verification (Quick Check)

### 1.1 Check Meta Tags in Browser
For each page, right-click → "View Page Source" and confirm:

```html
<!-- Should see this on every page -->
<link rel="canonical" href="https://howardresourcegroup.com/[page].html">
<meta property="og:type" content="website">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="...">
<meta name="twitter:card" content="summary_large_image">
<meta name="keywords" content="...">
```

**Pages to Check:**
- index.html
- products.html
- repair.html
- consulting.html
- cart.html
- success.html
- privacy.html
- product.html

### 1.2 Test Social Media Sharing
Go to these tools and paste your page URLs:
- **Facebook:** https://developers.facebook.com/tools/debug/sharing/
- **Twitter:** https://cards-dev.twitter.com/validator
- **LinkedIn:** https://www.linkedin.com/post-inspector/inspect/

Should show correct title, description, and image preview.

---

## Phase 2: Google Search Console Setup

### 2.1 Add Your Site
1. Go to https://search.google.com/search-console
2. Click "Add property"
3. Enter: `https://howardresourcegroup.com`
4. Verify ownership (choose DNS or HTML file method)

### 2.2 Submit Sitemap
1. In GSC left menu → **Sitemaps**
2. Enter: `https://howardresourcegroup.com/sitemap.xml`
3. Click Submit

### 2.3 Request Indexing
1. Go to **Coverage** tab
2. Should see all 8 pages listed
3. For new pages (repair.html, consulting.html), click "Request Indexing"

---

## Phase 3: Mobile & Performance Testing

### 3.1 Mobile-Friendly Test
- Go to: https://search.google.com/test/mobile-friendly
- Test each main page:
  - index.html
  - products.html
  - repair.html
  - consulting.html
- Should show ✅ "Mobile-friendly"

### 3.2 Lighthouse SEO Audit
In Chrome DevTools (F12):
1. Click "Lighthouse"
2. Select "SEO" only
3. Generate report
4. **Target Score: 90+**

Run this on:
- Homepage (index.html)
- Products page
- Service pages

**Key metrics to check:**
- Heading hierarchy (h1, h2, h3)
- Image alt text coverage
- Meta descriptions
- Mobile viewport
- Robots.txt accessible

### 3.3 Core Web Vitals Check
- Go to: https://pagespeed.web.dev/
- Enter: `https://howardresourcegroup.com`
- Check these metrics:
  - **LCP (Largest Contentful Paint):** < 2.5s ✅
  - **FID (First Input Delay):** < 100ms ✅
  - **CLS (Cumulative Layout Shift):** < 0.1 ✅

---

## Phase 4: Keyword & Indexing Verification

### 4.1 Check Google Index
In Google Search:
```
site:howardresourcegroup.com
```

Should show all main pages indexed (might take 24-48 hours for new pages).

### 4.2 Check Specific Pages
Search for:
```
site:howardresourcegroup.com/repair.html
site:howardresourcegroup.com/consulting.html
site:howardresourcegroup.com/products.html
```

### 4.3 Keyword Rankings (Optional)
Use free tools to check target keywords:
- **Google My Business:** https://business.google.com (for local visibility)
- **Ubersuggest Free:** https://ubersuggest.com (keyword ideas)
- **Answer the Public:** https://answerthepublic.com (what people search)

Target local keywords:
- "computer repair Dawsonville"
- "custom PC builds Atlanta"
- "tech consulting North Georgia"
- "laptop repair Forsyth County"

---

## Phase 5: Ongoing Monitoring

### 5.1 Weekly Checks (First Month)
- GSC Coverage tab → any errors?
- GSC Performance tab → impressions/clicks trending up?
- Any "Indexing" issues listed?

### 5.2 Monthly Checks
- Run Lighthouse audit again (maintain 90+)
- Check Core Web Vitals in PageSpeed Insights
- Monitor Google Analytics 4 for organic traffic
- Check backlinks (use Backlink Checker tools)

### 5.3 Google Analytics 4 Setup
Already configured with:
- Custom event tracking (phone calls, SMS, conversions)
- Page views
- Session tracking

Check the GA4 dashboard for:
1. **Organic traffic** from Google
2. **User engagement** (bounce rate, pages/session)
3. **Conversion funnel** (contact form fills, calls)

---

## Phase 6: Common Issues & Fixes

### Issue: Pages not indexed after 48+ hours
**Solution:**
1. Check robots.txt (already correct)
2. Submit in GSC → "Request Indexing"
3. Check for crawl errors in GSC → Coverage tab

### Issue: Low Lighthouse Score
**Common causes:**
- Missing image alt text (add `alt="description"` to all images)
- Poor heading hierarchy (use h1 → h2 → h3, not random order)
- Slow CSS/JS (already optimized with font-display: swap)
- Mobile viewport issue (already set correctly)

### Issue: Social preview looks broken
**Solution:**
- OG image URL must be absolute (https://howardresourcegroup.com/assets/...)
- Image must be at least 1200x630 pixels
- Supported formats: jpg, png, gif, webp

### Issue: Canonical tag issues
**Check:**
- Each page's canonical points to itself (no cross-linking)
- All are HTTPS (not HTTP)
- No trailing slash inconsistencies

---

## Testing Checklist

Print or save this checklist:

```
☐ All pages have canonical tags
☐ All pages have OG meta tags
☐ All pages have Twitter cards
☐ All pages have keywords meta
☐ Sitemap.xml updated (removed anchors, added new pages)
☐ Sitemap submitted to Google Search Console
☐ All 8 pages show in GSC Coverage as "Valid"
☐ Mobile-Friendly test passes for all main pages
☐ Lighthouse SEO score ≥ 90 on homepage
☐ Core Web Vitals all passing in PageSpeed Insights
☐ site:howardresourcegroup.com shows all pages in Google
☐ GA4 dashboard shows organic traffic
☐ New pages (repair.html, consulting.html) indexed
☐ Facebook/Twitter/LinkedIn preview looks correct
```

---

## Expected Timeline

- **Immediately:** SEO meta tags live ✅
- **1-3 days:** Google crawls new pages
- **1-2 weeks:** New pages start showing in search results
- **1-2 months:** Organic traffic begins increasing
- **3-6 months:** Ranking improvements visible for target keywords

---

## Tools Dashboard (Bookmark These)

| Tool | URL | Purpose |
|------|-----|---------|
| Google Search Console | https://search.google.com/search-console | Monitor indexing & performance |
| Google Analytics 4 | https://analytics.google.com | Track traffic & conversions |
| PageSpeed Insights | https://pagespeed.web.dev | Core Web Vitals monitoring |
| Mobile-Friendly Test | https://search.google.com/test/mobile-friendly | Mobile verification |
| Structured Data Test | https://search.google.com/test/rich-results | Schema validation |
| OG Preview (Facebook) | https://developers.facebook.com/tools/debug/sharing | Social meta tags |
| Twitter Card Validator | https://cards-dev.twitter.com/validator | Twitter preview |

---

## Questions? 

1. **"How long until we see results?"** — 1-2 weeks for indexing, 1-2 months for ranking improvements
2. **"Should we add more keywords?"** — Current keywords are solid; let data guide future additions
3. **"Do we need schema.org markup?"** — Good to have but not critical; current setup is strong
4. **"How often should we test?"** — Weekly first month, then monthly maintenance checks

---

## Success Indicators 🎯

You'll know it's working when:
- ✅ GSC shows all pages indexed
- ✅ Google Search Console Performance tab shows impressions
- ✅ GA4 shows organic traffic increasing
- ✅ Lighthouse score stays at 90+
- ✅ Pages ranking for target keywords in Google

---

**Last Updated:** January 13, 2026
**SEO Status:** 8/8 pages optimized ✅
