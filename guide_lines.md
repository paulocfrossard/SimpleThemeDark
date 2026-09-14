# Jellyfin Web CSS Guide Lines

This document contains the CSS classes and their behavior extracted from the Jellyfin web source code (v10.11.x). It serves as a reference for theme developers to understand how Jellyfin's CSS cascade works and how to properly override styles.

## Table of Contents

1. [Theme System](#theme-system)
2. [Header System](#header-system)
3. [Layout System](#layout-system)
4. [Card System](#card-system)
5. [Button System](#button-system)
6. [Form System](#form-system)
7. [Navigation System](#navigation-system)
8. [Login Page](#login-page)
9. [Detail Page](#detail-page)
10. [Toast/Snackbar](#toastsnackbar)
11. [CSS Variable System](#css-variable-system)

---

## Theme System

Jellyfin uses MUI (Material-UI) for its theme system. Themes are defined in `src/themes/` and consist of:

- **TypeScript theme definition** (`theme.ts` or `index.ts`): Defines MUI palette colors
- **SCSS theme styles** (`theme.scss`): Component-specific overrides

### Base Theme Variables

```scss
// src/themes/_base/_palette.scss
$common-white: #fff;
$background-default: #101010;    // Main page background
$background-paper: #202020;      // Card/surface background
$primary-main: #00a4dc;          // Primary accent color
$primary-dark: #00729a;
$primary-light: #33b6e3;
$primary-hover: rgba(0, 164, 220, 0.2);
$primary-contrastText: rgba(0, 0, 0, 0.87);
$error-main: #c62828;
$error-dark: #8a1c1c;
$error-light: #d15353;
$error-contrastText: #fff;
$text-primary: #fff;
$text-secondary: rgba(255, 255, 255, 0.7);
$action-focus: rgba(255, 255, 255, 0.12);
$action-hover: rgba(255, 255, 255, 0.08);
$divider: rgba(255, 255, 255, 0.12);
```

### Component Variables

```scss
// src/themes/_base/_theme.scss
$appBar-defaultBg: #202020;
$appBar-transparentBg: rgba(0, 0, 0, 0.4);
$filledInput-bg: rgba(255, 255, 255, 0.09);
$card-borderRadius: 0.2em;
$snackbarContent-bg: #303030;
$snackbarContent-color: rgba(255, 255, 255, 0.87);
$surface-overlay: $background-paper;
$appBar-gradient: none;
```

### CSS Custom Properties (Root)

```css
:root {
  --jf-palette-background-defaultImage: none;
  --jf-palette-AppBar-transparentBg: rgba(0, 0, 0, 0.4);
  --jf-palette-AppBar-gradient: none;
  --jf-card-borderRadius: 0.2em;
}
```

---

## Header System

The header is the most complex part of Jellyfin's CSS. Understanding it is critical for theme development.

### Header HTML Structure

```html
<div class="skinHeader focuscontainer-x">
  <div class="headerTop">
    <div class="headerLeft">
      <button class="mainDrawerButton headerButton">...</button>
      <button class="headerBackButton headerButton">...</button>
      <button class="headerHomeButton headerButton">...</button>
      <div class="pageTitle">...</div>
    </div>
    <div class="headerRight">
      <button class="headerSearchButton headerButton">...</button>
      <button class="headerCastButton headerButton">...</button>
      <button class="headerSyncButton headerButton">...</button>
      <button class="headerUserButton headerButton">...</button>
    </div>
  </div>
  <div class="sectionTabs">...</div>
</div>
```

### Header CSS Classes

| Class | Description | Applied By |
|-------|-------------|------------|
| `.skinHeader` | Base header container | Always present |
| `.skinHeader-withBackground` | Adds background color | `libraryMenu.js` line 56 |
| `.skinHeader-blurred` | Enables blur effect | `libraryMenu.js` line 57 |
| `.semiTransparent` | Makes header semi-transparent | `libraryMenu.js` line 779 |
| `.noHomeButtonHeader` | Hides home button | Home page (`home.js` line 19) |
| `.noHeaderRight` | Hides right buttons | Small screens (`index.jsx` line 65) |
| `.osdHeader` | Video player header | Video player |
| `.headroom` | Scroll behavior | Headroom.js library |
| `.headroom--pinned` | Header visible (scrolled) | Headroom.js |
| `.headroom--unpinned` | Header hidden (scrolled) | Headroom.js |
| `.headroomDisabled` | Disables headroom | `libraryMenu.js` line 578 |

### Header Background Behavior

```scss
// Base theme sets background
.skinHeader-withBackground,
.detailRibbon {
  background-color: var(--jf-palette-AppBar-defaultBg, $appBar-defaultBg);
  background-image: var(--jf-palette-AppBar-gradient, $appBar-gradient);
}

// Semi-transparent override (detail pages)
.skinHeader.semiTransparent {
  background-color: var(--jf-palette-AppBar-transparentBg, $appBar-transparentBg);
  background-image: none;
  backdrop-filter: none !important;
}
```

### Key Insight: Home Page Header

On the home page, Jellyfin applies:
- `.skinHeader-withBackground` (via `libraryMenu.js`)
- `.noHomeButtonHeader` (via `home.js`)
- Does NOT apply `.semiTransparent`

On detail pages, Jellyfin applies:
- `.skinHeader-withBackground`
- `.semiTransparent`

**This is why themes must handle `.skinHeader-withBackground` separately from `.semiTransparent`.**

### Header Dimensions

```scss
// librarybrowser.scss
.headerTop {
  padding: 0.54em 0;  // Default
}

@media all and (min-width: 100em) {
  .headerTop {
    padding: 0.8em 0.8em;
  }
}

.libraryPage {
  padding-top: 7em !important;
}

.libraryPage:not(.noSecondaryNavPage) {
  padding-top: 7.5em !important;
}
```

---

## Layout System

Jellyfin uses three layout modes:

### Layout Classes

| Class | Description | Trigger |
|-------|-------------|---------|
| `.layout-desktop` | Desktop browser | Default |
| `.layout-mobile` | Mobile browser | Screen width < threshold |
| `.layout-tv` | TV interface | TV mode enabled |

### Layout-Specific Behavior

```scss
// TV layout: header is relative, not fixed
.layout-tv .skinHeader {
  position: relative;
}

// Mobile: hide certain elements
.layout-mobile .headerHomeButton {
  display: block;  // Show on mobile for navigation
}

// Desktop: hide home button (use back button instead)
.skinHeader-withBackground:not(.semiTransparent) .headerHomeButton {
  display: none;
}
```

---

## Card System

### Card Classes

| Class | Description |
|-------|-------------|
| `.card` | Base card container |
| `.cardBox` | Card content wrapper |
| `.cardScalable` | Scalable card image |
| `.cardPadder` | Card padding/content area |
| `.cardImageContainer` | Image container |
| `.cardText` | Card text content |
| `.cardText-secondary` | Secondary text (year, etc.) |
| `.cardFooter` | Card footer |
| `.cardOverlayContainer` | Overlay buttons |
| `.cardIndicators` | Status indicators |
| `.cardBox-bottompadded` | Bottom padding |
| `.visualCardBox` | Info panel card |
| `.paperList` | List-style card |
| `.defaultCardBackground` | Default card background |
| `.defaultCardBackground1-5` | Theme-specific backgrounds |

### Card Background Colors

```scss
// dark/theme.scss
.defaultCardBackground1 { background-color: #00455c; }
.defaultCardBackground2 { background-color: #44bae1; }
.defaultCardBackground3 { background-color: #00a4db; }
.defaultCardBackground4 { background-color: #1c4c5c; }
.defaultCardBackground5 { background-color: #007ea8; }
```

### Card Border Radius

```scss
// Base theme
$card-borderRadius: 0.2em;

// Applied to:
.cardBox:not(.visualCardBox) .cardPadder,
.cardContent,
.cardImageContainer,
.blurhash-canvas,
.itemDetailImage,
.cardOverlayContainer {
  border-radius: var(--jf-card-borderRadius, $card-borderRadius);
}
```

---

## Button System

### Button Classes

| Class | Description |
|-------|-------------|
| `.emby-button` | Base button |
| `.emby-button.block` | Full-width button |
| `.button-alt` | Alternative button |
| `.raised` | Raised button |
| `.fab` | Floating action button |
| `.button-submit` | Submit button (primary color) |
| `.button-delete` | Delete button (error color) |
| `.button-flat` | Flat button |
| `.button-link` | Link-styled button |
| `.paper-icon-button-light` | Icon button |
| `.detailButton` | Detail page button |
| `.detailButton-content` | Button content |
| `.detailButton-icon` | Button icon |
| `.detailButton-text` | Button text |

### Button Focus States

```scss
// Base theme
.paper-icon-button-light.show-focus:focus {
  color: var(--jf-palette-secondary-main, $secondary-main);
}

.emby-button.show-focus:focus {
  background: var(--jf-palette-primary-main, $primary-main);
  color: var(--jf-palette-primary-contrastText, $primary-contrastText);
}
```

---

## Form System

### Form Classes

| Class | Description |
|-------|-------------|
| `.emby-input` | Text input |
| `.emby-textarea` | Textarea |
| `.emby-select` | Select dropdown |
| `.emby-select-withcolor` | Styled select |
| `.emby-checkbox` | Checkbox |
| `.inputLabel` | Input label |
| `.inputLabelFocused` | Focused input label |
| `.inputLabelUnfocused` | Unfocused input label |
| `.selectLabel` | Select label |
| `.selectLabelFocused` | Focused select label |
| `.textareaLabelUnfocused` | Textarea label |
| `.textareaLabelFocused` | Focused textarea label |
| `.checkboxOutline` | Checkbox outline |
| `.checkboxContainer` | Checkbox container |

### Form Styling

```scss
// Base theme
.emby-input,
.emby-textarea {
  background: var(--jf-palette-FilledInput-bg, $filledInput-bg);
  border-color: var(--jf-palette-FilledInput-borderColor, $filledInput-borderColor);
  color: inherit;
  border-width: 0.16em;
  border-style: solid;
  border-radius: 0.2em;

  &:focus {
    border-color: var(--jf-palette-secondary-main, $secondary-main);
  }
}

.inputLabelFocused,
.selectLabelFocused,
.textareaLabelFocused {
  color: var(--jf-palette-secondary-main, $secondary-main);
}
```

---

## Navigation System

### Sidebar/Drawer Classes

| Class | Description |
|-------|-------------|
| `.mainDrawer` | Sidebar container |
| `.drawer-open` | Sidebar open state |
| `.mainDrawer-scrollContainer` | Scrollable content |
| `.navMenuOption` | Menu item |
| `.navMenuOptionIcon` | Menu item icon |
| `.navMenuOptionText` | Menu item text |
| `.navMenuOption-selected` | Selected menu item |
| `.sidebarHeader` | Menu section header |

### Sidebar Styling

```scss
// Base theme
.mainDrawer,
.drawer-open {
  background-color: var(--jf-palette-background-default, $background-default);
}

.navMenuOption:hover {
  background: var(--jf-palette-action-hover, $action-hover);
}

.navMenuOption-selected {
  background: var(--jf-palette-primary-main, $primary-main) !important;
  color: var(--jf-palette-primary-contrastText, $primary-contrastText);
}
```

---

## Login Page

### Login Page HTML Structure

```html
<div id="loginPage" data-role="page" class="page standalonePage backdropPage" 
     data-backbutton="false" data-backdroptype="splashscreen">
  <div class="padded-left padded-right padded-bottom-page margin-auto-y">
    <div class="visualLoginForm">
      <h1>Sign in to continue</h1>
      <div class="loginForm">
        <!-- Login form content -->
      </div>
    </div>
  </div>
</div>
```

### Login Page Classes

| Class | Description |
|-------|-------------|
| `#loginPage` | Login page container |
| `.standalonePage` | Page without sidebar |
| `.backdropPage` | Page with backdrop image |
| `.padded-left` | Left padding (3.3%) |
| `.padded-right` | Right padding (3.3%) |
| `.padded-bottom-page` | Bottom padding (5em) |
| `.margin-auto-y` | Vertical centering |
| `.visualLoginForm` | Visual login form |
| `.manualLoginForm` | Manual login form |

### Login Page Background

The login page uses a splashscreen backdrop:
```html
<div id="loginPage" data-backdroptype="splashscreen">
```

The backdrop is applied via JavaScript and can be customized via:
```css
:root {
  --jf-palette-background-defaultImage: url(your-image.jpg);
}
```

---

## Detail Page

### Detail Page Classes

| Class | Description |
|-------|-------------|
| `.itemDetailPage` | Detail page container |
| `.detailPageWrapperContainer` | Page wrapper |
| `.detailPagePrimaryContainer` | Primary content |
| `.detailPagePrimaryContent` | Content area |
| `.detailPageSecondaryContainer` | Secondary content |
| `.detailImageContainer` | Image container |
| `.detailRibbon` | Ribbon below header |
| `.detailButton` | Action button |
| `.itemBackdrop` | Backdrop image |
| `.itemDetailImage` | Poster image |
| `.itemName` | Item title |
| `.itemMiscInfo` | Metadata info |
| `.itemOverview` | Description |
| `.mainDetailButtons` | Action buttons row |

### Detail Ribbon

```scss
// Base theme
.detailRibbon {
  background-color: var(--jf-palette-AppBar-defaultBg, $appBar-defaultBg);
  background-image: var(--jf-palette-AppBar-gradient, $appBar-gradient);
}

// TV layout: no ribbon
.layout-tv .detailRibbon {
  background: none;
}
```

---

## Toast/Snackbar

### Toast Classes

| Class | Description |
|-------|-------------|
| `.toast` | Toast container |
| `.toastContainer` | Toast container (alternative) |
| `.toastButton` | Toast action button |

### Toast Styling

```scss
// Base theme
.toast {
  background: var(--jf-palette-SnackbarContent-bg, $snackbarContent-bg);
  color: var(--jf-palette-SnackbarContent-color, $snackbarContent-color);
}
```

### MUI Snackbar Override

```typescript
// src/themes/dark/index.ts
const theme = merge(
  {},
  DEFAULT_COLOR_SCHEME,
  {
    palette: {
      SnackbarContent: {
        bg: '#303030',
        color: 'rgba(255, 255, 255, 0.87)'
      }
    }
  }
);
```

---

## CSS Variable System

### MUI Theme Variables

Jellyfin uses MUI's CSS variables feature. These are available in `:root`:

```css
:root {
  /* Palette */
  --mui-palette-primary-main: #00a4dc;
  --mui-palette-background-default: #101010;
  --mui-palette-background-paper: #202020;
  --mui-palette-text-primary: #fff;
  --mui-palette-text-secondary: rgba(255, 255, 255, 0.7);
  
  /* Custom Jellyfin */
  --jf-palette-background-defaultImage: none;
  --jf-palette-AppBar-defaultBg: #202020;
  --jf-palette-AppBar-transparentBg: rgba(0, 0, 0, 0.4);
  --jf-palette-AppBar-gradient: none;
  --jf-card-borderRadius: 0.2em;
  
  /* Text channels (for alpha composition) */
  --jf-palette-text-secondaryChannel: 255 255 255;
  --jf-palette-primary-mainChannel: 0 164 220;
}
```

### Theme Override Pattern

To override a theme color, set the CSS variable in your theme:

```css
:root {
  --jf-palette-background-default: #your-color;
  --jf-palette-AppBar-defaultBg: #your-header-color;
  --jf-palette-primary-main: #your-accent-color;
}
```

---

## Critical Rules for Theme Developers

### 1. Never Use `!important` Unlessly

Jellyfin's CSS uses `!important` in many places. Adding more `!important` creates specificity wars. Instead, use more specific selectors:

```css
/* Bad */
.skinHeader { background: transparent !important; }

/* Good */
.skinHeader-blurred:not(.osdHeader):not(.semiTransparent) {
  background: transparent;
}
```

### 2. Understand the Header Class Lifecycle

The header classes change based on user interaction:

1. **Initial load**: `.skinHeader.skinHeader-withBackground.skinHeader-blurred`
2. **Home page**: Adds `.noHomeButtonHeader`
3. **Detail page**: Adds `.semiTransparent`
4. **Scroll down**: Adds `.headroom--pinned`
5. **Scroll up**: Adds `.headroom--unpinned`

### 3. Respect the Cascade Order

Jellyfin loads CSS in this order:
1. MUI base styles
2. Theme `_theme.scss`
3. Component styles (`librarybrowser.scss`, etc.)
4. Custom CSS (via Dashboard)

Your theme CSS is loaded LAST, so it can override everything. But you must understand what you're overriding.

### 4. Use Design Tokens

Always use CSS variables instead of hardcoded values:

```css
/* Bad */
background: #202020;

/* Good */
background: var(--jf-palette-background-paper);
```

### 5. Test All Layouts

Always test your theme in:
- `.layout-desktop` (browser)
- `.layout-mobile` (mobile browser)
- `.layout-tv` (TV mode)

---

## Common Pitfalls

### 1. Header Background on Home Page

**Problem**: Header appears opaque on home page.

**Cause**: Jellyfin applies `.skinHeader-withBackground` but NOT `.semiTransparent` on home page.

**Solution**: Target `.skinHeader-withBackground:not(.semiTransparent)` separately.

### 2. Login Page Image Not Showing

**Problem**: Login card covers background image.

**Cause**: The card has opaque background.

**Solution**: Use semi-transparent background with backdrop-filter.

### 3. Toast Notifications Not Styled

**Problem**: Toast looks unstyled.

**Cause**: MUI overrides toast styles.

**Solution**: Target `.toast` and `.toastContainer` with proper MUI variable overrides.

### 4. Card Border Radius Not Applied

**Problem**: Cards have default border radius.

**Cause**: Jellyfin uses `--jf-card-borderRadius` variable.

**Solution**: Override `--jf-card-borderRadius` in `:root`.

---

## File Reference

| File | Purpose |
|------|---------|
| `src/themes/_base/_palette.scss` | Color palette definitions |
| `src/themes/_base/_theme.scss` | Base theme styles |
| `src/themes/_base/theme.ts` | MUI theme configuration |
| `src/themes/dark/theme.scss` | Dark theme overrides |
| `src/styles/site.scss` | Global styles |
| `src/styles/librarybrowser.scss` | Header, cards, layout |
| `src/scripts/libraryMenu.js` | Header class management |
| `src/apps/legacy/controllers/home.js` | Home page header classes |
| `src/apps/modern/routes/home.tsx` | Modern home page |

---

*Document generated from Jellyfin web source code analysis.*
*Last updated: 2026-09-14*
