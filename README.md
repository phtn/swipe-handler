# swipe-handler

[![npm version](https://img.shields.io/npm/v/swipe-handler.svg)](https://www.npmjs.com/package/swipe-handler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/swipe-handler)](https://bundlephobia.com/package/swipe-handler)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com)

A lightweight, high-performance, framework-agnostic swipe gesture library for touch devices. Built with strict TypeScript and zero tolerance for `any` types.

## Features

- **Lightweight**: < 1KB minified (core only)
- **High Performance**: Optimized event handling with passive listeners
- **Type Safe**: Strict TypeScript with zero `any` types
- **Framework Agnostic**: Works with React, Vue, Angular, or vanilla JavaScript
- **Touch Optimized**: Designed specifically for mobile touch events

## Installation

```bash
bun add swipe-handler
```

## Usage

### Core API (Framework Agnostic)

```typescript
import { createSwipeHandler } from 'swipe-handler';

const element = document.getElementById('swipeable');

const handler = createSwipeHandler(element, (event) => {
  console.log(`Swiped ${event.direction}`);
  console.log(`Distance: ${event.distance}px`);
  console.log(`Velocity: ${event.velocity}px/ms`);
});

// Cleanup when done
handler.destroy();
```

### React Hook (Custom Implementation)

Since this library is framework-agnostic, you can easily create your own React hook:

```tsx
import { useEffect, useRef, type RefObject } from 'react';
import { createSwipeHandler, type SwipeCallback, type SwipeConfig } from 'swipe-handler';

function useSwipe(
  ref: RefObject<HTMLElement>,
  callback: SwipeCallback,
  config?: SwipeConfig
): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handler = createSwipeHandler(element, callback, config);

    return () => {
      handler.destroy();
    };
  }, [ref, callback, config]);
}

// Usage
function SwipeableComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useSwipe(elementRef, (event) => {
    console.log(`Swiped ${event.direction}`);
  });

  return <div ref={elementRef}>Swipe me!</div>;
}
```

### Configuration Options

```typescript
import { createSwipeHandler } from 'swipe-handler';

const handler = createSwipeHandler(
  element,
  (event) => {
    // Handle swipe
  },
  {
    threshold: 20,           // Minimum distance in pixels (default: 10)
    velocityThreshold: 0.5,  // Minimum velocity in px/ms (default: 0.3)
    preventDefault: false,   // Prevent default touch behavior (default: false)
  }
);
```

## API Reference

### `createSwipeHandler(element, callback, config?)`

Creates a swipe handler for the given DOM element.

**Parameters:**
- `element: HTMLElement` - The DOM element to attach swipe detection to
- `callback: (event: SwipeEvent) => void` - Function called when a swipe is detected
- `config?: SwipeConfig` - Optional configuration options

**Returns:**
- `SwipeHandler` - Object with a `destroy()` method

### Types

```typescript
type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface SwipeEvent {
  direction: SwipeDirection;
  distance: number;      // Distance in pixels
  duration: number;      // Duration in milliseconds
  velocity: number;      // Velocity in pixels per millisecond
  deltaX: number;        // Horizontal movement
  deltaY: number;        // Vertical movement
}

interface SwipeConfig {
  threshold?: number;           // Minimum distance (default: 10)
  velocityThreshold?: number;   // Minimum velocity (default: 0.3)
  preventDefault?: boolean;     // Prevent default (default: false)
}
```

## Examples

### Basic Swipe Detection

```typescript
import { createSwipeHandler } from 'swipe-handler';

const element = document.querySelector('.swipeable');

createSwipeHandler(element, (event) => {
  switch (event.direction) {
    case 'left':
      console.log('Swiped left');
      break;
    case 'right':
      console.log('Swiped right');
      break;
    case 'up':
      console.log('Swiped up');
      break;
    case 'down':
      console.log('Swiped down');
      break;
  }
});
```

### React Carousel

```tsx
import { useEffect, useRef, useState } from 'react';
import { createSwipeHandler } from 'swipe-handler';

function Carousel() {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;

    const handler = createSwipeHandler(element, (event) => {
      if (event.direction === 'left') {
        setIndex((i) => i + 1);
      } else if (event.direction === 'right') {
        setIndex((i) => i - 1);
      }
    });

    return () => handler.destroy();
  }, []);

  return (
    <div ref={carouselRef} className="carousel">
      {/* Carousel content */}
    </div>
  );
}
```

### Custom Thresholds

```typescript
// Require longer swipes
createSwipeHandler(element, callback, {
  threshold: 50,          // 50px minimum
  velocityThreshold: 0.5, // Faster swipes only
});
```

## Performance

- Uses passive event listeners by default for optimal scroll performance
- Minimal object allocations in the hot path
- Early exit conditions for invalid gestures
- Single touch point tracking only

## Browser Support

- Modern browsers with touch event support
- Mobile Safari (iOS)
- Chrome Mobile (Android)
- Firefox Mobile

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build (if needed)
bun run build
```

## License

MIT
