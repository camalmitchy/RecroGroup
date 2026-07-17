# Merchandise Product Images Guide

## Current Status
The merchandise page is now using placeholder images from placehold.co that display the product name on a green background (matching Recro's brand colors).

## Option 1: Use Stock Photos (Quick Solution)

### Free Stock Photo Sites:
1. **Unsplash** (https://unsplash.com)
2. **Pexels** (https://pexels.com)
3. **Pixabay** (https://pixabay.com)

### Search Terms:
- For T-shirts: "white t-shirt mockup", "black t-shirt flat lay"
- For Mugs: "ceramic mug mockup", "coffee mug white background"
- For Water Bottles: "stainless steel water bottle", "sports bottle"
- For Backpacks: "backpack mockup", "canvas backpack"
- For Umbrellas: "umbrella product shot"
- For Caps: "baseball cap mockup"

### Steps:
1. Download images from stock photo sites
2. Resize to 600x600px (square)
3. Save as JPG or WebP format
4. Place in `/public/assets/merchandise/`
5. Image names should match the data file

## Option 2: Create Mockups with AI Tools

### Recommended AI Image Generators:
1. **Midjourney** (https://midjourney.com) - Best quality
2. **DALL-E** (https://openai.com/dall-e)
3. **Stable Diffusion** (https://stability.ai)

### Prompt Templates:

**For T-Shirts:**
```
Product photography of a [color] cotton t-shirt with Recro Group logo, 
flat lay on white background, professional studio lighting, minimalist, 
clean composition, high resolution
```

**For Mugs:**
```
Product photography of a ceramic coffee mug with mental health awareness 
design, white background, professional studio lighting, centered composition, 
commercial product shot
```

**For Water Bottles:**
```
Product photography of a stainless steel insulated water bottle, 
modern design, white background, professional lighting, high quality, 
commercial product photography
```

**For Backpacks:**
```
Product photography of a canvas backpack, multiple compartments, 
white background, professional studio lighting, 3/4 view, 
commercial quality
```

## Option 3: Commission Product Photos

### When to Use Real Photos:
- When you have physical products ready
- For final launch
- For authentic brand representation

### Photographer Checklist:
- All products on white or neutral background
- Consistent lighting across all shots
- Multiple angles for each product
- 600x600px minimum resolution
- Square aspect ratio (1:1)

## Option 4: Use Canva for Mockups

### Steps:
1. Go to Canva.com
2. Search for product mockup templates:
   - "T-shirt mockup"
   - "Mug mockup"
   - "Water bottle mockup"
   - "Backpack mockup"
3. Customize with Recro branding
4. Add logo (use `/public/assets/Recro_logo.png`)
5. Download as PNG (600x600px)
6. Save to `/public/assets/merchandise/`

## Required Images (16 products)

### Apparel (4):
- [ ] tshirt-white.jpg - White t-shirt with logo
- [ ] tshirt-black.jpg - Black t-shirt with logo
- [ ] tshirt-quote.jpg - T-shirt with healing quote
- [ ] hoodie.jpg - Comfort hoodie

### Drinkware (5):
- [ ] mug-white.jpg - White ceramic mug
- [ ] travel-mug.jpg - Stainless steel travel mug
- [ ] water-bottle.jpg - Sports water bottle
- [ ] water-bottle-insulated.jpg - Insulated water bottle
- [ ] cup-set.jpg - Set of 4 cups

### Accessories (7):
- [ ] backpack.jpg - Canvas backpack
- [ ] tote-bag.jpg - Eco tote bag
- [ ] umbrella.jpg - Compact umbrella
- [ ] journal.jpg - Healing journal
- [ ] cap.jpg - Baseball cap
- [ ] keychain.jpg - Metal keychain

## Image Specifications

- **Format:** JPG or WebP (for better compression)
- **Dimensions:** 600x600px (square, 1:1 ratio)
- **Background:** White or transparent
- **File size:** Under 200KB per image (for fast loading)
- **Quality:** High enough to show product details clearly

## Folder Structure

```
/public/assets/merchandise/
├── tshirt-white.jpg
├── tshirt-black.jpg
├── tshirt-quote.jpg
├── hoodie.jpg
├── mug-white.jpg
├── travel-mug.jpg
├── water-bottle.jpg
├── water-bottle-insulated.jpg
├── cup-set.jpg
├── backpack.jpg
├── tote-bag.jpg
├── umbrella.jpg
├── journal.jpg
├── cap.jpg
└── keychain.jpg
```

## Next Steps

1. **For Now:** The placeholder images will work fine and show product names
2. **When Ready:** Replace with actual images using any of the options above
3. **Update:** No code changes needed - just drop images in the folder with matching names

## Adding New Products

When adding new products:
1. Add product to `/src/features/public/merchandise/data/products-data.ts`
2. Make sure `image` path matches your file in `/public/assets/merchandise/`
3. Image will automatically appear on the page

## Branding Guidelines

For consistency across all product images:
- Use Recro's green color (#2d6a4f) for logos and accents
- Keep backgrounds neutral (white or light)
- Ensure logo is clearly visible but not overwhelming
- Maintain professional, clean aesthetic
- Consider adding tagline: "Supporting Mental Health & Healing"
