# Project Structure

This site has been refactored for maintainability with a modular code structure.

## Directory Layout

```
/
├── src/
│   ├── index.html          # Main HTML file (clean, no inline styles/JS)
│   ├── styles/
│   │   ├── main.css        # Core layout and typography
│   │   ├── dark-mode.css   # Theme variables and dark mode
│   │   └── icons.css       # FontAwesome icon definitions
│   └── scripts/
│       ├── analytics.js    # Google Analytics setup
│       ├── theme.js        # Theme toggle and persistence
│       └── links.js        # Dynamic link generation
├── dist/                   # Compiled output (auto-generated)
├── index.html              # Live version (generated from src/)
└── webpack.config.js       # Build configuration (optional)
```

## Code Organization

### HTML (`src/index.html`)
- Clean, semantic markup
- No inline styles
- External CSS links
- Modular JavaScript imports
- Proper element structure (no div wrappers for content)

### CSS (`src/styles/`)
- **main.css** - Base styles, layout, typography, variables
- **dark-mode.css** - CSS variables override for dark mode
- **icons.css** - FontAwesome setup and icon content

Uses CSS custom properties (variables) for easy theming.

### JavaScript (`src/scripts/`)
- **analytics.js** - Google Analytics initialization
- **theme.js** - Theme manager (IIFE pattern, localStorage, OS sync)
- **links.js** - Project links helper (IIFE pattern)

Each module is self-contained with clear initialization patterns.

## Development

1. **Edit source files** in `src/` folder
2. **No build step required** - Browsers load modular CSS/JS directly
3. **Optional**: Run webpack for production optimization

## Production Build (Optional)

To bundle CSS and minify JS:

```bash
npm install webpack webpack-cli html-webpack-plugin mini-css-extract-plugin --save-dev
npm run build
```

This generates optimized files in `dist/`.

## Key Improvements

✅ **Separated concerns** - CSS, JS, HTML in different files  
✅ **CSS variables** - Easy theme switching  
✅ **Modular JS** - Each feature in its own file  
✅ **Maintainable** - Clear file structure and naming  
✅ **Zero bloat** - Lightweight, no unused dependencies  
✅ **Semantic HTML** - Proper element hierarchy  
✅ **Performance hints** - DNS prefetch, preload, prefetch directives  

## Design Consistency

The refactored version maintains:
- Identical visual design
- Same color scheme (light/dark)
- Same responsive breakpoints
- Same functionality
- Same performance characteristics

## Browser Support

- Modern browsers (ES2020+)
- CSS Grid and Flexbox
- CSS Custom Properties
- `prefers-color-scheme` media query
- `localStorage` API
