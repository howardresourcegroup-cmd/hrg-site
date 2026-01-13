# HRG Pricing Structure & Product Configuration Guide

## Service Pricing

### Repair Services
- **Standard Computer Repair**: $40/hour
  - Diagnostics, hardware repair, software fixes, malware removal, driver updates, system optimization
  
- **Piano Player Unit Setup**: $125/hour
  - Specialized MIDI configuration, latency tuning, audio optimization, software setup
  - See [piano-player.html](piano-player.html) for details

- **Remote Support (Consultation)**: $20/session
  - 30-minute remote desktop assistance for troubleshooting or quick diagnostics

### Custom Development Services
All hourly, with estimates provided before work begins.

- **Website Development**: $40/hour
  - Custom web design, landing pages, e-commerce sites, CMS setup, hosting configuration
  
- **Application Development**: $35/hour
  - Custom web apps, SaaS development, API integration, database design, backend systems
  
- **Custom PC Builds**: $60/hour
  - Component selection, assembly, OS setup, benchmarking, configuration

### Prebuilt Computers
- **Markup**: 0.325% above hardware cost
  - Example: $1,000 hardware cost = $1,000 + ($1,000 × 0.00325) = $1,003.25

## Product Configuration System

### Part-Based Selection (New System)

Products are now configured with **category-based part selection** instead of tier-based options. Users select components from each category to build their PC.

#### Product JSON Structure

```json
{
  "title": "Custom PC Build",
  "description": "...",
  "type": "custom-build",
  "basePrice": 0,
  "categories": [
    {
      "name": "Gaming Build",
      "description": "Optimized for gaming",
      "parts": [
        {
          "name": "Processor",
          "category": "CPU",
          "model": "Intel i7-13700K",
          "price": 420,
          "description": "12-core gaming powerhouse"
        },
        {
          "name": "Graphics Card",
          "category": "GPU",
          "model": "RTX 4070 Ti",
          "price": 800,
          "description": "1440p ultra gaming"
        }
      ]
    },
    {
      "name": "Workstation Build",
      "description": "Optimized for creative work",
      "parts": [
        {
          "name": "Processor",
          "category": "CPU",
          "model": "AMD Ryzen Threadripper PRO 5995WX",
          "price": 7000,
          "description": "64-core powerhouse"
        }
      ]
    }
  ]
}
```

#### How It Works

1. **Category Selection**: User selects build type (Gaming, Workstation, etc.)
2. **Part Selection**: Within each category, user selects from parts grouped by component type (CPU, GPU, RAM, etc.)
3. **Real-time Pricing**: Total updates as selections are made
4. **Configuration Summary**: Shows all selected parts and total price
5. **Add to Cart**: Adds configured build with all selections to cart

#### Files Modified
- **product.html**: New part-based configuration UI
- **product.js**: Original script (preserved for other uses)
- **Inline script in product.html**: New configuration logic (lines 448-650)

## Creating Custom PC Products

### Template File
Use `content/products/CUSTOM-BUILD-TEMPLATE.json` as a reference.

### Structure Breakdown

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | Build name |
| `description` | string | Yes | Full description |
| `short` | string | No | Short tagline |
| `type` | string | Yes | "custom-build", "prebuilt", etc. |
| `category` | string | Yes | Category for organization |
| `featured` | boolean | No | Show on homepage? |
| `basePrice` | number | Yes | Starting price (often 0 for custom) |
| `badges` | array | Yes | ["CUSTOM", "FLEXIBLE", "60/HOUR"] |
| `image` | string | No | Product image path |
| `categories` | array | Yes | Build type categories |

### Categories Array Structure

```json
{
  "name": "Gaming Build",
  "description": "Optimized for gaming performance",
  "parts": [
    {
      "name": "Processor",
      "category": "CPU",
      "model": "Intel i7-13700K",
      "price": 420,
      "description": "12-core gaming and streaming powerhouse"
    }
  ]
}
```

### Part Object Structure

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | Human-readable component name |
| `category` | string | Yes | Grouping (CPU, GPU, RAM, Storage, etc.) |
| `model` | string | Yes | Specific model/SKU |
| `price` | number | Yes | Part cost (added to base) |
| `description` | string | No | Why choose this part |

## Pricing Examples

### Custom Gaming PC Build
- **Base Service**: $60/hour
- **Typical Build Time**: 3-4 hours = $180-$240
- **Example Configuration**:
  - CPU (Intel i7-13700K): $420
  - GPU (RTX 4070 Ti): $800
  - RAM (32GB DDR5): $160
  - SSD (2TB NVMe): $180
  - **Hardware Subtotal**: $1,560
  - **Service (3.5 hrs @ $60/hr)**: $210
  - **Total**: $1,770

### Piano Player Unit Setup
- **Service Rate**: $125/hour
- **Typical Setup Time**: 2-3 hours = $250-$375
- **Includes**:
  - MIDI controller setup & calibration
  - DAW configuration
  - Audio interface setup
  - Latency optimization
  - Software installation

### Website Development
- **Service Rate**: $40/hour
- **Typical Project**: 10-20 hours
- **Range**: $400-$800
- **Includes**: Design, HTML/CSS, CMS setup, hosting configuration

### Prebuilt System (Example)
- **Hardware Cost**: $2,500
- **Markup (0.325%)**: $8.13
- **Total Price**: $2,508.13

## Checkout & Cart

Products are added to cart with:
- Full configuration details (selected parts)
- Total calculated price
- Line item for service charges
- Hardware costs displayed separately

## Links to Services

- [Piano Player Units](piano-player.html) — Specialized $125/hr service
- [Repair Services](repair.html) — $40/hr standard repair
- [Consulting Services](consulting.html) — Full service menu with hourly rates
- [Custom Products](products.html) — Browse configurable builds

---

**Last Updated**: January 13, 2026
**Version**: 2.0 (Part-based configuration)
