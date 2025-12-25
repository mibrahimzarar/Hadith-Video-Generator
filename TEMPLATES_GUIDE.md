# Custom Templates Guide

## Adding Custom Image Templates

You can add custom image templates to the `public/templates/` folder. Here's how:

### Step 1: Add Your Image
1. Place your image files in the `public/templates/` folder
2. Supported formats: PNG, JPG, JPEG, WebP
3. Recommended size: **1080x1080px** (1:1 square ratio) for best quality
4. Keep file size under 500KB for fast loading

Example:
- `public/templates/my-template.jpg`
- `public/templates/islamic-design.png`

### Step 2: Register Template in Code
Edit `src/data/templates.ts` and add a new template object:

```typescript
{
  id: 7,
  name: 'My Custom Template',
  thumbnail: 'linear-gradient(...)', // Fallback gradient
  backgroundColor: '#1a2027',
  textColor: '#ffffff',
  referenceColor: '#d4a853',
  textPosition: { x: 540, y: 960, maxWidth: 900 },
  referencePosition: { x: 540, y: 1600 },
  fontSize: 52,
  referenceFontSize: 42,
  imageUrl: '/templates/my-template.jpg' // Add this line with your image path
}
```

### Important Settings

- **id**: Unique number for each template
- **name**: Display name shown in Step 1
- **imageUrl**: Path to your image file in `public/templates/`
- **backgroundColor**: Fallback color if image fails to load
- **textColor**: Color for Hadith text ('white' or 'black')
- **referenceColor**: Color for reference text (hex code)
- **textPosition**: Where the main Hadith text appears (x, y coordinates)
- **referencePosition**: Where the reference text appears

### Example Custom Template

```typescript
{
  id: 7,
  name: 'Marble Design',
  thumbnail: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  backgroundColor: '#2c3e50',
  textColor: '#ecf0f1',
  referenceColor: '#f39c12',
  textPosition: { x: 540, y: 960, maxWidth: 900 },
  referencePosition: { x: 540, y: 1600 },
  fontSize: 52,
  referenceFontSize: 42,
  imageUrl: '/templates/marble.jpg'
}
```

### Tips

1. **Text Positioning**: Adjust `textPosition.y` and `referencePosition.y` based on your image layout
2. **Color Harmony**: Choose text colors that contrast well with your background image
3. **Test**: After adding a template, refresh the app and select it in Step 1 to preview
4. **Multiple Templates**: You can have mix of gradient and image-based templates

Enjoy creating beautiful Hadith videos! 🎨

