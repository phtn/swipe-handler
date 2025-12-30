import type { SwipeConfig } from './types.js';

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Required<SwipeConfig> = {
  threshold: 10,
  velocityThreshold: 0.3,
  preventDefault: false,
} as const;

/**
 * Merge user configuration with defaults
 */
export function mergeConfig(userConfig: SwipeConfig = {}): Required<SwipeConfig> {
  return {
    threshold: userConfig.threshold ?? DEFAULT_CONFIG.threshold,
    velocityThreshold: userConfig.velocityThreshold ?? DEFAULT_CONFIG.velocityThreshold,
    preventDefault: userConfig.preventDefault ?? DEFAULT_CONFIG.preventDefault,
  };
}

/**
 * Validate configuration values
 */
export function validateConfig(config: Required<SwipeConfig>): void {
  if (config.threshold < 0) {
    throw new Error('Threshold must be non-negative');
  }
  if (config.velocityThreshold < 0) {
    throw new Error('Velocity threshold must be non-negative');
  }
}
