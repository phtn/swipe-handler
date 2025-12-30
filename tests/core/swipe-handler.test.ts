import { test, expect } from 'bun:test';
import { createSwipeHandler } from '../../src/core/swipe-handler.js';
import type { SwipeEvent } from '../../src/core/types.js';

// Note: Full DOM integration tests require a DOM environment (like jsdom)
// These tests verify the API structure and basic functionality
// For full integration testing, use a browser testing framework

test('createSwipeHandler returns handler with destroy method', () => {
  // Mock element for testing structure
  const mockElement = {
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as HTMLElement;

  const handler = createSwipeHandler(mockElement, () => {});

  expect(handler).toBeDefined();
  expect(typeof handler.destroy).toBe('function');
});

test('handler destroy method can be called', () => {
  const mockElement = {
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as HTMLElement;

  const handler = createSwipeHandler(mockElement, () => {});

  expect(() => handler.destroy()).not.toThrow();
});
