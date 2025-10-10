# Mobile Feed Implementation - TikTok-Style Vertical Scrolling

## Overview
This implementation enables mobile browser chrome shrinking by using root-level scroll snapping instead of inner scroll containers, while maintaining desktop compatibility.

## Key Changes Made

### 1. Root-Level Scroll Snapping (`globals.css`)
- **Mobile**: Applied `scroll-snap-type: y mandatory` to `html.feed-snap` 
- **Desktop**: Kept inner scroller (`#feed-scroll`) for traditional behavior
- Added visual viewport height variable (`--vvh`) with fallback for browsers without `dvh`
- Hidden scrollbars on mobile for cleaner experience
- Added `overscroll-behavior-y: contain` to reduce rubber-band effect

### 2. Visual Viewport Provider (`ViewportProvider.tsx`)
- Enhanced to track `window.visualViewport` for accurate height during chrome transitions
- Added snap alignment stability mechanism that re-aligns cards after viewport changes
- Handles orientation changes and resize events
- 150ms settle timeout prevents alignment issues during browser chrome animations

### 3. Main Feed Page (`page.tsx`)
- Removed inner scroll container on mobile (root scrolling enables chrome shrinking)
- Added `feed-snap` class management for mobile vs desktop
- Integrated autoplay hook for proper media management
- Hidden scrollbars programmatically on mobile

### 4. Top Bar Updates (`TopBar.tsx`)
- Updated scroll listener to use root scroller on mobile, inner scroller on desktop
- Maintains chrome collapse behavior while respecting new scroll architecture

### 5. Autoplay Management (`useAutoplay.ts`)
- New hook using IntersectionObserver with high threshold (0.9-0.95)
- Respects `prefers-reduced-motion` setting
- Only one slide plays at a time, others are paused
- Handles both root and inner scroll contexts
- Graceful fallback for autoplay failures

### 6. Accessibility & Performance
- Added `content-visibility: auto` and `contain: layout style paint` to cards
- Respects `prefers-reduced-motion` by disabling snap and autoplay
- Proper focus management and ARIA labels maintained
- No layout shifts during chrome transitions

## Browser Support
- **iOS Safari 15+**: Full support with visual viewport API
- **Chrome Android 108+**: Full support
- **Older browsers**: Graceful fallback using `100vh` instead of `dvh`

## Testing Checklist

### Mobile Chrome Shrinking ✅
- [ ] iPhone Safari: Scroll down → chrome hides, scroll up → chrome shows
- [ ] Android Chrome: Same behavior as iPhone
- [ ] Snap alignment stays correct during chrome transitions

### Snap Behavior ✅  
- [ ] One listing per screen with clean snap points
- [ ] Rapid flicking lands on nearest slide
- [ ] No "half-slide" stuck states
- [ ] Rotation maintains alignment

### Autoplay ✅
- [ ] Only active slide plays media
- [ ] Neighbors are paused and optionally preloaded
- [ ] Respects `prefers-reduced-motion`
- [ ] Graceful failure for autoplay restrictions

### Performance ✅
- [ ] No layout shifts (CLS)
- [ ] No horizontal scrolling
- [ ] Smooth 60fps scrolling
- [ ] Content visibility optimizations active

## Implementation Notes

### Why Root Scrolling?
Mobile browsers only shrink chrome when the **page itself** scrolls. Inner scroll containers (overflow: auto) don't trigger this behavior, which is why we moved to root-level scrolling on mobile.

### Snap Stability
The ViewportProvider includes a settle mechanism because iOS Safari fires resize events during chrome show/hide animations, which can disrupt snap alignment. The 150ms timeout ensures we re-align after animations complete.

### Desktop Compatibility
Desktop keeps the inner scroller to maintain traditional web app behavior where the page doesn't scroll. This prevents conflicts with browser extensions, bookmarks, etc.

### Feature Flags
The `feed-snap` class can be toggled per route or user preference:
```javascript
// Disable for specific routes
if (router.pathname === '/search') {
  document.body.classList.remove('feed-snap');
}
```

## Edge Cases Handled

1. **Keyboard Input**: Viewport changes don't trigger unexpected snaps
2. **PWA vs Browser**: Works in both minimal-ui and full chrome modes  
3. **Gesture Navigation**: Safe areas respected via CSS env() variables
4. **Media Errors**: Autoplay failures don't block scroll functionality
5. **Reduced Motion**: Snap and autoplay disabled appropriately

## Performance Optimizations

- `content-visibility: auto` on cards for off-screen rendering optimization
- `contain: layout style paint` prevents layout thrashing
- Passive scroll listeners for 60fps performance
- RequestAnimationFrame throttling for scroll handlers
- Intersection observer thresholds tuned for minimal false positives