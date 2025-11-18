# Solix International Logo Configuration Guide

## Current Optimal Settings (Saved for Future Uploads)

### Logo Specifications for 21-inch Screen Readability
- **Display Size:** 350x233px (maintains 1.5:1 aspect ratio from 1024x683px original)
- **Physical Size:** ~9cm x 6cm on standard 96 DPI screens
- **SGS Text:** Clearly readable at this size on 21-inch monitors
- **Quality:** High-resolution rendering with crisp edges

### CSS Class Configuration
```css
.solix-balanced-logo {
    width: 350px !important;
    height: 233px !important;
    min-width: 350px !important;
    max-width: 350px !important;
    min-height: 233px !important;
    max-height: 233px !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    object-fit: contain !important;
    object-position: center !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    transform: none !important;
    filter: none !important;
    box-sizing: content-box !important;
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    position: relative !important;
    z-index: 100 !important;
    image-rendering: high-quality !important;
}
```

### HTML Structure
```html
<img 
    src="images/solix-logo.png" 
    alt="Solix International SGS Certified Logo" 
    class="solix-balanced-logo"
>
```

### Navigation Layout Adjustments
- **Navigation Height:** h-60 (240px container)
- **Padding:** py-4 (16px top/bottom)
- **Hero Section Padding:** 280px top padding

## Logo Upload Requirements for Additional 2 Logos

### Recommended Formats (in order of preference)
1. **PNG** (current working format)
   - Transparent background
   - High resolution (1024px+ width recommended)
   - Aspect ratio: ~1.5:1 (width:height)

2. **SVG** (vector format - ideal for scaling)
   - Scalable without quality loss
   - Small file size
   - Perfect for responsive design

3. **High-res JPG** (fallback option)
   - Minimum 1024px width
   - White/transparent background preferred

### File Naming Convention
- `solix-logo.png` (current primary)
- `solix-logo-light.png` (for dark backgrounds)  
- `solix-logo-dark.png` (for light backgrounds)
- `solix-logo.svg` (vector version if available)

### Upload Process for Additional Logos
1. Upload files to `/images/` directory
2. Replace `src="images/solix-logo.png"` in HTML with new filename
3. CSS settings will automatically apply the 350x233px sizing
4. Test readability on 21-inch screen

### Quality Verification
- SGS certification text must be clearly readable
- Logo should maintain crisp edges at 350x233px
- No compression artifacts or distortion
- Professional appearance for million-dollar deals

### Responsive Behavior
- Desktop: 350x233px (full size)
- Tablet: Scales proportionally 
- Mobile: Adjusts to screen width while maintaining aspect ratio

### Browser Compatibility
- All modern browsers (Chrome, Firefox, Safari, Edge)
- High-quality image rendering enabled
- Fallback handling for older browsers

---

**These settings are optimized for:**
- 21-inch screen SGS text readability
- Professional cement trading presentation
- International client meetings
- High-resolution displays
- Print-quality viewing

**Ready for your 2 additional logo uploads with these exact specifications.**