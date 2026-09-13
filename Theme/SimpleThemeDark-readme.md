# SimpleThemeDark — Material Design 3 for Jellyfin

A clean, modern dark theme for Jellyfin based on Google's Material Design 3 specification.

## Features

- Full MD3 dark color palette (208 design tokens)
- Fluid JS animations (ripple, scroll-reveal, page transitions)
- Responsive design (mobile, desktop, TV)
- Add-on compatible (custom-media-covers, media-bar-plugin)
- Accent color switching (Purple default, Teal via `data-accent="teal"`)
- Theme variants: MD3 Pure (default), MD3 Surface Tint, MD3 Custom
- Dark-only (light mode override documented for future use)

## Installation

Paste in Custom CSS box:

```css
@import url("https://cdn.jsdelivr.net/gh/...");
```

Or include `SimpleThemeDark-nightly.css` directly.

## Accent Colors

- **Purple** (default): Standard MD3 purple accent
- **Teal**: Add `data-accent="teal"` to `<html>` element

## Theme Variants

- `data-theme="md3-surface-tint"`: Elevation via color tint overlays instead of shadows
- `data-theme="md3-custom"`: Full teal-forward custom dark scheme

## Files

| File | Description |
|------|-------------|
| `SimpleThemeDark-nightly.css` | Merged production CSS (tokens + components) |
| `SimpleThemeDark-tokens.css` | Design tokens only (208 tokens) |
| `SimpleThemeDark-pure.css` | MD3 Pure component styles only |
| `SimpleThemeDark.js` | Animation system (ripple, scroll, transitions) |

## Credits

- Based on [ElegantFin](https://github.com/lscambo13/ElegantFin) v26.09.05 by lscambo13
- Material Design 3 by Google
- Inter font by Rasmus Andersson

## License

MIT
