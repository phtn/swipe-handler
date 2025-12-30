import type { SwipeEvent, SwipeDirection, TouchState, SwipeConfig } from './types.js';

/**
 * Calculate swipe event from touch state and end position
 */
export function recognizeSwipe(
  touchState: TouchState,
  endX: number,
  endY: number,
  endTime: number,
  config: Required<Pick<SwipeConfig, 'threshold' | 'velocityThreshold'>> | Required<SwipeConfig>
): SwipeEvent | null {
  const deltaX = endX - touchState.startX;
  const deltaY = endY - touchState.startY;
  const duration = endTime - touchState.startTime;

  // Early exit: duration must be positive
  if (duration <= 0) {
    return null;
  }

  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  // Early exit: must have minimum movement
  if (absDeltaX < config.threshold && absDeltaY < config.threshold) {
    return null;
  }

  // Determine primary direction (horizontal vs vertical)
  const isHorizontal = absDeltaX > absDeltaY;

  let direction: SwipeDirection | null = null;
  let distance: number;
  let velocity: number;

  if (isHorizontal) {
    // Horizontal swipe
    if (absDeltaX < config.threshold) {
      return null;
    }
    distance = absDeltaX;
    velocity = absDeltaX / duration;
    
    // Check velocity threshold
    if (velocity < config.velocityThreshold) {
      return null;
    }

    direction = deltaX > 0 ? 'right' : 'left';
  } else {
    // Vertical swipe
    if (absDeltaY < config.threshold) {
      return null;
    }
    distance = absDeltaY;
    velocity = absDeltaY / duration;
    
    // Check velocity threshold
    if (velocity < config.velocityThreshold) {
      return null;
    }

    direction = deltaY > 0 ? 'down' : 'up';
  }

  return {
    direction,
    distance,
    duration,
    velocity,
    deltaX,
    deltaY,
  };
}
