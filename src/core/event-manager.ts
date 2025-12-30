import type { TouchState, SwipeCallback, SwipeConfig } from './types.js';
import { recognizeSwipe } from './gesture-recognizer.js';
import { mergeConfig, validateConfig } from './config.js';

/**
 * Event manager for handling touch events
 */
export class EventManager {
  private element: HTMLElement;
  private callback: SwipeCallback;
  private config: Required<SwipeConfig>;
  private touchState: TouchState | null = null;
  private boundHandlers: {
    touchstart: (e: TouchEvent) => void;
    touchend: (e: TouchEvent) => void;
    touchcancel: (e: TouchEvent) => void;
  };

  constructor(element: HTMLElement, callback: SwipeCallback, config: SwipeConfig = {}) {
    this.element = element;
    this.callback = callback;
    this.config = mergeConfig(config);
    validateConfig(this.config);

    // Bind handlers to preserve context
    this.boundHandlers = {
      touchstart: this.handleTouchStart.bind(this),
      touchend: this.handleTouchEnd.bind(this),
      touchcancel: this.handleTouchCancel.bind(this),
    };

    this.attachListeners();
  }

  private attachListeners(): void {
    const options: AddEventListenerOptions = {
      passive: !this.config.preventDefault,
    };

    this.element.addEventListener('touchstart', this.boundHandlers.touchstart, options);
    this.element.addEventListener('touchend', this.boundHandlers.touchend, options);
    this.element.addEventListener('touchcancel', this.boundHandlers.touchcancel, options);
  }

  private handleTouchStart(event: TouchEvent): void {
    // Only track single touch point
    if (event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    this.touchState = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: event.timeStamp,
    };

    if (this.config.preventDefault) {
      event.preventDefault();
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    if (!this.touchState) {
      return;
    }

    // Only process if single touch point
    if (event.changedTouches.length !== 1) {
      this.touchState = null;
      return;
    }

    const touch = event.changedTouches[0];
    if (!touch) {
      this.touchState = null;
      return;
    }

    const swipeEvent = recognizeSwipe(
      this.touchState,
      touch.clientX,
      touch.clientY,
      event.timeStamp,
      this.config
    );

    if (swipeEvent) {
      this.callback(swipeEvent);
    }

    this.touchState = null;
  }

  private handleTouchCancel(): void {
    // Reset state on cancel
    this.touchState = null;
  }

  destroy(): void {
    this.element.removeEventListener('touchstart', this.boundHandlers.touchstart);
    this.element.removeEventListener('touchend', this.boundHandlers.touchend);
    this.element.removeEventListener('touchcancel', this.boundHandlers.touchcancel);
    this.touchState = null;
  }
}
