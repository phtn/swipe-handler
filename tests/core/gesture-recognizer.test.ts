import { test, expect } from 'bun:test';
import { recognizeSwipe } from '../../src/core/gesture-recognizer.js';
import type { TouchState } from '../../src/core/types.js';

const createTouchState = (x: number, y: number, time: number): TouchState => ({
  startX: x,
  startY: y,
  startTime: time,
});

const defaultConfig = {
  threshold: 10,
  velocityThreshold: 0.3,
};

test('recognizes right swipe', () => {
  const touchState = createTouchState(0, 0, 0);
  const result = recognizeSwipe(touchState, 50, 0, 100, defaultConfig);

  expect(result).not.toBeNull();
  if (result) {
    expect(result.direction).toBe('right');
    expect(result.distance).toBe(50);
    expect(result.deltaX).toBe(50);
    expect(result.deltaY).toBe(0);
    expect(result.velocity).toBeGreaterThan(0);
  }
});

test('recognizes left swipe', () => {
  const touchState = createTouchState(50, 0, 0);
  const result = recognizeSwipe(touchState, 0, 0, 100, defaultConfig);

  expect(result).not.toBeNull();
  if (result) {
    expect(result.direction).toBe('left');
    expect(result.distance).toBe(50);
    expect(result.deltaX).toBe(-50);
  }
});

test('recognizes down swipe', () => {
  const touchState = createTouchState(0, 0, 0);
  const result = recognizeSwipe(touchState, 0, 50, 100, defaultConfig);

  expect(result).not.toBeNull();
  if (result) {
    expect(result.direction).toBe('down');
    expect(result.distance).toBe(50);
    expect(result.deltaY).toBe(50);
  }
});

test('recognizes up swipe', () => {
  const touchState = createTouchState(0, 50, 0);
  const result = recognizeSwipe(touchState, 0, 0, 100, defaultConfig);

  expect(result).not.toBeNull();
  if (result) {
    expect(result.direction).toBe('up');
    expect(result.distance).toBe(50);
    expect(result.deltaY).toBe(-50);
  }
});

test('returns null for movement below threshold', () => {
  const touchState = createTouchState(0, 0, 0);
  const result = recognizeSwipe(touchState, 5, 0, 100, defaultConfig);

  expect(result).toBeNull();
});

test('returns null for zero duration', () => {
  const touchState = createTouchState(0, 0, 0);
  const result = recognizeSwipe(touchState, 50, 0, 0, defaultConfig);

  expect(result).toBeNull();
});

test('returns null for negative duration', () => {
  const touchState = createTouchState(0, 0, 100);
  const result = recognizeSwipe(touchState, 50, 0, 0, defaultConfig);

  expect(result).toBeNull();
});

test('returns null for velocity below threshold', () => {
  const touchState = createTouchState(0, 0, 0);
  // Very slow swipe: 10px in 1000ms = 0.01 px/ms (below 0.3 threshold)
  const result = recognizeSwipe(touchState, 10, 0, 1000, defaultConfig);

  expect(result).toBeNull();
});

test('prefers horizontal over vertical when absDeltaX > absDeltaY', () => {
  const touchState = createTouchState(0, 0, 0);
  const result = recognizeSwipe(touchState, 30, 20, 100, defaultConfig);

  expect(result).not.toBeNull();
  if (result) {
    expect(result.direction).toBe('right');
  }
});

test('prefers vertical over horizontal when absDeltaY > absDeltaX', () => {
  const touchState = createTouchState(0, 0, 0);
  const result = recognizeSwipe(touchState, 20, 30, 100, defaultConfig);

  expect(result).not.toBeNull();
  if (result) {
    expect(result.direction).toBe('down');
  }
});

test('calculates velocity correctly', () => {
  const touchState = createTouchState(0, 0, 0);
  const result = recognizeSwipe(touchState, 100, 0, 200, defaultConfig);

  expect(result).not.toBeNull();
  if (result) {
    // 100px in 200ms = 0.5 px/ms
    expect(result.velocity).toBe(0.5);
  }
});

test('respects custom threshold', () => {
  const touchState = createTouchState(0, 0, 0);
  const customConfig = { threshold: 50, velocityThreshold: 0.3 };
  const result = recognizeSwipe(touchState, 30, 0, 100, customConfig);

  expect(result).toBeNull();
});

test('respects custom velocity threshold', () => {
  const touchState = createTouchState(0, 0, 0);
  const customConfig = { threshold: 10, velocityThreshold: 1.0 };
  // 20px in 100ms = 0.2 px/ms (below 1.0 threshold)
  const result = recognizeSwipe(touchState, 20, 0, 100, customConfig);

  expect(result).toBeNull();
});
