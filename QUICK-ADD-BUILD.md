# Quick Guide: Add a New Build

## Step 1: Copy the Template
1. Copy `content/products/_TEMPLATE.json`
2. Rename it to something like `gaming-beast.json` (use lowercase, dashes instead of spaces)

## Step 2: Edit the JSON File
Open your new file and fill in:
- **title**: Display name (e.g., "Gaming Beast RTX 4070")
- **short**: Brief tagline (shows on cards)
- **description**: Full details paragraph
- **price**: Number only, no $ sign (e.g., 1499)
- **category**: "gaming" or "professional" or "budget"
- **badges**: Array of tags like ["Featured", "Best Seller", "High Performance"]
- **featured**: true or false (featured builds show first)
- **specs**: All the parts
- **performance**: Expected FPS/capabilities
- **idealFor**: Bullet points of who this is for
- **features**: Highlight cards with icon, title, description (optional but recommended)
- **image**: Path to image (optional, leave as is if no image yet)

## Step 3: Add to Index
Open `content/products/index.json` and add your filename to the list:
```json
{
  "items": [
    "gaming-beast.json",
    "minecraft-ultimate.json",
    ...other files...
  ]
}
```

## Step 4: Done!
The site automatically loads and displays your new build. No restart needed.

## Pro Tips
- **featured: true** = Shows in the homepage carousel
- **category** values: "gaming", "professional", "budget", "workstation"
- **badges**: Keep to 2-3 max for clean look
- **price**: Whole numbers work best (1299, not 1299.99)
- **Image optional**: Placeholder will show if no image

## Example: Quick Gaming Build
```json
{
  "title": "Fortnite Champion",
  "short": "High FPS 1080p gaming on a budget",
  "description": "Dominate Fortnite, Valorant, and competitive shooters with consistent 240+ FPS at 1080p. Perfect first gaming PC.",
  "price": 899,
  "category": "gaming",
  "badges": ["Budget", "Popular"],
  "featured": true,
  "specs": {
    "CPU": "AMD Ryzen 5 5600",
    "GPU": "AMD RX 6600",
    "RAM": "16GB DDR4",
    "Storage": "500GB NVMe",
    "Motherboard": "B550",
    "PSU": "550W Bronze",
    "Case": "Compact ATX"
  },
  "idealFor": [
    "Competitive shooters at 240Hz",
    "Streaming on budget",
    "First gaming PC"
  ],
  "features": [
    {
      "icon": "⚡",
      "title": "High FPS Gaming",
      "description": "Consistent 240+ FPS in Fortnite, Valorant, Apex Legends"
    },
    {
      "icon": "💰",
      "title": "Best Value",
      "description": "Maximum performance per dollar - no wasted spending"
    },
    {
      "icon": "🔌",
      "title": "Upgrade Ready",
      "description": "PSU and motherboard support future GPU upgrades"
    }
  ]
}
```

Save this as `fortnite-champion.json`, add to index, and you're done!
