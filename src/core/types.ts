/**
 * Swipe direction types
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Swipe event data
 */
export interface SwipeEvent {
  /** The direction of the swipe */
  direction: SwipeDirection;
  /** The distance traveled in pixels */
  distance: number;
  /** The duration of the swipe in milliseconds */
  duration: number;
  /** The velocity of the swipe in pixels per millisecond */
  velocity: number;
  /** The delta X movement in pixels */
  deltaX: number;
  /** The delta Y movement in pixels */
  deltaY: number;
}

/**
 * Configuration options for swipe handler
 */
export interface SwipeConfig {
  /** Minimum distance in pixels to trigger a swipe (default: 10) */
  threshold?: number;
  /** Minimum velocity in pixels per millisecond to trigger a swipe (default: 0.3) */
  velocityThreshold?: number;
  /** Whether to prevent default touch behavior (default: false) */
  preventDefault?: boolean;
}

/**
 * Internal touch state tracking
 */
export interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
}

/**
 * Swipe handler instance with destroy method
 */
export interface SwipeHandler {
  /** Destroy the swipe handler and remove all event listeners */
  destroy: () => void;
}

/**
 * Callback function type for swipe events
 */
export type SwipeCallback = (event: SwipeEvent) => void;
