# Admin Portal - TODO

## Future Implementation Plan

### Product Catalog Management
- [ ] **Authentication & Security**
  - [ ] Secure login system (bcrypt password hashing)
  - [ ] Session management with expiration
  - [ ] Role-based access (admin vs editor)
  - [ ] HTTPS required for admin panel
  - [ ] CSRF protection
  - [ ] Rate limiting on login attempts
- [ ] **Product CRUD Interface**
  - [ ] Create/edit/delete products
  - [ ] Drag-and-drop feature cards (add/remove/reorder)
  - [ ] Icon picker for feature cards
  - [ ] Real-time preview
- [ ] Image upload with automatic optimization
- [ ] Bulk import from spreadsheet/CSV
- [ ] Featured product toggle
- [ ] Category management
- [ ] Price editing
- [ ] Inventory status
- [ ] SEO meta tags editor

### Content Management
- [ ] Edit homepage sections
- [ ] Manage FAQ questions
- [ ] Update service area cities
- [ ] Review moderation
- [ ] Testimonial management
- [ ] **Build Features Manager**
  - [ ] Add/remove feature cards per build
  - [ ] Emoji/icon picker for features
  - [ ] Drag to reorder features
  - [ ] Feature card preview
  - [ ] Quick copy features between builds

### Analytics Dashboard
- [ ] Form submission tracking
- [ ] Popular products
- [ ] Traffic sources
- [ ] Conversion metrics

### Current Workflow (Manual)
1. Create JSON file in `content/products/`
2. Add filename to `content/products/index.json`
3. Upload product images to `assets/products/`
4. Site automatically displays new products

### When Ready to Build
The admin panel will use the existing JSON structure, so no migration needed.
Just add a web interface that reads/writes these same files.

**Recommended Stack:** Plain JavaScript + simple backend (Node.js or Python Flask)
**No framework required** - keep it lightweight and maintainable.

### Security Implementation Notes
```javascript
// Recommended approach:
// 1. Separate admin domain: admin.howardresourcegroup.com
// 2. Environment variables for credentials (never commit passwords)
// 3. JWT tokens for session management
// 4. File write permissions restricted to authenticated users only
// 5. Input sanitization on all form fields
// 6. Audit log of all changes (who, what, when)
```

**File Structure:**
```
admin/
  ├── login.html          # Login page
  ├── dashboard.html      # Main admin view
  ├── products.html       # Product manager with features editor
  ├── auth.js            # Authentication logic
  └── api/
      ├── login.php/js   # Auth endpoint
      ├── products.php/js # CRUD endpoints
      └── upload.php/js   # Image handling
```
