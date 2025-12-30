import type { SwipeHandler, SwipeCallback, SwipeConfig } from './types.js';
import { EventManager } from './event-manager.js';

/**
 * Create a swipe handler for the given element
 * 
 * @param element - The DOM element to attach swipe detection to
 * @param callback - Function called when a swipe is detected
 * @param config - Optional configuration options
 * @returns A handler object with a destroy method
 * 
 * @example
 * ```ts
 * const element = document.getElementById('swipeable');
 * const handler = createSwipeHandler(element, (event) => {
 *   console.log(`Swiped ${event.direction}`);
 * });
 * 
 * // Later, cleanup
 * handler.destroy();
 * ```
 */
export function createSwipeHandler(
  element: HTMLElement,
  callback: SwipeCallback,
  config?: SwipeConfig
): SwipeHandler {
  const eventManager = new EventManager(element, callback, config);

  return {
    destroy: () => {
      eventManager.destroy();
    },
  };
}
